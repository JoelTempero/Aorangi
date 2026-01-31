import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

interface KanbanBoardProps<T> {
  children: React.ReactNode
  items: Record<string, T[]>
  onDragEnd: (itemId: string, sourceColumn: string, targetColumn: string) => void
  renderDragOverlay?: (item: T | null) => React.ReactNode
  getItemId: (item: T) => string
}

export function KanbanBoard<T>({
  children,
  items,
  onDragEnd,
  renderDragOverlay,
  getItemId
}: KanbanBoardProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<T | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const findColumnByItemId = (itemId: string): string | null => {
    for (const [columnId, columnItems] of Object.entries(items)) {
      if (columnItems.some((item) => getItemId(item) === itemId)) {
        return columnId
      }
    }
    return null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const itemId = active.id as string
    setActiveId(itemId)

    // Find the active item
    for (const columnItems of Object.values(items)) {
      const item = columnItems.find((i) => getItemId(i) === itemId)
      if (item) {
        setActiveItem(item)
        break
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      setActiveItem(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    const sourceColumn = findColumnByItemId(activeId)

    // The over ID could be a column ID or another item ID
    let targetColumn = overId

    // If overId is an item, find its column
    const overColumn = findColumnByItemId(overId)
    if (overColumn) {
      targetColumn = overColumn
    }

    if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
      onDragEnd(activeId, sourceColumn, targetColumn)
    }

    setActiveId(null)
    setActiveItem(null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over events if needed for visual feedback
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeItem && renderDragOverlay ? renderDragOverlay(activeItem) : null}
      </DragOverlay>
    </DndContext>
  )
}
