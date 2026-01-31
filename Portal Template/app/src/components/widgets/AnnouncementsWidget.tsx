import { Link } from 'react-router-dom'
import { Megaphone, ArrowRight, Bell, AlertTriangle, Info } from 'lucide-react'
import { Badge } from '../ui'
import { WidgetContainer } from './WidgetContainer'
import { useDataStore } from '../../stores/dataStore'
import { cn } from '../../utils/cn'
import { formatDistanceToNow } from 'date-fns'

interface AnnouncementsWidgetProps {
  onRemove?: () => void
  dragHandleProps?: any
  isDragging?: boolean
}

export function AnnouncementsWidget({ onRemove, dragHandleProps, isDragging }: AnnouncementsWidgetProps) {
  const { announcements } = useDataStore()

  const recentAnnouncements = announcements
    .sort((a, b) => {
      const aTime = (a.createdAt as any)?.toDate?.()?.getTime() || 0
      const bTime = (b.createdAt as any)?.toDate?.()?.getTime() || 0
      return bTime - aTime
    })
    .slice(0, 3)

  const formatTime = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return ''
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
    } catch {
      return ''
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'important':
        return <Bell className="h-4 w-4 text-amber-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <WidgetContainer
      title="Announcements"
      icon={<Megaphone className="h-4 w-4" />}
      size="medium"
      onRemove={onRemove}
      dragHandleProps={dragHandleProps}
      isDragging={isDragging}
      headerAction={
        <Link
          to="/announcements"
          className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      {recentAnnouncements.length === 0 ? (
        <div className="text-center py-6 text-surface-500">
          <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No announcements</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAnnouncements.map((announcement, index) => (
            <Link
              key={announcement.id}
              to="/announcements"
              className={cn(
                'block p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors',
                announcement.priority === 'urgent' && 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
              )}
            >
              <div className="flex items-start gap-3">
                {getPriorityIcon(announcement.priority)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white line-clamp-1">
                    {announcement.title}
                  </p>
                  <p className="text-xs text-surface-500 line-clamp-2 mt-1">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-surface-400 mt-2">
                    {formatTime(announcement.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </WidgetContainer>
  )
}
