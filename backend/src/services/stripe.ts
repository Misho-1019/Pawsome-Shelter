import Stripe from 'stripe'
import { config } from '../config/env'

// Initialize Stripe with the secret key from env
// Falls back to a placeholder for build/dev when no key is set
export const stripe: Stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  typescript: true,
})
