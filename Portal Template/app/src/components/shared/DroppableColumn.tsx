import { useDroppable } from '@dnd-kit/core'
import { cn } from '../../utils/cn'

interface DroppableColumnProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function DroppableColumn({ id, children, className }: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-colors duration-200',
        isOver && 'bg-primary-50/50 dark:bg-primary-900/10 rounded-lg',
        className
      )}
    >
      {children}
    </div>
  )
}
