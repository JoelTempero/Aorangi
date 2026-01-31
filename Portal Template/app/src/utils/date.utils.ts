import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, differenceInDays, differenceInHours } from 'date-fns'
import type { FirestoreTimestamp } from '../types'

export function toDate(timestamp: FirestoreTimestamp): Date | null {
  if (!timestamp) return null
  if (timestamp instanceof Date) return timestamp
  if (typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Date(timestamp.seconds * 1000)
  }
  return null
}

export function formatDate(timestamp: FirestoreTimestamp, formatStr: string = 'PPP'): string {
  const date = toDate(timestamp)
  if (!date) return ''
  return format(date, formatStr)
}

export function formatRelative(timestamp: FirestoreTimestamp): string {
  const date = toDate(timestamp)
  if (!date) return ''

  if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`
  if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`
  if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`

  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatTimeAgo(timestamp: FirestoreTimestamp): string {
  const date = toDate(timestamp)
  if (!date) return ''
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatTime(timestamp: FirestoreTimestamp): string {
  const date = toDate(timestamp)
  if (!date) return ''
  return format(date, 'h:mm a')
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}s`
  if (secs === 0) return `${mins}m`
  return `${mins}m ${secs}s`
}

export function getDaysUntil(timestamp: FirestoreTimestamp): number {
  const date = toDate(timestamp)
  if (!date) return 0
  return differenceInDays(date, new Date())
}

export function getHoursUntil(timestamp: FirestoreTimestamp): number {
  const date = toDate(timestamp)
  if (!date) return 0
  return differenceInHours(date, new Date())
}

export function isOverdue(timestamp: FirestoreTimestamp): boolean {
  const date = toDate(timestamp)
  if (!date) return false
  return date < new Date()
}

export function isDueSoon(timestamp: FirestoreTimestamp, hoursThreshold: number = 24): boolean {
  const hours = getHoursUntil(timestamp)
  return hours > 0 && hours <= hoursThreshold
}
