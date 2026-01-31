import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderOpen,
  FileDown,
  Receipt,
  HeadphonesIcon,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  Users,
  BarChart3,
  Shield,
} from 'lucide-react'
import { usePortalStore } from '@/stores/portalStore'
import { useThemeStore } from '@/stores/themeStore'
import { images } from '@/data/images'
import { cn } from '@/lib/utils'

// Navigation items - some are admin only
const getSidebarNav = (isAdmin: boolean) => {
  const baseNav = [
    { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/portal/projects', icon: FolderOpen },
    { name: 'Deliverables', href: '/portal/deliverables', icon: FileDown },
    { name: 'Invoices', href: '/portal/invoices', icon: Receipt },
    { name: 'Support', href: '/portal/support', icon: HeadphonesIcon },
  ]

  if (isAdmin) {
    // Add admin-only items
    return [
      ...baseNav.slice(0, 2),
      { name: 'All Clients', href: '/portal/clients', icon: Users, adminOnly: true },
      { name: 'Analytics', href: '/portal/analytics', icon: BarChart3, adminOnly: true },
      ...baseNav.slice(2),
    ]
  }

  return baseNav
}

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, notifications, unreadCount, markAsRead, markAllAsRead, logout } = usePortalStore()
  const { theme, setTheme } = useThemeStore()

  const isAdmin = user?.role === 'admin'
  const sidebarNav = getSidebarNav(isAdmin)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/portal')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-lighter border-r border-dark-border">
        {/* Logo */}
        <div className="p-6 border-b border-dark-border">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={images.logo}
              alt="Aorangi Aerials"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display font-bold text-white">Aorangi</span>
          </Link>
        </div>

        {/* Role Badge */}
        {isAdmin && (
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-accent-purple/10 border border-accent-purple/30 rounded-lg">
              <Shield className="w-4 h-4 text-accent-purple" />
              <span className="text-accent-purple text-xs font-medium">Admin View</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarNav.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/portal/dashboard' && location.pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isAdmin
                ? "bg-gradient-to-br from-accent-purple to-accent-cyan"
                : "bg-gradient-to-br from-accent-blue to-accent-purple"
            )}>
              <span className="font-medium text-white text-sm">
                {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{user?.name || 'Demo User'}</p>
              <p className="text-white/40 text-xs truncate">{user?.company || 'Demo Company'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 mt-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-dark-lighter border-r border-dark-border z-50 lg:hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-dark-border">
                <Link to="/" className="flex items-center gap-2">
                  <img
                    src={images.logo}
                    alt="Aorangi Aerials"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-display font-bold text-white">Aorangi</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role Badge - Mobile */}
              {isAdmin && (
                <div className="px-4 pt-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-accent-purple/10 border border-accent-purple/30 rounded-lg">
                    <Shield className="w-4 h-4 text-accent-purple" />
                    <span className="text-accent-purple text-xs font-medium">Admin View</span>
                  </div>
                </div>
              )}

              <nav className="p-4 space-y-1">
                {sidebarNav.map((item) => {
                  const isActive = location.pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-accent-blue/10 text-accent-blue'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* User section - Mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border bg-dark-lighter">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isAdmin
                      ? "bg-gradient-to-br from-accent-purple to-accent-cyan"
                      : "bg-gradient-to-br from-accent-blue to-accent-purple"
                  )}>
                    <span className="font-medium text-white text-sm">
                      {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                    <p className="text-white/40 text-xs truncate">{user?.role === 'admin' ? 'Admin' : 'Client'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 mt-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-white/60 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Link to="/portal/dashboard" className="text-white/40 hover:text-white transition-colors">
                Portal
              </Link>
              {location.pathname !== '/portal/dashboard' && (
                <>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                  <span className="text-white capitalize">
                    {location.pathname.split('/').pop()?.replace(/-/g, ' ')}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent-blue rounded-full text-[10px] font-medium flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-dark-border flex items-center justify-between">
                      <h3 className="font-medium text-white">Notifications</h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-accent-blue hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-white/40 text-sm">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id)
                              if (notif.link) navigate(notif.link)
                              setNotificationsOpen(false)
                            }}
                            className={cn(
                              'w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-dark-border last:border-0',
                              !notif.read && 'bg-accent-blue/5'
                            )}
                          >
                            <p className="text-white text-sm font-medium">{notif.title}</p>
                            <p className="text-white/60 text-xs mt-1 line-clamp-2">{notif.message}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User avatar - mobile */}
            <div className={cn(
              "lg:hidden w-8 h-8 rounded-full flex items-center justify-center",
              isAdmin
                ? "bg-gradient-to-br from-accent-purple to-accent-cyan"
                : "bg-gradient-to-br from-accent-blue to-accent-purple"
            )}>
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
