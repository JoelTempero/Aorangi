import { useState, useMemo } from 'react'
import { PageLayout } from '../../components/layout'
import { Card, Button, Badge, Avatar, Input, Select, EmptyState, Modal, ModalFooter, Textarea } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { useAppStore } from '../../stores/appStore'
import { firestoreService } from '../../services/firestore.service'
import { formatRelative, formatDuration } from '../../utils/date.utils'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  Film,
  Image,
  Clock,
  User,
  Instagram,
  Monitor,
  Play,
  CheckCircle,
  Filter,
  Edit2,
  ExternalLink,
  Trash2
} from 'lucide-react'
import type { ContentItem, ContentType, ContentStatus, ContentPlatform } from '../../types'
import {
  CONTENT_TYPE_LABELS,
  CONTENT_TYPE_COLORS,
  CONTENT_STATUS_LABELS,
  CONTENT_STATUS_COLORS,
  CONTENT_PLATFORM_LABELS
} from '../../types'

export function ContentPage() {
  const { user, isAdmin } = useAuth()
  const currentEvent = useAppStore((state) => state.currentEvent)
  const { content, teamMembers, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [platformFilter, setPlatformFilter] = useState<string>('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)

  // Filter content
  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter && item.type !== typeFilter) return false
      if (statusFilter && item.status !== statusFilter) return false
      if (platformFilter && item.platform !== platformFilter && item.platform !== 'both') return false
      return true
    })
  }, [content, search, typeFilter, statusFilter, platformFilter])

  // Stats
  const stats = {
    total: content.length,
    posted: content.filter((c) => c.status === 'posted').length,
    inProgress: content.filter((c) => ['shooting', 'editing', 'review'].includes(c.status)).length,
    totalDuration: content.reduce((sum, c) => sum + (c.actualDuration || c.targetDuration), 0)
  }

  return (
    <PageLayout
      title="Content Pipeline"
      description="Track and manage all content production"
      action={
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowNewModal(true)}>
          New Content
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Film className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-surface-500">Total Items</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Play className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-xs text-surface-500">In Progress</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.posted}</p>
              <p className="text-xs text-surface-500">Posted</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</p>
              <p className="text-xs text-surface-500">Total Duration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: '', label: 'All Types' },
              ...Object.entries(CONTENT_TYPE_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-36"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              ...Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-36"
          />
          <Select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            options={[
              { value: '', label: 'All Platforms' },
              ...Object.entries(CONTENT_PLATFORM_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-36"
          />
        </div>
      </Card>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Film className="h-8 w-8" />}
            title="No content found"
            description="Create new content items to track production"
            action={{ label: 'New Content', onClick: () => setShowNewModal(true) }}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              teamMembers={teamMembers}
              onEdit={() => setEditingContent(item)}
            />
          ))}
        </div>
      )}

      {/* New Content Modal */}
      <NewContentModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        teamMembers={teamMembers}
      />

      {/* Edit Content Modal */}
      <EditContentModal
        open={!!editingContent}
        onClose={() => setEditingContent(null)}
        content={editingContent}
        teamMembers={teamMembers}
      />
    </PageLayout>
  )
}

interface ContentCardProps {
  item: ContentItem
  teamMembers: { id: string; displayName: string; photoURL?: string }[]
  onEdit: () => void
}

