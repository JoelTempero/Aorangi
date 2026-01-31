import { cn } from '../../utils/cn'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  children?: React.ReactNode
  className?: string
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  color = 'stroke-primary-500',
  backgroundColor = 'stroke-surface-200 dark:stroke-surface-700',
  children,
  className
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={backgroundColor}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(color, 'transition-all duration-500 ease-out')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

interface CountdownRingProps {
  days: number
  hours: number
  minutes: number
  className?: string
}

export function CountdownRing({ days, hours, minutes, className }: CountdownRingProps) {
  const totalMinutesInDay = 24 * 60
  const currentMinutes = hours * 60 + minutes
  const dayProgress = ((totalMinutesInDay - currentMinutes) / totalMinutesInDay) * 100

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Days */}
      <ProgressRing
        progress={days > 30 ? 100 : (days / 30) * 100}
        size={70}
        strokeWidth={5}
        color="stroke-primary-500"
      >
        <div className="text-center">
          <span className="text-xl font-bold">{days}</span>
          <span className="block text-[10px] text-surface-500">days</span>
        </div>
      </ProgressRing>

      {/* Hours */}
      <ProgressRing
        progress={(hours / 24) * 100}
        size={60}
        strokeWidth={4}
        color="stroke-accent-500"
      >
        <div className="text-center">
          <span className="text-lg font-bold">{hours}</span>
          <span className="block text-[10px] text-surface-500">hrs</span>
        </div>
      </ProgressRing>

      {/* Minutes */}
      <ProgressRing
        progress={(minutes / 60) * 100}
        size={50}
        strokeWidth={3}
        color="stroke-emerald-500"
      >
        <div className="text-center">
          <span className="text-base font-bold">{minutes}</span>
          <span className="block text-[9px] text-surface-500">min</span>
        </div>
      </ProgressRing>
    </div>
  )
}
