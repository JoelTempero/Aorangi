import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Clock } from 'lucide-react'
import { Badge } from '../ui'
import { WidgetContainer } from './WidgetContainer'
import { ASSIGNMENT_ROLE_LABELS } from '../../types/schedule.types'
import { cn } from '../../utils/cn'

interface ScheduleSlot {
  id: string
  name: string
  time: string
  role: string
  confirmed: boolean
  dayTag?: string
  timeTag?: string
}

interface ScheduleWidgetProps {
  onRemove?: () => void
  dragHandleProps?: any
  isDragging?: boolean
}

export function ScheduleWidget({ onRemove, dragHandleProps, isDragging }: ScheduleWidgetProps) {
  // TODO: Load from Firestore when schedule data is available
  const todaySchedule: ScheduleSlot[] = []

  return (
    <WidgetContainer
      title="Today's Schedule"
      icon={<Calendar className="h-4 w-4" />}
      size="medium"
      onRemove={onRemove}
      dragHandleProps={dragHandleProps}
      isDragging={isDragging}
      headerAction={
        <Link
          to="/schedule"
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Full schedule <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      {todaySchedule.length === 0 ? (
        <div className="text-center py-6 text-surface-500">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No shifts today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todaySchedule.map((slot, index) => (
            <div
              key={slot.id}
              className={cn(
                'relative pl-4 py-2',
                index !== todaySchedule.length - 1 && 'border-b border-surface-100 dark:border-surface-800'
              )}
            >
              {/* Timeline indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-surface-200 dark:bg-surface-700">
                <div
                  className={cn(
                    'w-full rounded-full',
                    slot.confirmed ? 'bg-green-500' : 'bg-amber-500'
                  )}
                  style={{ height: '100%' }}
                />
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="primary" size="sm">
                    {slot.name}
                  </Badge>
                  <p className="text-sm font-medium mt-1">
                    {ASSIGNMENT_ROLE_LABELS[slot.role as keyof typeof ASSIGNMENT_ROLE_LABELS] || slot.role}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-surface-500 mt-1">
                    <Clock className="h-3 w-3" />
                    {slot.time}
                  </div>
                </div>
                <Badge
                  variant={slot.confirmed ? 'success' : 'warning'}
                  size="sm"
                >
                  {slot.confirmed ? 'Confirmed' : 'Pending'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetContainer>
  )
}
