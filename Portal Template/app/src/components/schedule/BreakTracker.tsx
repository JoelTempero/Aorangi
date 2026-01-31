import { useState, useEffect } from 'react'
import { Coffee, Play, Pause, Clock, AlertTriangle } from 'lucide-react'
import { Button, Badge } from '../ui'
import { cn } from '../../utils/cn'

interface BreakTrackerProps {
  assignmentId: string
  userId: string
  shiftDuration: number // minutes
  breakStart?: Date
  breakEnd?: Date
  breakDuration?: number // minutes
  onStartBreak: (assignmentId: string) => void
  onEndBreak: (assignmentId: string) => void
  compact?: boolean
}

export function BreakTracker({
  assignmentId,
  userId,
  shiftDuration,
  breakStart,
  breakEnd,
  breakDuration = 0,
  onStartBreak,
  onEndBreak,
  compact = false
}: BreakTrackerProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const isOnBreak = !!breakStart && !breakEnd

  // Calculate required break time (30 min per 4 hours)
  const requiredBreak = Math.floor(shiftDuration / 240) * 30

  // Track elapsed break time
  useEffect(() => {
    if (isOnBreak && breakStart) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - breakStart.getTime()) / 1000 / 60)
        setElapsedTime(elapsed)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isOnBreak, breakStart])

  const totalBreakTime = breakDuration + (isOnBreak ? elapsedTime : 0)
  const breakAdequate = totalBreakTime >= requiredBreak || requiredBreak === 0

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isOnBreak ? (
          <Badge variant="warning" className="flex items-center gap-1">
            <Coffee className="h-3 w-3" />
            On Break
          </Badge>
        ) : breakDuration > 0 ? (
          <Badge variant="success" className="flex items-center gap-1">
            <Coffee className="h-3 w-3" />
            {formatTime(breakDuration)}
          </Badge>
        ) : null}
        {!breakAdequate && !isOnBreak && (
          <span title="Break recommended"><AlertTriangle className="h-4 w-4 text-amber-500" /></span>
        )}
      </div>
    )
  }

  return (
    <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Coffee className={cn('h-4 w-4', isOnBreak ? 'text-amber-500' : 'text-surface-400')} />
          <span className="text-sm font-medium">Break Tracker</span>
        </div>
        {isOnBreak ? (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Pause className="h-3 w-3" />}
            onClick={() => onEndBreak(assignmentId)}
          >
            End Break
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Play className="h-3 w-3" />}
            onClick={() => onStartBreak(assignmentId)}
          >
            Start Break
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {isOnBreak && (
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Clock className="h-3 w-3 animate-pulse" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          )}
          <div className="text-surface-500">
            Total: <span className="font-medium text-surface-700 dark:text-surface-300">{formatTime(totalBreakTime)}</span>
          </div>
        </div>

        {requiredBreak > 0 && (
          <div className={cn(
            'flex items-center gap-1 text-xs',
            breakAdequate ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
          )}>
            {breakAdequate ? (
              <>
                <span>Break adequate</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3" />
                <span>{formatTime(requiredBreak - totalBreakTime)} more recommended</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {requiredBreak > 0 && (
        <div className="mt-2 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300',
              breakAdequate ? 'bg-green-500' : 'bg-amber-500'
            )}
            style={{ width: `${Math.min(100, (totalBreakTime / requiredBreak) * 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Hook for break validation logic
export function useBreakValidation(shiftDuration: number, breakDuration: number) {
  const requiredBreak = Math.floor(shiftDuration / 240) * 30 // 30 min per 4 hours
  const isAdequate = breakDuration >= requiredBreak || requiredBreak === 0
  const remainingBreak = Math.max(0, requiredBreak - breakDuration)

  return {
    requiredBreak,
    isAdequate,
    remainingBreak
  }
}
