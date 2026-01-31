import { cn } from '../../utils/cn'
import { Avatar } from '../ui'
import { formatRelative } from '../../utils/date.utils'
import {
  CheckSquare,
  MessageSquare,
  Film,
  Package,
  Calendar,
  Bell,
  ThumbsUp,
  Plus
} from 'lucide-react'
import type { FirestoreTimestamp } from '../../types'

export type ActivityType =
  | 'task_completed'
  | 'task_created'
  | 'comment_added'
  | 'content_posted'
  | 'equipment_checkout'
  | 'schedule_change'
  | 'announcement'
  | 'idea_approved'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description?: string
  user: {
    id: string
    name: string
    photoURL?: string
  }
  timestamp: FirestoreTimestamp
  metadata?: Record<string, unknown>
}

const activityIcons: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  task_completed: CheckSquare,
  task_created: Plus,
  comment_added: MessageSquare,
  content_posted: Film,
  equipment_checkout: Package,
  schedule_change: Calendar,
  announcement: Bell,
  idea_approved: ThumbsUp
}

const activityColors: Record<ActivityType, string> = {
  task_completed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  task_created: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  comment_added: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  content_posted: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  equipment_checkout: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  schedule_change: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  announcement: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  idea_approved: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
}

interface ActivityFeedProps {
  activities: Activity[]
  className?: string
  maxItems?: number
}

export function ActivityFeed({ activities, className, maxItems = 10 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems)

  return (
    <div className={cn('space-y-1', className)}>
      {displayActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type]
        const isLast = index === displayActivities.length - 1

        return (
          <div key={activity.id} className="flex gap-3">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className={cn('p-1.5 rounded-full', activityColors[activity.type])}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-surface-200 dark:bg-surface-700 my-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-medium text-surface-900 dark:text-surface-100">
                      {activity.user.name}
                    </span>
                    <span className="text-surface-600 dark:text-surface-400">
                      {' '}{activity.title}
                    </span>
                  </p>
                  {activity.description && (
                    <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">
                      {activity.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-surface-400 whitespace-nowrap">
                  {formatRelative(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Demo activities generator
export function generateDemoActivities(users: Array<{ id: string; displayName: string; photoURL?: string }>): Activity[] {
  const now = Date.now()
  const activities: Activity[] = [
    {
      id: '1',
      type: 'task_completed',
      title: 'completed "Finalize Big Top schedule"',
      user: { id: users[0]?.id || '1', name: users[0]?.displayName || 'User', photoURL: users[0]?.photoURL },
      timestamp: { seconds: Math.floor((now - 1000 * 60 * 5) / 1000), nanoseconds: 0 }
    },
    {
      id: '2',
      type: 'content_posted',
      title: 'posted "Friday Highlights Reel"',
      user: { id: users[1]?.id || '2', name: users[1]?.displayName || 'User', photoURL: users[1]?.photoURL },
      timestamp: { seconds: Math.floor((now - 1000 * 60 * 30) / 1000), nanoseconds: 0 }
    },
    {
      id: '3',
      type: 'announcement',
      title: 'posted a new announcement',
      description: 'Team meeting tomorrow at 7pm',
      user: { id: users[0]?.id || '1', name: users[0]?.displayName || 'User', photoURL: users[0]?.photoURL },
      timestamp: { seconds: Math.floor((now - 1000 * 60 * 60) / 1000), nanoseconds: 0 }
    },
    {
      id: '4',
      type: 'equipment_checkout',
      title: 'checked out "Canon 5D Mark IV"',
      user: { id: users[2]?.id || '3', name: users[2]?.displayName || 'User', photoURL: users[2]?.photoURL },
      timestamp: { seconds: Math.floor((now - 1000 * 60 * 60 * 2) / 1000), nanoseconds: 0 }
    },
    {
      id: '5',
      type: 'task_created',
      title: 'created "Prepare social media calendar"',
      user: { id: users[1]?.id || '2', name: users[1]?.displayName || 'User', photoURL: users[1]?.photoURL },
      timestamp: { seconds: Math.floor((now - 1000 * 60 * 60 * 3) / 1000), nanoseconds: 0 }
    },
    {
      id: '6',
      type: 'idea_approved',
      title: 'idea "Drone timelapse" was approved',
      user: { id: users[0]?.id || '1', name: users[0]?.displayName || 'User', photoURL: users[0]?.photoURL },
      timestamp: { seconds: Math.floor((now - 1000 * 60 * 60 * 5) / 1000), nanoseconds: 0 }
    }
  ]

  return activities
}
