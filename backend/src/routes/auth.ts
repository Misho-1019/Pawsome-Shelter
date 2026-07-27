import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/client'
import { authenticate, AuthRequest } from '../middleware/auth'
import { LoginSchema, validateBody } from '../validation/schemas'
import { asyncHandler } from '../utils/asyncHandler'
import { logger } from '../utils/logger'

const router = Router()

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable must be set')
  }
  return secret
}

// POST /api/auth/login - Admin login
router.post('/login', validateBody(LoginSchema), asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // Generic message to avoid email enumeration
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: '24h' }
  )

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })
}))

// GET /api/auth/me - Get current user
router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
}))

export default router
