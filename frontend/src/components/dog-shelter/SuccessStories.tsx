import { useTestimonials } from '../../hooks/useTestimonials'
import { FadeIn } from '../ui/animations'
import { TestimonialsCarousel } from './TestimonialsCarousel'
import { TestimonialsCarouselMobile } from './TestimonialsCarouselMobile'

export function SuccessStories() {
  const { testimonials, loading, error } = useTestimonials()

  if (error) {
    return (
      <section className="py-32" id="stories">
        <div className="max-w-container mx-auto px-4 md:px-12 text-center">
          <p className="text-error">Error loading testimonials: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-32 overflow-hidden" id="stories">
      <div className="max-w-container mx-auto px-4 md:px-12">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl mb-4">
              Happy Tails
            </h2>
            <p className="font-body text-on-surface-variant max-w-2xl mx-auto">
              Real stories from real families who found their perfect companion at Pawsome Shelter.
            </p>
          </div>
        </FadeIn>

        {testimonials.length === 0 && !loading ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-7xl text-on-surface-variant mb-4 block">
              sentiment_satisfied
            </span>
            <h3 className="font-heading text-xl mb-2">No success stories yet</h3>
            <p className="text-on-surface-variant">
              Check back soon to hear from our happy adopters!
            </p>
          </div>
        ) : (
          <>
            {/* Desktop: 3D carousel with arrows */}
            <div className="hidden md:block">
              <TestimonialsCarousel testimonials={testimonials} loading={loading} />
            </div>
            {/* Mobile: swipe carousel */}
            <div className="md:hidden">
              <TestimonialsCarouselMobile testimonials={testimonials} loading={loading} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
