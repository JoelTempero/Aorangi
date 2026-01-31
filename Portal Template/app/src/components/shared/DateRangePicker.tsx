import { useState, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { Button } from '../ui'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onChange: (start: Date | null, end: Date | null) => void
  placeholder?: string
  className?: string
  presets?: { label: string; start: Date; end: Date }[]
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = 'Select date range',
  className,
  presets
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(new Date())
  const [selecting, setSelecting] = useState<'start' | 'end'>('start')
  const [tempStart, setTempStart] = useState<Date | null>(startDate)
  const [tempEnd, setTempEnd] = useState<Date | null>(endDate)

  useEffect(() => {
    setTempStart(startDate)
    setTempEnd(endDate)
  }, [startDate, endDate])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatRange = () => {
    if (!startDate && !endDate) return placeholder
    if (startDate && !endDate) return `${formatDate(startDate)} - ...`
    if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`
    return placeholder
  }

  const handleDayClick = (day: Date) => {
    if (selecting === 'start') {
      setTempStart(day)
      setTempEnd(null)
      setSelecting('end')
    } else {
      if (tempStart && day < tempStart) {
        setTempStart(day)
        setTempEnd(tempStart)
      } else {
        setTempEnd(day)
      }
      setSelecting('start')
    }
  }

  const handleApply = () => {
    onChange(tempStart, tempEnd)
    setIsOpen(false)
  }

  const handleClear = () => {
    setTempStart(null)
    setTempEnd(null)
    onChange(null, null)
    setIsOpen(false)
  }

  const handlePreset = (preset: { start: Date; end: Date }) => {
    setTempStart(preset.start)
    setTempEnd(preset.end)
    onChange(preset.start, preset.end)
    setIsOpen(false)
  }

  const prevMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1))
  }

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty slots for days before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isInRange = (day: Date) => {
    if (!tempStart || !tempEnd) return false
    return day >= tempStart && day <= tempEnd
  }

  const isStartDate = (day: Date) => tempStart?.toDateString() === day.toDateString()
  const isEndDate = (day: Date) => tempEnd?.toDateString() === day.toDateString()
  const isToday = (day: Date) => new Date().toDateString() === day.toDateString()

  const defaultPresets = [
    { label: 'Today', start: new Date(), end: new Date() },
    { label: 'Last 7 days', start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() },
    { label: 'Last 30 days', start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
    { label: 'This month', start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date() },
  ]

  const activePresets = presets || defaultPresets

  return (
    <div className={cn('relative', className)}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 h-10 px-3 border rounded-lg text-sm transition-colors',
          startDate
            ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
            : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800',
          'hover:border-primary-400 dark:hover:border-primary-600'
        )}
      >
        <Calendar className="h-4 w-4 text-surface-400" />
        <span className={!startDate ? 'text-surface-500' : ''}>{formatRange()}</span>
        {startDate && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="ml-1 p-0.5 hover:bg-surface-200 dark:hover:bg-surface-600 rounded"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl z-30 p-4">
          <div className="flex gap-4">
            {/* Presets */}
            <div className="space-y-1 border-r border-surface-200 dark:border-surface-700 pr-4">
              <p className="text-xs font-medium text-surface-500 mb-2">Quick Select</p>
              {activePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className="block w-full text-left text-sm px-2 py-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div>
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="font-medium">
                  {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-surface-500 w-8">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(viewMonth).map((day, idx) => (
                  <div key={idx} className="w-8 h-8">
                    {day && (
                      <button
                        onClick={() => handleDayClick(day)}
                        className={cn(
                          'w-full h-full text-sm rounded transition-colors',
                          isInRange(day) && 'bg-primary-100 dark:bg-primary-900/30',
                          (isStartDate(day) || isEndDate(day)) && 'bg-primary-500 text-white',
                          isToday(day) && !isStartDate(day) && !isEndDate(day) && 'ring-2 ring-primary-500',
                          !isInRange(day) && !isStartDate(day) && !isEndDate(day) && 'hover:bg-surface-100 dark:hover:bg-surface-700'
                        )}
                      >
                        {day.getDate()}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Clear
                </Button>
                <Button size="sm" onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Simple single date picker
interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = 'Select date', className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(value || new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleDayClick = (day: Date) => {
    onChange(day)
    setIsOpen(false)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    for (let i = 0; i < startDayOfWeek; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))

    return days
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-3 border border-surface-200 dark:border-surface-700 rounded-lg text-sm bg-white dark:bg-surface-800 hover:border-primary-400"
      >
        <Calendar className="h-4 w-4 text-surface-400" />
        <span className={!value ? 'text-surface-500' : ''}>
          {value ? formatDate(value) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl z-30 p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1))}
              className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-medium">
              {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1))}
              className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-surface-500 w-8">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(viewMonth).map((day, idx) => (
              <div key={idx} className="w-8 h-8">
                {day && (
                  <button
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      'w-full h-full text-sm rounded transition-colors',
                      value?.toDateString() === day.toDateString() && 'bg-primary-500 text-white',
                      new Date().toDateString() === day.toDateString() && value?.toDateString() !== day.toDateString() && 'ring-2 ring-primary-500',
                      value?.toDateString() !== day.toDateString() && 'hover:bg-surface-100 dark:hover:bg-surface-700'
                    )}
                  >
                    {day.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
