import { useState } from 'react'
import { CheckCircle, XCircle, RotateCcw, MessageSquare, Clock, User } from 'lucide-react'
import { Button, Badge, Modal, ModalFooter } from '../ui'
import type { ContentItem, ContentApproval, ApprovalStatus } from '../../types/content.types'
import { APPROVAL_STATUS_LABELS, APPROVAL_STATUS_COLORS } from '../../types/content.types'
import { cn } from '../../utils/cn'
import { formatDistanceToNow } from 'date-fns'

interface ApprovalWorkflowProps {
  content: ContentItem
  currentUserId: string
  isReviewer: boolean
  teamMembers: { id: string; displayName: string }[]
  onSubmitForReview: (contentId: string) => void
  onApprove: (contentId: string, comments?: string) => void
  onReject: (contentId: string, comments: string) => void
  onRequestRevision: (contentId: string, comments: string) => void
}

export function ApprovalWorkflow({
  content,
  currentUserId,
  isReviewer,
  teamMembers,
  onSubmitForReview,
  onApprove,
  onReject,
  onRequestRevision
}: ApprovalWorkflowProps) {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'revision' | null>(null)
  const [comments, setComments] = useState('')

  const latestApproval = content.approvals?.[content.approvals.length - 1]
  const canSubmitForReview = content.status === 'editing' && !latestApproval
  const canReview = isReviewer && latestApproval?.status === 'pending'

  const getMemberName = (userId: string) => {
    return teamMembers.find(m => m.id === userId)?.displayName || 'Unknown'
  }

  const handleSubmitReview = () => {
    if (!reviewAction) return

    switch (reviewAction) {
      case 'approve':
        onApprove(content.id, comments || undefined)
        break
      case 'reject':
        if (!comments.trim()) return
        onReject(content.id, comments)
        break
      case 'revision':
        if (!comments.trim()) return
        onRequestRevision(content.id, comments)
        break
    }

    setShowReviewModal(false)
    setReviewAction(null)
    setComments('')
  }

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
            Approval Status:
          </span>
          {latestApproval ? (
            <Badge className={APPROVAL_STATUS_COLORS[latestApproval.status]}>
              {APPROVAL_STATUS_LABELS[latestApproval.status]}
            </Badge>
          ) : (
            <Badge variant="outline">Not Submitted</Badge>
          )}
        </div>

        {canSubmitForReview && (
          <Button
            size="sm"
            onClick={() => onSubmitForReview(content.id)}
          >
            Submit for Review
          </Button>
        )}

        {canReview && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-300 hover:bg-green-50"
              leftIcon={<CheckCircle className="h-4 w-4" />}
              onClick={() => {
                setReviewAction('approve')
                setShowReviewModal(true)
              }}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={() => {
                setReviewAction('revision')
                setShowReviewModal(true)
              }}
            >
              Request Changes
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              leftIcon={<XCircle className="h-4 w-4" />}
              onClick={() => {
                setReviewAction('reject')
                setShowReviewModal(true)
              }}
            >
              Reject
            </Button>
          </div>
        )}
      </div>

      {/* Approval History */}
      {content.approvals && content.approvals.length > 0 && (
        <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
          <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
            Review History
          </h4>
          <div className="space-y-3">
            {content.approvals.slice().reverse().map((approval, index) => (
              <ApprovalHistoryItem
                key={approval.id || index}
                approval={approval}
                reviewerName={getMemberName(approval.reviewerId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        open={showReviewModal}
        onClose={() => {
          setShowReviewModal(false)
          setReviewAction(null)
          setComments('')
        }}
        title={
          reviewAction === 'approve' ? 'Approve Content' :
          reviewAction === 'reject' ? 'Reject Content' :
          'Request Revision'
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            {reviewAction === 'approve' && 'Approve this content for posting. You can add optional comments.'}
            {reviewAction === 'reject' && 'Reject this content. Please provide a reason.'}
            {reviewAction === 'revision' && 'Request changes to this content. Please describe what needs to be revised.'}
          </p>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Comments {reviewAction !== 'approve' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={
                reviewAction === 'approve' ? 'Optional feedback...' :
                reviewAction === 'reject' ? 'Reason for rejection...' :
                'Describe the changes needed...'
              }
              rows={4}
              className={cn(
                'w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600',
                'bg-white dark:bg-surface-800 text-surface-900 dark:text-white',
                'placeholder-surface-500 resize-none',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              )}
            />
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            disabled={reviewAction !== 'approve' && !comments.trim()}
            className={cn(
              reviewAction === 'approve' && 'bg-green-600 hover:bg-green-700',
              reviewAction === 'reject' && 'bg-red-600 hover:bg-red-700',
              reviewAction === 'revision' && 'bg-amber-600 hover:bg-amber-700'
            )}
          >
            {reviewAction === 'approve' && 'Approve'}
            {reviewAction === 'reject' && 'Reject'}
            {reviewAction === 'revision' && 'Request Revision'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

interface ApprovalHistoryItemProps {
  approval: ContentApproval
  reviewerName: string
}

function ApprovalHistoryItem({ approval, reviewerName }: ApprovalHistoryItemProps) {
  const formatTime = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return ''
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
    } catch {
      return ''
    }
  }

  const StatusIcon = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
    revision_requested: RotateCcw
  }[approval.status]

  const statusColor = {
    pending: 'text-amber-500',
    approved: 'text-green-500',
    rejected: 'text-red-500',
    revision_requested: 'text-orange-500'
  }[approval.status]

  return (
    <div className="flex gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
      <StatusIcon className={cn('h-5 w-5 mt-0.5 shrink-0', statusColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{reviewerName}</span>
          <Badge className={APPROVAL_STATUS_COLORS[approval.status]} size="sm">
            {APPROVAL_STATUS_LABELS[approval.status]}
          </Badge>
        </div>
        {approval.comments && (
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
            {approval.comments}
          </p>
        )}
        <p className="text-xs text-surface-500 mt-1">
          {formatTime(approval.createdAt)}
        </p>
      </div>
    </div>
  )
}
