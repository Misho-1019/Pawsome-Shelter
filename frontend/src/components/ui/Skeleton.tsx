interface SkeletonProps {
  className?: string
  width?: 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4'
  height?: string
  rounded?: 'rounded' | 'rounded-none' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full'
}

const WIDTH_CLASS: Record<NonNullable<SkeletonProps['width']>, string> = {
  'full': 'w-full',
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '2/3': 'w-2/3',
  '1/4': 'w-1/4',
  '3/4': 'w-3/4',
}

export function Skeleton({
  className = '',
  width = 'full',
  height,
  rounded = 'rounded',
}: SkeletonProps) {
  const widthClass = WIDTH_CLASS[width]
  return (
    <div
      className={`bg-surface-container-high animate-pulse ${rounded} ${widthClass} ${height ? '' : 'h-4'} ${className}`}
      style={height ? { height } : undefined}
    />
  )
}

// Pre-built skeleton variants
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-premium">
      <Skeleton className="h-72" width="full" rounded="rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6" width="1/3" />
        <Skeleton className="h-4" width="1/2" />
        <Skeleton className="h-10" width="full" rounded="rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          width={i === lines - 1 ? '2/3' : 'full'}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar() {
  return <Skeleton className="w-14 h-14" width="full" rounded="rounded-full" />
}
