import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/content - Get all content (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const content = await prisma.content.findMany()
    res.json(content)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' })
  }
})

// GET /api/content/:section - Get section content (public)
router.get('/:section', async (req: Request, res: Response) => {
  try {
    const content = await prisma.content.findUnique({
      where: { section: req.params.section }
    })
    if (!content) return res.status(404).json({ error: 'Section not found' })
    res.json(content)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' })
  }
})

// PUT /api/content/:section - Update section (admin)
router.put('/:section', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { data } = req.body
    const content = await prisma.content.upsert({
      where: { section: req.params.section },
      update: { data },
      create: { section: req.params.section, data }
    })
    res.json(content)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' })
  }
})

export default router
