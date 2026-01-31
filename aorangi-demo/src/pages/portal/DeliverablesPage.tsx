import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { FileDown, Check, X, MessageSquare, ExternalLink, Image, Video, FileText, Database, Box } from 'lucide-react'
import { usePortalStore } from '@/stores/portalStore'
import { PageTransition } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { formatDate, formatFileSize } from '@/lib/utils'
import { cn } from '@/lib/utils'

const typeIcons = {
  image: Image,
  video: Video,
  document: FileText,
  data: Database,
  '3d_model': Box,
  point_cloud: Box,
}

const statusConfig = {
  pending: { label: 'Processing', color: 'text-white/60', bg: 'bg-white/10' },
  ready: { label: 'Ready for Review', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  approved: { label: 'Approved', color: 'text-green-500', bg: 'bg-green-500/10' },
  revision_requested: { label: 'Revision Requested', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
}

export default function DeliverablesPage() {
  const { deliverables, projects, approveDeliverable, requestRevision } = usePortalStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [revisionComment, setRevisionComment] = useState('')
  const [showRevisionModal, setShowRevisionModal] = useState(false)

  const handleApprove = (id: string) => {
    approveDeliverable(id)
  }

  const handleRequestRevision = () => {
    if (selectedId && revisionComment.trim()) {
      requestRevision(selectedId, revisionComment)
      setShowRevisionModal(false)
      setRevisionComment('')
      setSelectedId(null)
    }
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.name || 'Unknown Project'
  }

  const readyDeliverables = deliverables.filter((d) => d.status === 'ready')
  // Filter for section display - using all deliverables in main list
  const _otherDeliverables = deliverables.filter((d) => d.status !== 'ready')
  void _otherDeliverables // Suppress unused warning for future use

  return (
    <PageTransition>
      <Helmet>
        <title>Deliverables | Aorangi Aerials Portal</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="heading-display text-2xl text-white">Deliverables</h1>
          <p className="text-white/60">Review and approve your project deliverables.</p>
        </div>

        {/* Pending Review Section */}
        {readyDeliverables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border border-accent-blue/30 rounded-xl p-6"
          >
            <h2 className="font-display font-semibold text-white mb-4">
              Awaiting Your Review ({readyDeliverables.length})
            </h2>

            <div className="grid gap-4">
              {readyDeliverables.map((deliverable) => {
                const TypeIcon = typeIcons[deliverable.type] || FileDown

                return (
                  <div
                    key={deliverable.id}
                    className="bg-dark-card border border-dark-border rounded-xl p-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-lg bg-dark-lighter flex items-center justify-center flex-shrink-0">
                        <TypeIcon className="w-8 h-8 text-white/20" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-white font-medium">{deliverable.name}</p>
                            <p className="text-white/50 text-sm">{getProjectName(deliverable.projectId)}</p>
                            <p className="text-white/40 text-xs mt-1">
                              {formatFileSize(deliverable.fileSize)} • Uploaded {formatDate(deliverable.uploadedAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(deliverable.id)}
                              className="gap-1"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setSelectedId(deliverable.id)
                                setShowRevisionModal(true)
                              }}
                              className="gap-1"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Request Changes
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                          <button className="text-accent-blue text-sm hover:underline flex items-center gap-1">
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
          </motion.div>
        )}

        {/* All Deliverables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl"
        >
          <div className="p-4 border-b border-dark-border">
            <h2 className="font-display font-semibold text-white">All Deliverables</h2>
          </div>

          {deliverables.length === 0 ? (
            <div className="p-12 text-center">
              <FileDown className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">No deliverables yet</p>
              <p className="text-white/30 text-sm">Your project files will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-border">
              {deliverables.map((deliverable) => {
                const TypeIcon = typeIcons[deliverable.type] || FileDown
                const status = statusConfig[deliverable.status]

                return (
                  <div key={deliverable.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-dark-lighter flex items-center justify-center flex-shrink-0">
                        <TypeIcon className="w-5 h-5 text-white/20" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{deliverable.name}</p>
                        <p className="text-white/50 text-sm truncate">{getProjectName(deliverable.projectId)}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={cn('px-2 py-0.5 rounded text-xs font-medium', status.bg, status.color)}>
                          {status.label}
                        </span>
                        <span className="text-white/40 text-sm hidden sm:block">
                          {formatFileSize(deliverable.fileSize)}
                        </span>
                        <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                          <FileDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Revision Request Modal */}
      <AnimatePresence>
        {showRevisionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRevisionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white text-lg">Request Revision</h3>
                <button
                  onClick={() => setShowRevisionModal(false)}
                  className="p-1 rounded hover:bg-white/10 text-white/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-white/60 text-sm mb-4">
                Please describe the changes you'd like made to this deliverable.
              </p>

              <textarea
                value={revisionComment}
                onChange={(e) => setRevisionComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors resize-none mb-4"
                placeholder="Describe the changes needed..."
              />

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowRevisionModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleRequestRevision} className="flex-1" disabled={!revisionComment.trim()}>
                  Submit Request
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
