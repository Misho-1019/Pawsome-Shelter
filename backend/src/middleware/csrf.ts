import { Request, Response, NextFunction } from 'express'

const CSRF_HEADER = 'x-csrf-token'
const CSRF_COOKIE = 'csrf-token'

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
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })
  next()
}

export function verifyCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }

  const headerToken = req.headers[CSRF_HEADER] as string | undefined
  const cookieToken = req.cookies?.[CSRF_COOKIE]

  if (!headerToken || !cookieToken) {
    return res.status(403).json({ error: 'CSRF token missing' })
  }

  if (!timingSafeEqual(headerToken, cookieToken)) {
    return res.status(403).json({ error: 'CSRF token invalid' })
  }

  next()
}
