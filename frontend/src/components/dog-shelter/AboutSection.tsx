import { SlideIn } from '../ui/animations'
import { useCountUp } from '../../hooks/useCountUp'
import { useAboutContent, type AboutContent } from '../../hooks/useContent'

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

// Parse string like "500+" or "10" into numeric value
function parseStatValue(value: string): number {
  const num = parseInt(value.replace(/\D/g, ''), 10)
  return isNaN(num) ? 0 : num
}

const DEFAULT_CONTENT: AboutContent = {
  title: 'Professional Care, Emotional Connection.',
  description: 'Founded a decade ago, Pawsome Shelter has grown from a small rescue into a trusted community institution. We believe that bringing a dog into your life is a meaningful journey of hope, healing, and companionship — for both of you. Every dog who comes through our doors receives individualized care, training, and love while they wait for their forever home.',
  stats: [
    { label: 'Rescued', value: '500+' },
    { label: 'Happy Families', value: '350+' },
    { label: 'Years Active', value: '10' },
    { label: 'Volunteers', value: '50+' },
  ],
}

export function AboutSection() {
  const { data } = useAboutContent()
  const content = data ?? DEFAULT_CONTENT

  const statColors = [
    { colorClass: 'text-primary', borderColor: 'border-primary-container' },
    { colorClass: 'text-secondary', borderColor: 'border-secondary' },
    { colorClass: 'text-tertiary', borderColor: 'border-tertiary-container' },
    { colorClass: 'text-on-surface', borderColor: 'border-on-surface-variant' },
  ]

  return (
    <section className="py-32 bg-white" id="about">
      <div className="max-w-container mx-auto px-4 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <SlideIn from="left" className="lg:w-1/2">
            <div className="relative">
              <img
                className="rounded-3xl shadow-2xl z-10 relative"
                src="/images/about-facility.jpg"
                alt="Pawsome Shelter facility"
                loading="lazy"
              />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-container rounded-full -z-0 opacity-50 blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-container rounded-full -z-0 opacity-30 blur-3xl" />
            </div>
          </SlideIn>
          <SlideIn from="right" className="lg:w-1/2">
            <h2 className="font-heading text-3xl md:text-4xl mb-8">
              {content.title}
            </h2>
            <p className="font-body text-lg text-on-surface-variant leading-relaxed">
              {content.description}
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12">
              {content.stats.map((stat, index) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  numericValue={parseStatValue(stat.value)}
                  label={stat.label}
                  colorClass={statColors[index % statColors.length].colorClass}
                  borderColor={statColors[index % statColors.length].borderColor}
                />
              ))}
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  )
}
