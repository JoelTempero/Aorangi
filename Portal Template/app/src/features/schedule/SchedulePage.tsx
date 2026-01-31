import { useState, useMemo, useEffect } from 'react'
import { PageLayout } from '../../components/layout'
import { Card, Button, Badge, Avatar, Select, EmptyState, Modal, ModalFooter, Input } from '../../components/ui'
import { ExportButton } from '../../components/schedule/ExportButton'
import { PrintScheduleButton } from '../../components/schedule/PrintSchedule'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { useAppStore } from '../../stores/appStore'
import { firestoreService, orderBy } from '../../services/firestore.service'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle
} from 'lucide-react'
import type { AssignmentRole } from '../../types'
import { ASSIGNMENT_ROLE_LABELS } from '../../types'

// Schedule sections
const SCHEDULE_SECTIONS = [
  { id: 'pre_camp', name: 'Pre Camp', description: 'Before camp begins' },
  { id: 'thursday', name: 'Thursday', description: 'Day 1' },
  { id: 'friday', name: 'Friday', description: 'Day 2' },
  { id: 'saturday', name: 'Saturday', description: 'Day 3' },
  { id: 'sunday', name: 'Sunday', description: 'Day 4' },
  { id: 'monday', name: 'Monday', description: 'Day 5' },
  { id: 'post_camp', name: 'Post Camp', description: 'After camp ends' }
]

interface ScheduleSlotData {
  id: string
  sectionId: string
  name: string
  time: string
  // For pre/post camp - optional day and time info
  dayTag?: string
  timeTag?: string
  assignments: {
    id: string
    userId: string
    role: AssignmentRole
    customRole?: string
    confirmed: boolean
  }[]
  createdAt?: any
  updatedAt?: any
}

