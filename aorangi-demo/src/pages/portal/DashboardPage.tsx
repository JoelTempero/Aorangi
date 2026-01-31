import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  FolderOpen,
  FileDown,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plane,
} from 'lucide-react'
import { usePortalStore } from '@/stores/portalStore'
import { useWeather, getFlightConditionColor, getFlightConditionBg } from '@/hooks/useWeather'
import { PageTransition } from '@/components/effects/PageTransition'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { user, projects, deliverables, invoices, notifications } = usePortalStore()
  const { data: weather } = useWeather()

  const activeProjects = projects.filter((p) => p.status !== 'completed')
  const pendingDeliverables = deliverables.filter((d) => d.status === 'ready')
  const unpaidInvoices = invoices.filter((i) => i.status === 'sent')

  const stats = [
    {
      label: 'Active Projects',
      value: activeProjects.length,
      icon: FolderOpen,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
    },
    {
      label: 'Pending Review',
      value: pendingDeliverables.length,
      icon: FileDown,
      color: 'text-accent-purple',
      bg: 'bg-accent-purple/10',
    },
    {
      label: 'Unpaid Invoices',
      value: unpaidInvoices.length,
      icon: Receipt,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
  ]

  return (
    <PageTransition>
      <Helmet>
        <title>Dashboard | Aorangi Aerials Portal</title>
      </Helmet>

      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="heading-display text-2xl text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-white/60">Here's an overview of your projects.</p>
          </div>

          {/* Weather Widget */}
          {weather && (
            <div
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-xl border',
                getFlightConditionBg(weather.flightConditions)
              )}
            >
              <Plane className={cn('w-5 h-5', getFlightConditionColor(weather.flightConditions))} />
              <div>
                <p className={cn('text-sm font-medium', getFlightConditionColor(weather.flightConditions))}>
                  {weather.flightConditions.charAt(0).toUpperCase() + weather.flightConditions.slice(1)} Conditions
                </p>
                <p className="text-white/60 text-xs">
                  {weather.temperature}°C, {weather.windSpeed}km/h {weather.windDirection}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-3xl font-display font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-6 h-6', stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-card border border-dark-border rounded-xl"
          >
            <div className="p-4 border-b border-dark-border flex items-center justify-between">
              <h2 className="font-display font-semibold text-white">Recent Projects</h2>
              <Link to="/portal/projects" className="text-accent-blue text-sm hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-dark-border">
              {projects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  to={`/portal/projects/${project.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      project.status === 'completed'
                        ? 'bg-green-500/10'
                        : project.status === 'in_progress'
                        ? 'bg-accent-blue/10'
                        : project.status === 'review'
                        ? 'bg-yellow-500/10'
                        : 'bg-white/5'
                    )}
                  >
                    {project.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : project.status === 'review' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-accent-blue" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{project.name}</p>
                    <p className="text-white/50 text-sm">{project.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">{project.progress}%</p>
                    <div className="w-16 h-1.5 bg-dark-lighter rounded-full mt-1">
                      <div
                        className="h-full bg-accent-blue rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-card border border-dark-border rounded-xl"
          >
            <div className="p-4 border-b border-dark-border">
              <h2 className="font-display font-semibold text-white">Recent Activity</h2>
            </div>
            <div className="divide-y divide-dark-border">
              {notifications.slice(0, 4).map((notif) => (
                <div key={notif.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-2',
                        notif.read ? 'bg-white/20' : 'bg-accent-blue'
                      )}
                    />
                    <div>
                      <p className="text-white font-medium text-sm">{notif.title}</p>
                      <p className="text-white/50 text-sm mt-0.5 line-clamp-1">{notif.message}</p>
                      <p className="text-white/30 text-xs mt-1">{formatDate(notif.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Pending Deliverables */}
        {pendingDeliverables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border border-dark-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-white text-lg">
                  {pendingDeliverables.length} Deliverables Awaiting Review
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  Review and approve your project deliverables.
                </p>
              </div>
              <Link
                to="/portal/deliverables"
                className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
              >
                Review Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
