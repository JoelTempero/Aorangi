import { useState } from 'react'
import { PageLayout } from '../../components/layout'
import { Card, Button, Badge, Avatar, Input, Select, EmptyState, Modal, ModalFooter, Textarea } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { firestoreService } from '../../services/firestore.service'
import { formatRelative } from '../../utils/date.utils'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Plus,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Search,
  Filter,
  Sparkles
} from 'lucide-react'
import type { Idea } from '../../types'
import { IDEA_STATUS_LABELS, IDEA_STATUS_COLORS, IDEA_CATEGORIES } from '../../types'

export function BrainstormPage() {
  const { user, isAdmin } = useAuth()
  const { ideas, teamMembers, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showNewModal, setShowNewModal] = useState(false)

  // Filter ideas
  const filteredIdeas = ideas.filter((idea) => {
    if (search && !idea.title.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter && idea.category !== categoryFilter) return false
    if (statusFilter && idea.status !== statusFilter) return false
    return true
  })

  // Sort by votes
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    const aScore = a.upvotes.length - a.downvotes.length
    const bScore = b.upvotes.length - b.downvotes.length
    return bScore - aScore
  })

  return (
    <PageLayout
      title="Brainstorm"
      description="Share and vote on ideas"
      action={
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowNewModal(true)}>
          New Idea
        </Button>
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...IDEA_CATEGORIES.map((cat) => ({ value: cat, label: cat }))
            ]}
            className="w-44"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              ...Object.entries(IDEA_STATUS_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-36"
          />
        </div>
      </Card>

      {/* Ideas Grid */}
      {sortedIdeas.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Lightbulb className="h-8 w-8" />}
            title="No ideas yet"
            description="Be the first to share an idea with the team"
            action={{ label: 'Share Idea', onClick: () => setShowNewModal(true) }}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              author={teamMembers.find((m) => m.id === idea.authorId)}
              currentUserId={user?.id}
              canModerate={isAdmin}
            />
          ))}
        </div>
      )}

      {/* New Idea Modal */}
      <NewIdeaModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
      />
    </PageLayout>
  )
}

interface IdeaCardProps {
  idea: Idea
  author?: { displayName: string; photoURL?: string }
  currentUserId?: string
  canModerate: boolean
}

function IdeaCard({ idea, author, currentUserId, canModerate }: IdeaCardProps) {
  const hasUpvoted = currentUserId ? idea.upvotes.includes(currentUserId) : false
  const hasDownvoted = currentUserId ? idea.downvotes.includes(currentUserId) : false
  const score = idea.upvotes.length - idea.downvotes.length

  const handleVote = async (type: 'up' | 'down') => {
    if (!currentUserId) return

    try {
      const updates: Partial<Idea> = {}

      if (type === 'up') {
        if (hasUpvoted) {
          updates.upvotes = idea.upvotes.filter((id) => id !== currentUserId)
        } else {
          updates.upvotes = [...idea.upvotes, currentUserId]
          if (hasDownvoted) {
            updates.downvotes = idea.downvotes.filter((id) => id !== currentUserId)
          }
        }
      } else {
        if (hasDownvoted) {
          updates.downvotes = idea.downvotes.filter((id) => id !== currentUserId)
        } else {
          updates.downvotes = [...idea.downvotes, currentUserId]
          if (hasUpvoted) {
            updates.upvotes = idea.upvotes.filter((id) => id !== currentUserId)
          }
        }
      }

      await firestoreService.update('ideas', idea.id, updates)
    } catch (error) {
      toast.error('Failed to vote')
    }
  }

  return (
    <Card className="hover:border-primary-200 dark:hover:border-primary-800 transition-all">
      <div className="flex gap-3">
        {/* Vote buttons */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleVote('up')}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              hasUpvoted
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400'
            )}
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <span className={cn(
            'text-sm font-bold',
            score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-surface-500'
          )}>
            {score}
          </span>
          <button
            onClick={() => handleVote('down')}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              hasDownvoted
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400'
            )}
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">
              {idea.title}
            </h3>
            <Badge className={IDEA_STATUS_COLORS[idea.status]} size="sm">
              {IDEA_STATUS_LABELS[idea.status]}
            </Badge>
          </div>

          <p className="text-sm text-surface-600 dark:text-surface-400 mt-2 line-clamp-3">
            {idea.description}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <Badge variant="default" size="sm">
              {idea.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-surface-500">
              <MessageCircle className="h-3 w-3" />
              {idea.comments.length}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100 dark:border-surface-800">
            <Avatar src={author?.photoURL} name={author?.displayName} size="xs" />
            <span className="text-xs text-surface-500">{author?.displayName}</span>
            <span className="text-xs text-surface-400 ml-auto">
              {formatRelative(idea.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface NewIdeaModalProps {
  open: boolean
  onClose: () => void
}

function NewIdeaModal({ open, onClose }: NewIdeaModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>(IDEA_CATEGORIES[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setLoading(true)
    try {
      await firestoreService.create('ideas', {
        title: title.trim(),
        description: description.trim(),
        category,
        authorId: user?.id,
        status: 'proposed',
        upvotes: [],
        downvotes: [],
        comments: []
      })
      toast.success('Idea submitted')
      onClose()
      setTitle('')
      setDescription('')
    } catch (error) {
      toast.error('Failed to submit idea')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Share an Idea" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your idea?"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your idea in detail..."
          rows={4}
          required
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={IDEA_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
        />

        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!title.trim() || !description.trim()}>
            Submit Idea
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
