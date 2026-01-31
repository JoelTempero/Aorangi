import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button, Badge } from '../ui'
import type { ContentItem } from '../../types/content.types'
import { CONTENT_TYPE_COLORS, CONTENT_PLATFORM_LABELS } from '../../types/content.types'
import { cn } from '../../utils/cn'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from 'date-fns'

interface ContentCalendarProps {
  content: ContentItem[]
  onSelectContent: (content: ContentItem) => void
  onSelectDate: (date: Date) => void
  onAddContent?: (date: Date) => void
}

export function ContentCalendar({
  content,
  onSelectContent,
  onSelectDate,
  onAddContent
}: ContentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const getContentForDay = (date: Date) => {
    return content.filter(item => {
      if (!item.scheduledPostTime) return false
      const timestamp = item.scheduledPostTime as any
      if (!timestamp?.toDate) return false
      try {
        return isSameDay(timestamp.toDate(), date)
      } catch {
        return false
      }
    })
  }

  return (
    <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-surface-200 dark:border-surface-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-surface-500 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayContent = getContentForDay(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={index}
              className={cn(
                'min-h-[100px] p-1 border-b border-r border-surface-100 dark:border-surface-800',
                !isCurrentMonth && 'bg-surface-50 dark:bg-surface-950',
                index % 7 === 6 && 'border-r-0'
              )}
            >
              <div className="flex items-center justify-between p-1">
                <button
                  onClick={() => onSelectDate(day)}
                  className={cn(
                    'w-7 h-7 flex items-center justify-center rounded-full text-sm',
                    isCurrentDay
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-800',
                    !isCurrentMonth && 'text-surface-400'
                  )}
                >
                  {format(day, 'd')}
                </button>
                {onAddContent && isCurrentMonth && (
                  <button
                    onClick={() => onAddContent(day)}
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-surface-100 dark:hover:bg-surface-800 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="h-3 w-3 text-surface-400" />
                  </button>
                )}
              </div>

              <div className="space-y-1 mt-1">
                {dayContent.slice(0, 3).map(item => (
                  <button
                    key={item.id}
                    onClick={() => onSelectContent(item)}
                    className={cn(
                      'w-full px-1.5 py-0.5 rounded text-xs truncate text-left',
                      CONTENT_TYPE_COLORS[item.type]
                    )}
                    title={item.title}
                  >
                    {item.title}
                  </button>
                ))}
                {dayContent.length > 3 && (
                  <button
                    onClick={() => onSelectDate(day)}
                    className="w-full px-1.5 py-0.5 text-xs text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                  >
                    +{dayContent.length - 3} more
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 p-4 border-t border-surface-200 dark:border-surface-700">
        <span className="text-xs text-surface-500">Platforms:</span>
        {Object.entries(CONTENT_PLATFORM_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <div className={cn(
              'w-2 h-2 rounded-full',
              key === 'instagram' ? 'bg-pink-500' :
              key === 'bigtop' ? 'bg-amber-500' : 'bg-purple-500'
            )} />
            <span className="text-xs text-surface-600 dark:text-surface-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface CalendarDayModalProps {
  date: Date
  content: ContentItem[]
  open: boolean
  onClose: () => void
  onSelectContent: (content: ContentItem) => void
}

export function CalendarDayModal({
  date,
  content,
  open,
  onClose,
  onSelectContent
}: CalendarDayModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-surface-900 rounded-xl shadow-xl max-w-md w-full max-h-[70vh] overflow-hidden">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold text-lg">
            {format(date, 'EEEE, MMMM d, yyyy')}
          </h3>
          <p className="text-sm text-surface-500">
            {content.length} content item{content.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>

        <div className="p-4 overflow-y-auto max-h-[50vh] space-y-2">
          {content.length === 0 ? (
            <p className="text-center text-surface-500 py-8">
              No content scheduled for this day
            </p>
          ) : (
            content.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectContent(item)
                  onClose()
                }}
                className="w-full p-3 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-left transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={CONTENT_TYPE_COLORS[item.type]} size="sm">
                    {item.type}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {CONTENT_PLATFORM_LABELS[item.platform]}
                  </Badge>
                </div>
                <p className="font-medium text-sm truncate">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-surface-500 truncate mt-1">
                    {item.description}
                  </p>
                )}
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
