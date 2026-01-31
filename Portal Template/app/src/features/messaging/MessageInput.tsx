import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { Send, AtSign, Paperclip, Smile } from 'lucide-react'
import { Button } from '../../components/ui'
import type { TeamMember } from '../../types/user.types'
import { cn } from '../../utils/cn'

interface MessageInputProps {
  onSend: (content: string, mentions: string[]) => Promise<void>
  teamMembers: TeamMember[]
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({
  onSend,
  teamMembers,
  disabled = false,
  placeholder = 'Type a message...'
}: MessageInputProps) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionFilter, setMentionFilter] = useState('')
  const [mentionIndex, setMentionIndex] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const filteredMembers = teamMembers.filter(member =>
    member.displayName.toLowerCase().includes(mentionFilter.toLowerCase())
  )

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      const memberName = match[1]
      const member = teamMembers.find(
        m => m.displayName.toLowerCase().replace(/\s+/g, '') === memberName.toLowerCase()
      )
      if (member) {
        mentions.push(member.id)
      }
    }

    return [...new Set(mentions)]
  }

  const handleSend = async () => {
    if (!content.trim() || sending || disabled) return

    const mentions = extractMentions(content)

    setSending(true)
    try {
      await onSend(content, mentions)
      setContent('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setMentionIndex(prev => Math.min(prev + 1, filteredMembers.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setMentionIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        if (filteredMembers[mentionIndex]) {
          insertMention(filteredMembers[mentionIndex])
        }
      } else if (e.key === 'Escape') {
        setShowMentions(false)
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (value: string) => {
    setContent(value)

    // Check for @ mention trigger
    const cursorPos = inputRef.current?.selectionStart || 0
    const textBeforeCursor = value.slice(0, cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      setShowMentions(true)
      setMentionFilter(mentionMatch[1])
      setMentionIndex(0)
    } else {
      setShowMentions(false)
    }
  }

  const insertMention = (member: TeamMember) => {
    const cursorPos = inputRef.current?.selectionStart || 0
    const textBeforeCursor = content.slice(0, cursorPos)
    const textAfterCursor = content.slice(cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      const beforeMention = textBeforeCursor.slice(0, mentionMatch.index)
      const memberHandle = member.displayName.replace(/\s+/g, '')
      const newContent = `${beforeMention}@${memberHandle} ${textAfterCursor}`
      setContent(newContent)
    }

    setShowMentions(false)
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      {/* Mention Dropdown */}
      {showMentions && filteredMembers.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 max-h-48 overflow-y-auto">
          {filteredMembers.slice(0, 5).map((member, index) => (
            <button
              key={member.id}
              onClick={() => insertMention(member)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-100 dark:hover:bg-surface-700',
                index === mentionIndex && 'bg-surface-100 dark:bg-surface-700'
              )}
            >
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-700 dark:text-primary-300">
                {member.displayName.charAt(0)}
              </div>
              <span className="text-sm text-surface-900 dark:text-white">{member.displayName}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2 p-4 border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            rows={1}
            className={cn(
              'w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600',
              'bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white',
              'placeholder-surface-500 resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'min-h-[40px] max-h-32'
            )}
            style={{
              height: 'auto',
              minHeight: '40px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`
            }}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!content.trim() || sending || disabled}
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
