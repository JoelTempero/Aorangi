import { useState, useEffect } from 'react'
import { PageLayout } from '../../components/layout'
import { Card, Button, Badge, Avatar, Input, Select, EmptyState, Modal, ModalFooter, Textarea, Checkbox } from '../../components/ui'
import { ReadReceiptsDashboard } from '../../components/comms'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { firestoreService } from '../../services/firestore.service'
import { formatRelative } from '../../utils/date.utils'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Plus,
  Bell,
  Pin,
  AlertTriangle,
  Users,
  CheckCircle,
  MessageCircle,
  ThumbsUp,
  Search,
  Eye
} from 'lucide-react'
import type { Announcement, AnnouncementPriority, AnnouncementTarget } from '../../types'
import { ANNOUNCEMENT_PRIORITY_LABELS, ANNOUNCEMENT_PRIORITY_COLORS, TEAM_LABELS } from '../../types'

export function AnnouncementsPage() {
  const { user, isAdmin } = useAuth()
  const { announcements, teamMembers, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  // Filter announcements
  const filteredAnnouncements = announcements.filter((a) => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    if (priorityFilter && a.priority !== priorityFilter) return false
    return true
  })

  // Pinned announcements
  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.pinned)
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.pinned)

  return (
    <PageLayout
      title="Announcements"
      description="Team updates and important information"
      action={
        (isAdmin) && (
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowNewModal(true)}>
            New Announcement
          </Button>
        )
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { value: '', label: 'All Priorities' },
              ...Object.entries(ANNOUNCEMENT_PRIORITY_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-36"
          />
        </div>
      </Card>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Pin className="h-4 w-4" />
            Pinned
          </h2>
          <div className="space-y-4">
            {pinnedAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                author={teamMembers.find((m) => m.id === announcement.authorId)}
                currentUserId={user?.id}
                isAdmin={isAdmin}
                teamMemberCount={teamMembers.length}
                onViewReads={() => setSelectedAnnouncement(announcement)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      {regularAnnouncements.length === 0 && pinnedAnnouncements.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bell className="h-8 w-8" />}
            title="No announcements"
            description="Be the first to share something with the team"
            action={
              (isAdmin)
                ? { label: 'New Announcement', onClick: () => setShowNewModal(true) }
                : undefined
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {regularAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              author={teamMembers.find((m) => m.id === announcement.authorId)}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              teamMemberCount={teamMembers.length}
              onViewReads={() => setSelectedAnnouncement(announcement)}
            />
          ))}
        </div>
      )}

      {/* New Announcement Modal */}
      <NewAnnouncementModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        teamMembers={teamMembers}
      />

      {/* Read Receipts Dashboard */}
      <ReadReceiptsDashboard
        open={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={selectedAnnouncement}
        teamMembers={teamMembers}
      />
    </PageLayout>
  )
}

interface AnnouncementCardProps {
  announcement: Announcement
  author?: { displayName: string; photoURL?: string }
  currentUserId?: string
  isAdmin?: boolean
  teamMemberCount: number
  onViewReads: () => void
}

