import { Prisma } from '@prisma/client'
import { Response } from 'express'
import { logger } from './logger'

// Map Prisma error codes to HTTP responses.
// Returns true if the error was handled, false if it should bubble up to the generic 500 handler.
export function handlePrismaError(error: unknown, res: Response, context: string, requestId?: string): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025': // Record not found
        logger.warn(`${context}: record not found`, { code: error.code }, requestId)
        res.status(404).json({ error: 'Resource not found' })
        return true
      case 'P2002': // Unique constraint violation
        logger.warn(`${context}: unique constraint`, { code: error.code, meta: error.meta }, requestId)
        res.status(409).json({ error: 'A record with this value already exists' })
        return true
      case 'P2003': // Foreign key constraint violation
        logger.warn(`${context}: foreign key constraint`, { code: error.code, meta: error.meta }, requestId)
        res.status(400).json({ error: 'Invalid reference to related resource' })
        return true
      case 'P2011': // Null constraint violation
        logger.warn(`${context}: null constraint`, { code: error.code }, requestId)
        res.status(400).json({ error: 'Required field is missing' })
        return true
      case 'P2014': // Required relation violation
        logger.warn(`${context}: required relation`, { code: error.code }, requestId)
        res.status(400).json({ error: 'Required related record missing' })
        return true
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error(`${context}: validation error`, { error: error.message }, requestId)
    res.status(400).json({ error: 'Invalid data provided' })
    return true
  }

  return false
}
