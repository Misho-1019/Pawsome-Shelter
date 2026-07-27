import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import dogsRouter from './routes/dogs'
import testimonialsRouter from './routes/testimonials'
import adoptionsRouter from './routes/adoptions'
import authRouter from './routes/auth'
import contentRouter from './routes/content'
import volunteersRouter from './routes/volunteers'
import newsletterRouter from './routes/newsletter'

// Load environment variables
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingEnvVars.forEach((varName) => {
    console.error(`   - ${varName}`)
  })
  console.error('\nPlease add them to your .env file.')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3001

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

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(limiter)

// Routes with rate limiting
app.use('/api/dogs', dogsRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/adoptions', strictLimiter, adoptionsRouter)
app.use('/api/auth', strictLimiter, authRouter)
app.use('/api/content', contentRouter)
app.use('/api/volunteers', strictLimiter, volunteersRouter)
app.use('/api/newsletter', strictLimiter, newsletterRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`   Database: ${process.env.DATABASE_URL ? 'Connected' : '⚠️  Not configured'}`)
  console.log(`   Email: ${process.env.RESEND_API_KEY ? 'Configured' : '⚠️  Not configured'}`)
  console.log(`   Rate limiting: Enabled (100 req/15min general, 10 req/15min for forms)`)
})

export default app
