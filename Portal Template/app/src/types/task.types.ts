import type { FirestoreTimestamp } from './common.types'
import type { TeamType } from './user.types'

export type TaskStatus = 'not_started' | 'in_progress' | 'review' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskCategory = 'pre_camp' | 'during_camp' | 'post_camp' | 'recurring'

export interface Subtask {
  id: string
  title: string
  completed: boolean
  completedAt?: FirestoreTimestamp
  completedBy?: string
}

export interface TaskComment {
  id: string
  userId: string
  content: string
  createdAt: FirestoreTimestamp
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  team?: TeamType
  assignees: string[]
  dueDate?: FirestoreTimestamp
  subtasks: Subtask[]
  blockedBy: string[]
  blocks: string[]
  tags: string[]
  comments: TaskComment[]
  attachments: string[]
  createdBy: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
  completedAt?: FirestoreTimestamp
  completedBy?: string
}

export interface TaskFilter {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  category?: TaskCategory[]
  team?: TeamType
  assignee?: string
  search?: string
  dueBefore?: Date
  dueAfter?: Date
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  review: 'In Review',
  completed: 'Completed'
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  not_started: 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
}

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-surface-200 text-surface-600 dark:bg-surface-700 dark:text-surface-400',
  medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
}

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  pre_camp: 'Pre-Camp',
  during_camp: 'During Camp',
  post_camp: 'Post-Camp',
  recurring: 'Recurring'
}
