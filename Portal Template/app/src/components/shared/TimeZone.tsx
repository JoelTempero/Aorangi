import { useState, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { Clock, Globe } from 'lucide-react'

interface TimeDisplayProps {
  timezone?: string
  format?: '12h' | '24h'
  showSeconds?: boolean
  showDate?: boolean
  className?: string
}

export function TimeDisplay({
  timezone,
  format = '12h',
  showSeconds = false,
  showDate = false,
  className
}: TimeDisplayProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    ...(showSeconds && { second: '2-digit' }),
    hour12: format === '12h',
    ...(timezone && { timeZone: timezone })
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(timezone && { timeZone: timezone })
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Clock className="h-4 w-4 text-surface-400" />
      <div>
        <span className="font-mono text-sm font-medium">
          {time.toLocaleTimeString('en-US', formatOptions)}
        </span>
        {showDate && (
          <span className="text-xs text-surface-500 ml-2">
            {time.toLocaleDateString('en-US', dateOptions)}
          </span>
        )}
      </div>
    </div>
  )
}

// Multiple time zone display
interface MultiTimeZoneProps {
  zones: { id: string; label: string; timezone: string }[]
  format?: '12h' | '24h'
  className?: string
}

export function MultiTimeZone({ zones, format = '12h', className }: MultiTimeZoneProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12h'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {zones.map((zone) => (
        <div key={zone.id} className="flex items-center justify-between">
          <span className="text-sm text-surface-600 dark:text-surface-400">{zone.label}</span>
          <span className="font-mono text-sm font-medium">
            {time.toLocaleTimeString('en-US', { ...formatOptions, timeZone: zone.timezone })}
          </span>
        </div>
      ))}
    </div>
  )
}

// Camp countdown with detailed time remaining
interface CampCountdownProps {
  targetDate: Date
  eventName?: string
  className?: string
}

export function CampCountdown({ targetDate, eventName = 'Camp', className }: CampCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isOver: false
    }
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (timeLeft.isOver) {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-lg font-bold text-green-600">{eventName} is live!</p>
      </div>
    )
  }

  return (
    <div className={cn('', className)}>
      <div className="grid grid-cols-4 gap-2 text-center">
        <CountdownUnit value={timeLeft.days} label="Days" />
        <CountdownUnit value={timeLeft.hours} label="Hours" />
        <CountdownUnit value={timeLeft.minutes} label="Minutes" />
        <CountdownUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold font-mono">{value.toString().padStart(2, '0')}</span>
      <span className="text-xs text-surface-500 uppercase">{label}</span>
    </div>
  )
}

// Relative time ago display
interface TimeAgoProps {
  date: Date | { seconds: number }
  className?: string
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const targetDate = date instanceof Date
    ? date
    : new Date(date.seconds * 1000)

  const now = new Date()
  const diffMs = now.getTime() - targetDate.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  let text: string
  if (diffSec < 60) {
    text = 'just now'
  } else if (diffMin < 60) {
    text = `${diffMin}m ago`
  } else if (diffHour < 24) {
    text = `${diffHour}h ago`
  } else if (diffDay < 7) {
    text = `${diffDay}d ago`
  } else {
    text = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <span className={cn('text-surface-500', className)} title={targetDate.toLocaleString()}>
      {text}
    </span>
  )
}

// Timezone selector
interface TimezoneSelectorProps {
  value: string
  onChange: (timezone: string) => void
  className?: string
}

export function TimezoneSelector({ value, onChange, className }: TimezoneSelectorProps) {
  const commonTimezones = [
    { id: 'America/New_York', label: 'Eastern Time (US)' },
    { id: 'America/Chicago', label: 'Central Time (US)' },
    { id: 'America/Denver', label: 'Mountain Time (US)' },
    { id: 'America/Los_Angeles', label: 'Pacific Time (US)' },
    { id: 'America/Anchorage', label: 'Alaska Time' },
    { id: 'Pacific/Honolulu', label: 'Hawaii Time' },
    { id: 'Europe/London', label: 'London (GMT/BST)' },
    { id: 'Europe/Paris', label: 'Central European' },
    { id: 'Asia/Tokyo', label: 'Japan' },
    { id: 'Asia/Shanghai', label: 'China' },
    { id: 'Australia/Sydney', label: 'Sydney' }
  ]

  return (
    <div className={cn('relative', className)}>
      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {commonTimezones.map((tz) => (
          <option key={tz.id} value={tz.id}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  )
}
