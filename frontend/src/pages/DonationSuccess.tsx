import { useEffect, useState } from 'react'
import type { Donation } from '../types/dog-shelter'

export function DonationSuccess() {
  const [, setDonation] = useState<Donation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get the session_id from the URL
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')

    if (!sessionId) {
      setError('No session ID found')
      setLoading(false)
      return
    }

    // We could look up the donation here, but the webhook might not have fired yet
    // For now, show a generic thank you
    setLoading(false)

    // Optional: poll for the donation to be marked Succeeded
    setDonation({
      id: 0,
      amount: 0,
      currency: 'usd',
      status: 'Succeeded',
      interval: 'one_time',
      paymentProvider: 'stripe',
      donorEmail: null,
      donorName: null,
      message: null,
      stripeSessionId: sessionId,
      stripePaymentId: null,
      stripeSubscriptionId: null,
      stripeCustomerId: null,
      paypalOrderId: null,
      paypalPaymentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <span
            className="material-symbols-outlined text-5xl text-primary animate-spin"
            aria-hidden="true"
          >
            progress_activity
          </span>
          <p className="text-on-surface-variant mt-3">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-16">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-20 h-20 mx-auto bg-secondary-container rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-secondary" aria-hidden="true">
            check_circle
          </span>
        </div>

        <h1 className="font-heading text-3xl text-on-surface mb-4">
          Thank you for your donation!
        </h1>

        <p className="text-on-surface-variant mb-8">
          Your generous gift will help provide food, shelter, and medical care for our rescued animals.
          A receipt has been sent to your email.
        </p>

        {error && (
          <p className="text-error text-sm mb-4">{error}</p>
        )}

        <div className="space-y-3">
          <a
            href="/"
            className="block w-full bg-primary-container text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            Back to Home
          </a>
          <a
            href="/#volunteer"
            className="block w-full border-2 border-outline-variant text-on-surface font-semibold py-3 px-6 rounded-xl hover:bg-surface-container transition-colors"
          >
            Become a Volunteer
          </a>
        </div>

        <p className="text-xs text-on-surface-variant mt-8">
          Your donation is tax-deductible. Keep your email receipt for your records.
        </p>
      </div>
    </div>
  )
}
