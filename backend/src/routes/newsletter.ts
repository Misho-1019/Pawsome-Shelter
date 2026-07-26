import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'

const router = Router()

// POST /api/newsletter - Subscribe to newsletter (public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' })
    }

    const existing = await prisma.newsletter.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already subscribed' })
    }

    const subscriber = await prisma.newsletter.create({ data: { email } })
    res.status(201).json({ message: 'Successfully subscribed to newsletter', id: subscriber.id })
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe to newsletter' })
  }
})

// GET /api/newsletter - List all subscribers (admin)
router.get('/', async (req: Request, res: Response) => {
  try {
    const subscribers = await prisma.newsletter.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(subscribers)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscribers' })
  }
})

export default router
