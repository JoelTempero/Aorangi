import { useState, useMemo, useEffect } from 'react'
import { PageLayout } from '../../components/layout'
import { Card, Button, Badge, Avatar, Input, Select, EmptyState, Checkbox, Modal, ModalFooter, Textarea } from '../../components/ui'
import { KanbanBoard, DraggableCard, DroppableColumn } from '../../components/shared'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { firestoreService } from '../../services/firestore.service'
import { useAppStore } from '../../stores/appStore'
import { formatRelative, isOverdue, isDueSoon } from '../../utils/date.utils'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Clock,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Calendar,
  User,
  Tag,
  GripVertical,
  Trash2
} from 'lucide-react'
import type { Task, TaskStatus, TaskPriority, TaskCategory } from '../../types'
import { TASK_STATUS_LABELS, TASK_STATUS_COLORS, TASK_PRIORITY_LABELS, TASK_PRIORITY_COLORS, TASK_CATEGORY_LABELS } from '../../types'

export function TasksPage() {
  const { user } = useAuth()
  const currentEvent = useAppStore((state) => state.currentEvent)
  const { tasks, teamMembers, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('')
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter && task.status !== statusFilter) return false
      if (priorityFilter && task.priority !== priorityFilter) return false
      if (assigneeFilter === 'me' && !task.assignees.includes(user?.id || '')) return false
      if (assigneeFilter && assigneeFilter !== 'me' && !task.assignees.includes(assigneeFilter)) return false
      return true
    })
  }, [tasks, search, statusFilter, priorityFilter, assigneeFilter, user])

  // Group by status
  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      not_started: [],
      in_progress: [],
      review: [],
      completed: []
    }
    filteredTasks.forEach((task) => {
      groups[task.status].push(task)
    })
    return groups
  }, [filteredTasks])

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await firestoreService.update(`events/${currentEvent?.id}/tasks`, taskId, {
        status: newStatus,
        ...(newStatus === 'completed' ? {
          completedAt: firestoreService.serverTimestamp(),
          completedBy: user?.id
        } : {})
      })
      toast.success('Task updated')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  return (
    <PageLayout
      title="Tasks"
      description="Manage and track all tasks for the event"
      action={
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowNewTaskModal(true)}>
          New Task
        </Button>
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              ...Object.entries(TASK_STATUS_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-36"
          />
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { value: '', label: 'All Priorities' },
              ...Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-36"
          />
          <Select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            options={[
              { value: '', label: 'All Assignees' },
              { value: 'me', label: 'Assigned to me' },
              ...teamMembers.map((m) => ({ value: m.id, label: m.displayName }))
            ]}
            className="w-44"
          />
        </div>
      </Card>

      {/* Task Columns with Drag and Drop */}
      <KanbanBoard
        items={tasksByStatus}
        onDragEnd={(taskId, sourceColumn, targetColumn) => {
          handleStatusChange(taskId, targetColumn as TaskStatus)
        }}
        getItemId={(task) => task.id}
        renderDragOverlay={(task) =>
          task ? (
            <TaskCardContent task={task} teamMembers={teamMembers} isDragging />
          ) : null
        }
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['not_started', 'in_progress', 'review', 'completed'] as TaskStatus[]).map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              teamMembers={teamMembers}
              onEditTask={setEditingTask}
            />
          ))}
        </div>
      </KanbanBoard>

      {/* New Task Modal */}
      <NewTaskModal
        open={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        teamMembers={teamMembers}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        teamMembers={teamMembers}
      />
    </PageLayout>
  )
}

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  teamMembers: { id: string; displayName: string; photoURL?: string }[]
  onEditTask: (task: Task) => void
}

function TaskColumn({ status, tasks, teamMembers, onEditTask }: TaskColumnProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', TASK_STATUS_COLORS[status])}>
            {TASK_STATUS_LABELS[status]}
          </span>
          <span className="text-sm text-surface-500">{tasks.length}</span>
        </div>
      </div>

      <DroppableColumn id={status} className="flex-1 min-h-[200px]">
        <div className="space-y-2 min-h-[200px]">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg">
              <p className="text-sm text-surface-400">Drop tasks here</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                teamMembers={teamMembers}
                onEdit={() => onEditTask(task)}
              />
            ))
          )}
        </div>
      </DroppableColumn>
    </div>
  )
}

interface TaskCardProps {
  task: Task
  teamMembers: { id: string; displayName: string; photoURL?: string }[]
  onEdit: () => void
}

function TaskCard({ task, teamMembers, onEdit }: TaskCardProps) {
  return (
    <DraggableCard id={task.id}>
      <TaskCardContent task={task} teamMembers={teamMembers} onEdit={onEdit} />
    </DraggableCard>
  )
}

interface TaskCardContentProps {
  task: Task
  teamMembers: { id: string; displayName: string; photoURL?: string }[]
  isDragging?: boolean
  onEdit?: () => void
}

