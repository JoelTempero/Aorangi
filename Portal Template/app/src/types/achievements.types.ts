import type { FirestoreTimestamp } from './common.types'

export type AchievementCategory = 'content' | 'teamwork' | 'milestone' | 'special'

export interface Achievement {
  id: string
  name: string
  description: string
  category: AchievementCategory
  icon: string
  points: number
  criteria?: string
  secret?: boolean
  createdAt: FirestoreTimestamp
}

export interface UserAchievement {
  achievementId: string
  earnedAt: FirestoreTimestamp
}

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  content: 'Content',
  teamwork: 'Teamwork',
  milestone: 'Milestone',
  special: 'Special'
}

export const ACHIEVEMENT_CATEGORY_COLORS: Record<AchievementCategory, string> = {
  content: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  teamwork: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  milestone: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  special: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
}

export const DEFAULT_ACHIEVEMENTS: Omit<Achievement, 'id' | 'createdAt'>[] = [
  // Content Achievements
  {
    name: 'First Reel',
    description: 'Post your first reel',
    category: 'content',
    icon: '🎬',
    points: 10,
    criteria: 'Create and post 1 reel'
  },
  {
    name: 'Content Machine',
    description: 'Post 10 pieces of content',
    category: 'content',
    icon: '⚡',
    points: 50,
    criteria: 'Create and post 10 content items'
  },
  {
    name: 'Viral Hit',
    description: 'Get 10,000+ views on a single piece',
    category: 'content',
    icon: '🔥',
    points: 100,
    criteria: 'Single content item reaches 10,000 views'
  },
  {
    name: 'Story Teller',
    description: 'Post 5 stories',
    category: 'content',
    icon: '📖',
    points: 25,
    criteria: 'Create and post 5 stories'
  },

  // Teamwork Achievements
  {
    name: 'Team Player',
    description: 'Complete 5 assigned shifts',
    category: 'teamwork',
    icon: '🤝',
    points: 25,
    criteria: 'Complete 5 scheduled shifts'
  },
  {
    name: 'Reliable',
    description: 'Confirm all your shifts before camp starts',
    category: 'teamwork',
    icon: '✅',
    points: 30,
    criteria: 'Confirm all assigned shifts'
  },
  {
    name: 'Mentor',
    description: 'Help train a new team member',
    category: 'teamwork',
    icon: '🎓',
    points: 50,
    criteria: 'Awarded by admin for mentoring'
  },
  {
    name: 'Night Owl',
    description: 'Work 3 nightlife shifts',
    category: 'teamwork',
    icon: '🦉',
    points: 30,
    criteria: 'Complete 3 nightlife shifts'
  },

  // Milestone Achievements
  {
    name: 'First Timer',
    description: 'Complete your first camp',
    category: 'milestone',
    icon: '🏕️',
    points: 100,
    criteria: 'First camp completion'
  },
  {
    name: 'Veteran',
    description: 'Complete your third camp',
    category: 'milestone',
    icon: '⭐',
    points: 200,
    criteria: 'Third camp completion'
  },
  {
    name: 'Legend',
    description: 'Complete your fifth camp',
    category: 'milestone',
    icon: '👑',
    points: 500,
    criteria: 'Fifth camp completion'
  },
  {
    name: 'Early Bird',
    description: 'Be the first to confirm your schedule',
    category: 'milestone',
    icon: '🐦',
    points: 15,
    criteria: 'First person to confirm schedule'
  },

  // Special Achievements
  {
    name: 'MVP',
    description: 'Voted Most Valuable Player by the team',
    category: 'special',
    icon: '🏆',
    points: 250,
    criteria: 'Voted MVP at camp wrap-up'
  },
  {
    name: 'Problem Solver',
    description: 'Saved the day with quick thinking',
    category: 'special',
    icon: '💡',
    points: 75,
    criteria: 'Awarded by admin for problem solving'
  },
  {
    name: 'Secret Hunter',
    description: '???',
    category: 'special',
    icon: '🔮',
    points: 50,
    secret: true,
    criteria: 'Find all easter eggs in the app'
  }
]

export function calculateTotalPoints(achievements: UserAchievement[], allAchievements: Achievement[]): number {
  return achievements.reduce((total, ua) => {
    const achievement = allAchievements.find(a => a.id === ua.achievementId)
    return total + (achievement?.points || 0)
  }, 0)
}

export function getNextLevelProgress(points: number): { level: number; progress: number; pointsToNext: number } {
  const levels = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000]
  let level = 0

  for (let i = 0; i < levels.length; i++) {
    if (points >= levels[i]) {
      level = i + 1
    } else {
      break
    }
  }

  const currentThreshold = levels[level - 1] || 0
  const nextThreshold = levels[level] || levels[levels.length - 1]
  const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  const pointsToNext = nextThreshold - points

  return { level, progress: Math.min(100, progress), pointsToNext: Math.max(0, pointsToNext) }
}
