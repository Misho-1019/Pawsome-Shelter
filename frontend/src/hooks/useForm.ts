import { useState, useCallback, type ChangeEvent } from 'react'

// Generic form state hook for controlled inputs.
// Returns state, change handlers, and a reset function.
export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))
      // Clear field error when user starts typing
      setErrors((prev) => (prev[name as keyof T] ? { ...prev, [name]: undefined } : prev))
    },
    []
  )

  const handleValueChange = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }, [])

  const setFieldError = useCallback(<K extends keyof T>(name: K, error: string | undefined) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  const reset = useCallback((nextValues: T = initialValues) => {
    setValues(nextValues)
    setErrors({})
  }, [initialValues])

  return {
    values,
    errors,
    handleChange,
    handleValueChange,
    setFieldError,
    setValues,
    setErrors,
    reset,
  }
}
