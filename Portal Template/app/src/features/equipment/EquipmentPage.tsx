import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../components/layout'
import { Card, CardHeader, Button, Badge, Input, Select, EmptyState, Modal, ModalFooter, Textarea } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { firestoreService } from '../../services/firestore.service'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  Package,
  Camera,
  Monitor,
  HardDrive,
  Wifi,
  Mic,
  Lightbulb,
  Tent,
  DollarSign,
  User,
  AlertTriangle,
  CheckCircle,
  Upload
} from 'lucide-react'
import type { Equipment, EquipmentCategory, EquipmentCondition } from '../../types'
import { EQUIPMENT_CATEGORY_LABELS, EQUIPMENT_CONDITION_LABELS, EQUIPMENT_CONDITION_COLORS } from '../../types'

const categoryIcons: Record<EquipmentCategory, React.ComponentType<{ className?: string }>> = {
  camera: Camera,
  lens: Camera,
  computer: Monitor,
  storage: HardDrive,
  networking: Wifi,
  audio: Mic,
  lighting: Lightbulb,
  camping: Tent,
  other: Package
}

export function EquipmentPage() {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const { equipment, teamMembers, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [conditionFilter, setConditionFilter] = useState<string>('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null)

  // Filter equipment
  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter && item.category !== categoryFilter) return false
      if (conditionFilter && item.condition !== conditionFilter) return false
      return true
    })
  }, [equipment, search, categoryFilter, conditionFilter])

  // Calculate totals
  const totalValue = equipment.reduce((sum, item) => sum + item.value, 0)
  const insuredCount = equipment.filter((item) => item.insuranceVerified).length

  // Group by category
  const equipmentByCategory = useMemo(() => {
    const groups: Record<string, Equipment[]> = {}
    filteredEquipment.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    })
    return groups
  }, [filteredEquipment])

  return (
    <PageLayout
      title="Equipment"
      description="Manage gear inventory and insurance"
      action={
        (isAdmin) && (
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />} onClick={() => navigate('/import')}>
              Import
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowNewModal(true)}>
              Add Equipment
            </Button>
          </div>
        )
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Package className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{equipment.length}</p>
              <p className="text-xs text-surface-500">Total Items</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              <p className="text-xs text-surface-500">Total Value</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{insuredCount}</p>
              <p className="text-xs text-surface-500">Insured</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {equipment.filter((e) => e.condition === 'needs_repair').length}
              </p>
              <p className="text-xs text-surface-500">Needs Repair</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search equipment..."
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
              ...Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-40"
          />
          <Select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            options={[
              { value: '', label: 'All Conditions' },
              ...Object.entries(EQUIPMENT_CONDITION_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-40"
          />
        </div>
      </Card>

      {/* Equipment Grid */}
      <div className="space-y-8">
        {Object.entries(equipmentByCategory).map(([category, items]) => {
          const Icon = categoryIcons[category as EquipmentCategory]
          const categoryTotal = items.reduce((sum, item) => sum + item.value, 0)

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold">
                    {EQUIPMENT_CATEGORY_LABELS[category as EquipmentCategory]}
                  </h2>
                  <Badge variant="default">{items.length}</Badge>
                </div>
                <span className="text-sm text-surface-500">
                  ${categoryTotal.toLocaleString()}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <EquipmentCard
                    key={item.id}
                    item={item}
                    owner={teamMembers.find((m) => m.id === item.ownerId)}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <Card>
          <EmptyState
            icon={<Package className="h-8 w-8" />}
            title="No equipment found"
            description="Try adjusting your filters or add new equipment"
            action={
              (isAdmin)
                ? { label: 'Add Equipment', onClick: () => setShowNewModal(true) }
                : undefined
            }
          />
        </Card>
      )}

      {/* New Equipment Modal */}
      <NewEquipmentModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        teamMembers={teamMembers}
      />

      {/* Equipment Detail Modal */}
      <EquipmentDetailModal
        item={selectedItem}
        owner={teamMembers.find((m) => m.id === selectedItem?.ownerId)}
        onClose={() => setSelectedItem(null)}
      />
    </PageLayout>
  )
}

interface EquipmentCardProps {
  item: Equipment
  owner?: { displayName: string; photoURL?: string }
  onClick: () => void
}

function EquipmentCard({ item, owner, onClick }: EquipmentCardProps) {
  const Icon = categoryIcons[item.category]

  return (
    <Card
      className="hover:border-primary-200 dark:hover:border-primary-800 transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800">
          <Icon className="h-6 w-6 text-surface-600 dark:text-surface-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-surface-900 dark:text-surface-100 truncate">
            {item.name}
          </h3>
          <p className="text-sm text-surface-500 truncate">{item.description}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Badge className={EQUIPMENT_CONDITION_COLORS[item.condition]}>
          {EQUIPMENT_CONDITION_LABELS[item.condition]}
        </Badge>
        <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
          ${item.value.toLocaleString()}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-surface-500">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {owner?.displayName || 'Unknown'}
        </div>
        {item.insuranceVerified && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-3 w-3" />
            Insured
          </div>
        )}
      </div>
    </Card>
  )
}

interface NewEquipmentModalProps {
  open: boolean
  onClose: () => void
  teamMembers: { id: string; displayName: string }[]
}

function NewEquipmentModal({ open, onClose, teamMembers }: NewEquipmentModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<EquipmentCategory>('camera')
  const [value, setValue] = useState('')
  const [ownerId, setOwnerId] = useState(user?.id || '')
  const [condition, setCondition] = useState<EquipmentCondition>('good')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await firestoreService.create('equipment', {
        name: name.trim(),
        description,
        category,
        value: parseFloat(value) || 0,
        ownerId,
        condition,
        insuranceVerified: false,
        notes: '',
        maintenanceHistory: []
      })
      toast.success('Equipment added')
      onClose()
      setName('')
      setDescription('')
      setValue('')
    } catch (error) {
      toast.error('Failed to add equipment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Equipment" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Canon 5D Mark IV"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the equipment..."
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
            options={Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
          />

          <Input
            label="Value ($)"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Owner"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            options={teamMembers.map((m) => ({ value: m.id, label: m.displayName }))}
          />

          <Select
            label="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as EquipmentCondition)}
            options={Object.entries(EQUIPMENT_CONDITION_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!name.trim()}>
            Add Equipment
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

interface EquipmentDetailModalProps {
  item: Equipment | null
  owner?: { displayName: string; photoURL?: string }
  onClose: () => void
}

function EquipmentDetailModal({ item, owner, onClose }: EquipmentDetailModalProps) {
  if (!item) return null

  const Icon = categoryIcons[item.category]

  return (
    <Modal open={!!item} onClose={onClose} title="Equipment Details" size="lg">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-surface-100 dark:bg-surface-800">
            <Icon className="h-8 w-8 text-surface-600 dark:text-surface-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
              {item.name}
            </h2>
            <p className="text-surface-500">{item.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
            <p className="text-xs text-surface-500 uppercase tracking-wider">Value</p>
            <p className="text-lg font-bold">${item.value.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
            <p className="text-xs text-surface-500 uppercase tracking-wider">Condition</p>
            <Badge className={cn('mt-1', EQUIPMENT_CONDITION_COLORS[item.condition])}>
              {EQUIPMENT_CONDITION_LABELS[item.condition]}
            </Badge>
          </div>
          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
            <p className="text-xs text-surface-500 uppercase tracking-wider">Owner</p>
            <p className="font-medium">{owner?.displayName || 'Unknown'}</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
            <p className="text-xs text-surface-500 uppercase tracking-wider">Insurance</p>
            <p className={cn('font-medium', item.insuranceVerified ? 'text-green-600' : 'text-amber-600')}>
              {item.insuranceVerified ? 'Verified' : 'Not Verified'}
            </p>
          </div>
        </div>

        {item.serialNumber && (
          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
            <p className="text-xs text-surface-500 uppercase tracking-wider">Serial Number</p>
            <p className="font-mono">{item.serialNumber}</p>
          </div>
        )}

        {item.notes && (
          <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
            <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm">{item.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
