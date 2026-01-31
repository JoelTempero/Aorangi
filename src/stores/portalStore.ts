import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, Deliverable, Invoice, Notification } from '../types'

interface PortalState {
  // User
  user: {
    id: string
    name: string
    email: string
    company: string
    avatar?: string
  } | null

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
  initDemoData: () => void
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set, get) => ({
      user: null,
      projects: [],
      activeProject: null,
      deliverables: [],
      invoices: [],
      notifications: [],
      unreadCount: 0,
      isDemoMode: true,

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

      initDemoData: () => {
        const { projects } = get()
        if (projects.length > 0) return // Already initialized

        // Import demo data
        import('../data/demoData').then(({ demoData }) => {
          set({
            user: demoData.user,
            projects: demoData.projects,
            deliverables: demoData.deliverables,
            invoices: demoData.invoices,
            notifications: demoData.notifications,
            unreadCount: demoData.notifications.filter((n) => !n.read).length,
          })
        })
      },
    }),
    {
      name: 'aorangi-portal',
      partialize: (state) => ({
        user: state.user,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
)
