import { useState, useEffect } from 'react'
import { PageLayout, PageSection } from '../../components/layout'
import { Card, CardHeader, Button, Input, Modal, ModalFooter, EmptyState, Textarea } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Plus,
  ExternalLink,
  Copy,
  FileText,
  Link as LinkIcon,
  Trash2,
  Edit2,
  FolderOpen
} from 'lucide-react'

interface QuickAccessItem {
  id: string
  type: 'link' | 'text'
  label: string
  content: string
  category?: string
}

// Load quick access items from localStorage
function loadQuickAccessItems(): QuickAccessItem[] {
  try {
    const saved = localStorage.getItem('ec-quick-access')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Save quick access items to localStorage
function saveQuickAccessItems(items: QuickAccessItem[]) {
  localStorage.setItem('ec-quick-access', JSON.stringify(items))
}

const CATEGORIES = ['General', 'Social Media', 'Equipment', 'Contacts', 'Documents', 'Other']

export function HelpfulStuffPage() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState<QuickAccessItem[]>(loadQuickAccessItems)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<QuickAccessItem | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const handleAdd = (item: Omit<QuickAccessItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() }
    const updated = [...items, newItem]
    setItems(updated)
    saveQuickAccessItems(updated)
    setShowAddModal(false)
  }

  const handleUpdate = (id: string, item: Omit<QuickAccessItem, 'id'>) => {
    const updated = items.map(i => i.id === id ? { ...item, id } : i)
    setItems(updated)
    saveQuickAccessItems(updated)
    setEditingItem(null)
  }

  const handleRemove = (id: string) => {
    const updated = items.filter(item => item.id !== id)
    setItems(updated)
    saveQuickAccessItems(updated)
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, QuickAccessItem[]>)

  const filteredCategories = categoryFilter
    ? { [categoryFilter]: groupedItems[categoryFilter] || [] }
    : groupedItems

  return (
    <PageLayout
      title="Helpful Stuff"
      description="Quick access to important links and information"
      action={
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
          Add Item
        </Button>
      }
    >
      {/* Category Filter */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('')}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm transition-colors',
              !categoryFilter
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200'
            )}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm transition-colors',
                categoryFilter === cat
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Items */}
      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FolderOpen className="h-8 w-8" />}
            title="No items yet"
            description="Add links, text snippets, or other helpful information"
            action={{ label: 'Add First Item', onClick: () => setShowAddModal(true) }}
          />
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(filteredCategories).map(([category, categoryItems]) => (
            categoryItems.length > 0 && (
              <div key={category}>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary-600" />
                  {category}
                  <span className="text-sm font-normal text-surface-500">({categoryItems.length})</span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryItems.map((item) => (
                    <Card key={item.id} className="group hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {item.type === 'link' ? (
                            <LinkIcon className="h-5 w-5 text-primary-500 shrink-0" />
                          ) : (
                            <FileText className="h-5 w-5 text-surface-400 shrink-0" />
                          )}
                          <span className="font-medium truncate">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.type === 'link' ? (
                            <a href={item.content} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          ) : (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopyText(item.content)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingItem(item)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleRemove(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {item.type === 'text' && (
                        <p className="text-sm text-surface-500 mt-3 whitespace-pre-wrap">{item.content}</p>
                      )}
                      {item.type === 'link' && (
                        <p className="text-xs text-surface-400 mt-2 truncate">{item.content}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Add Modal */}
      <ItemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAdd}
        title="Add Item"
      />

      {/* Edit Modal */}
      {editingItem && (
        <ItemModal
          open={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(item) => handleUpdate(editingItem.id, item)}
          title="Edit Item"
          initialData={editingItem}
        />
      )}
    </PageLayout>
  )
}

interface ItemModalProps {
  open: boolean
  onClose: () => void
  onSave: (item: Omit<QuickAccessItem, 'id'>) => void
  title: string
  initialData?: QuickAccessItem
}

function ItemModal({ open, onClose, onSave, title, initialData }: ItemModalProps) {
  const [type, setType] = useState<'link' | 'text'>(initialData?.type || 'link')
  const [label, setLabel] = useState(initialData?.label || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [category, setCategory] = useState(initialData?.category || 'General')

  useEffect(() => {
    if (initialData) {
      setType(initialData.type)
      setLabel(initialData.label)
      setContent(initialData.content)
      setCategory(initialData.category || 'General')
    } else {
      setType('link')
      setLabel('')
      setContent('')
      setCategory('General')
    }
  }, [initialData, open])

  const handleSubmit = () => {
    if (!label.trim() || !content.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    onSave({ type, label: label.trim(), content: content.trim(), category })
    if (!initialData) {
      setLabel('')
      setContent('')
      setType('link')
      setCategory('General')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={type === 'link' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setType('link')}
            leftIcon={<LinkIcon className="h-4 w-4" />}
          >
            Link
          </Button>
          <Button
            variant={type === 'text' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setType('text')}
            leftIcon={<FileText className="h-4 w-4" />}
          >
            Text
          </Button>
        </div>

        <Input
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Drive Folder, Instagram Password"
        />

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-colors',
                  category === cat
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {type === 'link' ? (
          <Input
            label="URL"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="https://..."
          />
        ) : (
          <Textarea
            label="Text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter text to copy..."
            rows={4}
          />
        )}
      </div>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </ModalFooter>
    </Modal>
  )
}
