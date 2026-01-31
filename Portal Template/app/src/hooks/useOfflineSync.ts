import { useEffect, useCallback, useRef } from 'react'
import { useOfflineStore } from '../stores/offlineStore'
import { offlineService } from '../services/offline.service'
import { firestoreService } from '../services/firestore.service'
import toast from 'react-hot-toast'

export function useOfflineSync() {
  const {
    isOnline,
    isSyncing,
    pendingCount,
    setOnline,
    setSyncing,
    updatePendingCount,
    setLastSync,
    setSyncError
  } = useOfflineStore()

  const syncInProgress = useRef(false)

  // Process pending operations
  const syncPendingOperations = useCallback(async () => {
    if (syncInProgress.current || !isOnline) return

    const count = await offlineService.getPendingCount()
    if (count === 0) return

    syncInProgress.current = true
    setSyncing(true)
    setSyncError(null)

    try {
      const result = await offlineService.processPendingOperations(async (op) => {
        switch (op.operation) {
          case 'create':
            await firestoreService.create(op.collection, op.data)
            break
          case 'update':
            if (op.documentId) {
              await firestoreService.update(op.collection, op.documentId, op.data)
            }
            break
          case 'delete':
            if (op.documentId) {
              await firestoreService.delete(op.collection, op.documentId)
            }
            break
        }
      })

      setLastSync(Date.now())
      await updatePendingCount()

      if (result.success > 0) {
        toast.success(`Synced ${result.success} change${result.success > 1 ? 's' : ''}`)
      }

      if (result.failed > 0) {
        toast.error(`${result.failed} change${result.failed > 1 ? 's' : ''} failed to sync`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed'
      setSyncError(errorMessage)
      toast.error('Failed to sync changes')
    } finally {
      setSyncing(false)
      syncInProgress.current = false
    }
  }, [isOnline, setSyncing, setSyncError, setLastSync, updatePendingCount])

  // Monitor online status changes
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true)
      // Sync after a short delay to ensure connection is stable
      setTimeout(syncPendingOperations, 1000)
    }

    const handleOffline = () => {
      setOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial pending count update
    updatePendingCount()

    // Sync on mount if online
    if (navigator.onLine) {
      syncPendingOperations()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline, syncPendingOperations, updatePendingCount])

  // Periodic sync check (every 5 minutes when online)
  useEffect(() => {
    if (!isOnline) return

    const interval = setInterval(() => {
      syncPendingOperations()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isOnline, syncPendingOperations])

  return {
    isOnline,
    isSyncing,
    pendingCount,
    syncNow: syncPendingOperations
  }
}
