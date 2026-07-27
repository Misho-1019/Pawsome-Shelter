import { useState } from 'react'
import { VolunteerDrawer } from './VolunteerDrawer'
import { SlideIn } from '../ui/animations'
import { useToast } from '../ui/Toast'

export function GetInvolved() {
  const [donationAmount, setDonationAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false)
  const { addToast } = useToast()

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
      addToast(`Thank you for your $${amount} donation! (This is a demo - no actual payment will be processed)`, 'success')
    }
  }

  return (
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
                <p className="font-body text-surface-container mb-10">
                  Your contribution directly funds medical care, food, and warm beds for our residents.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {[25, 50, 100].map((amount) => (
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
                      ? `Donating: $${customAmount}`
                      : `Donating: $${donationAmount}`}
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
    </>
  )
}
