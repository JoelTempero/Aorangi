import { useState, useMemo } from 'react'
import { PageLayout, PageSection } from '../../components/layout'
import { Card, CardHeader, Button, Badge, Select } from '../../components/ui'
import { DonutChart, BarChart, StatTrend } from '../../components/shared'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { useAppStore } from '../../stores/appStore'
import { importService } from '../../services/import.service'
import { cn } from '../../utils/cn'
import {
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  CheckSquare,
  Film,
  Package,
  Calendar,
  Target
} from 'lucide-react'

export function ReportsPage() {
  const { user, isAdmin } = useAuth()
  const currentEvent = useAppStore((state) => state.currentEvent)
  const { tasks, teamMembers, content, equipment } = useDataStore()

  // Task stats
  const taskStats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'completed').length
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length
    const overdue = tasks.filter((t) => {
      if (!t.dueDate || t.status === 'completed') return false
      const dueDate = t.dueDate as { seconds: number }
      return new Date(dueDate.seconds * 1000) < new Date()
    }).length

    const byPriority = {
      urgent: tasks.filter((t) => t.priority === 'urgent').length,
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length
    }

    const byAssignee = teamMembers.map((member) => ({
      id: member.id,
      name: member.displayName,
      total: tasks.filter((t) => t.assignees.includes(member.id)).length,
      completed: tasks.filter((t) => t.assignees.includes(member.id) && t.status === 'completed').length
    })).filter((m) => m.total > 0).sort((a, b) => b.total - a.total)

    return { total, completed, inProgress, overdue, byPriority, byAssignee }
  }, [tasks, teamMembers])

  // Content stats
  const contentStats = useMemo(() => {
    const total = content.length
    const posted = content.filter((c) => c.status === 'posted').length
    const totalDuration = content.reduce((sum, c) => sum + (c.actualDuration || c.targetDuration), 0)

    const byType = Object.entries(
      content.reduce((acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1])

    const byStatus = Object.entries(
      content.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    )

    return { total, posted, totalDuration, byType, byStatus }
  }, [content])

  // Equipment stats
  const equipmentStats = useMemo(() => {
    const total = equipment.length
    const totalValue = equipment.reduce((sum, e) => sum + e.value, 0)
    const insured = equipment.filter((e) => e.insuranceVerified).length
    const needsRepair = equipment.filter((e) => e.condition === 'needs_repair').length

    const byCategory = Object.entries(
      equipment.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1])

    const valueByCategory = Object.entries(
      equipment.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.value
        return acc
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1])

    return { total, totalValue, insured, needsRepair, byCategory, valueByCategory }
  }, [equipment])

  const handleExport = (type: 'tasks' | 'content' | 'equipment') => {
    let data: unknown[] = []
    let filename = ''

    switch (type) {
      case 'tasks':
        data = tasks.map((t) => ({
          Title: t.title,
          Status: t.status,
          Priority: t.priority,
          Category: t.category,
          Assignees: t.assignees.map((id) => teamMembers.find((m) => m.id === id)?.displayName).join(', '),
          'Due Date': t.dueDate ? new Date((t.dueDate as { seconds: number }).seconds * 1000).toLocaleDateString() : '',
          'Subtasks Completed': `${t.subtasks.filter((s) => s.completed).length}/${t.subtasks.length}`
        }))
        filename = 'tasks-report'
        break

      case 'content':
        data = content.map((c) => ({
          Title: c.title,
          Type: c.type,
          Platform: c.platform,
          Status: c.status,
          'Target Duration': c.targetDuration,
          Shooter: teamMembers.find((m) => m.id === c.assignedShooter)?.displayName || '',
          Editor: teamMembers.find((m) => m.id === c.assignedEditor)?.displayName || ''
        }))
        filename = 'content-report'
        break

      case 'equipment':
        data = equipment.map((e) => ({
          Name: e.name,
          Category: e.category,
          Value: e.value,
          Condition: e.condition,
          Owner: teamMembers.find((m) => m.id === e.ownerId)?.displayName || '',
          'Insurance Verified': e.insuranceVerified ? 'Yes' : 'No',
          'Serial Number': e.serialNumber || ''
        }))
        filename = 'equipment-report'
        break
    }

    importService.exportToCsv(data, filename)
  }

  return (
    <PageLayout
      title="Reports & Analytics"
      description="Track progress and performance metrics"
    >
      {/* Task Analytics */}
      <PageSection
        title="Task Analytics"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => handleExport('tasks')}
          >
            Export
          </Button>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={CheckSquare}
            label="Total Tasks"
            value={taskStats.total}
            color="primary"
          />
          <StatCard
            icon={TrendingUp}
            label="Completed"
            value={taskStats.completed}
            subvalue={`${taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%`}
            color="green"
          />
          <StatCard
            icon={BarChart3}
            label="In Progress"
            value={taskStats.inProgress}
            color="blue"
          />
          <StatCard
            icon={Calendar}
            label="Overdue"
            value={taskStats.overdue}
            color="red"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Task Status Donut Chart */}
          <Card>
            <CardHeader title="Task Status Overview" />
            <div className="mt-4 flex justify-center">
              <DonutChart
                data={[
                  { label: 'Completed', value: taskStats.completed, color: 'stroke-green-500' },
                  { label: 'In Progress', value: taskStats.inProgress, color: 'stroke-blue-500' },
                  { label: 'Overdue', value: taskStats.overdue, color: 'stroke-red-500' },
                  { label: 'Remaining', value: Math.max(0, taskStats.total - taskStats.completed - taskStats.inProgress - taskStats.overdue), color: 'stroke-surface-300' }
                ]}
                totalLabel="Tasks"
              />
            </div>
          </Card>

          {/* By Priority Bar Chart */}
          <Card>
            <CardHeader title="Tasks by Priority" />
            <div className="mt-4">
              <BarChart
                data={[
                  { label: 'Urgent', value: taskStats.byPriority.urgent, color: 'bg-red-500' },
                  { label: 'High', value: taskStats.byPriority.high, color: 'bg-orange-500' },
                  { label: 'Medium', value: taskStats.byPriority.medium, color: 'bg-blue-500' },
                  { label: 'Low', value: taskStats.byPriority.low, color: 'bg-surface-400' }
                ]}
                horizontal
              />
            </div>
          </Card>

          {/* By Assignee */}
          <Card className="lg:col-span-2">
            <CardHeader title="Tasks by Team Member" />
            <div className="mt-4">
              <BarChart
                data={taskStats.byAssignee.slice(0, 8).map((member) => ({
                  label: member.name.split(' ')[0],
                  value: member.completed,
                  color: 'bg-green-500'
                }))}
                height={180}
              />
              <p className="text-xs text-center text-surface-500 mt-2">Completed tasks per team member</p>
            </div>
          </Card>
        </div>
      </PageSection>

      {/* Content Analytics */}
      <PageSection
        title="Content Analytics"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => handleExport('content')}
          >
            Export
          </Button>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Film}
            label="Total Content"
            value={contentStats.total}
            color="primary"
          />
          <StatCard
            icon={TrendingUp}
            label="Posted"
            value={contentStats.posted}
            subvalue={`${contentStats.total > 0 ? Math.round((contentStats.posted / contentStats.total) * 100) : 0}%`}
            color="green"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Content Status Donut */}
          <Card>
            <CardHeader title="Content Status" />
            <div className="mt-4 flex justify-center">
              <DonutChart
                data={contentStats.byStatus.map(([status, count], idx) => ({
                  label: status.charAt(0).toUpperCase() + status.slice(1),
                  value: count,
                  color: status === 'posted' ? 'stroke-green-500' :
                         status === 'editing' ? 'stroke-amber-500' :
                         status === 'shooting' ? 'stroke-blue-500' :
                         status === 'review' ? 'stroke-purple-500' : 'stroke-surface-400'
                }))}
                totalLabel="Items"
              />
            </div>
          </Card>

          {/* By Type Bar Chart */}
          <Card>
            <CardHeader title="Content by Type" />
            <div className="mt-4">
              <BarChart
                data={contentStats.byType.slice(0, 6).map(([type, count]) => ({
                  label: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
                  value: count,
                  color: 'bg-pink-500'
                }))}
                horizontal
              />
            </div>
          </Card>
        </div>
      </PageSection>

      {/* Equipment Analytics */}
      <PageSection
        title="Equipment Analytics"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => handleExport('equipment')}
          >
            Export
          </Button>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Package}
            label="Total Items"
            value={equipmentStats.total}
            color="primary"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Value"
            value={`$${equipmentStats.totalValue.toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={CheckSquare}
            label="Insured"
            value={equipmentStats.insured}
            subvalue={`${equipmentStats.total > 0 ? Math.round((equipmentStats.insured / equipmentStats.total) * 100) : 0}%`}
            color="blue"
          />
          <StatCard
            icon={BarChart3}
            label="Needs Repair"
            value={equipmentStats.needsRepair}
            color="amber"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Equipment Category Donut */}
          <Card>
            <CardHeader title="Items by Category" />
            <div className="mt-4 flex justify-center">
              <DonutChart
                data={equipmentStats.byCategory.slice(0, 6).map(([category, count], idx) => ({
                  label: category.charAt(0).toUpperCase() + category.slice(1),
                  value: count,
                  color: ['stroke-primary-500', 'stroke-accent-500', 'stroke-emerald-500', 'stroke-amber-500', 'stroke-pink-500', 'stroke-cyan-500'][idx % 6]
                }))}
                totalLabel="Items"
              />
            </div>
          </Card>

          {/* Value by Category Bar Chart */}
          <Card>
            <CardHeader title="Value by Category" />
            <div className="mt-4">
              <BarChart
                data={equipmentStats.valueByCategory.slice(0, 6).map(([category, value]) => ({
                  label: category.charAt(0).toUpperCase() + category.slice(1),
                  value,
                  color: 'bg-emerald-500'
                }))}
                horizontal
                showValues
              />
            </div>
          </Card>

          {/* Equipment Overview Stats */}
          <Card className="lg:col-span-2">
            <CardHeader title="Equipment Summary" />
            <div className="mt-4 grid sm:grid-cols-3 gap-6">
              <StatTrend
                label="Insurance Coverage"
                value={equipmentStats.total > 0 ? Math.round((equipmentStats.insured / equipmentStats.total) * 100) : 0}
                format={(v) => `${v}%`}
                trend={equipmentStats.insured === equipmentStats.total ? 'up' : 'neutral'}
                trendLabel={`${equipmentStats.insured}/${equipmentStats.total} verified`}
              />
              <StatTrend
                label="Condition Status"
                value={equipmentStats.total > 0 ? Math.round(((equipmentStats.total - equipmentStats.needsRepair) / equipmentStats.total) * 100) : 0}
                format={(v) => `${v}%`}
                trend={equipmentStats.needsRepair === 0 ? 'up' : equipmentStats.needsRepair > 2 ? 'down' : 'neutral'}
                trendLabel={equipmentStats.needsRepair > 0 ? `${equipmentStats.needsRepair} need repair` : 'All good'}
              />
              <StatTrend
                label="Total Asset Value"
                value={equipmentStats.totalValue}
                format={(v) => `$${Number(v).toLocaleString()}`}
                trend="neutral"
                trendLabel="Across all items"
              />
            </div>
          </Card>
        </div>
      </PageSection>
    </PageLayout>
  )
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  subvalue?: string
  color: 'primary' | 'green' | 'blue' | 'red' | 'amber'
}

function StatCard({ icon: Icon, label, value, subvalue, color }: StatCardProps) {
  const colors = {
    primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
  }

  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg', colors[color])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-surface-500">{label}</p>
        </div>
        {subvalue && (
          <span className="ml-auto text-sm text-surface-500">{subvalue}</span>
        )}
      </div>
    </Card>
  )
}

interface ProgressRowProps {
  label: string
  value: number
  max: number
  color: string
}

function ProgressRow({ label, value, max, color }: ProgressRowProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-surface-600 dark:text-surface-400">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
