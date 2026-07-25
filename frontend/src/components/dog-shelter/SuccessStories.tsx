import { testimonials } from '../../data/dogs'

export function SuccessStories() {
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
                    Adopted June 2023
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
