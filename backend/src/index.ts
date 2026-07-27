import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import dogsRouter from './routes/dogs'
import testimonialsRouter from './routes/testimonials'
import adoptionsRouter from './routes/adoptions'
import authRouter from './routes/auth'
import contentRouter from './routes/content'
import volunteersRouter from './routes/volunteers'
import newsletterRouter from './routes/newsletter'
import { issueCsrfToken, verifyCsrfToken } from './middleware/csrf'

// Load environment variables
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGIN']
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:')
  missingEnvVars.forEach((varName) => {
    console.error(`   - ${varName}`)
  })
  console.error('\nPlease add them to your .env file.')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3001
const isProduction = process.env.NODE_ENV === 'production'

// Trust proxy - required for rate limiting behind reverse proxies (nginx, Cloudflare, Vercel, etc.)
app.set('trust proxy', 1)

// Security headers via helmet
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false, // Disable CSP in dev to avoid Vite HMR issues
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// CORS - origin required, no localhost fallback
const corsOrigins = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // allow same-origin and curl
    if (corsOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('CORS not allowed'))
  },
  credentials: true,
}))

// Cookie parser for CSRF
app.use(cookieParser())

// Body parser with size limit
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false, limit: '1mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Stricter rate limit for auth and form submissions
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// CSRF - issue token on all requests, verify on state-changing methods
app.use(issueCsrfToken)
app.use(verifyCsrfToken)

// Health check (no auth, no CSRF, no rate limit)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes with rate limiting
app.use('/api/dogs', dogsRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/adoptions', strictLimiter, adoptionsRouter)
app.use('/api/auth', strictLimiter, authRouter)
app.use('/api/content', contentRouter)
app.use('/api/volunteers', strictLimiter, volunteersRouter)
app.use('/api/newsletter', strictLimiter, newsletterRouter)

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  if (err.message === 'CORS not allowed') {
    return res.status(403).json({ error: 'CORS not allowed' })
  }
  res.status(500).json({ error: 'Internal server error' })
})

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`)
  console.log(`   Email: ${process.env.RESEND_API_KEY ? 'Configured' : 'Not configured'}`)
  console.log(`   CORS origins: ${corsOrigins.join(', ')}`)
  console.log(`   Rate limiting: Enabled (100 req/15min general, 10 req/15min for forms)`)
  console.log(`   Security: Helmet + CSRF protection enabled`)
})

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`)
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
  // Force exit after 10s
  setTimeout(() => {
    console.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

export default app
