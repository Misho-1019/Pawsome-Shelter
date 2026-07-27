interface HeartButtonProps {
  isFavorite: boolean
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-10 h-10 text-xl',
  lg: 'w-12 h-12 text-2xl',
}

export function HeartButton({ isFavorite, onClick, size = 'md' }: HeartButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all duration-200 ${
        isFavorite
          ? 'bg-error-container text-error hover:bg-error-container/80'
          : 'bg-white/80 text-on-surface-variant hover:bg-white hover:text-error'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  )
}
