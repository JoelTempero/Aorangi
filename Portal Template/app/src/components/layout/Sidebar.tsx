import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { useAppStore } from '../../stores/appStore'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Film,
  Users,
  Package,
  Megaphone,
  MessageSquare,
  Lightbulb,
  HelpCircle,
  FolderOpen,
  BarChart3,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  Tent
} from 'lucide-react'

const mainNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/content', icon: Film, label: 'Content' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/equipment', icon: Package, label: 'Equipment' },
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' }
]

const secondaryNavItems = [
  { to: '/brainstorm', icon: Lightbulb, label: 'Brainstorm' },
  { to: '/faqs', icon: HelpCircle, label: 'FAQs' },
  { to: '/helpful-stuff', icon: FolderOpen, label: 'Helpful Stuff' },
  { to: '/reports', icon: BarChart3, label: 'Reports' }
]

const adminNavItems = [
  { to: '/import', icon: Upload, label: 'Import Data' },
  { to: '/settings', icon: Settings, label: 'Settings' }
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const { isAdmin } = useAuth()

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-[calc(100vh-4rem)] border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Main nav */}
        <div className="px-3 space-y-1">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              collapsed={!sidebarOpen}
            />
          ))}
        </div>

        {/* Secondary nav */}
        <div className="mt-6 px-3 space-y-1">
          {sidebarOpen && (
            <p className="px-3 text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
              Resources
            </p>
          )}
          {secondaryNavItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              collapsed={!sidebarOpen}
            />
          ))}
        </div>

        {/* Admin nav */}
        {isAdmin && (
          <div className="mt-6 px-3 space-y-1">
            {sidebarOpen && (
              <p className="px-3 text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Admin
              </p>
            )}
            {adminNavItems.map((item) => (
              <NavItem
                key={item.to}
                {...item}
                collapsed={!sidebarOpen}
              />
            ))}
          </div>
        )}
      </nav>

      {/* Event selector */}
      <div className="border-t border-surface-200 dark:border-surface-800 p-3">
        {sidebarOpen ? (
          <div className="flex items-center gap-3 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <Tent className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-primary-700 dark:text-primary-300 truncate">
                EC Media 2025
              </p>
              <p className="text-xs text-primary-600/70 dark:text-primary-400/70">
                Active Event
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Tent className="h-5 w-5 text-primary-600" />
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:flex items-center justify-center h-10 border-t border-surface-200 dark:border-surface-800 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-5 w-5 text-surface-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-surface-400" />
        )}
      </button>
    </aside>
  )
}

interface NavItemProps {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  collapsed: boolean
}

function NavItem({ to, icon: Icon, label, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100',
          collapsed && 'justify-center'
        )
      }
      title={collapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )
}
