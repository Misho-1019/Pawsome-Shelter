import { useEffect, useCallback, useState, useRef } from 'react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-full md:w-[400px]',
  md: 'w-full md:w-[500px]',
  lg: 'w-full md:w-[600px]',
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  )
}

export function Drawer({ isOpen, onClose, title, children, size = 'md' }: DrawerProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'Tab' && panelRef.current) {
      const focusable = getFocusableElements(panelRef.current)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      setShouldRender(true)
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
          if (panelRef.current) {
            const focusable = getFocusableElements(panelRef.current)
            if (focusable.length > 0) focusable[0].focus()
          }
        })
      })
    } else {
      setIsAnimating(false)
      document.body.style.overflow = 'unset'
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }

      const timer = setTimeout(() => setShouldRender(false), 400)
      return () => clearTimeout(timer)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-400"
        style={{ opacity: isAnimating ? 1 : 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={`relative ${sizeClasses[size]} h-full bg-white shadow-2xl transition-transform duration-500 ease-out`}
        style={{
          transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
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

        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
