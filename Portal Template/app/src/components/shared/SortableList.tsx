import { useState, useRef, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { GripVertical } from 'lucide-react'

interface SortableItem {
  id: string
  [key: string]: unknown
}

interface SortableListProps<T extends SortableItem> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number, dragHandle: ReactNode) => ReactNode
  className?: string
  itemClassName?: string
}

export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  renderItem,
  className,
  itemClassName
}: SortableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const draggedItem = useRef<T | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    draggedItem.current = items[index]
    setDraggedIndex(index)

    // Set drag image to be slightly transparent
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', index.toString())
    }
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && targetIndex !== null && draggedIndex !== targetIndex) {
      const newItems = [...items]
      const [removed] = newItems.splice(draggedIndex, 1)
      newItems.splice(targetIndex, 0, removed)
      onReorder(newItems)
    }

    setDraggedIndex(null)
    setTargetIndex(null)
    draggedItem.current = null
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setTargetIndex(index)
  }

  const handleDragLeave = () => {
    setTargetIndex(null)
  }

  const DragHandle = ({ index }: { index: number }) => (
    <div
      className="cursor-grab active:cursor-grabbing p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragEnd={handleDragEnd}
    >
      <GripVertical className="h-4 w-4" />
    </div>
  )

  return (
    <div className={cn('space-y-1', className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'transition-all duration-200',
            draggedIndex === index && 'opacity-50 scale-[0.98]',
            targetIndex === index && draggedIndex !== index && 'border-t-2 border-primary-500',
            itemClassName
          )}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={handleDragEnd}
        >
          {renderItem(item, index, <DragHandle index={index} />)}
        </div>
      ))}
    </div>
  )
}

// Simple reorder function utility
export function reorderArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

// Touch-friendly sortable that uses long press to initiate drag
interface TouchSortableListProps<T extends SortableItem> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode
  className?: string
}

export function TouchSortableList<T extends SortableItem>({
  items,
  onReorder,
  renderItem,
  className
}: TouchSortableListProps<T>) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const handleTouchStart = (index: number) => {
    longPressTimer.current = setTimeout(() => {
      setActiveIndex(index)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setActiveIndex(null)
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      onReorder(reorderArray(items, index, index - 1))
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < items.length - 1) {
      onReorder(reorderArray(items, index, index + 1))
    }
  }

  return (
    <div className={cn('space-y-1', className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          onTouchStart={() => handleTouchStart(index)}
          onTouchEnd={handleTouchEnd}
          className={cn(
            'transition-all duration-200',
            activeIndex === index && 'ring-2 ring-primary-500 rounded-lg'
          )}
        >
          {renderItem(item, index, activeIndex === index)}
          {activeIndex === index && (
            <div className="flex justify-center gap-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-b-lg">
              <button
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="px-4 py-1 text-sm font-medium text-primary-600 disabled:text-surface-400"
              >
                Move Up
              </button>
              <button
                onClick={() => handleMoveDown(index)}
                disabled={index === items.length - 1}
                className="px-4 py-1 text-sm font-medium text-primary-600 disabled:text-surface-400"
              >
                Move Down
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
