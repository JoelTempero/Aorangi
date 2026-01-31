import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface OfflineOperation {
  id: string
  collection: string
  operation: 'create' | 'update' | 'delete'
  documentId?: string
  data: any
  timestamp: number
  retryCount: number
  lastError?: string
}

interface OfflineDB extends DBSchema {
  pendingOperations: {
    key: string
    value: OfflineOperation
    indexes: {
      'by-timestamp': number
      'by-collection': string
    }
  }
  cachedData: {
    key: string
    value: {
      collection: string
      data: any[]
      cachedAt: number
    }
  }
}

const DB_NAME = 'ec-offline-db'
const DB_VERSION = 1

let db: IDBPDatabase<OfflineDB> | null = null

export const offlineService = {
  /**
   * Initialize the IndexedDB database
   */
  async init(): Promise<void> {
    if (db) return

    db = await openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Pending operations store
        const operationsStore = db.createObjectStore('pendingOperations', {
          keyPath: 'id'
        })
        operationsStore.createIndex('by-timestamp', 'timestamp')
        operationsStore.createIndex('by-collection', 'collection')

        // Cached data store
        db.createObjectStore('cachedData', {
          keyPath: 'collection'
        })
      }
    })
  },

  /**
   * Check if we're online
   */
  isOnline(): boolean {
    return navigator.onLine
  },

  /**
   * Queue an operation for later sync
   */
  async queueOperation(
    collection: string,
    operation: 'create' | 'update' | 'delete',
    data: any,
    documentId?: string
  ): Promise<string> {
    await this.init()
    if (!db) throw new Error('Database not initialized')

    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const op: OfflineOperation = {
      id,
      collection,
      operation,
      documentId,
      data,
      timestamp: Date.now(),
      retryCount: 0
    }

    await db.put('pendingOperations', op)
    return id
  },

  /**
   * Get all pending operations
   */
  async getPendingOperations(): Promise<OfflineOperation[]> {
    await this.init()
    if (!db) return []

    return db.getAllFromIndex('pendingOperations', 'by-timestamp')
  },

  /**
   * Get pending operation count
   */
  async getPendingCount(): Promise<number> {
    await this.init()
    if (!db) return 0

    return db.count('pendingOperations')
  },

  /**
   * Remove a pending operation (after successful sync)
   */
  async removeOperation(id: string): Promise<void> {
    await this.init()
    if (!db) return

    await db.delete('pendingOperations', id)
  },

  /**
   * Update operation retry count
   */
  async updateOperationRetry(id: string, error: string): Promise<void> {
    await this.init()
    if (!db) return

    const op = await db.get('pendingOperations', id)
    if (op) {
      op.retryCount++
      op.lastError = error
      await db.put('pendingOperations', op)
    }
  },

  /**
   * Cache collection data for offline access
   */
  async cacheData(collection: string, data: any[]): Promise<void> {
    await this.init()
    if (!db) return

    await db.put('cachedData', {
      collection,
      data,
      cachedAt: Date.now()
    })
  },

  /**
   * Get cached data for a collection
   */
  async getCachedData<T>(collection: string): Promise<{ data: T[]; cachedAt: number } | null> {
    await this.init()
    if (!db) return null

    const cached = await db.get('cachedData', collection)
    if (!cached) return null

    return {
      data: cached.data as T[],
      cachedAt: cached.cachedAt
    }
  },

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    await this.init()
    if (!db) return

    await db.clear('cachedData')
  },

  /**
   * Clear all pending operations (use with caution)
   */
  async clearPending(): Promise<void> {
    await this.init()
    if (!db) return

    await db.clear('pendingOperations')
  },

  /**
   * Process all pending operations
   * Returns the number of successfully processed operations
   */
  async processPendingOperations(
    processor: (op: OfflineOperation) => Promise<void>
  ): Promise<{ success: number; failed: number }> {
    const operations = await this.getPendingOperations()
    let success = 0
    let failed = 0

    for (const op of operations) {
      if (op.retryCount >= 5) {
        // Skip operations that have failed too many times
        failed++
        continue
      }

      try {
        await processor(op)
        await this.removeOperation(op.id)
        success++
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        await this.updateOperationRetry(op.id, errorMessage)
        failed++
      }
    }

    return { success, failed }
  }
}
