import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/dogs - List all dogs (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { size, status } = req.query
    const where: any = {}

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
    const dog = await prisma.dog.findUnique({ where: { id: parseInt(req.params.id as string) } })
    if (!dog) return res.status(404).json({ error: 'Dog not found' })
    res.json(dog)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dog' })
  }
})

// POST /api/dogs - Create dog (admin)
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, breed, age, gender, size, image, tags, status } = req.body
    const dog = await prisma.dog.create({
      data: { name, breed, age, gender, size, image, tags, status }
    })
    res.status(201).json(dog)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create dog' })
  }
})

// PUT /api/dogs/:id - Update dog (admin)
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, breed, age, gender, size, image, tags, status } = req.body
    const dog = await prisma.dog.update({
      where: { id: parseInt(req.params.id as string) },
      data: { name, breed, age, gender, size, image, tags, status }
    })
    res.json(dog)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dog' })
  }
})

// DELETE /api/dogs/:id - Delete dog (admin)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.dog.delete({ where: { id: parseInt(req.params.id as string) } })
    res.json({ message: 'Dog deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete dog' })
  }
})

export default router
