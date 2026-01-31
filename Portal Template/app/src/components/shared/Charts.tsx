import { cn } from '../../utils/cn'

// Simple bar chart component
interface BarChartProps {
  data: { label: string; value: number; color?: string }[]
  maxValue?: number
  showLabels?: boolean
  showValues?: boolean
  horizontal?: boolean
  className?: string
  barClassName?: string
  height?: number
}

export function BarChart({
  data,
  maxValue,
  showLabels = true,
  showValues = true,
  horizontal = false,
  className,
  barClassName,
  height = 200
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1)

  if (horizontal) {
    return (
      <div className={cn('space-y-3', className)}>
        {data.map((item, index) => (
          <div key={item.label} className="space-y-1">
            {showLabels && (
              <div className="flex justify-between text-sm">
                <span className="text-surface-600 dark:text-surface-400">{item.label}</span>
                {showValues && <span className="font-medium">{item.value}</span>}
              </div>
            )}
            <div className="h-3 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500 ease-out',
                  item.color || getDefaultColor(index),
                  barClassName
                )}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-end gap-2', className)} style={{ height }}>
      {data.map((item, index) => (
        <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
          <div className="relative w-full flex-1 flex items-end justify-center">
            <div
              className={cn(
                'w-full max-w-12 rounded-t transition-all duration-500 ease-out',
                item.color || getDefaultColor(index),
                barClassName
              )}
              style={{ height: `${(item.value / max) * 100}%` }}
            />
            {showValues && (
              <span className="absolute -top-5 text-xs font-medium">
                {item.value}
              </span>
            )}
          </div>
          {showLabels && (
            <span className="text-xs text-surface-500 truncate max-w-full px-1">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// Donut/Pie chart component
interface DonutChartProps {
  data: { label: string; value: number; color: string }[]
  size?: number
  strokeWidth?: number
  showLegend?: boolean
  showTotal?: boolean
  totalLabel?: string
  className?: string
}

export function DonutChart({
  data,
  size = 150,
  strokeWidth = 20,
  showLegend = true,
  showTotal = true,
  totalLabel = 'Total',
  className
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let offset = 0

  return (
    <div className={cn('flex items-center gap-6', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-surface-100 dark:stroke-surface-800"
          />
          {/* Data segments */}
          {data.map((segment) => {
            const segmentLength = (segment.value / total) * circumference
            const segmentOffset = offset
            offset += segmentLength

            return (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                className={segment.color}
                style={{
                  strokeDasharray: `${segmentLength} ${circumference}`,
                  strokeDashoffset: -segmentOffset
                }}
              />
            )
          })}
        </svg>
        {showTotal && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-xs text-surface-500">{totalLabel}</span>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', item.color.replace('stroke-', 'bg-'))} />
              <span className="text-sm text-surface-600 dark:text-surface-400">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Sparkline mini chart
interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  showArea?: boolean
  className?: string
}

export function Sparkline({
  data,
  width = 100,
  height = 30,
  color = 'stroke-primary-500',
  showArea = false,
  className
}: SparklineProps) {
  if (data.length < 2) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`

  return (
    <svg width={width} height={height} className={className}>
      {showArea && (
        <path
          d={areaD}
          className={cn(color.replace('stroke-', 'fill-'), 'opacity-20')}
        />
      )}
      <path
        d={pathD}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={color}
      />
    </svg>
  )
}

// Stat comparison card with trend
interface StatTrendProps {
  label: string
  value: number | string
  previousValue?: number
  format?: (value: number | string) => string
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  sparklineData?: number[]
  className?: string
}

export function StatTrend({
  label,
  value,
  previousValue,
  format,
  trend: explicitTrend,
  trendLabel,
  sparklineData,
  className
}: StatTrendProps) {
  const formattedValue = format ? format(value) : value

  // Calculate trend if not explicitly provided
  const trend = explicitTrend || (
    previousValue !== undefined
      ? typeof value === 'number' && value > previousValue
        ? 'up'
        : typeof value === 'number' && value < previousValue
          ? 'down'
          : 'neutral'
      : undefined
  )

  const trendColor = trend === 'up'
    ? 'text-green-600'
    : trend === 'down'
      ? 'text-red-600'
      : 'text-surface-500'

  return (
    <div className={cn('', className)}>
      <p className="text-sm text-surface-500 dark:text-surface-400">{label}</p>
      <div className="flex items-end justify-between mt-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{formattedValue}</span>
          {trend && trendLabel && (
            <span className={cn('text-sm font-medium', trendColor)}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendLabel}
            </span>
          )}
        </div>
        {sparklineData && (
          <Sparkline
            data={sparklineData}
            width={80}
            height={24}
            color={trend === 'down' ? 'stroke-red-500' : 'stroke-green-500'}
            showArea
          />
        )}
      </div>
    </div>
  )
}

// Helper to get default colors
function getDefaultColor(index: number): string {
  const colors = [
    'bg-primary-500',
    'bg-accent-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-violet-500',
    'bg-orange-500'
  ]
  return colors[index % colors.length]
}
