import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import { usePortalStore } from '@/stores/portalStore'
import { PageTransition } from '@/components/effects/PageTransition'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const statusConfig = {
  pending: { label: 'Scheduled', color: 'text-white/60', bg: 'bg-white/10', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-accent-blue', bg: 'bg-accent-blue/10', icon: Clock },
  review: { label: 'Review', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertCircle },
  completed: { label: 'Completed', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
}

export default function ProjectsPage() {
  const { projects } = usePortalStore()

  return (
    <PageTransition>
      <Helmet>
        <title>Projects | Aorangi Aerials Portal</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="heading-display text-2xl text-white">Projects</h1>
          <p className="text-white/60">View and manage your drone service projects.</p>
        </div>

        {/* Kanban-style board */}
        <div className="grid lg:grid-cols-4 gap-6">
          {(['pending', 'in_progress', 'review', 'completed'] as const).map((status) => {
            const config = statusConfig[status]
            const statusProjects = projects.filter((p) => p.status === status)

            return (
              <div key={status} className="space-y-4">
                <div className="flex items-center gap-2">
                  <config.icon className={cn('w-4 h-4', config.color)} />
                  <h2 className={cn('font-medium', config.color)}>{config.label}</h2>
                  <span className="text-white/40 text-sm">({statusProjects.length})</span>
                </div>

                <div className="space-y-3">
                  {statusProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/portal/projects/${project.id}`}
                        className="block bg-dark-card border border-dark-border rounded-xl p-4 hover:border-accent-blue/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn('px-2 py-0.5 rounded text-xs font-medium', config.bg, config.color)}>
                            {project.service}
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-accent-blue transition-colors" />
                        </div>

                        <h3 className="font-medium text-white mb-2 group-hover:text-accent-blue transition-colors">
                          {project.name}
                        </h3>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-white/50">
                            <MapPin className="w-3 h-3" />
                            {project.location}
                          </div>
                          <div className="flex items-center gap-2 text-white/50">
                            <Calendar className="w-3 h-3" />
                            {formatDate(project.startDate)}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/40">Progress</span>
                            <span className="text-white/60">{project.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-dark-lighter rounded-full">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                status === 'completed' ? 'bg-green-500' : 'bg-accent-blue'
                              )}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        {project.flightDate && status === 'pending' && (
                          <div className="mt-3 p-2 bg-accent-blue/10 rounded-lg">
                            <p className="text-accent-blue text-xs">
                              Flight scheduled: {formatDate(project.flightDate)}
                            </p>
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  ))}

                  {statusProjects.length === 0 && (
                    <div className="text-center py-8 text-white/30 text-sm">
                      No {config.label.toLowerCase()} projects
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}
