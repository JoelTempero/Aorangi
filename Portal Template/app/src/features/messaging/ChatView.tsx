import { useRef, useEffect } from 'react'
import { Hash, Users, SmilePlus } from 'lucide-react'
import { Card } from '../../components/ui'
import { MessageInput } from './MessageInput'
import type { Channel, Message } from '../../types/messaging.types'
import type { TeamMember } from '../../types/user.types'
import { cn } from '../../utils/cn'
import { formatDistanceToNow } from 'date-fns'

interface ChatViewProps {
  channel: Channel | null
  messages: Message[]
  teamMembers: TeamMember[]
  currentUserId?: string
  onSendMessage: (content: string, mentions: string[]) => Promise<void>
  onReaction: (messageId: string, emoji: string) => void
  loading: boolean
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '🔥']

export function ChatView({
  channel,
  messages,
  teamMembers,
  currentUserId,
  onSendMessage,
  onReaction,
  loading
}: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getMember = (userId: string) => {
    return teamMembers.find(m => m.id === userId)
  }

  const formatMessageTime = (timestamp: { toDate?: () => Date } | undefined) => {
    if (!timestamp?.toDate) return ''
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
    } catch {
      return ''
    }
  }

  if (!channel) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-surface-500">
          <Hash className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a channel to start chatting</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Channel Header */}
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-2">
          {channel.team ? (
            <Users className="w-5 h-5 text-surface-500" />
          ) : (
            <Hash className="w-5 h-5 text-surface-500" />
          )}
          <h2 className="font-semibold text-surface-900 dark:text-white">
            {channel.name}
          </h2>
        </div>
        {channel.description && (
          <p className="text-sm text-surface-500 mt-1">{channel.description}</p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-surface-200 dark:bg-surface-700 rounded" />
                  <div className="h-4 w-3/4 bg-surface-100 dark:bg-surface-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-surface-500">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Be the first to say something!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const author = getMember(message.authorId)
              const isOwn = message.authorId === currentUserId
              const showAuthor = index === 0 || messages[index - 1].authorId !== message.authorId

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  author={author}
                  isOwn={isOwn}
                  showAuthor={showAuthor}
                  currentUserId={currentUserId}
                  onReaction={onReaction}
                  formatTime={formatMessageTime}
                  teamMembers={teamMembers}
                />
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        onSend={onSendMessage}
        teamMembers={teamMembers}
        disabled={!currentUserId}
        placeholder={`Message #${channel.name}`}
      />
    </Card>
  )
}

interface MessageBubbleProps {
  message: Message
  author: TeamMember | undefined
  isOwn: boolean
  showAuthor: boolean
  currentUserId?: string
  onReaction: (messageId: string, emoji: string) => void
  formatTime: (timestamp: any) => string
  teamMembers: TeamMember[]
}

function MessageBubble({
  message,
  author,
  isOwn,
  showAuthor,
  currentUserId,
  onReaction,
  formatTime,
  teamMembers
}: MessageBubbleProps) {
  // Parse mentions in content
  const renderContent = (content: string) => {
    const parts = content.split(/(@\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const handle = part.slice(1)
        const member = teamMembers.find(
          m => m.displayName.toLowerCase().replace(/\s+/g, '') === handle.toLowerCase()
        )
        if (member) {
          return (
            <span
              key={index}
              className="text-primary-600 dark:text-primary-400 font-medium"
            >
              {part}
            </span>
          )
        }
      }
      return part
    })
  }

  return (
    <div className={cn('group flex gap-3', isOwn && 'flex-row-reverse')}>
      {showAuthor && (
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-300 shrink-0">
          {author?.displayName?.charAt(0) || '?'}
        </div>
      )}
      {!showAuthor && <div className="w-8" />}

      <div className={cn('flex-1 min-w-0', isOwn && 'flex flex-col items-end')}>
        {showAuthor && (
          <div className={cn('flex items-center gap-2 mb-1', isOwn && 'flex-row-reverse')}>
            <span className="font-medium text-sm text-surface-900 dark:text-white">
              {author?.displayName || 'Unknown'}
            </span>
            <span className="text-xs text-surface-500">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        <div
          className={cn(
            'rounded-lg px-3 py-2 max-w-[80%] inline-block',
            isOwn
              ? 'bg-primary-600 text-white'
              : 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white'
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {renderContent(message.content)}
          </p>
        </div>

        {/* Reactions */}
        {Object.keys(message.reactions).length > 0 && (
          <div className={cn('flex flex-wrap gap-1 mt-1', isOwn && 'justify-end')}>
            {Object.entries(message.reactions).map(([emoji, userIds]) => {
              if (!userIds || userIds.length === 0) return null
              const hasReacted = currentUserId && userIds.includes(currentUserId)
              return (
                <button
                  key={emoji}
                  onClick={() => onReaction(message.id, emoji)}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs flex items-center gap-1',
                    hasReacted
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                  )}
                >
                  <span>{emoji}</span>
                  <span>{userIds.length}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Reaction Picker (shows on hover) */}
        <div
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mt-1',
            isOwn && 'justify-end'
          )}
        >
          {QUICK_REACTIONS.map(emoji => (
            <button
              key={emoji}
              onClick={() => onReaction(message.id, emoji)}
              className="w-6 h-6 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-sm flex items-center justify-center"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
