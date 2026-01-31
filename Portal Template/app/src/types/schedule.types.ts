import type { FirestoreTimestamp } from './common.types'

export type AssignmentRole = 'shoot_highlights' | 'shoot_drone' | 'shoot_timelapse' | 'shoot_bts' | 'edit_highlights' | 'edit_news' | 'audio' | 'presentation' | 'chill_fill' | 'custom'

export interface Location {
  id: string
  name: string
  description?: string
  color?: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface Assignment {
  id: string
  userId: string
  role: AssignmentRole
  customRole?: string
  locationId?: string
  notes?: string
  confirmed: boolean
  confirmedAt?: FirestoreTimestamp
  // Break tracking
  breakStart?: FirestoreTimestamp
  breakEnd?: FirestoreTimestamp
  breakDuration?: number // minutes
}

export interface ScheduleSlot {
  id: string
  dayId: string
  name: string
  startTime: FirestoreTimestamp
  endTime: FirestoreTimestamp
  locationId?: string
  assignments: Assignment[]
  notes?: string
  // Optional tags for pre/post camp slots
  dayTag?: string
  timeTag?: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface ScheduleDay {
  id: string
  eventId: string
  date: FirestoreTimestamp
  name: string
  slots: ScheduleSlot[]
}

export interface Event {
  id: string
  name: string
  year: number
  startDate: FirestoreTimestamp
  endDate: FirestoreTimestamp
  status: 'planning' | 'active' | 'completed'
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export const ASSIGNMENT_ROLE_LABELS: Record<AssignmentRole, string> = {
  shoot_highlights: 'Shoot Highlights',
  shoot_drone: 'Drone',
  shoot_timelapse: 'Timelapse',
  shoot_bts: 'BTS',
  edit_highlights: 'Edit Highlights',
  edit_news: 'Edit News',
  audio: 'Audio',
  presentation: 'Presentation',
  chill_fill: 'Chill / Fill',
  custom: 'Custom'
}

export const DEFAULT_LOCATIONS: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Big Top', description: 'Main stage tent', color: 'amber' },
  { name: 'Media HQ', description: 'Media team headquarters', color: 'blue' },
  { name: 'Main Field', description: 'Open field area', color: 'green' },
  { name: 'Chapel', description: 'Chapel building', color: 'purple' },
  { name: 'Dining Hall', description: 'Meal times', color: 'orange' },
  { name: 'Roving', description: 'Moving around site', color: 'gray' }
]
