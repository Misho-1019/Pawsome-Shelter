import { shelterStats } from '../../data/dogs'

export function AboutSection() {
  return (
    <section
      className="py-32 bg-white"
      id="about"
    >
      <div className="max-w-container mx-auto px-4 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                className="rounded-3xl shadow-2xl z-10 relative"
                src="/images/about-facility.jpg"
                alt="Pawsome Shelter facility"
              />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-container rounded-full -z-0 opacity-50 blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-container rounded-full -z-0 opacity-30 blur-3xl" />
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="font-heading text-3xl md:text-4xl mb-8">
              Professional Care, Emotional Connection.
            </h2>
            <p className="font-body text-lg text-on-surface-variant mb-6 leading-relaxed">
              Founded a decade ago, Pawsome Shelter has evolved from a small rescue into a high-standard professional institution. We believe that pet adoption is not just a transaction, but a life-changing journey of hope and companionship.
            </p>
            <p className="font-body text-on-surface-variant mb-12">
              Our mission is to reduce cognitive load for adopters through organized processes while maintaining the warm, tactile interface of a true community heart. We treat every hound like royalty until they find their kingdom.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {shelterStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`border-l-4 pl-6 ${
                    index === 0 ? 'border-primary-container' :
                    index === 1 ? 'border-secondary' :
                    index === 2 ? 'border-tertiary-container' :
                    'border-on-surface-variant'
                  }`}
                >
                  <div className={`font-heading text-4xl leading-none mb-2 ${
                    index === 0 ? 'text-primary' :
                    index === 1 ? 'text-secondary' :
                    index === 2 ? 'text-tertiary' :
                    'text-on-surface'
                  }`}>
                    {stat.value}
                  </div>
                  <div className="font-body text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
