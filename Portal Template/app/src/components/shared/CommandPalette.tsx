import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../stores/appStore'
import { useDataStore } from '../../stores/dataStore'
import { cn } from '../../utils/cn'
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Film,
  Users,
  Package,
  Megaphone,
  Lightbulb,
  HelpCircle,
  BarChart3,
  Settings,
  ArrowRight,
  Hash,
  User,
  FileText
} from 'lucide-react'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ReactNode
  action: () => void
  category: 'navigation' | 'task' | 'content' | 'team' | 'equipment'
}

export function CommandPalette() {
  const navigate = useNavigate()
  const { globalSearchOpen, setGlobalSearchOpen } = useAppStore()
  const { tasks, teamMembers, equipment, content } = useDataStore()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Navigation commands
  const navigationCommands: CommandItem[] = [
    { id: 'nav-dashboard', title: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, action: () => navigate('/'), category: 'navigation' },
    { id: 'nav-tasks', title: 'Tasks', icon: <CheckSquare className="h-4 w-4" />, action: () => navigate('/tasks'), category: 'navigation' },
    { id: 'nav-schedule', title: 'Schedule', icon: <Calendar className="h-4 w-4" />, action: () => navigate('/schedule'), category: 'navigation' },
    { id: 'nav-content', title: 'Content', icon: <Film className="h-4 w-4" />, action: () => navigate('/content'), category: 'navigation' },
    { id: 'nav-team', title: 'Team', icon: <Users className="h-4 w-4" />, action: () => navigate('/team'), category: 'navigation' },
    { id: 'nav-equipment', title: 'Equipment', icon: <Package className="h-4 w-4" />, action: () => navigate('/equipment'), category: 'navigation' },
    { id: 'nav-announcements', title: 'Announcements', icon: <Megaphone className="h-4 w-4" />, action: () => navigate('/announcements'), category: 'navigation' },
    { id: 'nav-brainstorm', title: 'Brainstorm', icon: <Lightbulb className="h-4 w-4" />, action: () => navigate('/brainstorm'), category: 'navigation' },
    { id: 'nav-faqs', title: 'FAQs', icon: <HelpCircle className="h-4 w-4" />, action: () => navigate('/faqs'), category: 'navigation' },
    { id: 'nav-reports', title: 'Reports', icon: <BarChart3 className="h-4 w-4" />, action: () => navigate('/reports'), category: 'navigation' },
    { id: 'nav-settings', title: 'Settings', icon: <Settings className="h-4 w-4" />, action: () => navigate('/settings'), category: 'navigation' }
  ]

  // Dynamic commands from data
  const taskCommands: CommandItem[] = tasks.slice(0, 5).map((task) => ({
    id: `task-${task.id}`,
    title: task.title,
    subtitle: `Task - ${task.status.replace('_', ' ')}`,
    icon: <CheckSquare className="h-4 w-4" />,
    action: () => navigate(`/tasks/${task.id}`),
    category: 'task'
  }))

  const teamCommands: CommandItem[] = teamMembers.slice(0, 5).map((member) => ({
    id: `team-${member.id}`,
    title: member.displayName,
    subtitle: `Team member`,
    icon: <User className="h-4 w-4" />,
    action: () => navigate(`/team?member=${member.id}`),
    category: 'team'
  }))

  const equipmentCommands: CommandItem[] = equipment.slice(0, 5).map((item) => ({
    id: `eq-${item.id}`,
    title: item.name,
    subtitle: `Equipment - ${item.category}`,
    icon: <Package className="h-4 w-4" />,
    action: () => navigate(`/equipment?item=${item.id}`),
    category: 'equipment'
  }))

  const contentCommands: CommandItem[] = content.slice(0, 5).map((item) => ({
    id: `content-${item.id}`,
    title: item.title,
    subtitle: `Content - ${item.type}`,
    icon: <Film className="h-4 w-4" />,
    action: () => navigate(`/content?item=${item.id}`),
    category: 'content'
  }))

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    const allCommands = [
      ...navigationCommands,
      ...taskCommands,
      ...teamCommands,
      ...equipmentCommands,
      ...contentCommands
    ]

    if (!search) return allCommands.slice(0, 10)

    const searchLower = search.toLowerCase()
    return allCommands.filter((cmd) =>
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.subtitle?.toLowerCase().includes(searchLower)
    ).slice(0, 10)
  }, [search, tasks, teamMembers, equipment, content])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setGlobalSearchOpen(!globalSearchOpen)
      }

      if (!globalSearchOpen) return

      // Close with Escape
      if (e.key === 'Escape') {
        setGlobalSearchOpen(false)
        setSearch('')
        setSelectedIndex(0)
      }

      // Navigate with arrows
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      }

      // Execute with Enter
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault()
        filteredCommands[selectedIndex].action()
        setGlobalSearchOpen(false)
        setSearch('')
        setSelectedIndex(0)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [globalSearchOpen, filteredCommands, selectedIndex])

  // Focus input when opened
  useEffect(() => {
    if (globalSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [globalSearchOpen])

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  if (!globalSearchOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          setGlobalSearchOpen(false)
          setSearch('')
        }}
      />

      {/* Command Palette */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl mx-4">
        <div className="bg-white dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden animate-slide-down">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-700">
            <Search className="h-5 w-5 text-surface-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands, tasks, team..."
              className="flex-1 bg-transparent border-none outline-none text-surface-900 dark:text-surface-100 placeholder:text-surface-400"
            />
            <kbd className="hidden sm:block text-xs bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded text-surface-500">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto py-2">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-surface-500">
                No results found
              </div>
            ) : (
              filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action()
                    setGlobalSearchOpen(false)
                    setSearch('')
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left',
                    index === selectedIndex
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:bg-surface-50 dark:hover:bg-surface-800'
                  )}
                >
                  <div className={cn(
                    'p-1.5 rounded-lg',
                    index === selectedIndex
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'bg-surface-100 text-surface-500 dark:bg-surface-800'
                  )}>
                    {cmd.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 dark:text-surface-100 truncate">
                      {cmd.title}
                    </p>
                    {cmd.subtitle && (
                      <p className="text-xs text-surface-500 truncate">
                        {cmd.subtitle}
                      </p>
                    )}
                  </div>
                  <ArrowRight className={cn(
                    'h-4 w-4',
                    index === selectedIndex ? 'text-primary-500' : 'text-surface-300'
                  )} />
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-surface-200 dark:border-surface-700 flex items-center justify-between text-xs text-surface-400">
            <span>
              <kbd className="bg-surface-100 dark:bg-surface-800 px-1 rounded">↑↓</kbd> navigate
              <kbd className="bg-surface-100 dark:bg-surface-800 px-1 rounded ml-2">↵</kbd> select
            </span>
            <span>
              <kbd className="bg-surface-100 dark:bg-surface-800 px-1 rounded">esc</kbd> close
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
