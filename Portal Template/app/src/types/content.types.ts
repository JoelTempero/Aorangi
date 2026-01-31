import type { FirestoreTimestamp } from './common.types'

export type ContentType = 'reel' | 'story' | 'feed' | 'highlight' | 'segment' | 'supercut' | 'photo_reel' | 'testimony' | 'shoutout'
export type ContentPlatform = 'instagram' | 'bigtop' | 'both'
export type ContentStatus = 'planning' | 'shooting' | 'editing' | 'review' | 'approved' | 'posted'

export interface ContentAsset {
  id: string
  url: string
  path: string
  filename: string
  mimeType: string
  size: number
  uploadedBy: string
  uploadedAt: FirestoreTimestamp
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested'

export interface ContentApproval {
  id: string
  status: ApprovalStatus
  reviewerId: string
  comments?: string
  createdAt: FirestoreTimestamp
}

export interface ContentMetrics {
  contentId: string
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  reach: number
  engagementRate: number
  capturedAt: FirestoreTimestamp
}

export interface ContentItem {
  id: string
  eventId: string
  title: string
  description?: string
  type: ContentType
  platform: ContentPlatform
  status: ContentStatus
  targetDuration: number // seconds
  actualDuration?: number
  scheduledPostTime?: FirestoreTimestamp
  scheduledBigtopTime?: FirestoreTimestamp
  bigtopOrder?: number
  assignedShooter?: string
  assignedEditor?: string
  assignedReviewer?: string
  assetLinks: string[]
  assets?: ContentAsset[]
  thumbnailUrl?: string
  instagramUrl?: string
  notes: string
  tags: string[]
  // Approval workflow
  approvals?: ContentApproval[]
  currentApprovalStatus?: ApprovalStatus
  // Performance metrics
  latestMetrics?: ContentMetrics
  createdBy: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
  postedAt?: FirestoreTimestamp
}

export interface BigtopPlayoutItem {
  contentId: string
  order: number
  startTime?: FirestoreTimestamp
  duration: number
  played: boolean
  playedAt?: FirestoreTimestamp
}

export interface BigtopPlayout {
  id: string
  eventId: string
  dayId: string
  slotType: 'am' | 'pm'
  items: BigtopPlayoutItem[]
  totalDuration: number
  notes?: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  reel: 'Reel',
  story: 'Story',
  feed: 'Feed Post',
  highlight: 'Highlight',
  segment: 'Segment',
  supercut: 'Supercut',
  photo_reel: 'Photo Reel',
  testimony: 'Testimony',
  shoutout: 'Shoutout'
}

export const CONTENT_TYPE_COLORS: Record<ContentType, string> = {
  reel: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  story: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  feed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  highlight: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  segment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  supercut: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  photo_reel: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  testimony: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  shoutout: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
}

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  planning: 'Planning',
  shooting: 'Shooting',
  editing: 'Editing',
  review: 'In Review',
  approved: 'Approved',
  posted: 'Posted'
}

export const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  planning: 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300',
  shooting: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  editing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  review: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  posted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
}

export const CONTENT_PLATFORM_LABELS: Record<ContentPlatform, string> = {
  instagram: 'Instagram',
  bigtop: 'Big Top',
  both: 'Both'
}

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  revision_requested: 'Revision Requested'
}

export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  revision_requested: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
}
