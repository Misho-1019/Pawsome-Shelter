import { Router, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../db/client'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { ContentSectionSchemas } from '../validation/schemas'
import { asyncHandler } from '../utils/asyncHandler'
import { logger } from '../utils/logger'

const router = Router()

// GET /api/content - Get all content (public)
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const content = await prisma.content.findMany()
  res.json(content)
}))

// GET /api/content/:section - Get section content (public)
router.get('/:section', asyncHandler(async (req: Request, res: Response) => {
  const section = String(req.params.section)
  const content = await prisma.content.findUnique({ where: { section } })
  if (!content) return res.status(404).json({ error: 'Section not found' })
  res.json(content)
}))

// PUT /api/content/:section - Update section (admin)
router.put('/:section', authenticate, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const section = String(req.params.section)
  const schema = ContentSectionSchemas[section]

  if (!schema) {
    return res.status(400).json({ error: `Unknown content section: ${section}` })
  }

  // Accept either { data: {...} } or just {...}
  const input = req.body?.data ?? req.body
  const result = schema.safeParse(input)
  if (!result.success) {
    const message = result.error.issues
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ')
    return res.status(400).json({ error: `Invalid content: ${message}` })
  }

  const validatedData = result.data as Record<string, unknown>
  const content = await prisma.content.upsert({
    where: { section },
    update: { data: validatedData as Prisma.InputJsonValue },
    create: { section, data: validatedData as Prisma.InputJsonValue },
  })
  res.json(content)
}))

export default router
