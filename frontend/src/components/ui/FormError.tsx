import type { ReactNode } from 'react'

interface FormErrorProps {
  children: ReactNode
  className?: string
  title?: string
}

export function FormError({ children, className = '', title = 'Something went wrong' }: FormErrorProps) {
  if (!children) return null
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 p-4 rounded-xl bg-error-container text-on-error-container ${className}`}
    >
      <span className="material-symbols-outlined text-xl flex-shrink-0" aria-hidden="true">
        error
      </span>
      <div className="flex-1 text-sm">
        <p className="font-semibold mb-0.5">{title}</p>
        <p>{children}</p>
      </div>
    </div>
  )
}
