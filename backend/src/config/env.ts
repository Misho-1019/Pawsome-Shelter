import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  API_URL: z.string().default('http://localhost:3001'),
  PORT: z.string().default('3001'),
  NODE_ENV: z.string().default('development'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_placeholder'),
  STRIPE_PUBLISHABLE_KEY: z.string().default('pk_test_placeholder'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_placeholder'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const config = parsed.data
