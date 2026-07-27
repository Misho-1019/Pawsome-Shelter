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
  const [isAnimating, setIsAnimating] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      // Opening sequence
      setShouldRender(true)
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      // Double requestAnimationFrame ensures initial state is painted
      // before starting the animation (smooth opening)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      // Closing sequence
      setIsAnimating(false)
      document.body.style.overflow = 'unset'

      // Unmount after exit animation completes (400ms)
      const timer = setTimeout(() => setShouldRender(false), 400)
      return () => clearTimeout(timer)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])  // ✅ Only depends on isOpen

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-400"
        style={{ opacity: isAnimating ? 1 : 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`relative ${sizeClasses[size]} h-full bg-white shadow-2xl transition-transform duration-500 ease-out`}
        style={{
          transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
        }}
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
