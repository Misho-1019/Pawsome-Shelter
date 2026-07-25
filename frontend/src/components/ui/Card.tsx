interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-premium ${
        hover ? 'transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
