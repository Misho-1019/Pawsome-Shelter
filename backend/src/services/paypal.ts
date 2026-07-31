import { Client, Environment, OrdersController } from '@paypal/paypal-server-sdk'

const paypalClient = new Client({
  timeout: 0,
  environment: process.env.PAYPAL_MODE === 'live'
    ? Environment.Production
    : Environment.Sandbox,
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID || '',
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  },
})

export const ordersController = new OrdersController(paypalClient)
