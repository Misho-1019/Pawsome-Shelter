import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import dogsRouter from './routes/dogs'
import testimonialsRouter from './routes/testimonials'
import adoptionsRouter from './routes/adoptions'
import authRouter from './routes/auth'
import contentRouter from './routes/content'

dotenv.config()

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
