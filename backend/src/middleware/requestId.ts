import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

declare global {
  namespace Express {
    interface Request {
      requestId?: string
    }
  }
}

// Attach a unique request ID to every request for tracing.
export function requestId(req: Request, res: Response, next: NextFunction) {
  const existing = req.headers['x-request-id']
  req.requestId = (typeof existing === 'string' && existing) || crypto.randomUUID()
  res.setHeader('x-request-id', req.requestId)
  next()
}
