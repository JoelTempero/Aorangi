import { WifiOff, RefreshCw, Cloud, CloudOff, Check } from 'lucide-react'
import { useOfflineStore } from '../../stores/offlineStore'
import { useOfflineSync } from '../../hooks/useOfflineSync'
import { Button } from '../ui'
import { cn } from '../../utils/cn'
import { formatDistanceToNow } from 'date-fns'

interface OfflineIndicatorProps {
  showWhenOnline?: boolean
  compact?: boolean
}

export function OfflineIndicator({ showWhenOnline = false, compact = false }: OfflineIndicatorProps) {
  const { isOnline, isSyncing, pendingCount, lastSyncAt, syncError } = useOfflineStore()
  const { syncNow } = useOfflineSync()

  // Don't show anything if online and no pending changes (unless forced)
  if (isOnline && pendingCount === 0 && !showWhenOnline) {
    return null
  }

  const formatLastSync = () => {
    if (!lastSyncAt) return 'Never synced'
    try {
      return `Synced ${formatDistanceToNow(lastSyncAt, { addSuffix: true })}`
    } catch {
      return 'Recently synced'
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {!isOnline && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            <WifiOff className="h-3 w-3" />
            <span className="text-xs font-medium">Offline</span>
          </div>
        )}
        {pendingCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            {isSyncing ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Cloud className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">{pendingCount}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-lg border p-4',
      !isOnline
        ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
        : pendingCount > 0
          ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
          : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
    )}>
      <div className="flex items-start gap-3">
        {!isOnline ? (
          <CloudOff className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        ) : isSyncing ? (
          <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 animate-spin" />
        ) : pendingCount > 0 ? (
          <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        ) : (
          <Check className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
        )}

        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium text-sm',
            !isOnline
              ? 'text-amber-800 dark:text-amber-300'
              : pendingCount > 0
                ? 'text-blue-800 dark:text-blue-300'
                : 'text-green-800 dark:text-green-300'
          )}>
            {!isOnline
              ? 'You\'re offline'
              : isSyncing
                ? 'Syncing changes...'
                : pendingCount > 0
                  ? `${pendingCount} change${pendingCount > 1 ? 's' : ''} pending`
                  : 'All changes synced'}
          </p>

          <p className="text-xs text-surface-500 mt-1">
            {!isOnline
              ? 'Changes will sync when you\'re back online'
              : formatLastSync()}
          </p>

          {syncError && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Error: {syncError}
            </p>
          )}
        </div>

        {isOnline && pendingCount > 0 && !isSyncing && (
          <Button
            variant="outline"
            size="sm"
            onClick={syncNow}
            leftIcon={<RefreshCw className="h-3 w-3" />}
          >
            Sync
          </Button>
        )}
      </div>
    </div>
  )
}

// Banner version for header
export function OfflineBanner() {
  const { isOnline, isSyncing, pendingCount } = useOfflineStore()

  if (isOnline && pendingCount === 0) return null

  return (
    <div className={cn(
      'px-4 py-2 text-center text-sm',
      !isOnline
        ? 'bg-amber-500 text-white'
        : 'bg-blue-500 text-white'
    )}>
      {!isOnline ? (
        <span className="flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          You're offline. Changes will sync when reconnected.
        </span>
      ) : isSyncing ? (
        <span className="flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Syncing {pendingCount} change{pendingCount > 1 ? 's' : ''}...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <Cloud className="h-4 w-4" />
          {pendingCount} change{pendingCount > 1 ? 's' : ''} pending sync
        </span>
      )}
    </div>
  )
}
