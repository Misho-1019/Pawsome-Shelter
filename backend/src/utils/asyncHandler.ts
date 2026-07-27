import { Request, Response, NextFunction, RequestHandler } from 'express'

// Wrap an async route handler so that rejected promises are forwarded to Express's error handler.
// This is required for Express 5 compatibility (Express 4 swallowed async errors silently).
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

export function asyncHandler(fn: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
