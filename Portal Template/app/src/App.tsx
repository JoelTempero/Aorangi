import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { useRealtimeSync } from './hooks/useRealtimeSync'
import { useAppStore } from './stores/appStore'
import { Header, Sidebar, MobileNav } from './components/layout'
import { LoadingScreen } from './components/ui'
import { CommandPalette, useKeyboardShortcuts, ConnectionStatus } from './components/shared'

// Feature pages
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { SetupPage } from './features/auth/SetupPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { TasksPage } from './features/tasks/TasksPage'
import { SchedulePage } from './features/schedule/SchedulePage'
import { ContentPage } from './features/content/ContentPage'
import { TeamPage } from './features/team/TeamPage'
import { EquipmentPage } from './features/equipment/EquipmentPage'
import { AnnouncementsPage } from './features/comms/AnnouncementsPage'
import { BrainstormPage } from './features/brainstorm/BrainstormPage'
import { FAQsPage } from './features/faqs/FAQsPage'
import { HelpfulStuffPage } from './features/resources/HelpfulStuffPage'
import { ReportsPage } from './features/reports/ReportsPage'
import { ImportPage } from './features/import/ImportPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { MessagingPage } from './features/messaging/MessagingPage'
import { SkillsMatrixPage } from './features/team/SkillsMatrixPage'
import { RolesPage } from './features/team/RolesPage'

function App() {
  const { theme } = useAppStore()
  const { KeyboardShortcutsModal } = useKeyboardShortcuts()

  // Apply theme
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)

      const listener = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches)
      }
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/setup" element={<SetupPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:id" element={<TasksPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/skills" element={<SkillsMatrixPage />} />
          <Route path="/team/roles" element={<RolesPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/messages" element={<MessagingPage />} />
          <Route path="/brainstorm" element={<BrainstormPage />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/helpful-stuff" element={<HelpfulStuffPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<SettingsPage />} />
          <Route path="/notifications" element={<AnnouncementsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CommandPalette />
      <KeyboardShortcutsModal />
      <ConnectionStatus />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-surface-800)',
            color: 'var(--color-surface-100)',
            borderRadius: '0.75rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  )
}

function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  // Set up real-time sync when authenticated
  useRealtimeSync()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-surface-50 dark:bg-surface-950">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

export default App
