import { Router, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { ContentSectionSchemas } from '../validation/schemas'

const router = Router()

// GET /api/content - Get all content (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const content = await prisma.content.findMany()
    res.json(content)
  } catch (error) {
    console.error('Content fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch content' })
  }
})

// GET /api/content/:section - Get section content (public)
router.get('/:section', async (req: Request, res: Response) => {
  try {
    const section = String(req.params.section)
    const content = await prisma.content.findUnique({ where: { section } })
    if (!content) return res.status(404).json({ error: 'Section not found' })
    res.json(content)
  } catch (error) {
    console.error('Content section fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch content' })
  }
})

// PUT /api/content/:section - Update section (admin)
router.put('/:section', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const section = String(req.params.section)
    const schema = ContentSectionSchemas[section]

    if (!schema) {
      return res.status(400).json({ error: `Unknown content section: ${section}` })
    }

    const result = schema.safeParse(req.body?.data ?? req.body)
    if (!result.success) {
      const message = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      return res.status(400).json({ error: `Invalid content: ${message}` })
    }

    const validatedData = result.data as Record<string, unknown>
    const content = await prisma.content.upsert({
      where: { section },
      update: { data: validatedData as Prisma.InputJsonValue },
      create: { section, data: validatedData as Prisma.InputJsonValue }
    })
    res.json(content)
  } catch (error) {
    console.error('Content update error:', error)
    res.status(500).json({ error: 'Failed to update content' })
  }
})

export default router
