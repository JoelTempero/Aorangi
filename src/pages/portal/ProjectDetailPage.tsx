import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Cloud,
  FileDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { usePortalStore } from '@/stores/portalStore'
import { PageTransition } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { formatDate, formatFileSize } from '@/lib/utils'
import { cn } from '@/lib/utils'

const statusConfig = {
  pending: { label: 'Pending', color: 'text-white/60', bg: 'bg-white/10' },
  ready: { label: 'Ready for Review', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  approved: { label: 'Approved', color: 'text-green-500', bg: 'bg-green-500/10' },
  revision_requested: { label: 'Revision Requested', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { projects, deliverables } = usePortalStore()

  const project = projects.find((p) => p.id === id)
  const projectDeliverables = deliverables.filter((d) => d.projectId === id)

  if (!project) {
    return <Navigate to="/portal/projects" replace />
  }

  const projectStatusConfig = {
    pending: { label: 'Scheduled', color: 'text-white/60', bg: 'bg-white/10', icon: Clock },
    in_progress: { label: 'In Progress', color: 'text-accent-blue', bg: 'bg-accent-blue/10', icon: Clock },
    review: { label: 'Review', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertCircle },
    completed: { label: 'Completed', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
  }

  const status = projectStatusConfig[project.status]

  return (
    <PageTransition>
      <Helmet>
        <title>{project.name} | Aorangi Aerials Portal</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link
            to="/portal/projects"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="heading-display text-2xl text-white">{project.name}</h1>
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', status.bg, status.color)}>
                  {status.label}
                </span>
              </div>
              <p className="text-white/60">{project.service}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right mr-4">
                <p className="text-white/40 text-sm">Progress</p>
                <p className="text-white text-2xl font-bold">{project.progress}%</p>
              </div>
              <div className="w-24 h-24 relative">
                <svg className="w-24 h-24 -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-dark-border"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={251}
                    strokeDashoffset={251 - (project.progress / 100) * 251}
                    className="text-accent-blue transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6"
            >
              <h2 className="font-display font-semibold text-white mb-4">Project Description</h2>
              <p className="text-white/70">{project.description}</p>
            </motion.div>

            {/* Deliverables */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-card border border-dark-border rounded-xl"
            >
              <div className="p-4 border-b border-dark-border flex items-center justify-between">
                <h2 className="font-display font-semibold text-white">Deliverables</h2>
                <span className="text-white/40 text-sm">{projectDeliverables.length} files</span>
              </div>

              {projectDeliverables.length === 0 ? (
                <div className="p-8 text-center">
                  <FileDown className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">No deliverables yet</p>
                  <p className="text-white/30 text-sm">Files will appear here once processing is complete.</p>
                </div>
              ) : (
                <div className="divide-y divide-dark-border">
                  {projectDeliverables.map((deliverable) => {
                    const delStatus = statusConfig[deliverable.status]

                    return (
                      <div key={deliverable.id} className="p-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Thumbnail placeholder */}
                          <div className="w-16 h-16 rounded-lg bg-dark-lighter flex items-center justify-center flex-shrink-0">
                            <FileDown className="w-6 h-6 text-white/20" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-white font-medium truncate">{deliverable.name}</p>
                                <p className="text-white/50 text-sm">
                                  {formatFileSize(deliverable.fileSize)} • {deliverable.type.replace('_', ' ')}
                                </p>
                              </div>
                              <span className={cn('px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap', delStatus.bg, delStatus.color)}>
                                {delStatus.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 mt-3">
                              {deliverable.status === 'ready' && (
                                <Link
                                  to="/portal/deliverables"
                                  className="text-accent-blue text-sm hover:underline"
                                >
                                  Review & Approve
                                </Link>
                              )}
                              <button className="text-white/60 text-sm hover:text-white flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                Preview
                              </button>
                              <button className="text-white/60 text-sm hover:text-white flex items-center gap-1">
                                <FileDown className="w-3 h-3" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6"
            >
              <h3 className="font-display font-semibold text-white mb-4">Project Info</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
                  <div>
                    <p className="text-white/40 text-sm">Location</p>
                    <p className="text-white">{project.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-white/40 mt-0.5" />
                  <div>
                    <p className="text-white/40 text-sm">Start Date</p>
                    <p className="text-white">{formatDate(project.startDate)}</p>
                  </div>
                </div>

                {project.endDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-white/40 mt-0.5" />
                    <div>
                      <p className="text-white/40 text-sm">End Date</p>
                      <p className="text-white">{formatDate(project.endDate)}</p>
                    </div>
                  </div>
                )}

                {project.flightDate && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-white/40 mt-0.5" />
                    <div>
                      <p className="text-white/40 text-sm">Flight Date</p>
                      <p className="text-white">{formatDate(project.flightDate)}</p>
                    </div>
                  </div>
                )}

                {project.weather && (
                  <div className="flex items-start gap-3">
                    <Cloud className="w-4 h-4 text-white/40 mt-0.5" />
                    <div>
                      <p className="text-white/40 text-sm">Weather</p>
                      <p className="text-white">{project.weather}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6"
            >
              <h3 className="font-display font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-start">
                  <FileDown className="w-4 h-4 mr-2" />
                  Download All Files
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Request Support
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
