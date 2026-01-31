import { create } from 'zustand'
import { offlineService } from '../services/offline.service'

interface OfflineState {
  isOnline: boolean
  isSyncing: boolean
  pendingCount: number
  lastSyncAt: number | null
  syncError: string | null

  // Actions
  setOnline: (online: boolean) => void
  setSyncing: (syncing: boolean) => void
  updatePendingCount: () => Promise<void>
  setLastSync: (timestamp: number) => void
  setSyncError: (error: string | null) => void
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  pendingCount: 0,
  lastSyncAt: null,
  syncError: null,

  setOnline: (online) => set({ isOnline: online }),

  setSyncing: (syncing) => set({ isSyncing: syncing }),

  updatePendingCount: async () => {
    const count = await offlineService.getPendingCount()
    set({ pendingCount: count })
  },

  setLastSync: (timestamp) => set({ lastSyncAt: timestamp }),

  setSyncError: (error) => set({ syncError: error })
}))

// Initialize online status listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useOfflineStore.getState().setOnline(true)
  })

  window.addEventListener('offline', () => {
    useOfflineStore.getState().setOnline(false)
  })
}
