import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { sendAdoptionConfirmation } from '../services/email'

const router = Router()

// GET /api/adoptions - List all adoptions (admin)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const adoptions = await prisma.adoption.findMany({
      include: { dog: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(adoptions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch adoptions' })
  }
})

// POST /api/adoptions - Submit adoption inquiry (public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, dogId } = req.body
    const adoption = await prisma.adoption.create({
      data: { name, email, phone, message, dogId },
      include: { dog: true }
    })

    // Send confirmation email (don't fail if email fails)
    if (email && name && adoption.dog) {
      try {
        await sendAdoptionConfirmation(email, name, adoption.dog.name)
      } catch (emailError) {
        console.error('Failed to send adoption confirmation email:', emailError)
      }
    }

    res.status(201).json(adoption)
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit adoption inquiry' })
  }
})

// PUT /api/adoptions/:id - Update adoption status (admin)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body
    const adoption = await prisma.adoption.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    })
    res.json(adoption)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update adoption' })
  }
})

export default router
