import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/volunteers - List all volunteers (admin)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(volunteers)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch volunteers' })
  }
})

// POST /api/volunteers - Submit volunteer application (public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, availability, experience, message } = req.body
    const volunteer = await prisma.volunteer.create({
      data: { name, email, phone, availability, experience, message }
    })
    res.status(201).json(volunteer)
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit volunteer application' })
  }
})

// PUT /api/volunteers/:id - Update volunteer status (admin)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body
    const volunteer = await prisma.volunteer.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    })
    res.json(volunteer)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update volunteer' })
  }
})

export default router
