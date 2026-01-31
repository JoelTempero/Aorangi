import { Link } from 'react-router-dom'
import {
  Zap,
  Plus,
  CheckSquare,
  Calendar,
  MessageSquare,
  Film,
  Upload,
  HelpCircle
} from 'lucide-react'
import { WidgetContainer } from './WidgetContainer'
import { cn } from '../../utils/cn'

interface QuickActionsWidgetProps {
  onRemove?: () => void
  dragHandleProps?: any
  isDragging?: boolean
}

const QUICK_ACTIONS = [
  {
    label: 'New Task',
    icon: CheckSquare,
    href: '/tasks',
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
  },
  {
    label: 'My Schedule',
    icon: Calendar,
    href: '/schedule',
    color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
  },
  {
    label: 'Messages',
    icon: MessageSquare,
    href: '/messages',
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
  },
  {
    label: 'Content',
    icon: Film,
    href: '/content',
    color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30'
  },
  {
    label: 'Upload',
    icon: Upload,
    href: '/content',
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
  },
  {
    label: 'FAQs',
    icon: HelpCircle,
    href: '/faqs',
    color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30'
  }
]

export function QuickActionsWidget({ onRemove, dragHandleProps, isDragging }: QuickActionsWidgetProps) {
  return (
    <WidgetContainer
      title="Quick Actions"
      icon={<Zap className="h-4 w-4" />}
      size="small"
      onRemove={onRemove}
      dragHandleProps={dragHandleProps}
      isDragging={isDragging}
    >
      <div className="grid grid-cols-3 gap-2">
        {QUICK_ACTIONS.map(action => (
          <Link
            key={action.label}
            to={action.href}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          >
            <div className={cn('p-2 rounded-lg', action.color)}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-xs text-center text-surface-600 dark:text-surface-400">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </WidgetContainer>
  )
}
