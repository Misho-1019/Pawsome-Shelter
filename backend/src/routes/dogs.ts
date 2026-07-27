import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { CreateDogSchema, UpdateDogSchema, DogFilterSchema, validateBody, validateQuery } from '../validation/schemas'
import { parseId } from '../utils/parseId'
import { asyncHandler } from '../utils/asyncHandler'
import { logger } from '../utils/logger'
import { handlePrismaError } from '../utils/prismaErrorHandler'

const router = Router()

// GET /api/dogs - List all dogs (public, paginated, filterable)
router.get('/', validateQuery(DogFilterSchema), asyncHandler(async (req: Request & { validatedQuery?: { size?: string; status?: string; gender?: string; breed?: string; ageMin?: number; ageMax?: number; q?: string; page: number; pageSize: number } }, res: Response) => {
  const { size, status, gender, breed, ageMin, ageMax, q, page, pageSize } = req.validatedQuery || { page: 1, pageSize: 20 }

  const where: Record<string, unknown> = {}
  if (size) where.size = size
  if (status) where.status = status
  if (gender) where.gender = gender
  if (breed) where.breed = { contains: breed, mode: 'insensitive' }
  if (ageMin !== undefined || ageMax !== undefined) {
    where.ageMonths = {
      ...(ageMin !== undefined ? { gte: ageMin } : {}),
      ...(ageMax !== undefined ? { lte: ageMax } : {}),
    }
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { breed: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const [dogs, total] = await Promise.all([
    prisma.dog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.dog.count({ where }),
  ])

  res.json({
    data: dogs,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}))

// GET /api/dogs/:id - Get dog by ID (public)
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  const dog = await prisma.dog.findUnique({ where: { id } })
  if (!dog) return res.status(404).json({ error: 'Dog not found' })
  res.json(dog)
}))

// POST /api/dogs - Create dog (admin)
router.post('/', authenticate, requireAdmin, validateBody(CreateDogSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const dog = await prisma.dog.create({ data: req.body })
    res.status(201).json(dog)
  } catch (error) {
    if (handlePrismaError(error, res, 'Create dog', req.requestId)) return
    logger.error('Create dog failed', { error: (error as Error).message }, req.requestId)
    res.status(500).json({ error: 'Failed to create dog' })
  }
}))

// PUT /api/dogs/:id - Update dog (admin)
router.put('/:id', authenticate, requireAdmin, validateBody(UpdateDogSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  try {
    const dog = await prisma.dog.update({ where: { id }, data: req.body })
    res.json(dog)
  } catch (error) {
    if (handlePrismaError(error, res, 'Update dog', req.requestId)) return
    logger.error('Update dog failed', { error: (error as Error).message, id }, req.requestId)
    res.status(500).json({ error: 'Failed to update dog' })
  }
}))

// DELETE /api/dogs/:id - Delete dog (admin)
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = parseId(req.params.id)
  if (id === null) return res.status(400).json({ error: 'Invalid ID' })

  try {
    await prisma.dog.delete({ where: { id } })
    res.json({ message: 'Dog deleted successfully' })
  } catch (error) {
    if (handlePrismaError(error, res, 'Delete dog', req.requestId)) return
    logger.error('Delete dog failed', { error: (error as Error).message, id }, req.requestId)
    res.status(500).json({ error: 'Failed to delete dog' })
  }
}))

export default router
