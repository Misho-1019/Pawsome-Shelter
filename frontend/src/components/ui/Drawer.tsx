import { useEffect, useCallback, useState } from 'react'

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
  const [shouldRender, setShouldRender] = useState(false)
  const [animationState, setAnimationState] = useState<'idle' | 'opening' | 'open' | 'closing'>('idle')

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      // Opening sequence
      setShouldRender(true)
      setAnimationState('idle')
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      // Force a paint of the initial state, then start animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationState('opening')
          // Transition to 'open' after animation completes
          setTimeout(() => setAnimationState('open'), 500)
        })
      })
    } else if (animationState === 'open' || animationState === 'opening') {
      // Closing sequence
      setAnimationState('closing')
      document.body.style.overflow = 'unset'

      // Unmount after exit animation completes
      const timer = setTimeout(() => {
        setShouldRender(false)
        setAnimationState('idle')
      }, 400)

      return () => clearTimeout(timer)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown, animationState])

  if (!shouldRender) return null

  const isOpening = animationState === 'opening'
  const isOpenComplete = animationState === 'open'
  const isClosing = animationState === 'closing'

  // Determine animation styles
  const getDrawerStyle = () => {
    if (isOpening) {
      return {
        animation: 'drawer-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    }
    if (isOpenComplete) {
      return {
        transform: 'translateX(0)',
      }
    }
    if (isClosing) {
      return {
        animation: 'drawer-slide-out 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards',
      }
    }
    return {}
  }

  const getBackdropStyle = () => {
    if (isOpening) {
      return {
        animation: 'backdrop-fade-in 0.4s ease-out forwards',
      }
    }
    if (isOpenComplete) {
      return {
        opacity: 1,
      }
    }
    if (isClosing) {
      return {
        animation: 'backdrop-fade-out 0.3s ease-in forwards',
      }
    }
    return { opacity: 0 }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={getBackdropStyle()}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`relative ${sizeClasses[size]} h-full bg-white shadow-2xl`}
        style={getDrawerStyle()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
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
