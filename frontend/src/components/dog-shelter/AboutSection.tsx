import { shelterStats } from '../../data/dogs'
import { SlideIn } from '../ui/animations'
import { useCountUp } from '../../hooks/useCountUp'

interface AnimatedStatProps {
  value: string
  numericValue: number
  label: string
  colorClass: string
  borderColor: string
}

function AnimatedStat({ value, numericValue, label, colorClass, borderColor }: AnimatedStatProps) {
  const { count, ref } = useCountUp(numericValue, 2000)
  const hasPlus = value.includes('+')

  return (
    <div ref={ref} className={`border-l-4 pl-6 ${borderColor}`}>
      <div className={`font-heading text-4xl leading-none mb-2 ${colorClass}`}>
        {count}{hasPlus ? '+' : ''}
      </div>
      <div className="font-body text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}

export function AboutSection() {
  const statColors = [
    { colorClass: 'text-primary', borderColor: 'border-primary-container' },
    { colorClass: 'text-secondary', borderColor: 'border-secondary' },
    { colorClass: 'text-tertiary', borderColor: 'border-tertiary-container' },
    { colorClass: 'text-on-surface', borderColor: 'border-on-surface-variant' },
  ]

  return (
    <section
      className="py-32 bg-white"
      id="about"
    >
      <div className="max-w-container mx-auto px-4 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <SlideIn from="left" className="lg:w-1/2">
            <div className="relative">
              <img
                className="rounded-3xl shadow-2xl z-10 relative"
                src="/images/about-facility.jpg"
                alt="Pawsome Shelter facility"
              />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-container rounded-full -z-0 opacity-50 blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-container rounded-full -z-0 opacity-30 blur-3xl" />
            </div>
          </SlideIn>
          <SlideIn from="right" className="lg:w-1/2">
            <h2 className="font-heading text-3xl md:text-4xl mb-8">
              Professional Care, Emotional Connection.
            </h2>
            <p className="font-body text-lg text-on-surface-variant mb-6 leading-relaxed">
              Founded a decade ago, Pawsome Shelter has grown from a small rescue into a trusted community institution. We believe that bringing a dog into your life is a meaningful journey of hope, healing, and companionship — for both of you.
            </p>
            <p className="font-body text-on-surface-variant mb-12">
              Every dog who comes through our doors receives individualized care, training, and love while they wait for their forever home. We walk each family through the adoption process with patience and support, because the right match matters more than a quick placement.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {shelterStats.map((stat, index) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  numericValue={stat.numericValue}
                  label={stat.label}
                  colorClass={statColors[index].colorClass}
                  borderColor={statColors[index].borderColor}
                />
              ))}
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  )
}
