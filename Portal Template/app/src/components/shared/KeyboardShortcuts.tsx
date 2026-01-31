import { useState, useEffect } from 'react'
import { Modal } from '../ui'
import { cn } from '../../utils/cn'
import { Keyboard } from 'lucide-react'

interface ShortcutGroup {
  title: string
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Global',
    shortcuts: [
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close modal/palette' },
    ]
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['G', 'H'], description: 'Go to Dashboard' },
      { keys: ['G', 'T'], description: 'Go to Tasks' },
      { keys: ['G', 'S'], description: 'Go to Schedule' },
      { keys: ['G', 'C'], description: 'Go to Content' },
      { keys: ['G', 'E'], description: 'Go to Equipment' },
    ]
  },
  {
    title: 'Tasks',
    shortcuts: [
      { keys: ['N'], description: 'New task' },
      { keys: ['E'], description: 'Edit selected task' },
      { keys: ['Space'], description: 'Toggle task completion' },
      { keys: ['↑', '↓'], description: 'Navigate tasks' },
      { keys: ['Enter'], description: 'Open task details' },
    ]
  },
  {
    title: 'Lists',
    shortcuts: [
      { keys: ['J'], description: 'Move down' },
      { keys: ['K'], description: 'Move up' },
      { keys: ['Ctrl', 'A'], description: 'Select all' },
      { keys: ['Del'], description: 'Delete selected' },
    ]
  }
]

interface KeyboardShortcutsProps {
  open: boolean
  onClose: () => void
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsProps) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts" size="lg">
      <div className="grid md:grid-cols-2 gap-6">
        {shortcutGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.shortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-surface-700 dark:text-surface-300">
                    {shortcut.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIdx) => (
                      <span key={keyIdx}>
                        <kbd className="px-2 py-1 text-xs font-medium bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded">
                          {key}
                        </kbd>
                        {keyIdx < shortcut.keys.length - 1 && (
                          <span className="text-surface-400 mx-0.5">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
        <p className="text-xs text-surface-500 text-center">
          Press <kbd className="px-1.5 py-0.5 text-xs font-medium bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded">Ctrl</kbd>
          <span className="mx-0.5">+</span>
          <kbd className="px-1.5 py-0.5 text-xs font-medium bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded">/</kbd>
          {' '}to toggle this help
        </p>
      </div>
    </Modal>
  )
}

// Hook to manage keyboard shortcuts
export function useKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+/ to show shortcuts help
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault()
        setShowHelp((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    showHelp,
    setShowHelp,
    KeyboardShortcutsModal: () => (
      <KeyboardShortcutsModal open={showHelp} onClose={() => setShowHelp(false)} />
    )
  }
}

// Small keyboard icon button component
interface KeyboardShortcutButtonProps {
  onClick: () => void
  className?: string
}

export function KeyboardShortcutButton({ onClick, className }: KeyboardShortcutButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors',
        className
      )}
      title="Keyboard shortcuts (Ctrl+/)"
    >
      <Keyboard className="h-5 w-5" />
    </button>
  )
}
