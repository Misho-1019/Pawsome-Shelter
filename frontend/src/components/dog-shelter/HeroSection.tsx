import { Button } from '../ui'
import { FadeIn } from '../ui/animations'
import { useHeroContent, type HeroContent } from '../../hooks/useContent'

const DEFAULT_CONTENT: HeroContent = {
  headline: 'Find Your New\nBest Friend',
  subtext: 'Every dog deserves a loving home. Browse our available dogs and change a life today through our empathetic and professional adoption journey.',
  ctaText: 'Adopt Now',
  secondaryText: 'Learn How It Works',
}

function formatHeadline(text: string): React.ReactNode {
  // Split on \n to render as multiple lines
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ))
}

export function HeroSection() {
  const { data } = useHeroContent()
  const content = data ?? DEFAULT_CONTENT

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="relative h-[600px] md:h-[921px] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
          role="img"
          aria-label="Happy dogs playing together at Pawsome Shelter"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-on-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-container mx-auto px-4 md:px-12 w-full text-white">
        <div className="max-w-2xl">
          <FadeIn delay={0.2} direction="up">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight drop-shadow-md">
              {formatHeadline(content.headline)}
            </h1>
          </FadeIn>
          <FadeIn delay={0.4} direction="up">
            <p className="font-body text-lg md:text-xl mb-10 opacity-95 max-w-lg drop-shadow-sm">
              {content.subtext}
            </p>
          </FadeIn>
          <FadeIn delay={0.6} direction="up">
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('#dogs')}
                className="inline-flex items-center gap-2"
              >
                {content.ctaText}
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => scrollToSection('#process')}
              >
                {content.secondaryText}
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={1} direction="up" className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={() => scrollToSection('#dogs')}
          className="text-white/80 hover:text-white transition-colors animate-bounce"
          aria-label="Scroll to dogs"
        >
          <span className="material-symbols-outlined text-4xl" aria-hidden="true">keyboard_double_arrow_down</span>
        </button>
      </FadeIn>
    </section>
  )
}
