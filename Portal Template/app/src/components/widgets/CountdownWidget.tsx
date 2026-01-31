import { useState, useEffect } from 'react'
import { Tent, Calendar } from 'lucide-react'
import { WidgetContainer } from './WidgetContainer'
import { cn } from '../../utils/cn'

interface CountdownWidgetProps {
  onRemove?: () => void
  dragHandleProps?: any
  isDragging?: boolean
  targetDate?: Date
  eventName?: string
}

export function CountdownWidget({
  onRemove,
  dragHandleProps,
  isDragging,
  targetDate,
  eventName = 'Eastercamp 2025'
}: CountdownWidgetProps) {
  // Default to next Easter-ish date (April)
  const campDate = targetDate || new Date(new Date().getFullYear(), 3, 17, 14, 0, 0)

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(campDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(campDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [campDate])

  const isLive = timeLeft.total <= 0

  return (
    <WidgetContainer
      title="Camp Countdown"
      icon={<Tent className="h-4 w-4" />}
      size="small"
      onRemove={onRemove}
      dragHandleProps={dragHandleProps}
      isDragging={isDragging}
    >
      <div className="text-center">
        <p className="text-sm text-surface-500 mb-3">{eventName}</p>

        {isLive ? (
          <div className="py-4">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Tent className="h-8 w-8 text-green-600 dark:text-green-400 animate-pulse" />
            </div>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              We're LIVE!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2">
              <TimeBlock value={timeLeft.days} label="Days" />
              <TimeBlock value={timeLeft.hours} label="Hrs" />
              <TimeBlock value={timeLeft.minutes} label="Min" />
              <TimeBlock value={timeLeft.seconds} label="Sec" />
            </div>

            <div className="flex items-center justify-center gap-1 mt-4 text-xs text-surface-500">
              <Calendar className="h-3 w-3" />
              <span>
                {campDate.toLocaleDateString('en-AU', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </>
        )}
      </div>
    </WidgetContainer>
  )
}

interface TimeBlockProps {
  value: number
  label: string
}

function TimeBlock({ value, label }: TimeBlockProps) {
  return (
    <div className="text-center">
      <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-2">
        <span className="text-xl font-bold text-surface-900 dark:text-white">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-surface-500 mt-1 block">{label}</span>
    </div>
  )
}

function calculateTimeLeft(targetDate: Date) {
  const now = new Date().getTime()
  const target = targetDate.getTime()
  const difference = target - now

  if (difference <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    total: difference,
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  }
}
