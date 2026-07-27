import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { sendVolunteerConfirmation } from '../services/email'
import { CreateVolunteerSchema, UpdateVolunteerSchema, validateBody, PaginationSchema, validateQuery } from '../validation/schemas'
import { parseId } from '../utils/parseId'
import { asyncHandler } from '../utils/asyncHandler'
import { logger } from '../utils/logger'
import { handlePrismaError } from '../utils/prismaErrorHandler'

const router = Router()

// GET /api/volunteers - List all volunteers (admin, paginated)
router.get('/', authenticate, requireAdmin, validateQuery(PaginationSchema), asyncHandler(async (req: AuthRequest & { validatedQuery?: { page: number; pageSize: number } }, res: Response) => {
  const { page = 1, pageSize = 20 } = req.validatedQuery || {}

  const where: Record<string, unknown> = {}
  if (req.query.status) {
    where.status = String(req.query.status)
  }

  const [volunteers, total] = await Promise.all([
    prisma.volunteer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.volunteer.count({ where }),
  ])

  res.json({
    data: volunteers,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}))

// GET /api/volunteers/:id - Get volunteer by ID (admin)
router.get('/:id', authenticate, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  const volunteer = await prisma.volunteer.findUnique({ where: { id } })
  if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' })
  res.json(volunteer)
}))

// POST /api/volunteers - Submit volunteer application (public)
router.post('/', validateBody(CreateVolunteerSchema), asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, availability, experience, message } = req.body

  const volunteer = await prisma.volunteer.create({
    data: { name, email, phone, availability, experience, message },
  })

  // Send confirmation email (don't fail if email fails)
  try {
    await sendVolunteerConfirmation(email, name)
  } catch (emailError) {
    logger.error('Failed to send volunteer confirmation email', {
      error: (emailError as Error).message,
      volunteerId: volunteer.id,
    }, req.requestId)
  }

  res.status(201).json(volunteer)
}))

// PUT /api/volunteers/:id - Update volunteer (admin)
router.put('/:id', authenticate, requireAdmin, validateBody(UpdateVolunteerSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  try {
    const volunteer = await prisma.volunteer.update({ where: { id }, data: req.body })
    res.json(volunteer)
  } catch (error) {
    if (handlePrismaError(error, res, 'Update volunteer', req.requestId)) return
    logger.error('Update volunteer failed', { error: (error as Error).message, id }, req.requestId)
    res.status(500).json({ error: 'Failed to update volunteer' })
  }
}))

// DELETE /api/volunteers/:id - Delete volunteer (admin)
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  try {
    await prisma.volunteer.delete({ where: { id } })
    res.json({ message: 'Volunteer deleted successfully' })
  } catch (error) {
    if (handlePrismaError(error, res, 'Delete volunteer', req.requestId)) return
    logger.error('Delete volunteer failed', { error: (error as Error).message, id }, req.requestId)
    res.status(500).json({ error: 'Failed to delete volunteer' })
  }
}))

export default router
