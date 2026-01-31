import type { ScheduleSlot, Assignment } from '../types/schedule.types'
import { ASSIGNMENT_ROLE_LABELS } from '../types/schedule.types'

interface ICalEvent {
  uid: string
  title: string
  description?: string
  location?: string
  startDate: Date
  endDate: Date
}

/**
 * Escape special characters for iCal format
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Format date to iCal format (YYYYMMDDTHHMMSS)
 */
function formatICalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}T${hours}${minutes}${seconds}`
}

/**
 * Generate a unique ID for an event
 */
function generateUID(id: string): string {
  return `${id}@eastercamp.app`
}

/**
 * Create an iCal event string
 */
function createICalEvent(event: ICalEvent): string {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${generateUID(event.uid)}`,
    `DTSTAMP:${formatICalDate(new Date())}`,
    `DTSTART:${formatICalDate(event.startDate)}`,
    `DTEND:${formatICalDate(event.endDate)}`,
    `SUMMARY:${escapeICalText(event.title)}`
  ]

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICalText(event.description)}`)
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICalText(event.location)}`)
  }

  lines.push('END:VEVENT')
  return lines.join('\r\n')
}

/**
 * Generate iCal calendar file content
 */
export function generateICalendar(events: ICalEvent[], calendarName: string = 'EC Media Schedule'): string {
  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Eastercamp//Media Schedule//EN',
    `X-WR-CALNAME:${escapeICalText(calendarName)}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ].join('\r\n')

  const eventStrings = events.map(createICalEvent).join('\r\n')

  const footer = 'END:VCALENDAR'

  return `${header}\r\n${eventStrings}\r\n${footer}`
}

/**
 * Convert schedule slots to iCal events for a specific user
 */
export function convertSlotsToICalEvents(
  slots: ScheduleSlot[],
  userId: string,
  userName: string
): ICalEvent[] {
  const events: ICalEvent[] = []

  for (const slot of slots) {
    const userAssignment = slot.assignments.find(a => a.userId === userId)
    if (!userAssignment) continue

    const roleLabel = userAssignment.customRole ||
      ASSIGNMENT_ROLE_LABELS[userAssignment.role] ||
      userAssignment.role

    const startTime = slot.startTime as any
    const endTime = slot.endTime as any
    if (!startTime?.toDate || !endTime?.toDate) continue

    events.push({
      uid: `${slot.id}-${userId}`,
      title: `EC Media: ${slot.name} - ${roleLabel}`,
      description: [
        `Role: ${roleLabel}`,
        `Slot: ${slot.name}`,
        userAssignment.notes ? `Notes: ${userAssignment.notes}` : '',
        slot.notes ? `Slot Notes: ${slot.notes}` : ''
      ].filter(Boolean).join('\n'),
      startDate: startTime.toDate(),
      endDate: endTime.toDate()
    })
  }

  return events
}

/**
 * Convert demo slots to iCal events (for demo mode)
 */
export function convertDemoSlotsToICalEvents(
  demoSlots: { name: string; time: string; dayTag?: string; timeTag?: string }[],
  sectionName: string,
  baseDate: Date,
  assignments: { role: string }[]
): ICalEvent[] {
  const events: ICalEvent[] = []

  for (let i = 0; i < demoSlots.length; i++) {
    const slot = demoSlots[i]
    const assignment = assignments[i]
    if (!assignment) continue

    // Parse time string like "9:00 AM - 12:00 PM"
    const [startStr, endStr] = slot.time.split(' - ')
    const startDate = parseTimeString(startStr, baseDate)
    const endDate = endStr ? parseTimeString(endStr, baseDate) : new Date(startDate.getTime() + 3600000)

    const roleLabel = ASSIGNMENT_ROLE_LABELS[assignment.role as keyof typeof ASSIGNMENT_ROLE_LABELS] || assignment.role

    events.push({
      uid: `demo-${sectionName}-${i}`,
      title: `EC Media: ${slot.name} - ${roleLabel}`,
      description: `Role: ${roleLabel}\nDay: ${sectionName}`,
      startDate,
      endDate
    })
  }

  return events
}

/**
 * Parse a time string like "9:00 AM" into a Date
 */
function parseTimeString(timeStr: string, baseDate: Date): Date {
  const date = new Date(baseDate)

  if (timeStr === 'All Day' || timeStr === 'Scheduled') {
    date.setHours(9, 0, 0, 0)
    return date
  }

  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!match) {
    date.setHours(9, 0, 0, 0)
    return date
  }

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3]?.toUpperCase()

  if (period === 'PM' && hours !== 12) {
    hours += 12
  } else if (period === 'AM' && hours === 12) {
    hours = 0
  }

  date.setHours(hours, minutes, 0, 0)
  return date
}

/**
 * Download iCal file
 */
export function downloadICalFile(content: string, filename: string = 'ec-media-schedule.ics'): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
