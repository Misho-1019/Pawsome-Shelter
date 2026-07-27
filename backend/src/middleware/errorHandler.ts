import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

// Global error handler. Must have 4 args for Express to recognize it.
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error('Unhandled error', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  }, req.requestId)
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.requestId,
  })
}
