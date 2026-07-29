import { useRef, useState, useEffect } from 'react'
import { Skeleton, SkeletonAvatar } from '../ui/Skeleton'
import type { Testimonial } from '../../types/dog-shelter'

interface TestimonialsCarouselMobileProps {
  testimonials: Testimonial[]
  loading?: boolean
}

function MobileCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="snap-center shrink-0 w-[85%] bg-white p-8 rounded-3xl shadow-premium">
      {/* Stars */}
      <div
        className="flex gap-1 text-primary mb-6"
        role="img"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            star
          </span>
        ))}
      </div>

      <p className="font-body italic text-on-surface mb-8 leading-relaxed">
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
          <h5 className="font-body text-sm font-semibold text-on-surface">{testimonial.name}</h5>
          <p className="text-xs text-on-surface-variant">Adopted {testimonial.dogName}</p>
        </div>
      </div>
    </div>
  )
}

function MobileSkeleton() {
  return (
    <div className="snap-center shrink-0 w-[85%] bg-white p-8 rounded-3xl shadow-premium">
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((j) => (
          <Skeleton key={j} className="w-6 h-6" width="full" rounded="rounded" />
        ))}
      </div>
      <Skeleton className="h-24 mb-8" width="full" />
      <div className="flex items-center gap-4">
        <SkeletonAvatar />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4" width="1/2" />
          <Skeleton className="h-3" width="1/3" />
        </div>
      </div>
    </div>
  )
}

export function TestimonialsCarouselMobile({ testimonials, loading = false }: TestimonialsCarouselMobileProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Track which card is most visible (for dot indicators)
  useEffect(() => {
    const track = trackRef.current
    if (!track || testimonials.length === 0) return

    const handleScroll = () => {
      const scrollLeft = track.scrollLeft
      const cardWidth = track.children[0]?.clientWidth ?? 0
      const gap = 16 // gap-4 = 1rem = 16px
      const index = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(index, testimonials.length - 1))
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => track.removeEventListener('scroll', handleScroll)
  }, [testimonials.length])

  if (loading) {
    return (
      <div className="relative" role="region" aria-label="Customer testimonials">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-2">
          {[1, 2, 3].map((i) => (
            <MobileSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (testimonials.length === 0) return null

  return (
    <div className="relative" role="region" aria-label="Customer testimonials carousel">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {testimonials.map((testimonial) => (
          <MobileCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial selector">
        {testimonials.map((_, i) => (
          <span
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'bg-primary w-6'
                : 'bg-outline-variant w-2'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
