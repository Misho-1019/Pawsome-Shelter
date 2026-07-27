interface SkeletonProps {
  className?: string
  width?: string
  height?: string
  rounded?: string
}

export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'rounded',
}: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded} ${className}`}
      style={{ width, height }}
    />
  )
}

// Pre-built skeleton variants
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-premium">
      <Skeleton className="h-72 w-full" rounded="rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" rounded="rounded-xl" />
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
  return <Skeleton className="w-14 h-14" rounded="rounded-full" />
}
