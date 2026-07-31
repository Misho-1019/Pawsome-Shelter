import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { VolunteerDrawer } from './VolunteerDrawer'
import { SlideIn } from '../ui/animations'
import { Drawer, FormField, FormError, SubmitButton } from '../ui'
import { api } from '../../services/api'
import type { DonationInterval } from '../../types/dog-shelter'

const PRESET_AMOUNTS: Record<DonationInterval, number[]> = {
  one_time: [25, 50, 100],
  monthly: [10, 25, 50],
  annual: [100, 250, 500],
}

const INTERVAL_LABELS: Record<DonationInterval, string> = {
  one_time: 'One-time',
  monthly: 'Monthly',
  annual: 'Annual',
}

export function GetInvolved() {
  const [donationInterval, setDonationInterval] = useState<DonationInterval>('one_time')
  const [donationAmount, setDonationAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false)
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false)
  const [donorEmail, setDonorEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const presetAmounts = PRESET_AMOUNTS[donationInterval]

  const handleIntervalChange = (interval: DonationInterval) => {
    setDonationInterval(interval)
    setDonationAmount(PRESET_AMOUNTS[interval][1]) // Default to middle preset
    setIsCustom(false)
    setCustomAmount('')
  }

  const handleAmountClick = (amount: number) => {
    setDonationAmount(amount)
    setIsCustom(false)
    setCustomAmount('')
  }

  const handleCustomClick = () => {
    setIsCustom(true)
    setDonationAmount(0)
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setCustomAmount(value)
    if (value && parseInt(value) >= 1) {
      setDonationAmount(parseInt(value))
    }
  }

  const handleDonate = () => {
    const amount = isCustom ? parseInt(customAmount) : donationAmount
    if (amount >= 1) {
      setCheckoutError(null)
      setIsCheckoutDrawerOpen(true)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutError(null)

    const amount = isCustom ? parseInt(customAmount) : donationAmount
    if (amount < 1) {
      setCheckoutError('Minimum donation is $1')
      return
    }

    setIsProcessing(true)
    try {
      const response = await api.donations.createCheckout({
        amount,
        interval: donationInterval,
        donorEmail: donorEmail || undefined,
      })

      if (response.url) {
        window.location.href = response.url
      } else {
        setCheckoutError('Failed to create checkout session')
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Failed to start checkout')
    } finally {
      setIsProcessing(false)
    }
  }

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''

  return (
    <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD' }}>
    <>
      <section className="py-32 bg-surface-container" id="volunteer">
        <div className="max-w-container mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Volunteer */}
            <SlideIn from="left">
              <div className="bg-white rounded-3xl p-12 shadow-premium relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-secondary font-body text-sm font-semibold uppercase tracking-widest mb-4 block">
                    Community
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl mb-6">
                    Become a Volunteer
                  </h2>
                  <p className="font-body text-on-surface-variant mb-10 leading-relaxed">
                    Join our dedicated team of animal lovers. From walking dogs to helping at events, your time is the most valuable gift you can give.
                  </p>
                  <button
                    onClick={() => setIsVolunteerOpen(true)}
                    className="bg-secondary text-white font-body text-sm font-semibold px-10 py-4 rounded-xl hover:opacity-90 transition-all flex items-center gap-3"
                  >
                    Apply to Volunteer
                    <span className="material-symbols-outlined">volunteer_activism</span>
                  </button>
                </div>
                <div className="absolute -right-20 -bottom-20 opacity-10">
                  <span className="material-symbols-outlined text-[300px]">pets</span>
                </div>
              </div>
            </SlideIn>

            {/* Right: Donate */}
            <SlideIn from="right">
              <div className="bg-on-background text-white rounded-3xl p-12 shadow-premium flex flex-col h-full">
                <span className="text-primary-container font-body text-sm font-semibold uppercase tracking-widest mb-4 block">
                  Impact
                </span>
                <h2 className="font-heading text-3xl md:text-4xl mb-6">
                  Donate Today
                </h2>
                <p className="font-body text-surface-container mb-6">
                  Your contribution directly funds medical care, food, and warm beds for our residents.
                </p>

                {/* Interval Toggle */}
                <div className="flex gap-2 mb-6 bg-white/10 rounded-xl p-1">
                  {(Object.keys(INTERVAL_LABELS) as DonationInterval[]).map((interval) => (
                    <button
                      key={interval}
                      onClick={() => handleIntervalChange(interval)}
                      className={`flex-1 py-2.5 px-3 rounded-lg font-body text-sm font-semibold transition-all ${
                        donationInterval === interval
                          ? 'bg-primary-container text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {INTERVAL_LABELS[interval]}
                    </button>
                  ))}
                </div>

                {/* Amount Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountClick(amount)}
                      className={`border-2 rounded-xl py-4 font-body text-sm font-semibold transition-all ${
                        !isCustom && donationAmount === amount
                          ? 'border-primary-container bg-primary-container/20 text-white'
                          : 'border-white/20 hover:bg-white/10'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                  <button
                    onClick={handleCustomClick}
                    className={`border-2 rounded-xl py-4 font-body text-sm font-semibold transition-all ${
                      isCustom
                        ? 'border-primary-container bg-primary-container/20 text-white'
                        : 'border-white/20 hover:bg-white/10'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Custom Amount Input */}
                {isCustom && (
                  <div className="mb-4 animate-fade-in">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 font-body text-lg">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={customAmount}
                        onChange={handleCustomChange}
                        placeholder="Enter amount"
                        aria-label="Custom donation amount in dollars"
                        className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-4 pl-8 pr-4 font-body text-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-container transition-colors"
                        autoFocus
                      />
                    </div>
                    {customAmount && parseInt(customAmount) < 1 && (
                       <p className="text-error text-sm mt-2">Minimum donation is $1</p>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-4">
                  <p className="text-white/60 text-sm mb-4 text-center">
                    {isCustom && customAmount
                      ? `Donating: $${customAmount}${donationInterval !== 'one_time' ? ` / ${donationInterval === 'monthly' ? 'month' : 'year'}` : ''}`
                      : `Donating: $${donationAmount}${donationInterval !== 'one_time' ? ` / ${donationInterval === 'monthly' ? 'month' : 'year'}` : ''}`}
                  </p>
                  <button
                    onClick={handleDonate}
                    disabled={isCustom && (!customAmount || parseInt(customAmount) < 1)}
                    className="w-full bg-primary-container text-white font-heading text-xl py-5 rounded-xl hover:scale-[1.02] active:scale-100 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Make a Donation
                  </button>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      <VolunteerDrawer isOpen={isVolunteerOpen} onClose={() => setIsVolunteerOpen(false)} />

      {/* Checkout Drawer for Email Collection */}
      <Drawer
        isOpen={isCheckoutDrawerOpen}
        onClose={() => {
          if (!isProcessing) {
            setIsCheckoutDrawerOpen(false)
            setDonorEmail('')
            setCheckoutError(null)
          }
        }}
        title="Complete your donation"
        size="sm"
      >
        <form onSubmit={handleCheckout} className="p-6 space-y-5" noValidate>
          <p className="text-on-surface-variant text-sm">
            Enter your email to receive a receipt. You'll be redirected to our secure payment page to complete your donation.
          </p>

          <div className="bg-surface-container-low p-4 rounded-xl">
            <p className="text-sm text-on-surface-variant">Donation amount</p>
            <p className="text-2xl font-heading text-primary">
              ${isCustom ? customAmount || '0' : donationAmount}
              {donationInterval !== 'one_time' && (
                <span className="text-sm font-body text-on-surface-variant ml-2">
                  / {donationInterval === 'monthly' ? 'month' : 'year'}
                </span>
              )}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              {INTERVAL_LABELS[donationInterval]} donation
            </p>
          </div>

          <FormField
            label="Email address"
            name="email"
            type="email"
            required
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          {checkoutError && (
            <FormError title="Checkout failed">{checkoutError}</FormError>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsCheckoutDrawerOpen(false)
                setDonorEmail('')
                setCheckoutError(null)
              }}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm border-2 border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            {/* Stripe Button */}
            <button
              onClick={handleCheckout}
              disabled={!donorEmail || isProcessing}
              className="w-full bg-primary-container text-white font-heading text-lg py-4 rounded-xl hover:scale-[1.02] active:scale-100 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isProcessing ? 'Redirecting...' : 'Pay with Card'}
            </button>

            {/* PayPal Button */}
            {donorEmail && (
              <div className="pt-2">
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'gold', shape: 'rect', height: 45 }}
                  createOrder={async () => {
                    const amount = isCustom ? parseInt(customAmount) : donationAmount
                    const response = await api.paypalDonations.createOrder({
                      amount,
                      interval: donationInterval,
                      donorEmail: donorEmail || undefined,
                    })
                    return response.orderId
                  }}
                  onApprove={async (data) => {
                    const amount = isCustom ? parseInt(customAmount) : donationAmount
                    // Find the donationId from the create-order response
                    // We need to re-create the order to get the donationId
                    // Actually, we should store it. Let me use a simpler approach.
                    try {
                      const orderResponse = await api.paypalDonations.createOrder({
                        amount,
                        interval: donationInterval,
                        donorEmail: donorEmail || undefined,
                      })
                      await api.paypalDonations.captureOrder({
                        orderId: data.orderID,
                        donationId: orderResponse.donationId,
                      })
                      window.location.href = `${window.location.origin}/donation/success?session_id=${data.orderID}`
                    } catch {
                      setCheckoutError('Failed to capture PayPal payment')
                    }
                  }}
                  onError={(err) => {
                    setCheckoutError('PayPal payment failed. Please try again.')
                    console.error('PayPal error:', err)
                  }}
                />
              </div>
            )}
          </div>

          <p className="text-xs text-on-surface-variant text-center">
            Secure payment powered by Stripe and PayPal. Your card details are never stored on our servers.
          </p>
        </form>
      </Drawer>
    </>
    </PayPalScriptProvider>
  )
}
