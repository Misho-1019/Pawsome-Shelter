import { useTestimonials } from '../../hooks/useTestimonials'
import { FadeIn, StaggerContainer, StaggerItem } from '../ui/animations'
import { Skeleton, SkeletonAvatar } from '../ui/Skeleton'

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
    <section className="py-32" id="stories">
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" aria-busy={loading} aria-live="polite">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-premium">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} className="w-5 h-5" width="full" rounded="rounded" />
                  ))}
                </div>
                <Skeleton className="h-20 mb-8" width="full" />
                <div className="flex items-center gap-4">
                  <SkeletonAvatar />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4" width="1/2" />
                    <Skeleton className="h-3" width="1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.id}>
                <div className="bg-white p-8 rounded-3xl shadow-premium">
                  {/* Stars */}
                  <div
                    className="flex gap-1 text-primary mb-6"
                    role="img"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                        aria-hidden="true"
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <p className="font-body italic text-on-surface mb-8">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      loading="lazy"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-body text-sm font-semibold">{testimonial.name}</h5>
                      <p className="text-xs text-on-surface-variant">
                        Adopted {testimonial.dogName}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  )
}
