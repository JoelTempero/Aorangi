import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, Deliverable, Invoice, Notification } from '../types'

export type UserRole = 'client' | 'admin'

interface PortalUser {
  id: string
  name: string
  email: string
  company: string
  avatar?: string
  role: UserRole
}

interface PortalState {
  // Auth
  isAuthenticated: boolean
  user: PortalUser | null
  login: (role: UserRole) => void
  logout: () => void

  // Projects
  projects: Project[]
  activeProject: Project | null
  setActiveProject: (project: Project | null) => void

  // Deliverables
  deliverables: Deliverable[]
  approveDeliverable: (id: string) => void
  requestRevision: (id: string, comment: string) => void

  // Invoices
  invoices: Invoice[]

  // Notifications
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void

  // Demo mode
  isDemoMode: boolean
  initDemoData: (role: UserRole) => void
  clearData: () => void
}

// Demo users
const demoUsers: Record<UserRole, PortalUser> = {
  client: {
    id: 'demo-client',
    name: 'Sarah Mitchell',
    email: 'sarah@canterburyconstruction.co.nz',
    company: 'Canterbury Construction Ltd',
    role: 'client',
  },
  admin: {
    id: 'demo-admin',
    name: 'Caleb Weir',
    email: 'caleb@aorangiaerials.nz',
    company: 'Aorangi Aerials',
    role: 'admin',
  },
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      projects: [],
      activeProject: null,
      deliverables: [],
      invoices: [],
      notifications: [],
      unreadCount: 0,
      isDemoMode: true,

      login: (role) => {
        const user = demoUsers[role]
        set({ isAuthenticated: true, user })
        get().initDemoData(role)
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          projects: [],
          activeProject: null,
          deliverables: [],
          invoices: [],
          notifications: [],
          unreadCount: 0,
        })
      },

      setActiveProject: (project) => set({ activeProject: project }),

      approveDeliverable: (id) => {
        set((state) => ({
          deliverables: state.deliverables.map((d) =>
            d.id === id ? { ...d, status: 'approved' as const, approvedAt: new Date().toISOString() } : d
          ),
        }))
      },

      requestRevision: (id, comment) => {
        set((state) => ({
          deliverables: state.deliverables.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: 'revision_requested' as const,
                  revisionComment: comment,
                }
              : d
          ),
        }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }))
      },

      initDemoData: (role) => {
        const { projects } = get()
        if (projects.length > 0) return // Already initialized

        // Import demo data
        import('../data/demoData').then(({ demoData, adminDemoData }) => {
          const data = role === 'admin' ? adminDemoData : demoData
          set({
            projects: data.projects,
            deliverables: data.deliverables,
            invoices: data.invoices,
            notifications: data.notifications,
            unreadCount: data.notifications.filter((n) => !n.read).length,
          })
        })
      },

      clearData: () => {
        set({
          projects: [],
          activeProject: null,
          deliverables: [],
          invoices: [],
          notifications: [],
          unreadCount: 0,
        })
      },
    }),
    {
      name: 'aorangi-portal',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
)
