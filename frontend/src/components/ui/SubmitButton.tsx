import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Button } from './Button'

interface SubmitButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  loading?: boolean
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(function SubmitButton(
  { loading = false, loadingText = 'Submitting...', variant = 'primary', size = 'md', children, disabled, className = '', ...props },
  ref
) {
  return (
    <Button
      ref={ref}
      type="submit"
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="material-symbols-outlined animate-spin"
            style={{ fontVariationSettings: "'wght' 300" }}
            aria-hidden="true"
          >
            progress_activity
          </span>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  )
})
