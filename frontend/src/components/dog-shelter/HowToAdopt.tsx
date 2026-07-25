import { adoptionSteps } from '../../data/dogs'

export function HowToAdopt() {
  return (
    <section className="py-32 bg-surface-container-low overflow-hidden" id="process">
      <div className="max-w-container mx-auto px-4 md:px-12 text-center">
        <h2 className="font-heading text-3xl md:text-4xl mb-16">
          Your Path to a New Family Member
        </h2>
        <div className="relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -translate-y-1/2 z-0" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {adoptionSteps.map((step) => (
              <div key={step.step} className="bg-white p-10 rounded-3xl shadow-premium flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white mb-8 shadow-lg ${
                  step.step === 1 ? 'bg-primary-container' : step.step === 2 ? 'bg-secondary' : 'bg-tertiary-container'
                }`}>
                  <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                </div>
                <h4 className="font-heading text-xl mb-4">{step.step}. {step.title}</h4>
                <p className="text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
