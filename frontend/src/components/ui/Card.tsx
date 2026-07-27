import type { KeyboardEvent } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  /** When provided, the card becomes keyboard accessible (Enter/Space triggers onClick) */
  ariaLabel?: string
  role?: string
}

export function Card({ children, className = '', hover = true, onClick, ariaLabel, role }: CardProps) {
  const isInteractive = Boolean(onClick)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-premium ${
        hover ? 'transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-1' : ''
      } ${className}`}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={role ?? (isInteractive ? 'button' : undefined)}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  )
}
