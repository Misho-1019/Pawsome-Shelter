import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { sendAdoptionConfirmation } from '../services/email'
import { CreateAdoptionSchema, UpdateAdoptionSchema, validateBody } from '../validation/schemas'
import { parseId } from '../utils/parseId'
import { asyncHandler } from '../utils/asyncHandler'
import { logger } from '../utils/logger'
import { handlePrismaError } from '../utils/prismaErrorHandler'

const router = Router()

// GET /api/adoptions - List all adoptions (admin)
router.get('/', authenticate, requireAdmin, asyncHandler(async (_req: AuthRequest, res: Response) => {
  const adoptions = await prisma.adoption.findMany({
    include: { dog: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json(adoptions)
}))

// GET /api/adoptions/:id - Get adoption by ID (admin)
router.get('/:id', authenticate, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  const adoption = await prisma.adoption.findUnique({
    where: { id },
    include: { dog: true },
  })
  if (!adoption) return res.status(404).json({ error: 'Adoption not found' })
  res.json(adoption)
}))

// POST /api/adoptions - Submit adoption inquiry (public)
router.post('/', validateBody(CreateAdoptionSchema), asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, message, dogId, householdType, hasYard, otherPets } = req.body

  const adoption = await prisma.adoption.create({
    data: { name, email, phone, message, dogId, householdType, hasYard, otherPets },
    include: { dog: true },
  })

  // Send confirmation email (don't fail if email fails)
  if (adoption.dog) {
    try {
      await sendAdoptionConfirmation(email, name, adoption.dog.name)
    } catch (emailError) {
      logger.error('Failed to send adoption confirmation email', {
        error: (emailError as Error).message,
        adoptionId: adoption.id,
      }, req.requestId)
    }
  }

  res.status(201).json(adoption)
}))

// PUT /api/adoptions/:id - Update adoption (admin)
router.put('/:id', authenticate, requireAdmin, validateBody(UpdateAdoptionSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  try {
    const adoption = await prisma.adoption.update({
      where: { id },
      data: req.body,
      include: { dog: true },
    })
    res.json(adoption)
  } catch (error) {
    if (handlePrismaError(error, res, 'Update adoption', req.requestId)) return
    logger.error('Update adoption failed', { error: (error as Error).message, id }, req.requestId)
    res.status(500).json({ error: 'Failed to update adoption' })
  }
}))

// DELETE /api/adoptions/:id - Delete adoption (admin)
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  try {
    await prisma.adoption.delete({ where: { id } })
    res.json({ message: 'Adoption deleted successfully' })
  } catch (error) {
    if (handlePrismaError(error, res, 'Delete adoption', req.requestId)) return
    logger.error('Delete adoption failed', { error: (error as Error).message, id }, req.requestId)
    res.status(500).json({ error: 'Failed to delete adoption' })
  }
}))

export default router
