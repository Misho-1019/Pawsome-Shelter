import { useEffect, useCallback, useState, useRef } from 'react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-[400px]',
  md: 'w-[500px]',
  lg: 'w-[600px]',
}

export function Drawer({ isOpen, onClose, title, children, size = 'md' }: DrawerProps) {
  const [animationState, setAnimationState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const contentRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      setAnimationState('opening')
      // Transition to 'open' after animation completes
      const timer = setTimeout(() => setAnimationState('open'), 500)
      return () => {
        clearTimeout(timer)
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
      }
    } else if (animationState === 'open') {
      // Start closing animation
      setAnimationState('closing')
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setAnimationState('closed'), 400)
      return () => clearTimeout(timer)
    }
  }, [isOpen, handleKeyDown])

  // Don't render if closed
  if (animationState === 'closed') return null

  const isAnimatingIn = animationState === 'opening'
  const isAnimatingOut = animationState === 'closing'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{
          animation: isAnimatingIn
            ? 'backdrop-fade-in 0.4s ease-out forwards'
            : isAnimatingOut
            ? 'backdrop-fade-out 0.3s ease-in forwards'
            : 'none',
          opacity: isAnimatingOut ? 0 : undefined,
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`relative ${sizeClasses[size]} h-full bg-white shadow-2xl`}
        style={{
          animation: isAnimatingIn
            ? 'drawer-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            : isAnimatingOut
            ? 'drawer-slide-out 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards'
            : 'none',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={contentRef}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-outline-variant px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-on-surface">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors duration-200"
            aria-label="Close drawer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
