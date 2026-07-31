import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { ordersController } from '../services/paypal'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth'
import { handlePrismaError } from '../utils/prismaErrorHandler'
import { logger } from '../utils/logger'
import { CheckoutPaymentIntent } from '@paypal/paypal-server-sdk'

const router = Router()

// POST /api/v1/paypal-donations/create-order
// Creates a PayPal order and returns the approval URL
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, interval, donorEmail, donorName, message } = req.body

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid donation amount' })
    }

    // Amount is in dollars from frontend, convert to string for PayPal
    const amountStr = String(Number(amount).toFixed(2))

    // Create donation record first
    const tempOrderId = `temp_paypal_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const donation = await prisma.donation.create({
      data: {
        amount: Math.round(amount * 100), // Store in cents
        currency: 'usd',
        status: 'Pending',
        interval: interval || 'one_time',
        paymentProvider: 'paypal',
        donorEmail: donorEmail || null,
        donorName: donorName || null,
        message: message || null,
        stripeSessionId: tempOrderId, // Reuse field for temp ID
      },
    })

    // Create PayPal order
    const { result, ...httpResponse } = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: amountStr,
            },
            description: 'Donation to Pawsome Shelter',
            customId: String(donation.id),
          },
        ],
      },
      prefer: 'return=representation',
    })

    if (httpResponse.statusCode !== 201) {
      throw new Error(`PayPal API returned status ${httpResponse.statusCode}`)
    }

    const approveUrl = result.links?.find(
      (link: { rel: string }) => link.rel === 'approve'
    )?.href

    if (!result.id || !approveUrl) {
      throw new Error('Failed to create PayPal order')
    }

    // Update donation with PayPal order ID
    await prisma.donation.update({
      where: { id: donation.id },
      data: { paypalOrderId: result.id },
    })

    logger.info('PayPal order created', {
      donationId: donation.id,
      paypalOrderId: result.id,
      amount: amountStr,
    })

    res.json({ orderId: result.id, approveUrl, donationId: donation.id })
  } catch (error) {
    logger.error('Failed to create PayPal order', { error: (error as Error).message })
    res.status(500).json({ error: 'Failed to create PayPal order' })
  }
})

// POST /api/v1/paypal-donations/capture-order
// Captures payment after user approves the order
router.post('/capture-order', async (req: Request, res: Response) => {
  try {
    const { orderId, donationId } = req.body

    if (!orderId || !donationId) {
      return res.status(400).json({ error: 'Missing orderId or donationId' })
    }

    // Capture the PayPal order
    const { result, ...httpResponse } = await ordersController.captureOrder({
      id: orderId,
      prefer: 'return=representation',
    })

    if (httpResponse.statusCode !== 200 && httpResponse.statusCode !== 201) {
      throw new Error(`PayPal API returned status ${httpResponse.statusCode}`)
    }

    const status = result.status
    const capture = result.purchaseUnits?.[0]?.payments?.captures?.[0]

    if (status === 'COMPLETED' && capture) {
      await prisma.donation.update({
        where: { id: parseInt(donationId, 10) },
        data: {
          status: 'Succeeded',
          paypalPaymentId: capture.id || null,
        },
      })

      logger.info('PayPal order captured', { donationId, paypalOrderId: orderId, captureId: capture.id })

      res.json({ status: 'succeeded', captureId: capture.id })
    } else {
      await prisma.donation.update({
        where: { id: parseInt(donationId, 10) },
        data: { status: 'Failed' },
      })

      logger.warn('PayPal order not completed', { donationId, paypalOrderId: orderId, status })
      res.json({ status: 'failed' })
    }
  } catch (error) {
    logger.error('Failed to capture PayPal order', { error: (error as Error).message })
    res.status(500).json({ error: 'Failed to capture PayPal order' })
  }
})

// POST /api/v1/paypal-donations/webhook
// PayPal sends events here
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const event = req.body

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const resource = event.resource
        const captureId = resource?.id
        const customId = resource?.custom_id

        if (customId) {
          await prisma.donation.update({
            where: { id: parseInt(customId, 10) },
            data: {
              status: 'Succeeded',
              paypalPaymentId: captureId || null,
            },
          })
          logger.info('PayPal webhook: capture completed', { donationId: customId, captureId })
        }
        break
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED': {
        const resource = event.resource
        const customId = resource?.custom_id

        if (customId) {
          await prisma.donation.update({
            where: { id: parseInt(customId, 10) },
            data: { status: event.event_type === 'PAYMENT.CAPTURE.REFUNDED' ? 'Refunded' : 'Failed' },
          })
          logger.info(`PayPal webhook: ${event.event_type}`, { donationId: customId })
        }
        break
      }

      default:
        logger.debug('Unhandled PayPal event type', { type: event.event_type })
    }

    res.json({ received: true })
  } catch (error) {
    logger.error('PayPal webhook handler error', { error: (error as Error).message })
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

// GET /api/v1/paypal-donations — List PayPal donations (admin only)
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1)
    const pageSize = Math.min(100, Math.max(1, parseInt(String(req.query.pageSize || '20'), 10) || 20))

    const where = { paymentProvider: 'paypal' }

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
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    })
  } catch (error) {
    if (handlePrismaError(error, res, 'List PayPal donations', req.requestId)) return
    logger.error('List PayPal donations failed', { error: (error as Error).message })
    res.status(500).json({ error: 'Failed to fetch donations' })
  }
})

export default router
