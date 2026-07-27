// Simple structured logger. In production, replace with pino or winston for log aggregation.
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: unknown
}

const isProduction = process.env.NODE_ENV === 'production'

function format(level: LogLevel, message: string, context?: LogContext, requestId?: string) {
  const timestamp = new Date().toISOString()
  const data = {
    timestamp,
    level,
    message,
    ...(requestId ? { requestId } : {}),
    ...(context ? { context } : {}),
  }
  if (isProduction) {
    return JSON.stringify(data)
  }
  // Pretty format for development
  const ctxStr = context ? ` ${JSON.stringify(context)}` : ''
  const reqStr = requestId ? ` [${requestId}]` : ''
  return `${timestamp} ${level.toUpperCase()}${reqStr}: ${message}${ctxStr}`
}

export const logger = {
  info(message: string, context?: LogContext, requestId?: string) {
    console.log(format('info', message, context, requestId))
  },
  warn(message: string, context?: LogContext, requestId?: string) {
    console.warn(format('warn', message, context, requestId))
  },
  error(message: string, context?: LogContext, requestId?: string) {
    console.error(format('error', message, context, requestId))
  },
  debug(message: string, context?: LogContext, requestId?: string) {
    if (!isProduction) {
      console.debug(format('debug', message, context, requestId))
    }
  },
}
