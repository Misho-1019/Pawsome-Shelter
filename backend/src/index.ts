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
import { requestId } from './middleware/requestId'
import { errorHandler } from './middleware/errorHandler'
import { prisma } from './db/client'
import { logger } from './utils/logger'

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

// Request ID for tracing
app.use(requestId)

// Security headers via helmet
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
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

// Health check (no auth, no CSRF, no rate limit, must come before other routes)
app.get('/api/health', async (_req, res) => {
  try {
    // Verify DB connectivity
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    })
  } catch (error) {
    logger.error('Health check failed', { error: (error as Error).message })
    res.status(503).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    })
  }
})

// Liveness probe (for K8s)
app.get('/api/health/live', (_req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() })
})

// Readiness probe (for K8s)
app.get('/api/health/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ready', timestamp: new Date().toISOString() })
  } catch {
    res.status(503).json({ status: 'not ready', timestamp: new Date().toISOString() })
  }
})

// Routes with rate limiting
app.use('/api/dogs', dogsRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/adoptions', strictLimiter, adoptionsRouter)
app.use('/api/auth', strictLimiter, authRouter)
app.use('/api/content', contentRouter)
app.use('/api/volunteers', strictLimiter, volunteersRouter)
app.use('/api/newsletter', strictLimiter, newsletterRouter)

// CORS rejection handler
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === 'CORS not allowed') {
    return res.status(403).json({ error: 'CORS not allowed' })
  }
  next(err)
})

// Global error handler (must be last)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`)
  logger.info(`   Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`   Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`)
  logger.info(`   Email: ${process.env.RESEND_API_KEY ? 'Configured' : 'Not configured'}`)
  logger.info(`   CORS origins: ${corsOrigins.join(', ')}`)
  logger.info(`   Rate limiting: Enabled (100 req/15min general, 10 req/15min for forms)`)
  logger.info(`   Security: Helmet + CSRF protection enabled`)
})

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`)
  server.close(async () => {
    logger.info('HTTP server closed')
    await prisma.$disconnect()
    process.exit(0)
  })
  // Force exit after 10s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

export default app
