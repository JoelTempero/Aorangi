import { useState } from 'react'
import { Download, Calendar, FileText } from 'lucide-react'
import { Button, Modal, ModalFooter } from '../ui'
import { generateICalendar, convertDemoSlotsToICalEvents, downloadICalFile } from '../../utils/ical.utils'
import toast from 'react-hot-toast'

interface ExportButtonProps {
  demoSlots: Record<string, { name: string; time: string; dayTag?: string; timeTag?: string }[]>
  sections: { id: string; name: string }[]
  userAssignments?: { sectionId: string; slotIndex: number; role: string }[]
  userName?: string
}

export function ExportButton({ demoSlots, sections, userAssignments = [], userName = 'Team Member' }: ExportButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [exportType, setExportType] = useState<'all' | 'my'>('my')

  const handleExport = () => {
    // For demo, we'll create a sample schedule based on the current date
    const baseDate = new Date()
    // Find the next Thursday as camp start
    const dayOfWeek = baseDate.getDay()
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7
    baseDate.setDate(baseDate.getDate() + daysUntilThursday)

    const allEvents: ReturnType<typeof convertDemoSlotsToICalEvents> = []

    // Map sections to dates
    const sectionDates: Record<string, Date> = {
      pre_camp: new Date(baseDate.getTime() - 86400000), // Day before
      thursday: baseDate,
      friday: new Date(baseDate.getTime() + 86400000),
      saturday: new Date(baseDate.getTime() + 86400000 * 2),
      sunday: new Date(baseDate.getTime() + 86400000 * 3),
      monday: new Date(baseDate.getTime() + 86400000 * 4),
      post_camp: new Date(baseDate.getTime() + 86400000 * 5)
    }

    for (const section of sections) {
      const slots = demoSlots[section.id]
      if (!slots) continue

      const sectionDate = sectionDates[section.id] || baseDate

      if (exportType === 'my') {
        // Export only user's assignments
        const mySlotAssignments = userAssignments
          .filter(a => a.sectionId === section.id)
          .map(a => {
            const slot = slots[a.slotIndex]
            return slot ? { role: a.role } : null
          })
          .filter(Boolean) as { role: string }[]

        if (mySlotAssignments.length > 0) {
          const events = convertDemoSlotsToICalEvents(
            slots.filter((_, i) => userAssignments.some(a => a.sectionId === section.id && a.slotIndex === i)),
            section.name,
            sectionDate,
            mySlotAssignments
          )
          allEvents.push(...events)
        }
      } else {
        // Export all slots with demo assignments
        const demoAssignments = slots.map(() => ({ role: 'shoot_highlights' }))
        const events = convertDemoSlotsToICalEvents(slots, section.name, sectionDate, demoAssignments)
        allEvents.push(...events)
      }
    }

    if (allEvents.length === 0) {
      toast.error('No schedule events to export')
      setShowModal(false)
      return
    }

    const calendarName = exportType === 'my' ? `EC Media - ${userName}` : 'EC Media Schedule'
    const content = generateICalendar(allEvents, calendarName)
    const filename = exportType === 'my' ? 'my-ec-schedule.ics' : 'ec-media-schedule.ics'

    downloadICalFile(content, filename)
    toast.success('Schedule exported successfully!')
    setShowModal(false)
  }

  return (
    <>
      <Button
        variant="outline"
        leftIcon={<Download className="h-4 w-4" />}
        onClick={() => setShowModal(true)}
      >
        Export
      </Button>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Export Schedule">
        <div className="space-y-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Export your schedule as an iCal file to import into Google Calendar, Apple Calendar, or Outlook.
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 dark:border-surface-700 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800">
              <input
                type="radio"
                name="exportType"
                value="my"
                checked={exportType === 'my'}
                onChange={() => setExportType('my')}
                className="text-primary-600"
              />
              <Calendar className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-sm">My Schedule Only</p>
                <p className="text-xs text-surface-500">Export only your assigned shifts</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 dark:border-surface-700 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800">
              <input
                type="radio"
                name="exportType"
                value="all"
                checked={exportType === 'all'}
                onChange={() => setExportType('all')}
                className="text-primary-600"
              />
              <FileText className="h-5 w-5 text-surface-500" />
              <div>
                <p className="font-medium text-sm">Full Schedule</p>
                <p className="text-xs text-surface-500">Export all slots for reference</p>
              </div>
            </label>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button leftIcon={<Download className="h-4 w-4" />} onClick={handleExport}>
            Download .ics
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
