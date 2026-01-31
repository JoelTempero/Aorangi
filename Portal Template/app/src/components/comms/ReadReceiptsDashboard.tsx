import { Modal, Avatar, Badge } from '../ui'
import { cn } from '../../utils/cn'
import { Check, X, Eye, Users } from 'lucide-react'
import type { Announcement } from '../../types'

interface ReadReceiptsDashboardProps {
  open: boolean
  onClose: () => void
  announcement: Announcement | null
  teamMembers: { id: string; displayName: string; photoURL?: string }[]
}

export function ReadReceiptsDashboard({
  open,
  onClose,
  announcement,
  teamMembers
}: ReadReceiptsDashboardProps) {
  if (!announcement) return null

  const readBy = announcement.readBy || []
  const confirmedBy = announcement.confirmedBy || []

  const readMembers = teamMembers.filter((m) => readBy.includes(m.id))
  const unreadMembers = teamMembers.filter((m) => !readBy.includes(m.id))

  const readPercentage = teamMembers.length > 0
    ? Math.round((readMembers.length / teamMembers.length) * 100)
    : 0

  const confirmedPercentage = announcement.requiresConfirmation && teamMembers.length > 0
    ? Math.round((confirmedBy.length / teamMembers.length) * 100)
    : null

  return (
    <Modal open={open} onClose={onClose} title="Read Receipts" size="md">
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 mb-2">
              <Eye className="h-5 w-5" />
              <span className="text-2xl font-bold">{readPercentage}%</span>
            </div>
            <p className="text-sm text-surface-500">
              {readMembers.length} of {teamMembers.length} have read
            </p>
          </div>

          {announcement.requiresConfirmation && confirmedPercentage !== null && (
            <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <Check className="h-5 w-5" />
                <span className="text-2xl font-bold">{confirmedPercentage}%</span>
              </div>
              <p className="text-sm text-surface-500">
                {confirmedBy.length} of {teamMembers.length} confirmed
              </p>
            </div>
          )}
        </div>

        {/* Read Members */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Check className="h-4 w-4 text-green-500" />
            <h4 className="font-medium text-surface-900 dark:text-surface-100">
              Seen by ({readMembers.length})
            </h4>
          </div>
          {readMembers.length === 0 ? (
            <p className="text-sm text-surface-500 italic">No one has seen this yet</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {readMembers.map((member) => {
                const hasConfirmed = confirmedBy.includes(member.id)
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/10"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={member.photoURL}
                        name={member.displayName}
                        size="sm"
                      />
                      <span className="text-sm font-medium text-surface-900 dark:text-surface-100">
                        {member.displayName}
                      </span>
                    </div>
                    {announcement.requiresConfirmation && (
                      <Badge
                        className={cn(
                          hasConfirmed
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        )}
                      >
                        {hasConfirmed ? 'Confirmed' : 'Pending'}
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Unread Members */}
        {unreadMembers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <X className="h-4 w-4 text-surface-400" />
              <h4 className="font-medium text-surface-900 dark:text-surface-100">
                Not seen yet ({unreadMembers.length})
              </h4>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {unreadMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-surface-50 dark:bg-surface-800"
                >
                  <Avatar
                    src={member.photoURL}
                    name={member.displayName}
                    size="sm"
                    className="opacity-50"
                  />
                  <span className="text-sm text-surface-500">
                    {member.displayName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
