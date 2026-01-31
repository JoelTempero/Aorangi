import type { FirestoreTimestamp } from './common.types'

export type UserRole = 'admin' | 'member'
export type UserStatus = 'available' | 'busy' | 'break' | 'offline'
export type TeamType = 'video' | 'photo' | 'socials' | 'support'

export interface NotificationPrefs {
  taskAssigned: boolean
  taskDueSoon: boolean
  scheduleChange: boolean
  announcement: boolean
  directMessage: boolean
  contentStatusChange: boolean
  equipmentAssigned: boolean
  dueSoonHours: number
  // Extended notification preferences
  mentionInChannel: boolean
  achievementEarned: boolean
  contentApprovalRequired: boolean
  quietHoursEnabled: boolean
  quietHoursStart: string // "22:00"
  quietHoursEnd: string   // "07:00"
}

export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  teams: TeamType[]
  skills: string[]
  phone?: string
  status: UserStatus
  notificationPrefs: NotificationPrefs
  fcmToken?: string
  createdAt: FirestoreTimestamp
  lastActive: FirestoreTimestamp
}

export interface UserProfile extends Omit<User, 'fcmToken'> {
  tasksCompleted: number
  currentTasks: number
}

export interface Invite {
  code: string
  createdBy: string
  assignedRole: UserRole
  assignedTeams: TeamType[]
  used: boolean
  usedBy?: string
  expiresAt: FirestoreTimestamp
  createdAt: FirestoreTimestamp
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  taskAssigned: true,
  taskDueSoon: true,
  scheduleChange: true,
  announcement: true,
  directMessage: true,
  contentStatusChange: true,
  equipmentAssigned: true,
  dueSoonHours: 24,
  mentionInChannel: true,
  achievementEarned: true,
  contentApprovalRequired: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00'
}

export const TEAM_LABELS: Record<TeamType, string> = {
  video: 'Video',
  photo: 'Photo',
  socials: 'Socials',
  support: 'Support'
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  member: 'Member'
}

// Alias for team member (same as User but used in team contexts)
export type TeamMember = User
