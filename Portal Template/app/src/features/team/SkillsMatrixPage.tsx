import { useState, useMemo } from 'react'
import { PageLayout } from '../../components/layout'
import { Card, Badge, Avatar, Select, Input } from '../../components/ui'
import { useDataStore } from '../../stores/dataStore'
import { Search, Filter, ChevronDown, ChevronRight } from 'lucide-react'
import type { SkillCategory, SkillLevel, Skill, UserSkill } from '../../types/skills.types'
import {
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_COLORS,
  SKILL_LEVEL_VALUES,
  SKILL_CATEGORY_LABELS,
  SKILL_CATEGORY_COLORS,
  DEFAULT_SKILLS
} from '../../types/skills.types'
import { cn } from '../../utils/cn'

// Demo skills data - in production this would come from Firestore
const DEMO_SKILLS: Skill[] = DEFAULT_SKILLS.map((s, i) => ({
  ...s,
  id: `skill-${i}`,
  createdAt: { toDate: () => new Date() } as any,
  updatedAt: { toDate: () => new Date() } as any
}))

// Demo user skills - in production this would be on each user document
const DEMO_USER_SKILLS: Record<string, UserSkill[]> = {
  'user-1': [
    { skillId: 'skill-0', level: 'expert' },
    { skillId: 'skill-1', level: 'advanced' },
    { skillId: 'skill-4', level: 'advanced' },
    { skillId: 'skill-8', level: 'expert' },
    { skillId: 'skill-13', level: 'expert' }
  ],
  'user-2': [
    { skillId: 'skill-4', level: 'intermediate' },
    { skillId: 'skill-5', level: 'advanced' },
    { skillId: 'skill-7', level: 'intermediate' },
    { skillId: 'skill-16', level: 'beginner' }
  ],
  'user-3': [
    { skillId: 'skill-0', level: 'intermediate' },
    { skillId: 'skill-9', level: 'expert' },
    { skillId: 'skill-10', level: 'advanced' }
  ]
}

export function SkillsMatrixPage() {
  const { teamMembers } = useDataStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | 'all'>('all')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['technical', 'creative', 'equipment', 'software']))

  const filteredSkills = useMemo(() => {
    return DEMO_SKILLS.filter(skill => {
      if (categoryFilter !== 'all' && skill.category !== categoryFilter) return false
      if (searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [searchQuery, categoryFilter])

  const skillsByCategory = useMemo(() => {
    const grouped: Record<SkillCategory, Skill[]> = {
      technical: [],
      creative: [],
      equipment: [],
      software: []
    }
    filteredSkills.forEach(skill => {
      grouped[skill.category].push(skill)
    })
    return grouped
  }, [filteredSkills])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const getUserSkillLevel = (userId: string, skillId: string): SkillLevel | null => {
    const userSkills = DEMO_USER_SKILLS[userId] || []
    const skill = userSkills.find(s => s.skillId === skillId)
    return skill?.level || null
  }

  return (
    <PageLayout
      title="Skills Matrix"
      description="Team capabilities and expertise overview"
    >
      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as SkillCategory | 'all')}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'technical', label: 'Technical' },
              { value: 'creative', label: 'Creative' },
              { value: 'equipment', label: 'Equipment' },
              { value: 'software', label: 'Software' }
            ]}
            className="w-full sm:w-48"
          />
        </div>
      </Card>

      {/* Legend */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Skill Levels:</span>
          {(Object.keys(SKILL_LEVEL_LABELS) as SkillLevel[]).map(level => (
            <div key={level} className="flex items-center gap-2">
              <SkillLevelIndicator level={level} size="sm" />
              <span className="text-sm text-surface-600 dark:text-surface-400">
                {SKILL_LEVEL_LABELS[level]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Matrix */}
      <div className="space-y-4">
        {(Object.keys(skillsByCategory) as SkillCategory[]).map(category => {
          const skills = skillsByCategory[category]
          if (skills.length === 0) return null

          const isExpanded = expandedCategories.has(category)

          return (
            <Card key={category} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-surface-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-surface-400" />
                  )}
                  <Badge className={SKILL_CATEGORY_COLORS[category]}>
                    {SKILL_CATEGORY_LABELS[category]}
                  </Badge>
                  <span className="text-sm text-surface-500">
                    {skills.length} skills
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-surface-200 dark:border-surface-700 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-50 dark:bg-surface-800">
                        <th className="sticky left-0 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider min-w-[200px]">
                          Skill
                        </th>
                        {teamMembers.slice(0, 8).map(member => (
                          <th key={member.id} className="px-3 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Avatar
                                src={member.photoURL}
                                name={member.displayName || member.displayName}
                                size="sm"
                              />
                              <span className="text-xs text-surface-600 dark:text-surface-400 truncate max-w-[80px]">
                                {(member.displayName || member.displayName).split(' ')[0]}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {skills.map((skill, index) => (
                        <tr
                          key={skill.id}
                          className={cn(
                            index % 2 === 0 ? 'bg-white dark:bg-surface-900' : 'bg-surface-50/50 dark:bg-surface-800/50'
                          )}
                        >
                          <td className="sticky left-0 bg-inherit px-4 py-3 text-sm font-medium text-surface-900 dark:text-white">
                            {skill.name}
                            {skill.description && (
                              <p className="text-xs text-surface-500 font-normal">{skill.description}</p>
                            )}
                          </td>
                          {teamMembers.slice(0, 8).map(member => {
                            const level = getUserSkillLevel(member.id, skill.id)
                            return (
                              <td key={member.id} className="px-3 py-3 text-center">
                                {level ? (
                                  <SkillLevelIndicator level={level} />
                                ) : (
                                  <span className="text-surface-300 dark:text-surface-700">—</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </PageLayout>
  )
}

interface SkillLevelIndicatorProps {
  level: SkillLevel
  size?: 'sm' | 'md'
}

function SkillLevelIndicator({ level, size = 'md' }: SkillLevelIndicatorProps) {
  const levelValue = SKILL_LEVEL_VALUES[level]
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
  const gap = size === 'sm' ? 'gap-0.5' : 'gap-1'

  return (
    <div className={cn('flex items-center justify-center', gap)} title={SKILL_LEVEL_LABELS[level]}>
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={cn(
            dotSize,
            'rounded-full',
            i <= levelValue
              ? level === 'expert'
                ? 'bg-amber-500'
                : level === 'advanced'
                  ? 'bg-purple-500'
                  : level === 'intermediate'
                    ? 'bg-blue-500'
                    : 'bg-surface-400'
              : 'bg-surface-200 dark:bg-surface-700'
          )}
        />
      ))}
    </div>
  )
}
