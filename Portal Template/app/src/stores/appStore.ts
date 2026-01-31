import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Event } from '../types'

interface AppState {
  // Current event context
  currentEvent: Event | null
  setCurrentEvent: (event: Event | null) => void

  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Mobile navigation
  mobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void

  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Notification badge count
  unreadNotifications: number
  setUnreadNotifications: (count: number) => void

  // Online status
  isOnline: boolean
  setIsOnline: (online: boolean) => void

  // Search
  globalSearchOpen: boolean
  setGlobalSearchOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentEvent: null,
      setCurrentEvent: (currentEvent) => set({ currentEvent }),

      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      mobileNavOpen: false,
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),

      theme: 'system',
      setTheme: (theme) => set({ theme }),

      unreadNotifications: 0,
      setUnreadNotifications: (unreadNotifications) => set({ unreadNotifications }),

      isOnline: navigator.onLine,
      setIsOnline: (isOnline) => set({ isOnline }),

      globalSearchOpen: false,
      setGlobalSearchOpen: (globalSearchOpen) => set({ globalSearchOpen })
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
        currentEvent: state.currentEvent
      })
    }
  )
)

// Initialize online status listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useAppStore.getState().setIsOnline(true))
  window.addEventListener('offline', () => useAppStore.getState().setIsOnline(false))
}
