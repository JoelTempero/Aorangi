import { Eye, Heart, MessageCircle, Share2, Bookmark, Users, TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '../ui'
import type { ContentMetrics, ContentItem } from '../../types/content.types'
import { cn } from '../../utils/cn'
import { formatDistanceToNow } from 'date-fns'

interface PerformanceMetricsProps {
  content: ContentItem
  metrics?: ContentMetrics
  previousMetrics?: ContentMetrics
}

export function PerformanceMetrics({ content, metrics, previousMetrics }: PerformanceMetricsProps) {
  if (!metrics) {
    return (
      <Card className="p-6 text-center">
        <TrendingUp className="h-8 w-8 mx-auto mb-3 text-surface-300" />
        <p className="text-surface-500">No metrics available yet</p>
        <p className="text-sm text-surface-400 mt-1">
          Metrics will appear after the content is posted
        </p>
      </Card>
    )
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const calculateChange = (current: number, previous?: number): number | null => {
    if (!previous || previous === 0) return null
    return ((current - previous) / previous) * 100
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return ''
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
    } catch {
      return ''
    }
  }

  const metricsData = [
    {
      label: 'Views',
      value: metrics.views,
      previous: previousMetrics?.views,
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      label: 'Likes',
      value: metrics.likes,
      previous: previousMetrics?.likes,
      icon: Heart,
      color: 'text-red-500'
    },
    {
      label: 'Comments',
      value: metrics.comments,
      previous: previousMetrics?.comments,
      icon: MessageCircle,
      color: 'text-green-500'
    },
    {
      label: 'Shares',
      value: metrics.shares,
      previous: previousMetrics?.shares,
      icon: Share2,
      color: 'text-purple-500'
    },
    {
      label: 'Saves',
      value: metrics.saves,
      previous: previousMetrics?.saves,
      icon: Bookmark,
      color: 'text-amber-500'
    },
    {
      label: 'Reach',
      value: metrics.reach,
      previous: previousMetrics?.reach,
      icon: Users,
      color: 'text-cyan-500'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Engagement Rate Card */}
      <Card className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-600 dark:text-primary-400">Engagement Rate</p>
            <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
              {metrics.engagementRate.toFixed(2)}%
            </p>
          </div>
          <div className="p-3 bg-primary-200/50 dark:bg-primary-800/50 rounded-full">
            <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        {previousMetrics && (
          <div className="mt-2">
            <ChangeIndicator
              change={calculateChange(metrics.engagementRate, previousMetrics.engagementRate)}
            />
          </div>
        )}
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {metricsData.map(({ label, value, previous, icon: Icon, color }) => {
          const change = calculateChange(value, previous)
          return (
            <Card key={label} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('h-4 w-4', color)} />
                <span className="text-xs text-surface-500 uppercase tracking-wide">{label}</span>
              </div>
              <p className="text-2xl font-semibold text-surface-900 dark:text-white">
                {formatNumber(value)}
              </p>
              {change !== null && (
                <ChangeIndicator change={change} size="sm" />
              )}
            </Card>
          )
        })}
      </div>

      {/* Last Updated */}
      <p className="text-xs text-surface-500 text-center">
        Last updated {formatTime(metrics.capturedAt)}
      </p>
    </div>
  )
}

interface ChangeIndicatorProps {
  change: number | null
  size?: 'sm' | 'md'
}

function ChangeIndicator({ change, size = 'md' }: ChangeIndicatorProps) {
  if (change === null) return null

  const isPositive = change >= 0
  const Icon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className={cn(
      'flex items-center gap-1',
      isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      size === 'sm' ? 'text-xs' : 'text-sm'
    )}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
    </div>
  )
}

// Summary component for dashboard widgets
interface MetricsSummaryProps {
  contentItems: ContentItem[]
}

export function MetricsSummary({ contentItems }: MetricsSummaryProps) {
  const itemsWithMetrics = contentItems.filter(c => c.latestMetrics)

  if (itemsWithMetrics.length === 0) {
    return (
      <p className="text-sm text-surface-500 text-center py-4">
        No performance data available
      </p>
    )
  }

  const totals = itemsWithMetrics.reduce(
    (acc, item) => {
      const m = item.latestMetrics!
      return {
        views: acc.views + m.views,
        likes: acc.likes + m.likes,
        comments: acc.comments + m.comments,
        shares: acc.shares + m.shares
      }
    },
    { views: 0, likes: 0, comments: 0, shares: 0 }
  )

  const avgEngagement = itemsWithMetrics.reduce(
    (sum, item) => sum + (item.latestMetrics?.engagementRate || 0),
    0
  ) / itemsWithMetrics.length

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-800">
        <span className="text-sm text-surface-600 dark:text-surface-400">Total Views</span>
        <span className="font-semibold">{formatNumber(totals.views)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-800">
        <span className="text-sm text-surface-600 dark:text-surface-400">Total Likes</span>
        <span className="font-semibold">{formatNumber(totals.likes)}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-surface-100 dark:border-surface-800">
        <span className="text-sm text-surface-600 dark:text-surface-400">Total Comments</span>
        <span className="font-semibold">{formatNumber(totals.comments)}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="text-sm text-surface-600 dark:text-surface-400">Avg. Engagement</span>
        <span className="font-semibold text-primary-600 dark:text-primary-400">
          {avgEngagement.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}
