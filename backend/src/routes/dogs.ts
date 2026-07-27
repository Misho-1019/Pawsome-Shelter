import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { CreateDogSchema, UpdateDogSchema, validate } from '../validation/schemas'

const router = Router()

function parseId(id: string | string[]): number | null {
  const value = Array.isArray(id) ? id[0] : id
  const parsed = parseInt(value)
  return isNaN(parsed) ? null : parsed
}

// GET /api/dogs - List all dogs (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { size, status } = req.query
    const where: { size?: string; status?: string } = {}

    if (size) where.size = size as string
    if (status) where.status = status as string

    const dogs = await prisma.dog.findMany({ where, orderBy: { createdAt: 'desc' } })
    res.json(dogs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' })
  }
})

// GET /api/dogs/:id - Get dog by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id)
    if (id === null) return res.status(400).json({ error: 'Invalid ID' })
    const dog = await prisma.dog.findUnique({ where: { id } })
    if (!dog) return res.status(404).json({ error: 'Dog not found' })
    res.json(dog)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dog' })
  }
})

// POST /api/dogs - Create dog (admin)
router.post('/', authenticate, requireAdmin, validate(CreateDogSchema), async (req: AuthRequest, res: Response) => {
  try {
    const dog = await prisma.dog.create({ data: req.body })
    res.status(201).json(dog)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create dog' })
  }
})

// PUT /api/dogs/:id - Update dog (admin)
router.put('/:id', authenticate, requireAdmin, validate(UpdateDogSchema), async (req: AuthRequest, res: Response) => {
  try {
    const id = parseId(req.params.id)
    if (id === null) return res.status(400).json({ error: 'Invalid ID' })
    const dog = await prisma.dog.update({ where: { id }, data: req.body })
    res.json(dog)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dog' })
  }
})

// DELETE /api/dogs/:id - Delete dog (admin)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseId(req.params.id)
    if (id === null) return res.status(400).json({ error: 'Invalid ID' })
    await prisma.dog.delete({ where: { id } })
    res.json({ message: 'Dog deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete dog' })
  }
})

export default router
