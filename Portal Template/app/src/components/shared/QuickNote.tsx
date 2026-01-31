import { useState, useEffect } from 'react'
import { Card } from '../ui'
import { StickyNote, Save, Trash2 } from 'lucide-react'

const STORAGE_KEY = 'eastercamp-quick-note'

export function QuickNote() {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(true)

  // Load note from localStorage
  useEffect(() => {
    const savedNote = localStorage.getItem(STORAGE_KEY)
    if (savedNote) {
      setNote(savedNote)
    }
  }, [])

  // Auto-save after typing stops
  useEffect(() => {
    if (note === localStorage.getItem(STORAGE_KEY)) {
      setSaved(true)
      return
    }

    setSaved(false)
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, note)
      setSaved(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [note])

  const handleClear = () => {
    setNote('')
    localStorage.removeItem(STORAGE_KEY)
    setSaved(true)
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-amber-500" />
          <h3 className="font-medium text-sm">Quick Note</h3>
        </div>
        <div className="flex items-center gap-2">
          {!saved && (
            <span className="text-xs text-surface-400">Saving...</span>
          )}
          {saved && note && (
            <span className="text-xs text-green-500 flex items-center gap-1">
              <Save className="h-3 w-3" />
              Saved
            </span>
          )}
          {note && (
            <button
              onClick={handleClear}
              className="p-1 text-surface-400 hover:text-red-500 transition-colors"
              title="Clear note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot down quick notes, reminders, or ideas..."
        className="w-full h-24 resize-none bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      />
    </Card>
  )
}
