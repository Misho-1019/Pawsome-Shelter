interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'status'
  status?: 'available' | 'pending'
  className?: string
}

export function Badge({ children, variant = 'default', status = 'available', className = '' }: BadgeProps) {
  const base = 'px-3 py-1 rounded-full text-xs font-semibold'

  const variants = {
    default: 'bg-surface-container-low text-primary',
    status: status === 'available'
      ? 'bg-secondary text-white'
      : 'bg-primary-container text-white',
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
