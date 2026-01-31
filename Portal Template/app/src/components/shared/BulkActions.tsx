import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Button } from '../ui'
import { X, CheckSquare, Trash2, Tag, Users, Archive, MoreHorizontal } from 'lucide-react'

interface BulkAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'danger'
  onClick: (selectedIds: string[]) => void | Promise<void>
}

interface BulkActionsBarProps {
  selectedCount: number
  totalCount: number
  selectedIds: string[]
  onClearSelection: () => void
  onSelectAll: () => void
  actions: BulkAction[]
  className?: string
}

export function BulkActionsBar({
  selectedCount,
  totalCount,
  selectedIds,
  onClearSelection,
  onSelectAll,
  actions,
  className
}: BulkActionsBarProps) {
  const [loading, setLoading] = useState<string | null>(null)

  if (selectedCount === 0) return null

  const handleAction = async (action: BulkAction) => {
    setLoading(action.id)
    try {
      await action.onClick(selectedIds)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-40',
        'bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900',
        'rounded-xl shadow-2xl px-4 py-3',
        'flex items-center gap-4',
        'animate-slide-up',
        className
      )}
    >
      {/* Selection info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClearSelection}
          className="p-1 hover:bg-surface-700 dark:hover:bg-surface-300 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {selectedCount} selected
        </span>
        {selectedCount < totalCount && (
          <button
            onClick={onSelectAll}
            className="text-sm text-primary-400 dark:text-primary-600 hover:underline"
          >
            Select all {totalCount}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-surface-700 dark:bg-surface-300" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions.slice(0, 4).map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              variant={action.variant === 'danger' ? 'danger' : 'ghost'}
              size="sm"
              onClick={() => handleAction(action)}
              disabled={loading !== null}
              loading={loading === action.id}
              className={cn(
                action.variant !== 'danger' && 'text-white dark:text-surface-900 hover:bg-surface-700 dark:hover:bg-surface-300'
              )}
            >
              {Icon && <Icon className="h-4 w-4 mr-1.5" />}
              {action.label}
            </Button>
          )
        })}

        {actions.length > 4 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white dark:text-surface-900 hover:bg-surface-700 dark:hover:bg-surface-300"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Selection manager hook
interface SelectionState<T> {
  selectedIds: Set<string>
  items: T[]
}

export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const isSelected = (id: string) => selectedIds.has(id)

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectAll = () => {
    setSelectedIds(new Set(items.map((item) => item.id)))
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  const selectMultiple = (ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
  }

  const deselectMultiple = (ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }

  return {
    selectedIds: Array.from(selectedIds),
    selectedCount: selectedIds.size,
    isSelected,
    toggle,
    selectAll,
    clearSelection,
    selectMultiple,
    deselectMultiple,
    allSelected: selectedIds.size === items.length && items.length > 0,
    someSelected: selectedIds.size > 0 && selectedIds.size < items.length
  }
}

// Selectable list item wrapper
interface SelectableItemProps {
  id: string
  isSelected: boolean
  onToggle: () => void
  children: React.ReactNode
  className?: string
}

export function SelectableItem({ id, isSelected, onToggle, children, className }: SelectableItemProps) {
  return (
    <div
      className={cn(
        'relative transition-colors',
        isSelected && 'bg-primary-50 dark:bg-primary-900/20',
        className
      )}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
        />
      </div>
      <div className="pl-12">
        {children}
      </div>
    </div>
  )
}

// Common bulk actions
export const commonBulkActions = {
  delete: (onDelete: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    variant: 'danger',
    onClick: onDelete
  }),

  archive: (onArchive: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: 'archive',
    label: 'Archive',
    icon: Archive,
    onClick: onArchive
  }),

  assignTo: (onAssign: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: 'assign',
    label: 'Assign',
    icon: Users,
    onClick: onAssign
  }),

  addTag: (onAddTag: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: 'tag',
    label: 'Add Tag',
    icon: Tag,
    onClick: onAddTag
  }),

  markComplete: (onComplete: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: 'complete',
    label: 'Mark Complete',
    icon: CheckSquare,
    onClick: onComplete
  })
}
