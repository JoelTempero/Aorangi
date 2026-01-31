import { useState, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { Avatar } from '../ui'
import { Circle, Wifi, WifiOff, Clock } from 'lucide-react'

type OnlineStatus = 'online' | 'away' | 'busy' | 'offline'

interface TeamMember {
  id: string
  name: string
  photoURL?: string
  status: OnlineStatus
  lastSeen?: Date
  currentActivity?: string
}

interface TeamPresenceProps {
  members: TeamMember[]
  showOffline?: boolean
  compact?: boolean
  className?: string
}

export function TeamPresence({ members, showOffline = true, compact = false, className }: TeamPresenceProps) {
  const onlineMembers = members.filter((m) => m.status !== 'offline')
  const offlineMembers = members.filter((m) => m.status === 'offline')

  const displayMembers = showOffline ? members : onlineMembers

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex -space-x-2">
          {onlineMembers.slice(0, 5).map((member) => (
            <Avatar
              key={member.id}
              src={member.photoURL}
              name={member.name}
              size="sm"
              status="online"
              className="ring-2 ring-white dark:ring-surface-900"
            />
          ))}
        </div>
        <span className="text-sm text-surface-500">
          {onlineMembers.length} online
          {offlineMembers.length > 0 && `, ${offlineMembers.length} offline`}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      {displayMembers.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
        >
          <Avatar
            src={member.photoURL}
            name={member.name}
            size="md"
            status={member.status === 'online' ? 'online' : member.status === 'away' ? 'away' : 'offline'}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">{member.name}</span>
              <StatusBadge status={member.status} />
            </div>
            {member.currentActivity && member.status !== 'offline' && (
              <p className="text-xs text-surface-500 truncate">{member.currentActivity}</p>
            )}
            {member.status === 'offline' && member.lastSeen && (
              <p className="text-xs text-surface-400">
                Last seen {formatLastSeen(member.lastSeen)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: OnlineStatus }) {
  const config = {
    online: { color: 'text-green-500', label: 'Online' },
    away: { color: 'text-amber-500', label: 'Away' },
    busy: { color: 'text-red-500', label: 'Busy' },
    offline: { color: 'text-surface-400', label: 'Offline' }
  }

  return (
    <span className={cn('text-xs', config[status].color)}>
      {config[status].label}
    </span>
  )
}

function formatLastSeen(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Current user status selector
interface StatusSelectorProps {
  status: OnlineStatus
  onChange: (status: OnlineStatus) => void
  className?: string
}

export function StatusSelector({ status, onChange, className }: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const statuses: { value: OnlineStatus; label: string; color: string; description: string }[] = [
    { value: 'online', label: 'Online', color: 'bg-green-500', description: 'Available for collaboration' },
    { value: 'away', label: 'Away', color: 'bg-amber-500', description: 'Temporarily unavailable' },
    { value: 'busy', label: 'Busy', color: 'bg-red-500', description: 'Do not disturb' },
    { value: 'offline', label: 'Appear Offline', color: 'bg-surface-400', description: 'Hidden from team' }
  ]

  const current = statuses.find((s) => s.value === status)!

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
      >
        <Circle className={cn('h-3 w-3 fill-current', current.color.replace('bg-', 'text-'))} />
        <span>{current.label}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg z-20 py-1">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  onChange(s.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full flex items-start gap-3 px-3 py-2 text-left hover:bg-surface-50 dark:hover:bg-surface-700',
                  status === s.value && 'bg-primary-50 dark:bg-primary-900/20'
                )}
              >
                <Circle className={cn('h-3 w-3 mt-1 fill-current', s.color.replace('bg-', 'text-'))} />
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-surface-500">{s.description}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Connection status indicator
interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(true)
      setTimeout(() => setShowBanner(false), 3000)
    }
    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showBanner) return null

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg',
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-amber-500 text-white',
        className
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span className="text-sm font-medium">Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You're offline</span>
        </>
      )}
    </div>
  )
}

// Who's working on what
interface ActivityItem {
  userId: string
  userName: string
  userPhoto?: string
  action: string
  target: string
  timestamp: Date
}

interface LiveActivityFeedProps {
  activities: ActivityItem[]
  maxItems?: number
  className?: string
}

export function LiveActivityFeed({ activities, maxItems = 5, className }: LiveActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems)

  return (
    <div className={cn('space-y-2', className)}>
      {displayActivities.map((activity, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <Avatar
            src={activity.userPhoto}
            name={activity.userName}
            size="xs"
          />
          <span className="font-medium">{activity.userName.split(' ')[0]}</span>
          <span className="text-surface-500">{activity.action}</span>
          <span className="font-medium truncate">{activity.target}</span>
          <span className="text-xs text-surface-400 ml-auto">
            {formatLastSeen(activity.timestamp)}
          </span>
        </div>
      ))}
    </div>
  )
}
