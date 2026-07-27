import { Router, Request, Response } from 'express'
import crypto from 'crypto'
import { prisma } from '../db/client'
import { sendNewsletterWelcome } from '../services/email'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { SubscribeNewsletterSchema, validateBody, PaginationSchema, validateQuery } from '../validation/schemas'
import { asyncHandler } from '../utils/asyncHandler'
import { logger } from '../utils/logger'
import { handlePrismaError } from '../utils/prismaErrorHandler'

const router = Router()

function getUnsubscribeSecret(): string {
  return process.env.UNSUBSCRIBE_SECRET || process.env.JWT_SECRET || ''
}

function generateUnsubscribeToken(email: string): string {
  const secret = getUnsubscribeSecret()
  if (!secret) {
    throw new Error('UNSUBSCRIBE_SECRET or JWT_SECRET must be set')
  }
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(email)
  return hmac.digest('base64url')
}

export function buildUnsubscribeUrl(email: string, baseUrl: string): string {
  const token = generateUnsubscribeToken(email)
  const params = new URLSearchParams({ email, token })
  return `${baseUrl}/api/newsletter/unsubscribe?${params.toString()}`
}

// POST /api/newsletter - Subscribe to newsletter (public)
router.post('/', validateBody(SubscribeNewsletterSchema), asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body

  const existing = await prisma.newsletter.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ error: 'Email already subscribed' })
  }

  const subscriber = await prisma.newsletter.create({ data: { email } })

  // Send welcome email (don't fail if email fails)
  try {
    await sendNewsletterWelcome(email)
  } catch (emailError) {
    logger.error('Failed to send welcome email', {
      error: (emailError as Error).message,
      email,
    }, req.requestId)
  }

  res.status(201).json({ message: 'Successfully subscribed to newsletter', id: subscriber.id })
}))

// GET /api/newsletter - List all subscribers (admin, paginated)
router.get('/', authenticate, requireAdmin, validateQuery(PaginationSchema), asyncHandler(async (req: AuthRequest & { validatedQuery?: { page: number; pageSize: number } }, res: Response) => {
  const { page = 1, pageSize = 20 } = req.validatedQuery || {}

  const where: Record<string, unknown> = {}
  if (req.query.q) {
    where.email = { contains: String(req.query.q), mode: 'insensitive' }
  }

  const [subscribers, total] = await Promise.all([
    prisma.newsletter.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.newsletter.count({ where }),
  ])

  res.json({
    data: subscribers,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}))

// GET /api/newsletter/unsubscribe - Token-based unsubscribe (public, for email links)
// Must come BEFORE the /:email route so Express matches it first
router.get('/unsubscribe', asyncHandler(async (req: Request, res: Response) => {
  const email = String(req.query.email || '')
  const token = String(req.query.token || '')

  if (!email || !token) {
    return res.status(400).json({ error: 'Missing email or token' })
  }

  const expectedToken = generateUnsubscribeToken(email)
  if (token !== expectedToken) {
    return res.status(403).json({ error: 'Invalid unsubscribe token' })
  }

  try {
    const subscriber = await prisma.newsletter.findUnique({ where: { email } })
    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found' })
    }

    await prisma.newsletter.delete({ where: { email } })
    res.json({ message: 'Successfully unsubscribed' })
  } catch (error) {
    if (handlePrismaError(error, res, 'Unsubscribe', req.requestId)) return
    logger.error('Unsubscribe failed', { error: (error as Error).message, email }, req.requestId)
    res.status(500).json({ error: 'Failed to unsubscribe' })
  }
}))

// POST /api/newsletter/unsubscribe - Token-based unsubscribe via POST (public)
router.post('/unsubscribe', asyncHandler(async (req: Request, res: Response) => {
  const { email, token } = req.body

  if (!email || !token) {
    return res.status(400).json({ error: 'Missing email or token' })
  }

  const expectedToken = generateUnsubscribeToken(email)
  if (token !== expectedToken) {
    return res.status(403).json({ error: 'Invalid unsubscribe token' })
  }

  try {
    const subscriber = await prisma.newsletter.findUnique({ where: { email } })
    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found' })
    }

    await prisma.newsletter.delete({ where: { email } })
    res.json({ message: 'Successfully unsubscribed' })
  } catch (error) {
    if (handlePrismaError(error, res, 'Unsubscribe', req.requestId)) return
    logger.error('Unsubscribe failed', { error: (error as Error).message, email }, req.requestId)
    res.status(500).json({ error: 'Failed to unsubscribe' })
  }
}))

// DELETE /api/newsletter/:email - Admin-only direct delete
router.delete('/:email', authenticate, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const emailParam = Array.isArray(req.params.email) ? req.params.email[0] : req.params.email
  if (!emailParam) {
    return res.status(400).json({ error: 'Email required' })
  }

  try {
    const subscriber = await prisma.newsletter.findUnique({ where: { email: emailParam } })
    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found' })
    }

    await prisma.newsletter.delete({ where: { email: emailParam } })
    res.json({ message: 'Subscriber deleted' })
  } catch (error) {
    if (handlePrismaError(error, res, 'Delete subscriber', req.requestId)) return
    logger.error('Delete subscriber failed', { error: (error as Error).message, email: emailParam }, req.requestId)
    res.status(500).json({ error: 'Failed to delete subscriber' })
  }
}))

export default router
