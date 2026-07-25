import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/testimonials - List all testimonials (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(testimonials)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' })
  }
})

// POST /api/testimonials - Create testimonial (admin)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, dogName, quote, image, rating } = req.body
    const testimonial = await prisma.testimonial.create({
      data: { name, dogName, quote, image, rating }
    })
    res.status(201).json(testimonial)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' })
  }
})

// PUT /api/testimonials/:id - Update testimonial (admin)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, dogName, quote, image, rating } = req.body
    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(req.params.id) },
      data: { name, dogName, quote, image, rating }
    })
    res.json(testimonial)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' })
  }
})

// DELETE /api/testimonials/:id - Delete testimonial (admin)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.testimonial.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' })
  }
})

export default router
