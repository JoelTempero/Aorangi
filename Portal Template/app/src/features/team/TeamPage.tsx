import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../components/layout'
import { Card, Button, Badge, Avatar, Input, Select, EmptyState, Modal, ModalFooter } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { firestoreService } from '../../services/firestore.service'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  Users,
  Shield,
  Filter,
  Edit2,
  Trash2
} from 'lucide-react'
import type { User, TeamType, UserRole } from '../../types'
import { TEAM_LABELS, ROLE_LABELS } from '../../types'

export function TeamPage() {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const { teamMembers, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [teamFilter, setTeamFilter] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [selectedMember, setSelectedMember] = useState<User | null>(null)
  const [editingMember, setEditingMember] = useState<User | null>(null)

  // Filter members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      if (search && !member.displayName.toLowerCase().includes(search.toLowerCase())) return false
      if (teamFilter && !member.teams.includes(teamFilter as TeamType)) return false
      if (roleFilter && member.role !== roleFilter) return false
      return true
    })
  }, [teamMembers, search, teamFilter, roleFilter])

  // Group by team
  const membersByTeam = useMemo(() => {
    if (teamFilter) return null
    const groups: Record<string, User[]> = {}
    teamMembers.forEach((member) => {
      member.teams.forEach((team) => {
        if (!groups[team]) groups[team] = []
        groups[team].push(member)
      })
    })
    return groups
  }, [teamMembers, teamFilter])

  return (
    <PageLayout
      title="Team Directory"
      description={`${teamMembers.length} team members`}
      action={
        isAdmin && (
          <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => navigate('/settings')}>
            Invite Member
          </Button>
        )
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <Select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            options={[
              { value: '', label: 'All Teams' },
              ...Object.entries(TEAM_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-36"
          />
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: '', label: 'All Roles' },
              ...Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))
            ]}
            className="w-36"
          />
        </div>
      </Card>

      {/* Team Grid or Filtered List */}
      {!teamFilter && membersByTeam ? (
        <div className="space-y-8">
          {Object.entries(membersByTeam).map(([team, members]) => (
            <div key={team}>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold">{TEAM_LABELS[team as TeamType]}</h2>
                <Badge variant="default">{members.length}</Badge>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {members.map((member) => (
                  <MemberCard
                    key={`${team}-${member.id}`}
                    member={member}
                    onClick={() => setSelectedMember(member)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMembers.length === 0 ? (
            <Card className="col-span-full">
              <EmptyState
                icon={<Users className="h-8 w-8" />}
                title="No members found"
                description="Try adjusting your filters"
              />
            </Card>
          ) : (
            filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onClick={() => setSelectedMember(member)}
              />
            ))
          )}
        </div>
      )}

      {/* Member Detail Modal */}
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        isAdmin={isAdmin}
        onEdit={(member) => {
          setSelectedMember(null)
          setEditingMember(member)
        }}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        member={editingMember}
        onClose={() => setEditingMember(null)}
      />
    </PageLayout>
  )
}

interface MemberCardProps {
  member: User
  onClick: () => void
}

function MemberCard({ member, onClick }: MemberCardProps) {
  const statusColors = {
    available: 'bg-green-500',
    busy: 'bg-red-500',
    break: 'bg-amber-500',
    offline: 'bg-surface-400'
  }

  return (
    <Card
      className="hover:border-primary-200 dark:hover:border-primary-800 transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center">
        <Avatar
          src={member.photoURL}
          name={member.displayName}
          size="xl"
          status={member.status === 'available' ? 'online' : member.status === 'busy' ? 'busy' : 'offline'}
        />

        <h3 className="mt-3 font-semibold text-surface-900 dark:text-surface-100">
          {member.displayName}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          {member.role === 'admin' && <Shield className="h-3 w-3 text-primary-500" />}
          <span className="text-sm text-surface-500 dark:text-surface-400">
            {ROLE_LABELS[member.role]}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-1 mt-3">
          {member.teams.map((team) => (
            <Badge key={team} variant="default" size="sm">
              {TEAM_LABELS[team]}
            </Badge>
          ))}
        </div>

        <div className={cn(
          'flex items-center gap-1 mt-3 text-xs',
          member.status === 'available' ? 'text-green-600' :
          member.status === 'busy' ? 'text-red-600' :
          'text-surface-500'
        )}>
          <span className={cn('h-2 w-2 rounded-full', statusColors[member.status])} />
          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
        </div>
      </div>
    </Card>
  )
}

interface MemberDetailModalProps {
  member: User | null
  onClose: () => void
  isAdmin: boolean
  onEdit: (member: User) => void
}

function MemberDetailModal({ member, onClose, isAdmin, onEdit }: MemberDetailModalProps) {
  if (!member) return null

  return (
    <Modal open={!!member} onClose={onClose} title="Team Member" size="md">
      <div className="flex flex-col items-center text-center">
        <Avatar
          src={member.photoURL}
          name={member.displayName}
          size="xl"
        />

        <h2 className="mt-4 text-xl font-bold text-surface-900 dark:text-surface-100">
          {member.displayName}
        </h2>

        <div className="flex items-center gap-2 mt-1">
          {member.role === 'admin' && <Shield className="h-4 w-4 text-primary-500" />}
          <span className="text-surface-500">{ROLE_LABELS[member.role]}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {member.teams.map((team) => (
            <Badge key={team} variant="primary">
              {TEAM_LABELS[team]}
            </Badge>
          ))}
        </div>

        <div className="w-full mt-6 space-y-3">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <Mail className="h-5 w-5 text-surface-400" />
              <span className="text-sm">{member.email}</span>
            </a>
          )}

          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <Phone className="h-5 w-5 text-surface-400" />
              <span className="text-sm">{member.phone}</span>
            </a>
          )}
        </div>

        {member.skills.length > 0 && (
          <div className="w-full mt-6">
            <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="w-full mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
            <Button
              className="w-full"
              variant="outline"
              leftIcon={<Edit2 className="h-4 w-4" />}
              onClick={() => onEdit(member)}
            >
              Edit Member
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

interface EditMemberModalProps {
  member: User | null
  onClose: () => void
}

function EditMemberModal({ member, onClose }: EditMemberModalProps) {
  const [loading, setLoading] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState<UserRole>('member')
  const [teams, setTeams] = useState<TeamType[]>([])
  const [phone, setPhone] = useState('')
  const [skills, setSkills] = useState('')

  useEffect(() => {
    if (member) {
      setDisplayName(member.displayName)
      setRole(member.role)
      setTeams(member.teams)
      setPhone(member.phone || '')
      setSkills(Array.isArray(member.skills) ? member.skills.join(', ') : '')
    }
  }, [member])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!member || !displayName.trim()) return

    setLoading(true)
    try {
      await firestoreService.update('users', member.id, {
        displayName: displayName.trim(),
        role,
        teams,
        phone: phone || null,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean)
      })
      toast.success('Member updated')
      onClose()
    } catch (error) {
      toast.error('Failed to update member')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!member) return
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return

    setLoading(true)
    try {
      await firestoreService.delete('users', member.id)
      toast.success('Member deleted')
      onClose()
    } catch (error) {
      toast.error('Failed to delete member')
    } finally {
      setLoading(false)
    }
  }

  if (!member) return null

  return (
    <Modal open={!!member} onClose={onClose} title="Edit Team Member" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <Input
          label="Email"
          value={member.email}
          disabled
          hint="Email cannot be changed"
        />

        <Input
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 234 567 8900"
        />

        <Select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          options={[
            { value: 'member', label: 'Member' },
            { value: 'lead', label: 'Lead' },
            { value: 'admin', label: 'Admin' }
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Teams
          </label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg border-surface-300 dark:border-surface-600">
            {(Object.entries(TEAM_LABELS) as [TeamType, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setTeams((prev) =>
                    prev.includes(value)
                      ? prev.filter((t) => t !== value)
                      : [...prev, value]
                  )
                }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-colors',
                  teams.includes(value)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Photography, Video Editing, Drone"
          hint="Comma-separated list"
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
          <Button type="submit" loading={loading} disabled={!displayName.trim()}>
            Save Changes
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
