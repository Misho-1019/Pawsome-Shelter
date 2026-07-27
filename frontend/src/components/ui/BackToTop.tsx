import { useState, useEffect, useCallback } from 'react'

const SCROLL_THRESHOLD = 500

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const updateVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD)
      ticking = false
    }

    const onScroll = () => {
      // Throttle to one update per animation frame
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateVisibility)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Check initial scroll position
    updateVisibility()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 bg-primary-container text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
      aria-label="Back to top"
    >
      <span className="material-symbols-outlined" aria-hidden="true">keyboard_arrow_up</span>
    </button>
  )
}
