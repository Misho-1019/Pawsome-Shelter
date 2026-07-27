import { useId, forwardRef, type TextareaHTMLAttributes, type ReactNode } from 'react'

interface TextareaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  error?: string
  required?: boolean
  hint?: ReactNode
  className?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, error, required = false, hint, className = '', ...textareaProps },
  ref
) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedBy = [
    error ? errorId : null,
    hint ? hintId : null,
  ].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-on-surface mb-1.5"
      >
        {label}
        {required && (
          <span className="text-error ml-1" aria-hidden="true">*</span>
        )}
      </label>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        aria-required={required}
        className={`w-full px-4 py-3 rounded-xl border bg-surface transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? 'border-error' : 'border-outline-variant'
        }`}
        {...textareaProps}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-on-surface-variant mt-1">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-error mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})
