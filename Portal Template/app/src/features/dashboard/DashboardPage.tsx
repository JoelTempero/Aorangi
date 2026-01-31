import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageLayout, PageSection } from '../../components/layout'
import { Card, CardHeader, Button, Avatar, EmptyState, Checkbox, Input, Modal, ModalFooter } from '../../components/ui'
import { CountdownRing } from '../../components/shared'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { useAppStore } from '../../stores/appStore'
import { formatRelative, getDaysUntil, isDueSoon, isOverdue } from '../../utils/date.utils'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  CheckSquare,
  Calendar,
  ArrowRight,
  Plus,
  Bell,
  Tent,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Copy,
  FileText,
  Link as LinkIcon,
  Trash2
} from 'lucide-react'
import type { Task } from '../../types'

interface QuickAccessItem {
  id: string
  type: 'link' | 'text'
  label: string
  content: string
}

// Load quick access items from localStorage
function loadQuickAccessItems(): QuickAccessItem[] {
  try {
    const saved = localStorage.getItem('ec-quick-access')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Save quick access items to localStorage
function saveQuickAccessItems(items: QuickAccessItem[]) {
  localStorage.setItem('ec-quick-access', JSON.stringify(items))
}

export function DashboardPage() {
  const { user } = useAuth()
  const currentEvent = useAppStore((state) => state.currentEvent)
  const { tasks, teamMembers, announcements } = useDataStore()
  const [quickAccessItems, setQuickAccessItems] = useState<QuickAccessItem[]>(loadQuickAccessItems)
  const [showAddQuickAccess, setShowAddQuickAccess] = useState(false)

  // Filter tasks for current user
  const myTasks = tasks.filter((t) => t.assignees.includes(user?.id || ''))
  const pendingTasks = myTasks.filter((t) => t.status !== 'completed')

  // Recent announcements
  const recentAnnouncements = announcements.slice(0, 3)

  // Camp countdown calculations
  const daysUntilCamp = currentEvent?.startDate ? getDaysUntil(currentEvent.startDate) : null
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    if (!currentEvent?.startDate) return

    const updateCountdown = () => {
      const now = new Date()
      const startDate = currentEvent.startDate
      if (!startDate) return

      const start = startDate instanceof Date
        ? startDate
        : 'seconds' in startDate
          ? new Date(startDate.seconds * 1000)
          : new Date()
      const diff = start.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      setCountdown({ days, hours, minutes })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000)

    return () => clearInterval(interval)
  }, [currentEvent?.startDate])

  const handleAddQuickAccess = (item: Omit<QuickAccessItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() }
    const updated = [...quickAccessItems, newItem]
    setQuickAccessItems(updated)
    saveQuickAccessItems(updated)
    setShowAddQuickAccess(false)
  }

  const handleRemoveQuickAccess = (id: string) => {
    const updated = quickAccessItems.filter(item => item.id !== id)
    setQuickAccessItems(updated)
    saveQuickAccessItems(updated)
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  return (
    <PageLayout title={`Welcome back, ${user?.displayName?.split(' ')[0]}`}>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Tasks */}
          <PageSection
            title="My Tasks"
            action={
              <Link to="/tasks">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View All
                </Button>
              </Link>
            }
          >
            <Card padding="none">
              {pendingTasks.length === 0 ? (
                <EmptyState
                  icon={<CheckSquare className="h-8 w-8" />}
                  title="All caught up!"
                  description="You have no pending tasks"
                  className="py-8"
                />
              ) : (
                <div className="divide-y divide-surface-100 dark:divide-surface-800">
                  {pendingTasks.slice(0, 5).map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </Card>
          </PageSection>

          {/* Announcements */}
          <PageSection
            title="Announcements"
            action={
              <Link to="/announcements">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View All
                </Button>
              </Link>
            }
          >
            {recentAnnouncements.length === 0 ? (
              <Card>
                <EmptyState
                  icon={<Bell className="h-8 w-8" />}
                  title="No announcements"
                  description="Check back later for updates"
                />
              </Card>
            ) : (
              <div className="space-y-3">
                {recentAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        announcement.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                        announcement.priority === 'important' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                        'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
                      )}>
                        <Bell className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-surface-900 dark:text-surface-100">
                          {announcement.title}
                        </h4>
                        <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mt-1">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-surface-400 mt-2">
                          {formatRelative(announcement.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </PageSection>

          {/* Quick Access */}
          <PageSection
            title="Quick Access"
            action={
              <div className="flex gap-2">
                <Link to="/helpful-stuff">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View All
                  </Button>
                </Link>
                <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddQuickAccess(true)}>
                  Add
                </Button>
              </div>
            }
          >
            {quickAccessItems.length === 0 ? (
              <Card>
                <EmptyState
                  icon={<FileText className="h-8 w-8" />}
                  title="No quick access items"
                  description="Add links or text snippets for easy access"
                  action={{ label: 'Add Item', onClick: () => setShowAddQuickAccess(true) }}
                />
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {quickAccessItems.slice(0, 6).map((item) => (
                  <Card key={item.id} className="group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.type === 'link' ? (
                          <LinkIcon className="h-4 w-4 text-primary-500 shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-surface-400 shrink-0" />
                        )}
                        <span className="font-medium text-sm truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.type === 'link' ? (
                          <a href={item.content} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyText(item.content)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleRemoveQuickAccess(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {item.type === 'text' && (
                      <p className="text-xs text-surface-500 mt-2 line-clamp-2">{item.content}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </PageSection>
        </div>

        {/* Sidebar - 1 col */}
        <div className="space-y-6">
          {/* Camp Countdown */}
          {daysUntilCamp !== null && daysUntilCamp > 0 && (
            <Card className="bg-gradient-to-br from-primary-500 to-accent-500 text-white border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tent className="h-5 w-5" />
                  <span className="font-medium">Camp Countdown</span>
                </div>
                <Sparkles className="h-4 w-4 opacity-70" />
              </div>
              <CountdownRing
                days={countdown.days}
                hours={countdown.hours}
                minutes={countdown.minutes}
                className="justify-center"
              />
              <p className="text-center text-sm text-white/80 mt-4">
                {currentEvent?.name || 'Camp'} is coming!
              </p>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Link to="/tasks">
                <Button variant="outline" className="w-full justify-start" leftIcon={<Plus className="h-4 w-4" />}>
                  New Task
                </Button>
              </Link>
              <Link to="/announcements">
                <Button variant="outline" className="w-full justify-start" leftIcon={<Bell className="h-4 w-4" />}>
                  Announce
                </Button>
              </Link>
              <Link to="/schedule">
                <Button variant="outline" className="w-full justify-start" leftIcon={<Calendar className="h-4 w-4" />}>
                  Schedule
                </Button>
              </Link>
              <Link to="/helpful-stuff">
                <Button variant="outline" className="w-full justify-start" leftIcon={<FileText className="h-4 w-4" />}>
                  Resources
                </Button>
              </Link>
            </div>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader title="Team" />
            <div className="flex flex-wrap gap-2 mt-4">
              {teamMembers.slice(0, 8).map((member) => (
                <Avatar
                  key={member.id}
                  src={member.photoURL}
                  name={member.displayName}
                  size="md"
                  status={member.status === 'available' ? 'online' : 'offline'}
                />
              ))}
              {teamMembers.length > 8 && (
                <div className="h-10 w-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-sm font-medium">
                  +{teamMembers.length - 8}
                </div>
              )}
            </div>
            <Link to="/team" className="block mt-4">
              <Button variant="ghost" size="sm" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Add Quick Access Modal */}
      <AddQuickAccessModal
        open={showAddQuickAccess}
        onClose={() => setShowAddQuickAccess(false)}
        onAdd={handleAddQuickAccess}
      />
    </PageLayout>
  )
}

interface TaskItemProps {
  task: Task
}

function TaskItem({ task }: TaskItemProps) {
  const overdue = task.dueDate && isOverdue(task.dueDate)
  const dueSoon = task.dueDate && isDueSoon(task.dueDate, 24)

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="flex items-center gap-3 p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
    >
      <Checkbox checked={task.status === 'completed'} onChange={() => {}} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-surface-900 dark:text-surface-100 truncate">
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {task.dueDate && (
            <span className={cn(
              'text-xs',
              overdue ? 'text-red-600' : dueSoon ? 'text-amber-600' : 'text-surface-500'
            )}>
              {formatRelative(task.dueDate)}
            </span>
          )}
        </div>
      </div>
      {overdue && <AlertCircle className="h-4 w-4 text-red-500" />}
    </Link>
  )
}

interface AddQuickAccessModalProps {
  open: boolean
  onClose: () => void
  onAdd: (item: Omit<QuickAccessItem, 'id'>) => void
}

function AddQuickAccessModal({ open, onClose, onAdd }: AddQuickAccessModalProps) {
  const [type, setType] = useState<'link' | 'text'>('link')
  const [label, setLabel] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (!label.trim() || !content.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    onAdd({ type, label: label.trim(), content: content.trim() })
    setLabel('')
    setContent('')
    setType('link')
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Quick Access Item">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={type === 'link' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setType('link')}
            leftIcon={<LinkIcon className="h-4 w-4" />}
          >
            Link
          </Button>
          <Button
            variant={type === 'text' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setType('text')}
            leftIcon={<FileText className="h-4 w-4" />}
          >
            Text
          </Button>
        </div>

        <Input
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Drive Folder, Instagram Login"
        />

        <Input
          label={type === 'link' ? 'URL' : 'Text to copy'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={type === 'link' ? 'https://...' : 'Enter text...'}
        />
      </div>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </ModalFooter>
    </Modal>
  )
}
