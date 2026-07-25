import { useState } from 'react'

export function GetInvolved() {
  const [donationAmount, setDonationAmount] = useState(50)

  return (
    <section className="py-32 bg-surface-container" id="volunteer">
      <div className="max-w-container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Volunteer */}
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
              <button className="bg-secondary text-white font-body text-sm font-semibold px-10 py-4 rounded-xl hover:opacity-90 transition-all flex items-center gap-3">
                Apply to Volunteer
                <span className="material-symbols-outlined">volunteer_activism</span>
              </button>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-10">
              <span className="material-symbols-outlined text-[300px]">pets</span>
            </div>
          </div>

          {/* Right: Donate */}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount)}
                  className={`border-2 rounded-xl py-4 font-body text-sm font-semibold transition-all ${
                    donationAmount === amount
                      ? 'border-primary-container bg-primary-container/20 text-white'
                      : 'border-white/20 hover:bg-white/10'
                  }`}
                >
                  ${amount}
                </button>
              ))}
              <button className="border-2 border-white/20 rounded-xl py-4 font-body text-sm font-semibold hover:bg-white/10 transition-all">
                Custom
              </button>
            </div>
            <button className="w-full bg-primary-container text-white font-heading text-xl py-5 rounded-xl hover:scale-[1.02] active:scale-100 transition-all shadow-lg mt-auto">
              Make a Donation
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
