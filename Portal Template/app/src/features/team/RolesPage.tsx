import { useState } from 'react'
import { PageLayout } from '../../components/layout'
import { Card, Badge, Input } from '../../components/ui'
import { Search, Camera, Film, Edit3, Mic, Monitor, Clapperboard, Users } from 'lucide-react'
import type { AssignmentRole } from '../../types/schedule.types'
import { ASSIGNMENT_ROLE_LABELS } from '../../types/schedule.types'
import { cn } from '../../utils/cn'

interface RoleDescription {
  id: string
  role: AssignmentRole
  title: string
  description: string
  responsibilities: string[]
  requiredSkills: string[]
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const ROLE_DESCRIPTIONS: RoleDescription[] = [
  {
    id: '1',
    role: 'shoot_highlights',
    title: 'Highlights Shooter',
    description: 'Capture the best moments of each session for highlight reels and social media content.',
    responsibilities: [
      'Film key moments during main sessions',
      'Capture crowd reactions and atmosphere',
      'Get b-roll footage of activities',
      'Coordinate with editors on specific shots needed',
      'Ensure proper exposure and framing'
    ],
    requiredSkills: ['Camera (DSLR/Mirrorless)', 'Cinematography', 'Storytelling'],
    icon: Camera,
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
  },
  {
    id: '2',
    role: 'shoot_drone',
    title: 'Drone Operator',
    description: 'Capture aerial footage of the camp grounds, events, and group activities.',
    responsibilities: [
      'Plan and execute safe drone flights',
      'Capture establishing shots of the venue',
      'Film group activities from above',
      'Ensure compliance with aviation regulations',
      'Maintain and charge drone equipment'
    ],
    requiredSkills: ['Drone Operation', 'Cinematography', 'Video Editing'],
    icon: Film,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    id: '3',
    role: 'shoot_timelapse',
    title: 'Timelapse Operator',
    description: 'Set up and monitor timelapse cameras to capture the passage of time.',
    responsibilities: [
      'Position timelapse cameras at strategic locations',
      'Calculate intervals and duration for optimal results',
      'Monitor cameras and battery levels',
      'Process and compile timelapse footage',
      'Protect equipment from weather'
    ],
    requiredSkills: ['Camera (DSLR/Mirrorless)', 'Photography', 'Video Editing'],
    icon: Camera,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  },
  {
    id: '4',
    role: 'shoot_bts',
    title: 'BTS (Behind the Scenes)',
    description: 'Document the media team and capture candid moments from behind the camera.',
    responsibilities: [
      'Film the media team in action',
      'Capture setup and preparation moments',
      'Interview team members',
      'Document the camp experience from a unique angle',
      'Create content for team socials'
    ],
    requiredSkills: ['Camera (DSLR/Mirrorless)', 'Storytelling', 'Photography'],
    icon: Clapperboard,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  },
  {
    id: '5',
    role: 'edit_highlights',
    title: 'Highlights Editor',
    description: 'Edit daily highlight reels for social media and big top display.',
    responsibilities: [
      'Review and select best footage',
      'Edit content to music and pacing',
      'Apply color grading and effects',
      'Export for multiple platforms',
      'Meet daily deadlines for content release'
    ],
    requiredSkills: ['Video Editing', 'Color Grading', 'Premiere Pro', 'Storytelling'],
    icon: Edit3,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    id: '6',
    role: 'edit_news',
    title: 'News Editor',
    description: 'Create quick-turnaround news and update content for camp communications.',
    responsibilities: [
      'Edit announcement videos quickly',
      'Create informational content',
      'Add graphics and lower thirds',
      'Ensure clear audio and messaging',
      'Work with camp leaders on content'
    ],
    requiredSkills: ['Video Editing', 'Motion Graphics', 'After Effects', 'Audio Mixing'],
    icon: Monitor,
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
  },
  {
    id: '7',
    role: 'audio',
    title: 'Audio Technician',
    description: 'Record and mix audio for video content and presentations.',
    responsibilities: [
      'Set up and operate recording equipment',
      'Monitor audio levels during filming',
      'Process and clean audio in post',
      'Handle voiceovers and interviews',
      'Troubleshoot audio issues'
    ],
    requiredSkills: ['Audio Recording', 'Audio Mixing', 'Video Editing'],
    icon: Mic,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  },
  {
    id: '8',
    role: 'presentation',
    title: 'Presentation Operator',
    description: 'Run the big top display and manage content playback during sessions.',
    responsibilities: [
      'Queue up content for display',
      'Operate playback systems',
      'Coordinate with session leaders',
      'Handle live switching if needed',
      'Troubleshoot technical issues'
    ],
    requiredSkills: ['Technical operation', 'Communication', 'Problem solving'],
    icon: Monitor,
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
  },
  {
    id: '9',
    role: 'chill_fill',
    title: 'Chill / Fill',
    description: 'On standby to fill in where needed and take breaks.',
    responsibilities: [
      'Be available as backup for any role',
      'Help with equipment transport',
      'Assist with data management',
      'Support other team members',
      'Rest and recharge for next shift'
    ],
    requiredSkills: ['Flexibility', 'Team player', 'Basic equipment knowledge'],
    icon: Users,
    color: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300'
  }
]

export function RolesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<RoleDescription | null>(null)

  const filteredRoles = ROLE_DESCRIPTIONS.filter(role =>
    role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.responsibilities.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <PageLayout
      title="Role Guide"
      description="Learn about each media team role and responsibilities"
    >
      {/* Search */}
      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <Input
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Roles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            onClick={() => setSelectedRole(role)}
          />
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="h-8 w-8 mx-auto mb-2 text-surface-300" />
          <p className="text-surface-500">No roles match your search</p>
        </Card>
      )}

      {/* Role Detail Modal */}
      {selectedRole && (
        <RoleDetailModal
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </PageLayout>
  )
}

interface RoleCardProps {
  role: RoleDescription
  onClick: () => void
}

function RoleCard({ role, onClick }: RoleCardProps) {
  const Icon = role.icon

  return (
    <button
      onClick={onClick}
      className="text-left"
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-lg', role.color)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-surface-900 dark:text-white">
              {role.title}
            </h3>
            <p className="text-sm text-surface-500 mt-1 line-clamp-2">
              {role.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              {role.requiredSkills.slice(0, 3).map(skill => (
                <Badge key={skill} variant="outline" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </button>
  )
}

interface RoleDetailModalProps {
  role: RoleDescription
  onClose: () => void
}

function RoleDetailModal({ role, onClose }: RoleDetailModalProps) {
  const Icon = role.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-surface-900 rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className={cn('p-6', role.color.replace('text-', 'text-').split(' ')[0])}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 dark:bg-black/20 rounded-lg">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{role.title}</h2>
              <Badge variant="outline" className="mt-1 border-current">
                {ASSIGNMENT_ROLE_LABELS[role.role]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            {role.description}
          </p>

          {/* Responsibilities */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Responsibilities</h3>
            <ul className="space-y-2">
              {role.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                  <span className="text-surface-600 dark:text-surface-400">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="font-semibold mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {role.requiredSkills.map(skill => (
                <Badge key={skill} className="bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-lg bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
