import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, ArrowRight, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '../ui'
import { WidgetContainer } from './WidgetContainer'
import { useDataStore } from '../../stores/dataStore'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'
import { formatDistanceToNow } from 'date-fns'

interface TasksWidgetProps {
  onRemove?: () => void
  dragHandleProps?: any
  isDragging?: boolean
}

export function TasksWidget({ onRemove, dragHandleProps, isDragging }: TasksWidgetProps) {
  const { tasks } = useDataStore()
  const { user } = useAuth()

  const myTasks = useMemo(() => {
    return tasks
      .filter(task => task.assignees.includes(user?.id || '') && task.status !== 'completed')
      .sort((a, b) => {
        // Priority: overdue > due today > high priority > others
        const now = Date.now()
        const aDue = (a.dueDate as any)?.toDate?.()?.getTime() || Infinity
        const bDue = (b.dueDate as any)?.toDate?.()?.getTime() || Infinity

        if (aDue < now && bDue >= now) return -1
        if (bDue < now && aDue >= now) return 1
        if (aDue !== bDue) return aDue - bDue
        if (a.priority !== b.priority) {
          const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }
          return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
        }
        return 0
      })
      .slice(0, 5)
  }, [tasks, user?.id])

  const formatDueDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return null
    try {
      const date = timestamp.toDate()
      const now = new Date()
      const isOverdue = date < now

      return {
        text: formatDistanceToNow(date, { addSuffix: true }),
        isOverdue
      }
    } catch {
      return null
    }
  }

  return (
    <WidgetContainer
      title="My Tasks"
      icon={<CheckSquare className="h-4 w-4" />}
      size="medium"
      onRemove={onRemove}
      dragHandleProps={dragHandleProps}
      isDragging={isDragging}
      headerAction={
        <Link
          to="/tasks"
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      {myTasks.length === 0 ? (
        <div className="text-center py-6 text-surface-500">
          <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No tasks assigned</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myTasks.map(task => {
            const due = formatDueDate(task.dueDate)
            return (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <div className={cn(
                  'w-2 h-2 rounded-full mt-1.5 shrink-0',
                  task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-amber-500' : 'bg-surface-400'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" size="sm">{task.status}</Badge>
                    {due && (
                      <span className={cn(
                        'flex items-center gap-1 text-xs',
                        due.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-surface-500'
                      )}>
                        {due.isOverdue ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {due.text}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </WidgetContainer>
  )
}
