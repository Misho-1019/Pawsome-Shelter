export function DonationCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-16">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-20 h-20 mx-auto bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant" aria-hidden="true">
            close
          </span>
        </div>

        <h1 className="font-heading text-3xl text-on-surface mb-4">
          Donation cancelled
        </h1>

        <p className="text-on-surface-variant mb-8">
          No worries! Your donation was not processed. If you change your mind, you can try again anytime.
        </p>

        <div className="space-y-3">
          <a
            href="/#volunteer"
            className="block w-full bg-primary-container text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            Try Again
          </a>
          <a
            href="/"
            className="block w-full border-2 border-outline-variant text-on-surface font-semibold py-3 px-6 rounded-xl hover:bg-surface-container transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