function TaskCardContent({ task, teamMembers, isDragging, onEdit }: TaskCardContentProps) {
  const overdue = task.dueDate && isOverdue(task.dueDate)
  const dueSoon = task.dueDate && isDueSoon(task.dueDate, 24)

  const assignedMembers = teamMembers.filter((m) => task.assignees.includes(m.id))

  const cardContent = (
    <Card className={cn(
      'transition-all cursor-grab active:cursor-grabbing',
      isDragging
        ? 'shadow-xl border-primary-400 dark:border-primary-500 rotate-2 scale-105'
        : 'hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md'
    )}>
      {/* Priority indicator */}
      {task.priority === 'urgent' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 rounded-t-xl" />
      )}

      <div className="space-y-3">
        {/* Drag handle + Title */}
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-surface-300 dark:text-surface-600 shrink-0 mt-0.5" />
          <p className="font-medium text-surface-900 dark:text-surface-100 line-clamp-2 flex-1">
            {task.title}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <Badge className={TASK_PRIORITY_COLORS[task.priority]}>
            {TASK_PRIORITY_LABELS[task.priority]}
          </Badge>
          {task.category && (
            <Badge variant="default">
              {TASK_CATEGORY_LABELS[task.category]}
            </Badge>
          )}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className={cn(
            'flex items-center gap-1 text-xs',
            overdue ? 'text-red-600' : dueSoon ? 'text-amber-600' : 'text-surface-500'
          )}>
            {overdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {formatRelative(task.dueDate)}
          </div>
        )}

        {/* Subtasks progress */}
        {task.subtasks.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <CheckSquare className="h-3 w-3" />
            {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
          </div>
        )}

        {/* Assignees */}
        {assignedMembers.length > 0 && (
          <div className="flex -space-x-1">
            {assignedMembers.slice(0, 3).map((member) => (
              <Avatar
                key={member.id}
                src={member.photoURL}
                name={member.displayName}
                size="xs"
                className="ring-2 ring-white dark:ring-surface-900"
              />
            ))}
            {assignedMembers.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-xs ring-2 ring-white dark:ring-surface-900">
                +{assignedMembers.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )

  // If dragging, don't add click handler
  if (isDragging) {
    return cardContent
  }

  return (
    <div onClick={(e) => { e.stopPropagation(); onEdit?.() }}>
      {cardContent}
    </div>
  )
}

interface NewTaskModalProps {
  open: boolean
  onClose: () => void
  teamMembers: { id: string; displayName: string }[]
}

function NewTaskModal({ open, onClose, teamMembers }: NewTaskModalProps) {
  const { user } = useAuth()
  const currentEvent = useAppStore((state) => state.currentEvent)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [category, setCategory] = useState<TaskCategory>('during_camp')
  const [assignees, setAssignees] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !currentEvent) return

    setLoading(true)
    try {
      await firestoreService.createInNested('events', currentEvent.id, 'tasks', {
        title: title.trim(),
        description,
        status: 'not_started' as TaskStatus,
        priority,
        category,
        assignees,
        subtasks: [],
        blockedBy: [],
        blocks: [],
        tags: [],
        comments: [],
        attachments: [],
        createdBy: user?.id
      })
      toast.success('Task created')
      onClose()
      setTitle('')
      setDescription('')
      setAssignees([])
    } catch (error) {
      toast.error('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            options={Object.entries(TASK_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Assignees
          </label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg border-surface-300 dark:border-surface-600">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  setAssignees((prev) =>
                    prev.includes(member.id)
                      ? prev.filter((id) => id !== member.id)
                      : [...prev, member.id]
                  )
                }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-colors',
                  assignees.includes(member.id)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200'
                )}
              >
                {member.displayName}
              </button>
            ))}
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!title.trim()}>
            Create Task
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

interface EditTaskModalProps {
  open: boolean
  onClose: () => void
  task: Task | null
  teamMembers: { id: string; displayName: string }[]
}

function EditTaskModal({ open, onClose, task, teamMembers }: EditTaskModalProps) {
  const { user } = useAuth()
  const currentEvent = useAppStore((state) => state.currentEvent)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('not_started')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [category, setCategory] = useState<TaskCategory>('during_camp')
  const [assignees, setAssignees] = useState<string[]>([])

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setStatus(task.status)
      setPriority(task.priority)
      setCategory(task.category || 'during_camp')
      setAssignees(task.assignees || [])
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !currentEvent || !task) return

    setLoading(true)
    try {
      await firestoreService.update(`events/${currentEvent.id}/tasks`, task.id, {
        title: title.trim(),
        description,
        status,
        priority,
        category,
        assignees,
        ...(status === 'completed' && task.status !== 'completed' ? {
          completedAt: firestoreService.serverTimestamp(),
          completedBy: user?.id
        } : {})
      })
      toast.success('Task updated')
      onClose()
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentEvent || !task) return
    if (!confirm('Are you sure you want to delete this task?')) return

    setLoading(true)
    try {
      await firestoreService.delete(`events/${currentEvent.id}/tasks`, task.id)
      toast.success('Task deleted')
      onClose()
    } catch (error) {
      toast.error('Failed to delete task')
    } finally {
      setLoading(false)
    }
  }

  if (!task) return null

  return (
    <Modal open={open} onClose={onClose} title="Edit Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
          rows={3}
        />

        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={Object.entries(TASK_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            options={Object.entries(TASK_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Assignees
          </label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg border-surface-300 dark:border-surface-600">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  setAssignees((prev) =>
                    prev.includes(member.id)
                      ? prev.filter((id) => id !== member.id)
                      : [...prev, member.id]
                  )
                }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-colors',
                  assignees.includes(member.id)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200'
                )}
              >
                {member.displayName}
              </button>
            ))}
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" type="button" className="text-red-500" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!title.trim()}>
            Save Changes
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
