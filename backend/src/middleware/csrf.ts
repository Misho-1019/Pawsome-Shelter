import { Request, Response, NextFunction } from 'express'

const CSRF_HEADER = 'x-csrf-token'
const CSRF_COOKIE = 'csrf-token'

// Endpoints that don't require CSRF:
// - auth/login: credentials-based, has its own protection
// - newsletter/unsubscribe: HMAC-signed token
// - donations/webhook: Stripe signature verification
// - Public POST endpoints (adoptions, volunteers, newsletter subscribe, donations create-checkout):
//   These are unauthenticated — CSRF protection is meaningless since there's no session to hijack.
//   CSRF only protects authenticated state-changing actions.
const CSRF_EXEMPT_PATHS = ['/api/v1/auth/login', '/api/v1/adoptions', '/api/v1/volunteers', '/api/v1/newsletter', '/api/v1/donations/create-checkout']
const CSRF_EXEMPT_PREFIXES = ['/api/v1/newsletter/unsubscribe', '/api/v1/donations/webhook', '/api/v1/paypal-donations/webhook']

function isCsrfExempt(path: string): boolean {
  if (CSRF_EXEMPT_PATHS.includes(path)) return true
  return CSRF_EXEMPT_PREFIXES.some((prefix) => path.startsWith(prefix))
}

function getCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET || process.env.JWT_SECRET
  if (!secret) {
    throw new Error('CSRF_SECRET or JWT_SECRET must be set')
  }
  return secret
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export function issueCsrfToken(_req: Request, res: Response, next: NextFunction) {
  const secret = getCsrfSecret()
  const token = Buffer.from(secret).toString('base64url').slice(0, 32)

  // Set cookie for same-origin (local dev via Vite proxy)
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
  })

  // Also set token in response header for cross-origin (production Vercel + Fly.io)
  // Frontend reads this header and stores the token in JS memory
  res.setHeader('x-csrf-token', token)

  next()
}

export function verifyCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }

  if (isCsrfExempt(req.path)) {
    return next()
  }

  const headerToken = req.headers[CSRF_HEADER] as string | undefined
  const cookieToken = req.cookies?.[CSRF_COOKIE]

  // Accept if header token is present (cross-origin: frontend reads from X-CSRF-Token header)
  // or if both header and cookie match (same-origin: local dev via Vite proxy)
  const tokenToVerify = headerToken || (headerToken && cookieToken ? headerToken : null)

  if (!tokenToVerify) {
    return res.status(403).json({ error: 'CSRF token missing' })
  }

  // Validate the token matches the expected value
  const secret = getCsrfSecret()
  const expectedToken = Buffer.from(secret).toString('base64url').slice(0, 32)

  if (!timingSafeEqual(tokenToVerify, expectedToken)) {
    return res.status(403).json({ error: 'CSRF token invalid' })
  }

  next()
}
