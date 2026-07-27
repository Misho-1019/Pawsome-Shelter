import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { sendNewsletterWelcome } from '../services/email'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { SubscribeNewsletterSchema, validate } from '../validation/schemas'

const router = Router()

// POST /api/newsletter - Subscribe to newsletter (public)
router.post('/', validate(SubscribeNewsletterSchema), async (req: Request, res: Response) => {
  try {
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
      console.error('Failed to send welcome email:', emailError)
    }

    res.status(201).json({ message: 'Successfully subscribed to newsletter', id: subscriber.id })
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe to newsletter' })
  }
})

// GET /api/newsletter - List all subscribers (admin)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const subscribers = await prisma.newsletter.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(subscribers)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscribers' })
  }
})

// DELETE /api/newsletter/:email - Unsubscribe from newsletter (public)
router.delete('/:email', async (req: Request, res: Response) => {
  try {
    const emailParam = Array.isArray(req.params.email) ? req.params.email[0] : req.params.email
    const subscriber = await prisma.newsletter.findUnique({ where: { email: emailParam } })
    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found' })
    }
    await prisma.newsletter.delete({ where: { email: emailParam } })
    res.json({ message: 'Successfully unsubscribed' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsubscribe' })
  }
})

export default router