function ContentCard({ item, teamMembers, onEdit }: ContentCardProps) {
  const shooter = teamMembers.find((m) => m.id === item.assignedShooter)
  const editor = teamMembers.find((m) => m.id === item.assignedEditor)

  return (
    <Card className="hover:border-primary-200 dark:hover:border-primary-800 transition-all hover:shadow-md cursor-pointer" onClick={onEdit}>
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-surface-100 dark:bg-surface-800 rounded-lg mb-3 flex items-center justify-center">
        {item.platform === 'instagram' ? (
          <Instagram className="h-8 w-8 text-surface-400" />
        ) : (
          <Monitor className="h-8 w-8 text-surface-400" />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-medium text-surface-900 dark:text-surface-100 line-clamp-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-surface-500 line-clamp-2 mt-1">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge className={CONTENT_TYPE_COLORS[item.type]}>
            {CONTENT_TYPE_LABELS[item.type]}
          </Badge>
          <Badge className={CONTENT_STATUS_COLORS[item.status]}>
            {CONTENT_STATUS_LABELS[item.status]}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-surface-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(item.targetDuration)}
          </div>
          <div className="flex items-center gap-1">
            {item.platform === 'instagram' && <Instagram className="h-3 w-3" />}
            {item.platform === 'bigtop' && <Monitor className="h-3 w-3" />}
            {item.platform === 'both' && (
              <>
                <Instagram className="h-3 w-3" />
                <Monitor className="h-3 w-3" />
              </>
            )}
            {CONTENT_PLATFORM_LABELS[item.platform]}
          </div>
        </div>

        {(shooter || editor) && (
          <div className="flex items-center gap-2 pt-2 border-t border-surface-100 dark:border-surface-800">
            {shooter && (
              <div className="flex items-center gap-1" title="Shooter">
                <Avatar src={shooter.photoURL} name={shooter.displayName} size="xs" />
              </div>
            )}
            {editor && (
              <div className="flex items-center gap-1" title="Editor">
                <Avatar src={editor.photoURL} name={editor.displayName} size="xs" />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

interface NewContentModalProps {
  open: boolean
  onClose: () => void
  teamMembers: { id: string; displayName: string }[]
}

function NewContentModal({ open, onClose, teamMembers }: NewContentModalProps) {
  const { user } = useAuth()
  const currentEvent = useAppStore((state) => state.currentEvent)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ContentType>('reel')
  const [platform, setPlatform] = useState<ContentPlatform>('instagram')
  const [targetDuration, setTargetDuration] = useState('60')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !currentEvent) return

    setLoading(true)
    try {
      await firestoreService.createInNested('events', currentEvent.id, 'content', {
        eventId: currentEvent.id,
        title: title.trim(),
        description,
        type,
        platform,
        status: 'planning' as ContentStatus,
        targetDuration: parseInt(targetDuration) || 60,
        assetLinks: [],
        notes: '',
        tags: [],
        createdBy: user?.id
      })
      toast.success('Content created')
      onClose()
      setTitle('')
      setDescription('')
    } catch (error) {
      toast.error('Failed to create content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Content" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Friday Highlights Reel"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this content about?"
          rows={2}
        />

        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
            options={Object.entries(CONTENT_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <Select
            label="Platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as ContentPlatform)}
            options={Object.entries(CONTENT_PLATFORM_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <Input
            label="Duration (sec)"
            type="number"
            value={targetDuration}
            onChange={(e) => setTargetDuration(e.target.value)}
            placeholder="60"
          />
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!title.trim()}>
            Create Content
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

interface EditContentModalProps {
  open: boolean
  onClose: () => void
  content: ContentItem | null
  teamMembers: { id: string; displayName: string }[]
}

function EditContentModal({ open, onClose, content, teamMembers }: EditContentModalProps) {
  const currentEvent = useAppStore((state) => state.currentEvent)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ContentType>('reel')
  const [platform, setPlatform] = useState<ContentPlatform>('instagram')
  const [status, setStatus] = useState<ContentStatus>('planning')
  const [targetDuration, setTargetDuration] = useState('60')
  const [assignedShooter, setAssignedShooter] = useState('')
  const [assignedEditor, setAssignedEditor] = useState('')
  const [assetLink, setAssetLink] = useState('')
  const [notes, setNotes] = useState('')

  // Reset form when content changes
  useState(() => {
    if (content) {
      setTitle(content.title)
      setDescription(content.description || '')
      setType(content.type)
      setPlatform(content.platform)
      setStatus(content.status)
      setTargetDuration(String(content.targetDuration))
      setAssignedShooter(content.assignedShooter || '')
      setAssignedEditor(content.assignedEditor || '')
      setAssetLink(content.assetLinks?.[0] || '')
      setNotes(content.notes || '')
    }
  })

  // Update fields when content changes
  useMemo(() => {
    if (content) {
      setTitle(content.title)
      setDescription(content.description || '')
      setType(content.type)
      setPlatform(content.platform)
      setStatus(content.status)
      setTargetDuration(String(content.targetDuration))
      setAssignedShooter(content.assignedShooter || '')
      setAssignedEditor(content.assignedEditor || '')
      setAssetLink(content.assetLinks?.[0] || '')
      setNotes(content.notes || '')
    }
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !currentEvent || !content) return

    setLoading(true)
    try {
      await firestoreService.update(`events/${currentEvent.id}/content`, content.id, {
        title: title.trim(),
        description,
        type,
        platform,
        status,
        targetDuration: parseInt(targetDuration) || 60,
        assignedShooter: assignedShooter || null,
        assignedEditor: assignedEditor || null,
        assetLinks: assetLink ? [assetLink] : [],
        notes
      })
      toast.success('Content updated')
      onClose()
    } catch (error) {
      toast.error('Failed to update content')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentEvent || !content) return
    if (!confirm('Are you sure you want to delete this content?')) return

    setLoading(true)
    try {
      await firestoreService.delete(`events/${currentEvent.id}/content`, content.id)
      toast.success('Content deleted')
      onClose()
    } catch (error) {
      toast.error('Failed to delete content')
    } finally {
      setLoading(false)
    }
  }

  if (!content) return null

  return (
    <Modal open={open} onClose={onClose} title="Edit Content" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Friday Highlights Reel"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this content about?"
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
            options={Object.entries(CONTENT_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <Select
            label="Platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as ContentPlatform)}
            options={Object.entries(CONTENT_PLATFORM_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ContentStatus)}
            options={Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <Input
            label="Duration (sec)"
            type="number"
            value={targetDuration}
            onChange={(e) => setTargetDuration(e.target.value)}
            placeholder="60"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Assigned Shooter"
            value={assignedShooter}
            onChange={(e) => setAssignedShooter(e.target.value)}
            options={[
              { value: '', label: 'Not assigned' },
              ...teamMembers.map((m) => ({ value: m.id, label: m.displayName }))
            ]}
          />

          <Select
            label="Assigned Editor"
            value={assignedEditor}
            onChange={(e) => setAssignedEditor(e.target.value)}
            options={[
              { value: '', label: 'Not assigned' },
              ...teamMembers.map((m) => ({ value: m.id, label: m.displayName }))
            ]}
          />
        </div>

        <Input
          label="Asset Link"
          value={assetLink}
          onChange={(e) => setAssetLink(e.target.value)}
          placeholder="https://drive.google.com/... or other link"
        />

        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
          rows={2}
        />

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
