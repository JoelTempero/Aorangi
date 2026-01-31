import { ReactNode } from 'react'
import { GripVertical, MoreVertical, X } from 'lucide-react'
import { Card } from '../ui'
import { cn } from '../../utils/cn'

interface WidgetContainerProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  size?: 'small' | 'medium' | 'large'
  onRemove?: () => void
  dragHandleProps?: any
  isDragging?: boolean
  className?: string
  headerAction?: ReactNode
}

export function WidgetContainer({
  title,
  icon,
  children,
  size = 'medium',
  onRemove,
  dragHandleProps,
  isDragging,
  className,
  headerAction
}: WidgetContainerProps) {
  return (
    <Card
      className={cn(
        'flex flex-col overflow-hidden transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-primary-500',
        size === 'small' && 'col-span-1',
        size === 'medium' && 'col-span-1 md:col-span-2',
        size === 'large' && 'col-span-1 md:col-span-2 lg:col-span-3',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <button
              {...dragHandleProps}
              className="p-1 -ml-1 cursor-grab active:cursor-grabbing hover:bg-surface-100 dark:hover:bg-surface-800 rounded"
            >
              <GripVertical className="h-4 w-4 text-surface-400" />
            </button>
          )}
          {icon && <span className="text-surface-500">{icon}</span>}
          <h3 className="font-semibold text-sm text-surface-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {headerAction}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded text-surface-400 hover:text-surface-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {children}
      </div>
    </Card>
  )
}

export function WidgetSkeleton() {
  return (
    <Card className="p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-24 bg-surface-200 dark:bg-surface-700 rounded" />
        <div className="h-20 bg-surface-100 dark:bg-surface-800 rounded" />
      </div>
    </Card>
  )
}
