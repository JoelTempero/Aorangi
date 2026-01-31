import { useState } from 'react'
import { cn } from '../../utils/cn'

const EMOJI_CATEGORIES = {
  recent: ['👍', '❤️', '😊', '🎉', '🔥', '👏', '💯', '✅'],
  smileys: ['😀', '😊', '😄', '😁', '🤣', '😅', '😂', '🙂', '😉', '😍', '🥰', '😘'],
  gestures: ['👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '👊', '✊', '💪', '🙏', '👋'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💖', '💝', '💗', '💓'],
  celebration: ['🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '⭐', '🌟', '✨'],
  objects: ['📷', '🎬', '🎤', '🎧', '💻', '📱', '⏰', '📅', '✏️', '📝', '📌', '🔔']
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  className?: string
}

export function EmojiPicker({ onSelect, className }: EmojiPickerProps) {
  const [category, setCategory] = useState<keyof typeof EMOJI_CATEGORIES>('recent')

  return (
    <div className={cn(
      'bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 p-3 w-72',
      className
    )}>
      {/* Category tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
        {(Object.keys(EMOJI_CATEGORIES) as Array<keyof typeof EMOJI_CATEGORIES>).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors',
              category === cat
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700'
            )}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_CATEGORIES[category].map((emoji, i) => (
          <button
            key={`${emoji}-${i}`}
            onClick={() => onSelect(emoji)}
            className="p-1.5 text-xl hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ReactionButtonProps {
  emoji: string
  count: number
  active?: boolean
  onClick: () => void
}

export function ReactionButton({ emoji, count, active, onClick }: ReactionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors',
        active
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
          : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
      )}
    >
      <span>{emoji}</span>
      <span className="text-xs font-medium">{count}</span>
    </button>
  )
}

interface AddReactionButtonProps {
  onSelect: (emoji: string) => void
}

export function AddReactionButton({ onSelect }: AddReactionButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
      >
        <span className="text-sm">+</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 z-20">
            <EmojiPicker
              onSelect={(emoji) => {
                onSelect(emoji)
                setOpen(false)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
