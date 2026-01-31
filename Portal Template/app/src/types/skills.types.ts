import type { FirestoreTimestamp } from './common.types'

export type SkillCategory = 'technical' | 'creative' | 'equipment' | 'software'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface Skill {
  id: string
  name: string
  description?: string
  category: SkillCategory
  icon?: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface UserSkill {
  skillId: string
  level: SkillLevel
  endorsedBy?: string[]
  verifiedAt?: FirestoreTimestamp
}

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert'
}

export const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  beginner: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  expert: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
}

export const SKILL_LEVEL_VALUES: Record<SkillLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4
}

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  technical: 'Technical',
  creative: 'Creative',
  equipment: 'Equipment',
  software: 'Software'
}

export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
  technical: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  creative: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  equipment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  software: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
}

export const DEFAULT_SKILLS: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Technical Skills
  { name: 'Video Editing', category: 'technical', description: 'Editing video content' },
  { name: 'Color Grading', category: 'technical', description: 'Color correction and grading' },
  { name: 'Audio Mixing', category: 'technical', description: 'Audio post-production' },
  { name: 'Motion Graphics', category: 'technical', description: 'Creating animated graphics' },

  // Creative Skills
  { name: 'Cinematography', category: 'creative', description: 'Camera operation and framing' },
  { name: 'Photography', category: 'creative', description: 'Still photography' },
  { name: 'Storytelling', category: 'creative', description: 'Narrative construction' },
  { name: 'Graphic Design', category: 'creative', description: 'Visual design and layout' },

  // Equipment Skills
  { name: 'Camera (DSLR/Mirrorless)', category: 'equipment', description: 'Operating cameras' },
  { name: 'Drone Operation', category: 'equipment', description: 'Flying and filming with drones' },
  { name: 'Gimbal/Stabilizer', category: 'equipment', description: 'Using camera stabilization' },
  { name: 'Lighting Setup', category: 'equipment', description: 'Setting up lighting equipment' },
  { name: 'Audio Recording', category: 'equipment', description: 'Microphones and recorders' },

  // Software Skills
  { name: 'Premiere Pro', category: 'software', description: 'Adobe Premiere Pro' },
  { name: 'After Effects', category: 'software', description: 'Adobe After Effects' },
  { name: 'DaVinci Resolve', category: 'software', description: 'Blackmagic DaVinci Resolve' },
  { name: 'Photoshop', category: 'software', description: 'Adobe Photoshop' },
  { name: 'Lightroom', category: 'software', description: 'Adobe Lightroom' }
]
