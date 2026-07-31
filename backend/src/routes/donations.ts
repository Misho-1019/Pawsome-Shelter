import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { stripe } from '../services/stripe'
import { config } from '../config/env'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { CreateCheckoutSchema } from '../validation/schemas'
import { validateBody } from '../validation/schemas'
import { handlePrismaError } from '../utils/prismaErrorHandler'
import { logger } from '../utils/logger'
import Stripe from 'stripe'

const router = Router()

// POST /api/v1/donations/create-checkout
// Creates a Stripe Checkout Session and returns the redirect URL
// Saves the donation as Pending in the database first
// Supports one-time, monthly, and annual recurring donations
router.post('/create-checkout', validateBody(CreateCheckoutSchema), async (req: Request, res: Response) => {
  try {
    const { amount, interval, donorEmail, donorName, message } = req.body

    // Amount is in dollars from frontend, convert to cents for Stripe
    const amountInCents = Math.round(amount * 100)

    // Minimum $1, maximum $999,999
    if (amountInCents < 100 || amountInCents > 99999900) {
      return res.status(400).json({ error: 'Donation amount must be between $1 and $999,999' })
    }

    // Create donation record first (status: Pending)
    const tempSessionId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const donation = await prisma.donation.create({
      data: {
        amount: amountInCents,
        currency: 'usd',
        status: 'Pending',
        interval: interval || 'one_time',
        donorEmail: donorEmail || null,
        donorName: donorName || null,
        message: message || null,
        stripeSessionId: tempSessionId,
      },
    })

    const productName = 'Donation to Pawsome Shelter'
    const productDescription = message
      ? `Donation with message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`
      : 'Thank you for supporting Pawsome Shelter!'

    let sessionParams: Stripe.Checkout.SessionCreateParams

    if (interval === 'monthly' || interval === 'annual') {
      // Recurring donation — create a Stripe Price with recurring interval
      const recurringInterval = interval === 'annual' ? 'year' as const : 'month' as const

      const price = await stripe.prices.create({
        unit_amount: amountInCents,
        currency: 'usd',
        recurring: { interval: recurringInterval },
        product_data: {
          name: productName,
        },
      })

      sessionParams = {
        mode: 'subscription',
        line_items: [{ price: price.id, quantity: 1 }],
        customer_email: donorEmail || undefined,
        success_url: `${config.FRONTEND_URL}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.FRONTEND_URL}/donation/cancel`,
        metadata: {
          donation_id: String(donation.id),
          donor_name: donorName || '',
          interval,
        },
      }
    } else {
      // One-time donation
      sessionParams = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productName,
                description: productDescription,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        customer_email: donorEmail || undefined,
        success_url: `${config.FRONTEND_URL}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.FRONTEND_URL}/donation/cancel`,
        metadata: {
          donation_id: String(donation.id),
          donor_name: donorName || '',
          interval: 'one_time',
        },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Update donation with real Stripe session ID
    await prisma.donation.update({
      where: { id: donation.id },
      data: { stripeSessionId: session.id },
    })

    logger.info('Stripe checkout session created', {
      donationId: donation.id,
      sessionId: session.id,
      amount: amountInCents,
      interval,
    })

    res.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    logger.error('Failed to create checkout session', { error: (error as Error).message })
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// POST /api/v1/donations/webhook
// Stripe sends events here. We verify the signature and update donation status.
// IMPORTANT: The raw body middleware is registered globally in index.ts
// before express.json() to preserve the body for signature verification.
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string | undefined

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' })
  }

  let event: Stripe.Event

  try {
    // req.body is a Buffer here because the raw middleware ran first
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      config.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    logger.error('Webhook signature verification failed', { error: (error as Error).message })
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const donationId = session.metadata?.donation_id

        if (donationId) {
          await prisma.donation.update({
            where: { id: parseInt(donationId, 10) },
            data: {
              status: 'Succeeded',
              stripePaymentId: session.payment_intent as string || null,
            },
          })
          logger.info('Donation marked as succeeded', { donationId, sessionId: session.id })
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const donationId = session.metadata?.donation_id

        if (donationId) {
          await prisma.donation.update({
            where: { id: parseInt(donationId, 10) },
            data: { status: 'Failed' },
          })
          logger.info('Donation marked as failed (expired)', { donationId, sessionId: session.id })
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string

        if (paymentIntentId) {
          await prisma.donation.updateMany({
            where: { stripePaymentId: paymentIntentId },
            data: { status: 'Refunded' },
          })
          logger.info('Donation marked as refunded', { paymentIntentId })
        }
        break
      }

      // Subscription events for recurring donations
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const donationId = subscription.metadata?.donation_id

        if (donationId) {
          await prisma.donation.update({
            where: { id: parseInt(donationId, 10) },
            data: {
              status: 'Succeeded',
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: subscription.customer as string,
            },
          })
          logger.info('Recurring donation subscription created', { donationId, subscriptionId: subscription.id })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const donationId = subscription.metadata?.donation_id

        if (donationId) {
          const status = subscription.status === 'active' ? 'Succeeded'
            : subscription.status === 'canceled' ? 'Failed'
            : undefined

          if (status) {
            await prisma.donation.update({
              where: { id: parseInt(donationId, 10) },
              data: { status },
            })
          }
          logger.info('Recurring donation subscription updated', { donationId, subscriptionStatus: subscription.status })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const donationId = subscription.metadata?.donation_id

        if (donationId) {
          await prisma.donation.update({
            where: { id: parseInt(donationId, 10) },
            data: { status: 'Failed' },
          })
          logger.info('Recurring donation subscription canceled', { donationId, subscriptionId: subscription.id })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceData = invoice as unknown as { subscription: string; payment_intent: string }
        const subscriptionId = invoiceData.subscription

        if (subscriptionId) {
          // Find the original donation for this subscription
          const originalDonation = await prisma.donation.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
          })

          if (originalDonation) {
            // Create a new donation record for this recurring payment
            await prisma.donation.create({
              data: {
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: 'Succeeded',
                interval: originalDonation.interval,
                donorEmail: originalDonation.donorEmail,
                donorName: originalDonation.donorName,
                message: originalDonation.message,
                stripeSessionId: `sub_${subscriptionId}_${Date.now()}`,
                stripePaymentId: invoiceData.payment_intent || null,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: invoice.customer as string || null,
              },
            })
            logger.info('Recurring payment recorded', { subscriptionId, amount: invoice.amount_paid })
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceData = invoice as unknown as { subscription: string }
        const subscriptionId = invoiceData.subscription

        if (subscriptionId) {
          logger.warn('Recurring payment failed', { subscriptionId, customerId: invoice.customer })
        }
        break
      }

      default:
        logger.debug('Unhandled Stripe event type', { type: event.type })
    }

    res.json({ received: true })
  } catch (error) {
    logger.error('Webhook handler error', { error: (error as Error).message, eventType: event.type })
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

// GET /api/v1/donations - List all donations (admin only, paginated)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1)
    const pageSize = Math.min(100, Math.max(1, parseInt(String(req.query.pageSize || '20'), 10) || 20))
    const status = req.query.status as string | undefined

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.donation.count({ where }),
    ])

    res.json({
      data: donations,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    if (handlePrismaError(error, res, 'List donations', req.requestId)) return
    logger.error('List donations failed', { error: (error as Error).message })
    res.status(500).json({ error: 'Failed to fetch donations' })
  }
})

// GET /api/v1/donations/stats - Get donation statistics for admin overview
router.get('/stats', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const [totalRaised, totalDonations, totalDonors] = await Promise.all([
      prisma.donation.aggregate({
        where: { status: 'Succeeded' },
        _sum: { amount: true },
      }),
      prisma.donation.count({ where: { status: 'Succeeded' } }),
      prisma.donation.findMany({
        where: { status: 'Succeeded', donorEmail: { not: null } },
        distinct: ['donorEmail'],
        select: { donorEmail: true },
      }),
    ])

    res.json({
      totalRaisedCents: totalRaised._sum.amount || 0,
      totalDonations,
      uniqueDonors: totalDonors.length,
    })
  } catch (error) {
    logger.error('Donation stats failed', { error: (error as Error).message })
    res.status(500).json({ error: 'Failed to fetch donation stats' })
  }
})

// GET /api/v1/donations/:id - Get a specific donation (admin only)
router.get('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10)
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: 'Invalid ID' })

    const donation = await prisma.donation.findUnique({ where: { id } })
    if (!donation) return res.status(404).json({ error: 'Donation not found' })
    res.json(donation)
  } catch (error) {
    if (handlePrismaError(error, res, 'Get donation', req.requestId)) return
    res.status(500).json({ error: 'Failed to fetch donation' })
  }
})

export default router
