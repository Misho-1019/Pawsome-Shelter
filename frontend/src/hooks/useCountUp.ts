import { useState, useEffect, useRef, useCallback } from 'react'

interface UseCountUpReturn {
  count: number
  ref: React.RefObject<HTMLDivElement | null>
}

export function useCountUp(target: number, duration: number = 2000): UseCountUpReturn {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const animationFrameRef = useRef<number>(0)

  const animateCount = useCallback(() => {
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic - fast start, slow finish
      const eased = 1 - Math.pow(1 - progress, 3)

      setCount(Math.floor(eased * target))

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [target, duration])

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setCount(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animateCount()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [target, animateCount])

  return { count, ref }
}