export function SchedulePage() {
  const { user, isAdmin } = useAuth()
  const { teamMembers } = useDataStore()
  const currentEvent = useAppStore((state) => state.currentEvent)
  const [selectedSection, setSelectedSection] = useState('friday')
  const [showAddSlot, setShowAddSlot] = useState(false)
  const [showAddAssignment, setShowAddAssignment] = useState<string | null>(null)
  const [editingSlot, setEditingSlot] = useState<ScheduleSlotData | null>(null)
  const [slots, setSlots] = useState<ScheduleSlotData[]>([])
  const [loading, setLoading] = useState(true)

  // Load slots from Firestore
  useEffect(() => {
    if (!currentEvent) {
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = firestoreService.subscribeToCollection<ScheduleSlotData>(
      `events/${currentEvent.id}/schedule`,
      [orderBy('createdAt', 'asc')],
      (data) => {
        setSlots(data)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentEvent])

  const currentSection = SCHEDULE_SECTIONS.find((s) => s.id === selectedSection)
  const currentSlots = slots.filter(s => s.sectionId === selectedSection)

  const handleDeleteSlot = async (slotId: string) => {
    if (!currentEvent) return

    try {
      await firestoreService.delete(`events/${currentEvent.id}/schedule`, slotId)
      toast.success('Slot deleted')
    } catch (error) {
      toast.error('Failed to delete slot')
    }
  }

  const handleAddSlot = async (data: { name: string; time?: string; dayTag?: string; timeTag?: string }) => {
    if (!currentEvent) return

    try {
      const slotData: Partial<ScheduleSlotData> = {
        sectionId: selectedSection,
        name: data.name,
        time: data.time || '',
        assignments: []
      }

      // Only add optional fields if they have values
      if (data.dayTag) slotData.dayTag = data.dayTag
      if (data.timeTag) slotData.timeTag = data.timeTag

      await firestoreService.create(`events/${currentEvent.id}/schedule`, slotData)
      toast.success('Slot added')
      setShowAddSlot(false)
    } catch (error) {
      console.error('Failed to add slot:', error)
      toast.error('Failed to add slot')
    }
  }

  const handleUpdateSlot = async (slotId: string, data: { name: string; time?: string; dayTag?: string; timeTag?: string }) => {
    if (!currentEvent) return

    try {
      const updateData: Record<string, any> = {
        name: data.name,
        time: data.time || ''
      }

      // Use null to clear fields, or set them if they have values
      updateData.dayTag = data.dayTag || null
      updateData.timeTag = data.timeTag || null

      await firestoreService.update(`events/${currentEvent.id}/schedule`, slotId, updateData)
      toast.success('Slot updated')
      setEditingSlot(null)
    } catch (error) {
      console.error('Failed to update slot:', error)
      toast.error('Failed to update slot')
    }
  }

  const handleAddAssignment = async (slotId: string, userId: string, role: AssignmentRole, customRole?: string) => {
    if (!currentEvent) return

    const slot = slots.find(s => s.id === slotId)
    if (!slot) return

    const newAssignment: {
      id: string
      userId: string
      role: AssignmentRole
      customRole?: string
      confirmed: boolean
    } = {
      id: crypto.randomUUID(),
      userId,
      role,
      confirmed: false
    }

    // Only add customRole field if it has a value
    if (role === 'custom' && customRole) {
      newAssignment.customRole = customRole
    }

    try {
      await firestoreService.update(`events/${currentEvent.id}/schedule`, slotId, {
        assignments: [...slot.assignments, newAssignment]
      })
      toast.success('Assignment added')
      setShowAddAssignment(null)
    } catch (error) {
      console.error('Failed to add assignment:', error)
      toast.error('Failed to add assignment')
    }
  }

  const handleConfirmAssignment = async (slotId: string, assignmentId: string) => {
    if (!currentEvent) return

    const slot = slots.find(s => s.id === slotId)
    if (!slot) return

    const updatedAssignments = slot.assignments.map(a =>
      a.id === assignmentId ? { ...a, confirmed: true } : a
    )

    try {
      await firestoreService.update(`events/${currentEvent.id}/schedule`, slotId, {
        assignments: updatedAssignments
      })
      toast.success('Assignment confirmed')
    } catch (error) {
      toast.error('Failed to confirm assignment')
    }
  }

  const handleRemoveAssignment = async (slotId: string, assignmentId: string) => {
    if (!currentEvent) return

    const slot = slots.find(s => s.id === slotId)
    if (!slot) return

    const updatedAssignments = slot.assignments.filter(a => a.id !== assignmentId)

    try {
      await firestoreService.update(`events/${currentEvent.id}/schedule`, slotId, {
        assignments: updatedAssignments
      })
      toast.success('Assignment removed')
    } catch (error) {
      toast.error('Failed to remove assignment')
    }
  }

  // Convert slots to format needed by export
  const slotsForExport = useMemo(() => {
    const result: Record<string, { name: string; time: string; dayTag?: string; timeTag?: string }[]> = {}
    SCHEDULE_SECTIONS.forEach(section => {
      result[section.id] = slots
        .filter(s => s.sectionId === section.id)
        .map(s => ({ name: s.name, time: s.time, dayTag: s.dayTag, timeTag: s.timeTag }))
    })
    return result
  }, [slots])

  // Get user's assignments
  const myAssignments = useMemo(() => {
    return currentSlots.flatMap(slot =>
      slot.assignments.filter(a => a.userId === user?.id)
    )
  }, [currentSlots, user?.id])

  if (!currentEvent) {
    return (
      <PageLayout title="Schedule" description="Crew assignments and timeslots">
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-surface-300" />
          <h3 className="text-lg font-semibold mb-2">No Event Selected</h3>
          <p className="text-surface-500">Create an event first to manage schedules.</p>
        </Card>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title="Schedule"
      description="Crew assignments and timeslots"
      action={
        <div className="flex items-center gap-2">
          <ExportButton
            demoSlots={slotsForExport}
            sections={SCHEDULE_SECTIONS}
            userName={user?.displayName}
          />
          <PrintScheduleButton
            sections={SCHEDULE_SECTIONS}
            slots={slotsForExport}
            teamMembers={teamMembers.map(m => ({ id: m.id, displayName: m.displayName }))}
          />
          {isAdmin && (
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddSlot(true)}>
              Add Slot
            </Button>
          )}
        </div>
      }
    >
      {/* Section Selector */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
          {SCHEDULE_SECTIONS.map((section) => {
            const isPrePost = section.id === 'pre_camp' || section.id === 'post_camp'
            const sectionSlotCount = slots.filter(s => s.sectionId === section.id).length
            return (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={cn(
                  'flex flex-col items-center px-4 py-2 rounded-lg transition-colors min-w-[90px] relative',
                  selectedSection === section.id
                    ? isPrePost
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                )}
              >
                <span className={cn(
                  'text-lg font-bold',
                  isPrePost && selectedSection !== section.id && 'text-amber-600 dark:text-amber-500'
                )}>
                  {section.name.split(' ')[0]}
                </span>
                {isPrePost && (
                  <span className="text-xs opacity-70">{section.name.split(' ')[1]}</span>
                )}
                {sectionSlotCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {sectionSlotCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {/* My Schedule Summary */}
      <Card className="mb-6 border-l-4 border-l-primary-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">My Shifts - {currentSection?.name}</h3>
            <p className="text-sm text-surface-500 mt-1">
              {myAssignments.length > 0
                ? `You have ${myAssignments.length} assignment(s)`
                : 'No shifts assigned yet'}
            </p>
          </div>
          {myAssignments.length === 0 && (
            <Badge variant="warning">Unassigned</Badge>
          )}
        </div>
      </Card>

      {/* Schedule Grid */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-pulse">Loading schedule...</div>
          </Card>
        ) : currentSlots.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Calendar className="h-8 w-8" />}
              title="No slots for this section"
              description={isAdmin ? "Add timeslots to start scheduling" : "Check back later for schedule updates"}
              action={
                isAdmin ? {
                  label: 'Add First Slot',
                  onClick: () => setShowAddSlot(true)
                } : undefined
              }
            />
          </Card>
        ) : (
          currentSlots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              teamMembers={teamMembers}
              canEdit={isAdmin}
              onAddAssignment={() => setShowAddAssignment(slot.id)}
              onEditSlot={() => setEditingSlot(slot)}
              onDeleteSlot={() => handleDeleteSlot(slot.id)}
              onConfirmAssignment={(assignmentId) => handleConfirmAssignment(slot.id, assignmentId)}
              onRemoveAssignment={(assignmentId) => handleRemoveAssignment(slot.id, assignmentId)}
            />
          ))
        )}
      </div>

      {/* Add Slot Modal */}
      <AddSlotModal
        open={showAddSlot}
        onClose={() => setShowAddSlot(false)}
        onSubmit={handleAddSlot}
        sectionId={selectedSection}
      />

      {/* Add Assignment Modal */}
      <AddAssignmentModal
        open={!!showAddAssignment}
        onClose={() => setShowAddAssignment(null)}
        teamMembers={teamMembers}
        onSubmit={(userId, role, customRole) => showAddAssignment && handleAddAssignment(showAddAssignment, userId, role, customRole)}
      />

      {/* Edit Slot Modal */}
      <EditSlotModal
        open={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        slot={editingSlot}
        onSubmit={(data) => editingSlot && handleUpdateSlot(editingSlot.id, data)}
      />
    </PageLayout>
  )
}

interface SlotCardProps {
  slot: ScheduleSlotData
  teamMembers: { id: string; displayName: string; photoURL?: string }[]
  canEdit: boolean
  onAddAssignment: () => void
  onEditSlot: () => void
  onDeleteSlot: () => void
  onConfirmAssignment: (assignmentId: string) => void
  onRemoveAssignment: (assignmentId: string) => void
}

function SlotCard({ slot, teamMembers, canEdit, onAddAssignment, onEditSlot, onDeleteSlot, onConfirmAssignment, onRemoveAssignment }: SlotCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="primary">
            {slot.name}
          </Badge>
          {slot.time && (
            <div className="flex items-center gap-1 text-sm text-surface-500">
              <Clock className="h-4 w-4" />
              {slot.time}
            </div>
          )}
          {/* Show day/time tags for pre/post camp slots */}
          {(slot.dayTag || slot.timeTag) && (
            <div className="flex items-center gap-2">
              {slot.dayTag && (
                <Badge variant="warning" size="sm">{slot.dayTag}</Badge>
              )}
              {slot.timeTag && (
                <Badge variant="default" size="sm">{slot.timeTag}</Badge>
              )}
            </div>
          )}
        </div>
        {canEdit && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" title="Edit slot" onClick={onEditSlot}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete slot" className="text-red-500 hover:text-red-600" onClick={onDeleteSlot}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {slot.assignments.map((assignment) => {
          const member = teamMembers.find((m) => m.id === assignment.userId)
          return (
            <div
              key={assignment.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg group relative',
                assignment.confirmed
                  ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                  : 'bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700'
              )}
            >
              <Avatar
                src={member?.photoURL}
                name={member?.displayName}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {member?.displayName || 'Unassigned'}
                </p>
                <p className="text-xs text-surface-500">
                  {assignment.role === 'custom' && assignment.customRole
                    ? assignment.customRole
                    : ASSIGNMENT_ROLE_LABELS[assignment.role] || assignment.role}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {assignment.confirmed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onConfirmAssignment(assignment.id)}
                  >
                    Confirm
                  </Button>
                )}
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                    onClick={() => onRemoveAssignment(assignment.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}

        {canEdit && (
          <button
            onClick={onAddAssignment}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors text-surface-400 hover:text-primary-600"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add Assignment</span>
          </button>
        )}
      </div>
    </Card>
  )
}

interface AddSlotModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; time?: string; dayTag?: string; timeTag?: string }) => void
  sectionId: string
}

function AddSlotModal({ open, onClose, onSubmit, sectionId }: AddSlotModalProps) {
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [dayTag, setDayTag] = useState('')
  const [timeTag, setTimeTag] = useState('')

  const isPrePostCamp = sectionId === 'pre_camp' || sectionId === 'post_camp'

  const handleSubmit = () => {
    if (!name) {
      toast.error('Please enter a slot name')
      return
    }
    // Time is required for regular camp days, optional for pre/post camp
    if (!isPrePostCamp && !time) {
      toast.error('Please enter a time')
      return
    }
    onSubmit({
      name,
      time: time || undefined,
      dayTag: dayTag || undefined,
      timeTag: timeTag || undefined
    })
    setName('')
    setTime('')
    setDayTag('')
    setTimeTag('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Time Slot">
      <div className="space-y-4">
        <Input
          label="Slot Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Big Top AM"
        />
        <Input
          label={isPrePostCamp ? "Time (optional)" : "Time"}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g., 9:00 AM - 12:00 PM"
        />
        {isPrePostCamp && (
          <>
            <Input
              label="Day Tag (optional)"
              value={dayTag}
              onChange={(e) => setDayTag(e.target.value)}
              placeholder="e.g., Monday, Tuesday"
              hint="Optional label for which day this is on"
            />
            <Input
              label="Time Tag (optional)"
              value={timeTag}
              onChange={(e) => setTimeTag(e.target.value)}
              placeholder="e.g., Morning, Afternoon"
              hint="Optional time of day label"
            />
          </>
        )}
      </div>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Slot</Button>
      </ModalFooter>
    </Modal>
  )
}

interface AddAssignmentModalProps {
  open: boolean
  onClose: () => void
  teamMembers: { id: string; displayName: string }[]
  onSubmit: (userId: string, role: AssignmentRole, customRole?: string) => void
}

function AddAssignmentModal({ open, onClose, teamMembers, onSubmit }: AddAssignmentModalProps) {
  const [selectedMember, setSelectedMember] = useState('')
  const [role, setRole] = useState<AssignmentRole>('chill_fill')
  const [customRole, setCustomRole] = useState('')

  const handleSubmit = () => {
    if (!selectedMember) {
      toast.error('Please select a team member')
      return
    }
    if (role === 'custom' && !customRole.trim()) {
      toast.error('Please enter a custom role name')
      return
    }
    onSubmit(selectedMember, role, customRole.trim() || undefined)
    setSelectedMember('')
    setRole('chill_fill')
    setCustomRole('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Assignment">
      <div className="space-y-4">
        <Select
          label="Team Member"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          options={[
            { value: '', label: 'Select a team member' },
            ...teamMembers.map((m) => ({ value: m.id, label: m.displayName }))
          ]}
        />
        <Select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as AssignmentRole)}
          options={[
            { value: 'shoot_highlights', label: 'Shoot Highlights' },
            { value: 'shoot_drone', label: 'Drone' },
            { value: 'shoot_timelapse', label: 'Timelapse' },
            { value: 'shoot_bts', label: 'BTS' },
            { value: 'edit_highlights', label: 'Edit Highlights' },
            { value: 'edit_news', label: 'Edit News' },
            { value: 'audio', label: 'Audio' },
            { value: 'presentation', label: 'Presentation' },
            { value: 'chill_fill', label: 'Chill / Fill' },
            { value: 'custom', label: 'Custom...' }
          ]}
        />
        {role === 'custom' && (
          <Input
            label="Custom Role"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="Enter custom role name"
          />
        )}
      </div>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Assignment</Button>
      </ModalFooter>
    </Modal>
  )
}

interface EditSlotModalProps {
  open: boolean
  onClose: () => void
  slot: ScheduleSlotData | null
  onSubmit: (data: { name: string; time?: string; dayTag?: string; timeTag?: string }) => void
}

function EditSlotModal({ open, onClose, slot, onSubmit }: EditSlotModalProps) {
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [dayTag, setDayTag] = useState('')
  const [timeTag, setTimeTag] = useState('')

  const isPrePostCamp = slot?.sectionId === 'pre_camp' || slot?.sectionId === 'post_camp'

  useEffect(() => {
    if (slot) {
      setName(slot.name)
      setTime(slot.time || '')
      setDayTag(slot.dayTag || '')
      setTimeTag(slot.timeTag || '')
    }
  }, [slot])

  const handleSubmit = () => {
    if (!name) {
      toast.error('Please enter a slot name')
      return
    }
    // Time is required for regular camp days, optional for pre/post camp
    if (!isPrePostCamp && !time) {
      toast.error('Please enter a time')
      return
    }
    onSubmit({
      name,
      time: time || undefined,
      dayTag: dayTag || undefined,
      timeTag: timeTag || undefined
    })
  }

  if (!slot) return null

  return (
    <Modal open={open} onClose={onClose} title="Edit Time Slot">
      <div className="space-y-4">
        <Input
          label="Slot Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Big Top AM"
        />
        <Input
          label={isPrePostCamp ? "Time (optional)" : "Time"}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g., 9:00 AM - 12:00 PM"
        />
        {isPrePostCamp && (
          <>
            <Input
              label="Day Tag (optional)"
              value={dayTag}
              onChange={(e) => setDayTag(e.target.value)}
              placeholder="e.g., Monday, Tuesday"
              hint="Optional label for which day this is on"
            />
            <Input
              label="Time Tag (optional)"
              value={timeTag}
              onChange={(e) => setTimeTag(e.target.value)}
              placeholder="e.g., Morning, Afternoon"
              hint="Optional time of day label"
            />
          </>
        )}
      </div>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </ModalFooter>
    </Modal>
  )
}
