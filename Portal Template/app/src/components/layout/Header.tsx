import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { useAuth } from '../../hooks/useAuth'
import { useAppStore } from '../../stores/appStore'
import { Avatar, Button } from '../ui'
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Settings,
  User,
  ChevronDown
} from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()
  const {
    toggleSidebar,
    setMobileNavOpen,
    theme,
    setTheme,
    unreadNotifications,
    setGlobalSearchOpen
  } = useAppStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setMobileNavOpen(true)
              } else {
                toggleSidebar()
              }
            }}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="font-bold text-lg hidden sm:block gradient-text">
              EC Media
            </span>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <button
            onClick={() => setGlobalSearchOpen(true)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-surface-500 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search tasks, content, team...</span>
            <kbd className="ml-auto text-xs bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 rounded">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGlobalSearchOpen(true)}
            className="md:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme toggle */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            >
              <ThemeIcon className="h-5 w-5" />
            </Button>

            {themeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setThemeMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 z-20">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: Monitor, label: 'System' }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setTheme(item.value as 'light' | 'dark' | 'system')
                        setThemeMenuOpen(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-700',
                        theme === item.value && 'text-primary-600 dark:text-primary-400'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Button>
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <Avatar
                src={user?.photoURL}
                name={user?.displayName}
                size="sm"
                status={user?.status === 'available' ? 'online' : 'offline'}
              />
              <span className="hidden sm:block text-sm font-medium">
                {user?.displayName?.split(' ')[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-surface-400" />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 py-1 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 z-20">
                  <div className="px-3 py-2 border-b border-surface-200 dark:border-surface-700">
                    <p className="font-medium text-sm">{user?.displayName}</p>
                    <p className="text-xs text-surface-500">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>

                  <hr className="my-1 border-surface-200 dark:border-surface-700" />

                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      signOut()
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
