interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'donation'
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  active = false,
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary-container text-white hover:opacity-90 active:scale-95',
    secondary: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
    ghost: 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20',
    donation: active
      ? 'border-2 border-primary-container bg-primary-container/20 text-white'
      : 'border-2 border-white/20 text-white hover:bg-white/10',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