function AnnouncementCard({ announcement, author, currentUserId, isAdmin, teamMemberCount, onViewReads }: AnnouncementCardProps) {
  const readBy = announcement.readBy || []
  const isRead = currentUserId ? readBy.includes(currentUserId) : false
  const hasConfirmed = currentUserId ? announcement.confirmedBy.includes(currentUserId) : false

  // Mark as read when the card is viewed
  useEffect(() => {
    if (currentUserId && !isRead) {
      // Mark as read after a short delay (to ensure it's actually viewed)
      const timeout = setTimeout(async () => {
        try {
          await firestoreService.update('announcements', announcement.id, {
            readBy: [...readBy, currentUserId]
          })
        } catch (error) {
          // Silently fail - not critical
          console.error('Failed to mark as read:', error)
        }
      }, 1000) // 1 second delay

      return () => clearTimeout(timeout)
    }
  }, [announcement.id, currentUserId, isRead, readBy])

  const handleConfirm = async () => {
    if (!currentUserId || hasConfirmed) return
    try {
      await firestoreService.update('announcements', announcement.id, {
        confirmedBy: [...announcement.confirmedBy, currentUserId]
      })
      toast.success('Confirmed')
    } catch (error) {
      toast.error('Failed to confirm')
    }
  }

  return (
    <Card
      className={cn(
        'transition-all',
        announcement.pinned && 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10',
        announcement.priority === 'urgent' && 'border-red-200 dark:border-red-800'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'p-2 rounded-lg shrink-0',
          announcement.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
          announcement.priority === 'important' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
          'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
        )}>
          {announcement.priority === 'urgent' ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                {announcement.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Avatar src={author?.photoURL} name={author?.displayName} size="xs" />
                <span className="text-sm text-surface-500">{author?.displayName}</span>
                <span className="text-sm text-surface-400">
                  {formatRelative(announcement.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {announcement.pinned && (
                <Badge variant="primary" size="sm">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
              <Badge className={ANNOUNCEMENT_PRIORITY_COLORS[announcement.priority]}>
                {ANNOUNCEMENT_PRIORITY_LABELS[announcement.priority]}
              </Badge>
            </div>
          </div>

          <p className="mt-3 text-surface-700 dark:text-surface-300 whitespace-pre-wrap">
            {announcement.content}
          </p>

          {/* Targets */}
          {announcement.targets.length > 0 && !announcement.targets.includes('all') && (
            <div className="flex items-center gap-2 mt-3">
              <Users className="h-4 w-4 text-surface-400" />
              <div className="flex gap-1">
                {announcement.targets.map((target) => (
                  <Badge key={target} variant="default" size="sm">
                    {target === 'all' ? 'Everyone' : TEAM_LABELS[target as keyof typeof TEAM_LABELS]}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
            {announcement.requiresConfirmation && (
              <Button
                variant={hasConfirmed ? 'secondary' : 'primary'}
                size="sm"
                leftIcon={<CheckCircle className="h-4 w-4" />}
                onClick={handleConfirm}
                disabled={hasConfirmed}
              >
                {hasConfirmed ? 'Confirmed' : 'Confirm'}
              </Button>
            )}

            {announcement.requiresConfirmation && (
              <span className="text-sm text-surface-500">
                {announcement.confirmedBy.length} confirmed
              </span>
            )}

            {/* Read count & View reads button */}
            {isAdmin && (
              <button
                onClick={onViewReads}
                className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>{announcement.readBy?.length || 0}/{teamMemberCount} read</span>
              </button>
            )}

            {/* Reactions */}
            <div className="flex items-center gap-2 ml-auto">
              {Object.entries(announcement.reactions).map(([emoji, users]) => (
                <button
                  key={emoji}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-sm"
                >
                  <span>{emoji}</span>
                  <span className="text-surface-500">{users.length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface NewAnnouncementModalProps {
  open: boolean
  onClose: () => void
  teamMembers: { id: string; displayName: string }[]
}

function NewAnnouncementModal({ open, onClose, teamMembers }: NewAnnouncementModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState<AnnouncementPriority>('normal')
  const [targets, setTargets] = useState<AnnouncementTarget[]>(['all'])
  const [requiresConfirmation, setRequiresConfirmation] = useState(false)
  const [pinned, setPinned] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    try {
      await firestoreService.create('announcements', {
        title: title.trim(),
        content: content.trim(),
        priority,
        targets,
        mentions: [],
        authorId: user?.id,
        pinned,
        requiresConfirmation,
        confirmedBy: [],
        reactions: {},
        readBy: []
      })
      toast.success('Announcement posted')
      onClose()
      setTitle('')
      setContent('')
      setPriority('normal')
      setRequiresConfirmation(false)
      setPinned(false)
    } catch (error) {
      toast.error('Failed to post announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Announcement" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement title"
          required
        />

        <Textarea
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to share?"
          rows={4}
          required
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
          options={Object.entries(ANNOUNCEMENT_PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
        />

        <div className="space-y-3">
          <Checkbox
            label="Require confirmation"
            description="Team members will need to confirm they've read this"
            checked={requiresConfirmation}
            onChange={(e) => setRequiresConfirmation(e.target.checked)}
          />

          <Checkbox
            label="Pin announcement"
            description="Keep this at the top of the feed"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
          />
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!title.trim() || !content.trim()}>
            Post Announcement
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
