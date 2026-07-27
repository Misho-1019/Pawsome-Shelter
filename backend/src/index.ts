import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

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

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Routes
app.use('/api/dogs', dogsRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/adoptions', adoptionsRouter)
app.use('/api/auth', authRouter)
app.use('/api/content', contentRouter)
app.use('/api/volunteers', volunteersRouter)
app.use('/api/newsletter', newsletterRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`   Database: ${process.env.DATABASE_URL ? 'Connected' : '⚠️  Not configured'}`)
  console.log(`   Email: ${process.env.RESEND_API_KEY ? 'Configured' : '⚠️  Not configured'}`)
})

export default app
