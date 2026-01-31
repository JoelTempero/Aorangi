import { cn } from '../../utils/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-200 dark:bg-surface-700',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{ width, height }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="p-4 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-1/3 h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-4/5" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700">
          <Skeleton variant="circular" className="h-8 w-8" />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="text" className="w-1/2 h-3" />
          </div>
          <Skeleton className="w-16 h-6" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-3">
            <Skeleton variant="rectangular" className="h-10 w-10" />
            <div className="space-y-1.5">
              <Skeleton variant="text" className="w-16 h-6" />
              <Skeleton variant="text" className="w-12 h-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex gap-4">
          <Skeleton variant="text" className="w-1/4 h-4" />
          <Skeleton variant="text" className="w-1/4 h-4" />
          <Skeleton variant="text" className="w-1/4 h-4" />
          <Skeleton variant="text" className="w-1/4 h-4" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-surface-100 dark:border-surface-800 last:border-0">
          <div className="flex gap-4">
            <Skeleton variant="text" className="w-1/4" />
            <Skeleton variant="text" className="w-1/4" />
            <Skeleton variant="text" className="w-1/4" />
            <Skeleton variant="text" className="w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
