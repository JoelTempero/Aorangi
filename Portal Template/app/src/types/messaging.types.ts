import type { FirestoreTimestamp } from './common.types'
import type { TeamType } from './user.types'

export interface Channel {
  id: string
  name: string
  description?: string
  team?: TeamType // null = general channel for all teams
  memberIds: string[]
  lastMessageAt?: FirestoreTimestamp
  lastMessagePreview?: string
  createdBy: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface Message {
  id: string
  channelId: string
  authorId: string
  content: string
  mentions: string[]
  attachments: MessageAttachment[]
  reactions: Record<string, string[]> // emoji -> userIds
  edited: boolean
  deleted: boolean
  replyToId?: string
  createdAt: FirestoreTimestamp
  updatedAt?: FirestoreTimestamp
}

export interface MessageAttachment {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
}

export const DEFAULT_CHANNELS: Omit<Channel, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'memberIds'>[] = [
  { name: 'General', description: 'General discussion for everyone' },
  { name: 'Video Team', description: 'Video team coordination', team: 'video' },
  { name: 'Photo Team', description: 'Photo team coordination', team: 'photo' },
  { name: 'Socials Team', description: 'Social media team coordination', team: 'socials' },
  { name: 'Support Team', description: 'Support team coordination', team: 'support' }
]
