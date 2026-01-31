import { useState, useMemo, useEffect } from 'react'
import { PageLayout } from '../../components/layout'
import { Card, Button, Badge, Input, EmptyState, Modal, ModalFooter, Textarea, Select } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { firestoreService } from '../../services/firestore.service'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Edit2
} from 'lucide-react'
import type { FAQ } from '../../types'
import { FAQ_CATEGORIES } from '../../types'

export function FAQsPage() {
  const { user, isAdmin } = useAuth()
  const { faqs, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      if (search) {
        const searchLower = search.toLowerCase()
        if (!faq.question.toLowerCase().includes(searchLower) &&
            !faq.answer.toLowerCase().includes(searchLower)) {
          return false
        }
      }
      if (categoryFilter && faq.category !== categoryFilter) return false
      return true
    })
  }, [faqs, search, categoryFilter])

  // Group by category
  const faqsByCategory = useMemo(() => {
    if (categoryFilter) return null
    const groups: Record<string, FAQ[]> = {}
    filteredFaqs.forEach((faq) => {
      if (!groups[faq.category]) groups[faq.category] = []
      groups[faq.category].push(faq)
    })
    return groups
  }, [filteredFaqs, categoryFilter])

  return (
    <PageLayout
      title="FAQs & Knowledge Base"
      description="Find answers to common questions"
      action={
        (isAdmin) && (
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowNewModal(true)}>
            Add FAQ
          </Button>
        )
      }
    >
      {/* Search */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search FAQs..."
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
              ...FAQ_CATEGORIES.map((cat) => ({ value: cat, label: cat }))
            ]}
            className="w-40"
          />
        </div>
      </Card>

      {/* FAQs */}
      {filteredFaqs.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HelpCircle className="h-8 w-8" />}
            title="No FAQs found"
            description={search ? 'Try a different search term' : 'Add FAQs to help your team'}
            action={
              (isAdmin)
                ? { label: 'Add FAQ', onClick: () => setShowNewModal(true) }
                : undefined
            }
          />
        </Card>
      ) : faqsByCategory ? (
        // Grouped view
        <div className="space-y-8">
          {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary-600" />
                {category}
                <Badge variant="default">{categoryFaqs.length}</Badge>
              </h2>
              <div className="space-y-2">
                {categoryFaqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    expanded={expandedId === faq.id}
                    onToggle={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    canEdit={isAdmin}
                    onEdit={() => setEditingFaq(faq)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Filtered view
        <div className="space-y-2">
          {filteredFaqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              expanded={expandedId === faq.id}
              onToggle={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              canEdit={isAdmin}
              onEdit={() => setEditingFaq(faq)}
            />
          ))}
        </div>
      )}

      {/* New FAQ Modal */}
      <NewFAQModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
      />

      {/* Edit FAQ Modal */}
      <EditFAQModal
        open={!!editingFaq}
        onClose={() => setEditingFaq(null)}
        faq={editingFaq}
      />
    </PageLayout>
  )
}

interface FAQItemProps {
  faq: FAQ
  expanded: boolean
  onToggle: () => void
  canEdit: boolean
  onEdit: () => void
}

function FAQItem({ faq, expanded, onToggle, canEdit, onEdit }: FAQItemProps) {
  const handleHelpful = async (helpful: boolean) => {
    try {
      await firestoreService.update('faqs', faq.id, {
        [helpful ? 'helpful' : 'notHelpful']: (helpful ? faq.helpful : faq.notHelpful) + 1
      })
    } catch (error) {
      toast.error('Failed to record feedback')
    }
  }

  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="font-medium text-surface-900 dark:text-surface-100 pr-4">
          {faq.question}
        </h3>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-surface-400 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-surface-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-surface-700 dark:text-surface-300">
              {faq.answer}
            </p>
          </div>

          {faq.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {faq.tags.map((tag) => (
                <Badge key={tag} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
            <div className="flex items-center gap-4">
              <span className="text-sm text-surface-500">Was this helpful?</span>
              <button
                onClick={() => handleHelpful(true)}
                className="flex items-center gap-1 text-sm text-surface-500 hover:text-green-600"
              >
                <ThumbsUp className="h-4 w-4" />
                {faq.helpful}
              </button>
              <button
                onClick={() => handleHelpful(false)}
                className="flex items-center gap-1 text-sm text-surface-500 hover:text-red-600"
              >
                <ThumbsDown className="h-4 w-4" />
                {faq.notHelpful}
              </button>
            </div>

            {canEdit && (
              <Button variant="ghost" size="sm" leftIcon={<Edit2 className="h-3 w-3" />} onClick={onEdit}>
                Edit
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

interface NewFAQModalProps {
  open: boolean
  onClose: () => void
}

function NewFAQModal({ open, onClose }: NewFAQModalProps) {
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState<string>(FAQ_CATEGORIES[0])
  const [tags, setTags] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !answer.trim()) return

    setLoading(true)
    try {
      // Get max order
      const existingFaqs = useDataStore.getState().faqs
      const maxOrder = Math.max(0, ...existingFaqs.map((f) => f.order))

      await firestoreService.create('faqs', {
        question: question.trim(),
        answer: answer.trim(),
        category,
        order: maxOrder + 1,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        helpful: 0,
        notHelpful: 0
      })
      toast.success('FAQ added')
      onClose()
      setQuestion('')
      setAnswer('')
      setTags('')
    } catch (error) {
      toast.error('Failed to add FAQ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add FAQ" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What's the question?"
          required
        />

        <Textarea
          label="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Provide a helpful answer..."
          rows={6}
          required
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={FAQ_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
        />

        <Input
          label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags separated by commas"
          hint="e.g., equipment, setup, editing"
        />

        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!question.trim() || !answer.trim()}>
            Add FAQ
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

interface EditFAQModalProps {
  open: boolean
  onClose: () => void
  faq: FAQ | null
}

function EditFAQModal({ open, onClose, faq }: EditFAQModalProps) {
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState<string>(FAQ_CATEGORIES[0])
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question)
      setAnswer(faq.answer)
      setCategory(faq.category)
      setTags(faq.tags.join(', '))
    }
  }, [faq])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !answer.trim() || !faq) return

    setLoading(true)
    try {
      await firestoreService.update('faqs', faq.id, {
        question: question.trim(),
        answer: answer.trim(),
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean)
      })
      toast.success('FAQ updated')
      onClose()
    } catch (error) {
      toast.error('Failed to update FAQ')
    } finally {
      setLoading(false)
    }
  }

  if (!faq) return null

  return (
    <Modal open={open} onClose={onClose} title="Edit FAQ" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What's the question?"
          required
        />

        <Textarea
          label="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Provide a helpful answer..."
          rows={6}
          required
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={FAQ_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
        />

        <Input
          label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags separated by commas"
          hint="e.g., equipment, setup, editing"
        />

        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!question.trim() || !answer.trim()}>
            Save Changes
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
