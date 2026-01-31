import type { FirestoreTimestamp } from './common.types'
import type { TeamType } from './user.types'

export type AnnouncementPriority = 'normal' | 'important' | 'urgent'
export type AnnouncementTarget = 'all' | TeamType

export interface Announcement {
  id: string
  title: string
  content: string
  priority: AnnouncementPriority
  targets: AnnouncementTarget[]
  mentions: string[]
  authorId: string
  pinned: boolean
  requiresConfirmation: boolean
  confirmedBy: string[]
  reactions: Record<string, string[]>
  readBy: string[]
  expiresAt?: FirestoreTimestamp
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, string>
  read: boolean
  actionUrl?: string
  createdAt: FirestoreTimestamp
}

export type NotificationType =
  | 'task_assigned'
  | 'task_due_soon'
  | 'task_completed'
  | 'schedule_change'
  | 'announcement'
  | 'mention'
  | 'content_status'
  | 'equipment_checkout'
  | 'equipment_return'
  | 'idea_approved'

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  tags: string[]
  helpful: number
  notHelpful: number
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface Idea {
  id: string
  title: string
  description: string
  category: string
  authorId: string
  status: 'proposed' | 'under_review' | 'approved' | 'implemented' | 'rejected'
  upvotes: string[]
  downvotes: string[]
  comments: IdeaComment[]
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface IdeaComment {
  id: string
  userId: string
  content: string
  createdAt: FirestoreTimestamp
}

export const ANNOUNCEMENT_PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  normal: 'Normal',
  important: 'Important',
  urgent: 'Urgent'
}

export const ANNOUNCEMENT_PRIORITY_COLORS: Record<AnnouncementPriority, string> = {
  normal: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300',
  important: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

export const IDEA_STATUS_LABELS: Record<Idea['status'], string> = {
  proposed: 'Proposed',
  under_review: 'Under Review',
  approved: 'Approved',
  implemented: 'Implemented',
  rejected: 'Rejected'
}

export const IDEA_STATUS_COLORS: Record<Idea['status'], string> = {
  proposed: 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300',
  under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  implemented: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

export const FAQ_CATEGORIES = [
  'Equipment',
  'Processes',
  'Contacts',
  'Policies',
  'Technical',
  'General'
] as const

export const IDEA_CATEGORIES = [
  'Content Ideas',
  'Process Improvements',
  'Equipment',
  'Team Building',
  'Future Camps',
  'Other'
] as const
