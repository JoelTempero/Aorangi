import { useState } from 'react'
import { Trophy, Lock, Star } from 'lucide-react'
import { Card, Badge, Modal } from '../ui'
import type { Achievement, UserAchievement, AchievementCategory } from '../../types/achievements.types'
import {
  ACHIEVEMENT_CATEGORY_LABELS,
  ACHIEVEMENT_CATEGORY_COLORS,
  calculateTotalPoints,
  getNextLevelProgress,
  DEFAULT_ACHIEVEMENTS
} from '../../types/achievements.types'
import { cn } from '../../utils/cn'
import { formatDistanceToNow } from 'date-fns'

interface AchievementsListProps {
  userAchievements: UserAchievement[]
  allAchievements?: Achievement[]
  showLocked?: boolean
  compact?: boolean
}

// Demo achievements - in production this would come from Firestore
const DEMO_ACHIEVEMENTS: Achievement[] = DEFAULT_ACHIEVEMENTS.map((a, i) => ({
  ...a,
  id: `achievement-${i}`,
  createdAt: { toDate: () => new Date() } as any
}))

export function AchievementsList({
  userAchievements,
  allAchievements = DEMO_ACHIEVEMENTS,
  showLocked = true,
  compact = false
}: AchievementsListProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  const earnedIds = new Set(userAchievements.map(ua => ua.achievementId))
  const totalPoints = calculateTotalPoints(userAchievements, allAchievements)
  const { level, progress, pointsToNext } = getNextLevelProgress(totalPoints)

  const earnedAchievements = allAchievements.filter(a => earnedIds.has(a.id))
  const lockedAchievements = allAchievements.filter(a => !earnedIds.has(a.id) && !a.secret)

  const getEarnedDate = (achievementId: string) => {
    const ua = userAchievements.find(u => u.achievementId === achievementId)
    return ua?.earnedAt
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Level Progress */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Level {level}</span>
              <span className="text-surface-500">{totalPoints} pts</span>
            </div>
            <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="flex flex-wrap gap-2">
          {earnedAchievements.slice(0, 5).map(achievement => (
            <button
              key={achievement.id}
              onClick={() => setSelectedAchievement(achievement)}
              className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-xl hover:scale-110 transition-transform"
              title={achievement.name}
            >
              {achievement.icon}
            </button>
          ))}
          {earnedAchievements.length > 5 && (
            <div className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-sm text-surface-500">
              +{earnedAchievements.length - 5}
            </div>
          )}
        </div>

        <AchievementModal
          achievement={selectedAchievement}
          earned={selectedAchievement ? earnedIds.has(selectedAchievement.id) : false}
          earnedAt={selectedAchievement ? getEarnedDate(selectedAchievement.id) : undefined}
          onClose={() => setSelectedAchievement(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Level Card */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-200/50 dark:bg-amber-800/50 rounded-full">
            <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                Level {level}
              </span>
              <Badge variant="outline" className="border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300">
                {totalPoints} points
              </Badge>
            </div>
            <div className="h-2 bg-amber-200 dark:bg-amber-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              {pointsToNext > 0 ? `${pointsToNext} points to next level` : 'Max level reached!'}
            </p>
          </div>
        </div>
      </Card>

      {/* Earned Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          Earned ({earnedAchievements.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {earnedAchievements.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              earned
              earnedAt={getEarnedDate(achievement.id)}
              onClick={() => setSelectedAchievement(achievement)}
            />
          ))}
        </div>
        {earnedAchievements.length === 0 && (
          <Card className="p-8 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-surface-300" />
            <p className="text-surface-500">No achievements earned yet</p>
            <p className="text-sm text-surface-400 mt-1">Complete tasks to earn your first badge!</p>
          </Card>
        )}
      </div>

      {/* Locked Achievements */}
      {showLocked && lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-surface-400" />
            Locked ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                earned={false}
                onClick={() => setSelectedAchievement(achievement)}
              />
            ))}
          </div>
        </div>
      )}

      <AchievementModal
        achievement={selectedAchievement}
        earned={selectedAchievement ? earnedIds.has(selectedAchievement.id) : false}
        earnedAt={selectedAchievement ? getEarnedDate(selectedAchievement.id) : undefined}
        onClose={() => setSelectedAchievement(null)}
      />
    </div>
  )
}

interface AchievementCardProps {
  achievement: Achievement
  earned: boolean
  earnedAt?: any
  onClick: () => void
}

function AchievementCard({ achievement, earned, earnedAt, onClick }: AchievementCardProps) {
  const formatTime = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return ''
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
    } catch {
      return ''
    }
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border text-left transition-all hover:scale-105',
        earned
          ? 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700'
          : 'bg-surface-50 dark:bg-surface-900 border-surface-200 dark:border-surface-800 opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
          earned
            ? 'bg-amber-100 dark:bg-amber-900/30'
            : 'bg-surface-200 dark:bg-surface-800 grayscale'
        )}>
          {earned ? achievement.icon : <Lock className="h-5 w-5 text-surface-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium text-sm truncate',
            earned ? 'text-surface-900 dark:text-white' : 'text-surface-500'
          )}>
            {achievement.name}
          </p>
          <p className="text-xs text-surface-500 mt-0.5">
            {earned ? formatTime(earnedAt) : `${achievement.points} pts`}
          </p>
        </div>
      </div>
    </button>
  )
}

interface AchievementModalProps {
  achievement: Achievement | null
  earned: boolean
  earnedAt?: any
  onClose: () => void
}

function AchievementModal({ achievement, earned, earnedAt, onClose }: AchievementModalProps) {
  if (!achievement) return null

  const formatTime = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return ''
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
    } catch {
      return ''
    }
  }

  return (
    <Modal open={!!achievement} onClose={onClose} title="">
      <div className="text-center py-4">
        <div className={cn(
          'w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-4',
          earned
            ? 'bg-amber-100 dark:bg-amber-900/30'
            : 'bg-surface-100 dark:bg-surface-800 grayscale'
        )}>
          {earned ? achievement.icon : <Lock className="h-10 w-10 text-surface-400" />}
        </div>

        <h3 className="text-xl font-bold mb-1">{achievement.name}</h3>
        <Badge className={ACHIEVEMENT_CATEGORY_COLORS[achievement.category]}>
          {ACHIEVEMENT_CATEGORY_LABELS[achievement.category]}
        </Badge>

        <p className="text-surface-600 dark:text-surface-400 mt-4">
          {achievement.description}
        </p>

        {achievement.criteria && (
          <p className="text-sm text-surface-500 mt-2">
            <span className="font-medium">How to earn:</span> {achievement.criteria}
          </p>
        )}

        <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {achievement.points}
              </p>
              <p className="text-xs text-surface-500">Points</p>
            </div>
            {earned && (
              <div className="text-center">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Earned
                </p>
                <p className="text-xs text-surface-500">{formatTime(earnedAt)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
