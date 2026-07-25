import { useTestimonials } from '../../hooks/useTestimonials'

export function SuccessStories() {
  const { testimonials, loading, error } = useTestimonials()

  if (error) {
    return (
      <section className="py-32" id="stories">
        <div className="max-w-container mx-auto px-4 md:px-12 text-center">
          <p className="text-red-500">Error loading testimonials: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-32" id="stories">
      <div className="max-w-container mx-auto px-4 md:px-12">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl mb-4">
            Happy Tails
          </h2>
          <p className="font-body text-on-surface-variant max-w-2xl mx-auto">
            Real stories from real families who found their perfect companion at Pawsome Shelter.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-premium animate-pulse">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-5 h-5 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="h-20 bg-gray-200 rounded mb-8" />
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-3xl shadow-premium"
              >
                {/* Stars */}
                <div className="flex gap-1 text-primary mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
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
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
