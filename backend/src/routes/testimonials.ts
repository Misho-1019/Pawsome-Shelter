import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { CreateTestimonialSchema, UpdateTestimonialSchema, validate } from '../validation/schemas'

const router = Router()

function parseId(id: string | string[]): number | null {
  const value = Array.isArray(id) ? id[0] : id
  const parsed = parseInt(value)
  return isNaN(parsed) ? null : parsed
}

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
router.post('/', authenticate, requireAdmin, validate(CreateTestimonialSchema), async (req: AuthRequest, res: Response) => {
  try {
    const testimonial = await prisma.testimonial.create({ data: req.body })
    res.status(201).json(testimonial)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' })
  }
})

// PUT /api/testimonials/:id - Update testimonial (admin)
router.put('/:id', authenticate, requireAdmin, validate(UpdateTestimonialSchema), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseId(req.params.id)
    if (id === null) return res.status(400).json({ error: 'Invalid ID' })
    const testimonial = await prisma.testimonial.update({ where: { id }, data: req.body })
    res.json(testimonial)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' })
  }
})

// DELETE /api/testimonials/:id - Delete testimonial (admin)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseId(req.params.id)
    if (id === null) return res.status(400).json({ error: 'Invalid ID' })
    await prisma.testimonial.delete({ where: { id } })
    res.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' })
  }
})

export default router
