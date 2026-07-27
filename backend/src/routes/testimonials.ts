import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { CreateTestimonialSchema, UpdateTestimonialSchema, validateBody } from '../validation/schemas'
import { parseId } from '../utils/parseId'
import { asyncHandler } from '../utils/asyncHandler'
import { logger } from '../utils/logger'
import { handlePrismaError } from '../utils/prismaErrorHandler'

const router = Router()

// GET /api/testimonials - List all testimonials (public)
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(testimonials)
}))

// GET /api/testimonials/:id - Get testimonial by ID (public)
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  const testimonial = await prisma.testimonial.findUnique({ where: { id } })
  if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' })
  res.json(testimonial)
}))

// POST /api/testimonials - Create testimonial (admin)
router.post('/', authenticate, requireAdmin, validateBody(CreateTestimonialSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const testimonial = await prisma.testimonial.create({ data: req.body })
    res.status(201).json(testimonial)
  } catch (error) {
    if (handlePrismaError(error, res, 'Create testimonial', req.requestId)) return
    logger.error('Create testimonial failed', { error: (error as Error).message }, req.requestId)
    res.status(500).json({ error: 'Failed to create testimonial' })
  }
}))

// PUT /api/testimonials/:id - Update testimonial (admin)
router.put('/:id', authenticate, requireAdmin, validateBody(UpdateTestimonialSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  try {
    const testimonial = await prisma.testimonial.update({ where: { id }, data: req.body })
    res.json(testimonial)
  } catch (error) {
    if (handlePrismaError(error, res, 'Update testimonial', req.requestId)) return
    logger.error('Update testimonial failed', { error: (error as Error).message, id }, req.requestId)
    res.status(500).json({ error: 'Failed to update testimonial' })
  }
}))

// DELETE /api/testimonials/:id - Delete testimonial (admin)
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  try {
    await prisma.testimonial.delete({ where: { id } })
    res.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    if (handlePrismaError(error, res, 'Delete testimonial', req.requestId)) return
    logger.error('Delete testimonial failed', { error: (error as Error).message, id }, req.requestId)
    res.status(500).json({ error: 'Failed to delete testimonial' })
  }
}))

export default router
