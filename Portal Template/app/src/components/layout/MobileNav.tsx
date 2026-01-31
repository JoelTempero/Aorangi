import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { useAppStore } from '../../stores/appStore'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui'
import {
  X,
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
  Upload,
  Settings,
  Tent
} from 'lucide-react'

const allNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/content', icon: Film, label: 'Content' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/equipment', icon: Package, label: 'Equipment' },
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/brainstorm', icon: Lightbulb, label: 'Brainstorm' },
  { to: '/faqs', icon: HelpCircle, label: 'FAQs' },
  { to: '/reports', icon: BarChart3, label: 'Reports' }
]

const adminNavItems = [
  { to: '/import', icon: Upload, label: 'Import Data' },
  { to: '/settings', icon: Settings, label: 'Settings' }
]

export function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen } = useAppStore()
  const { isAdmin } = useAuth()

  if (!mobileNavOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => setMobileNavOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-surface-950 shadow-xl animate-slide-right">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="font-bold text-lg">EC Media</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileNavOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {allNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {isAdmin && (
            <div className="mt-6 px-3 space-y-1">
              <p className="px-3 text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Admin
              </p>
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Event badge */}
        <div className="border-t border-surface-200 dark:border-surface-800 p-4">
          <div className="flex items-center gap-3 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <Tent className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="font-medium text-sm text-primary-700 dark:text-primary-300">
                EC Media 2025
              </p>
              <p className="text-xs text-primary-600/70 dark:text-primary-400/70">
                Active Event
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add CSS animation
const style = document.createElement('style')
style.textContent = `
  @keyframes slideRight {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  .animate-slide-right {
    animation: slideRight 0.3s ease-out;
  }
`
document.head.appendChild(style)
