import { useState, useEffect, useCallback } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { Skeleton, SkeletonAvatar } from '../ui/Skeleton'
import type { Testimonial } from '../../types/dog-shelter'

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  loading?: boolean
}

type CardPosition = 'left' | 'center' | 'right' | 'hidden'

const AUTO_ROTATE_MS = 6000

function getPosition(index: number, current: number, total: number): CardPosition {
  if (total === 0) return 'hidden'
  const left = (current - 1 + total) % total
  const right = (current + 1) % total
  if (index === current) return 'center'
  if (index === left) return 'left'
  if (index === right) return 'right'
  return 'hidden'
}

const positionClasses: Record<CardPosition, string> = {
  center: 'translate-x-[-50%] translate-z-0 scale-100 opacity-100 z-30',
  left: 'translate-x-[-130%] scale-75 opacity-50 -rotate-y-35 z-20',
  right: 'translate-x-[30%] scale-75 opacity-50 rotate-y-35 z-20',
  hidden: 'translate-x-[-50%] scale-50 opacity-0 z-10',
}

function TestimonialCard({ testimonial, position }: { testimonial: Testimonial; position: CardPosition }) {
  return (
    <div
      className={`absolute top-0 left-1/2 w-full max-w-md transition-all duration-700 ease-out ${positionClasses[position]}`}
      aria-hidden={position !== 'center'}
    >
      <div className={`bg-white p-8 md:p-10 rounded-3xl shadow-premium ${position === 'center' ? 'shadow-2xl' : ''}`}>
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

        <p className={`font-body italic text-on-surface mb-8 leading-relaxed text-lg ${position !== 'center' ? 'line-clamp-3' : ''}`}>
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
    </div>
  )
}

function CarouselSkeleton() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-premium">
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
    </div>
  )
}

export function TestimonialsCarousel({ testimonials, loading = false }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prev = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  // Auto-rotate (pauses on hover or reduced motion preference)
  useEffect(() => {
    if (isPaused || prefersReducedMotion || testimonials.length <= 1) return
    const timer = setInterval(next, AUTO_ROTATE_MS)
    return () => clearInterval(timer)
  }, [isPaused, prefersReducedMotion, next, testimonials.length])

  // Keyboard navigation
  useEffect(() => {
    if (testimonials.length <= 1) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, testimonials.length])

  if (loading) return <CarouselSkeleton />
  if (testimonials.length === 0) return null

  return (
    <div
      className="relative"
      role="region"
      aria-label="Customer testimonials carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* 3D Stage */}
      <div
        className="relative h-[480px] perspective-dramatic"
        style={{ perspective: '1200px' }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {testimonials.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              position={getPosition(i, currentIndex, testimonials.length)}
            />
          ))}
        </div>
      </div>

      {/* Arrow Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="w-12 h-12 rounded-full bg-white border-2 border-outline-variant hover:border-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-on-surface-variant"
        >
          <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
        </button>

        {/* Dot Indicators */}
        <div className="flex gap-2" role="tablist" aria-label="Testimonial selector">
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to testimonial ${i + 1} of ${testimonials.length}`}
              onClick={() => setCurrentIndex(i)}
              className={`h-3 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-outline-variant w-3 hover:bg-outline'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next testimonial"
          className="w-12 h-12 rounded-full bg-white border-2 border-outline-variant hover:border-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-on-surface-variant"
        >
          <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        </button>
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing testimonial {currentIndex + 1} of {testimonials.length}: {testimonials[currentIndex]?.name}
      </div>
    </div>
  )
}
