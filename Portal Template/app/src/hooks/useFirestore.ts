import { useState, useEffect, useCallback } from 'react'
import { firestoreService, where, orderBy } from '../services/firestore.service'
import type { QueryConstraint } from 'firebase/firestore'

interface UseCollectionOptions {
  constraints?: QueryConstraint[]
  enabled?: boolean
}

export function useDocument<T>(collectionName: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!docId) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = firestoreService.subscribeToDoc<T>(
      collectionName,
      docId,
      (doc) => {
        setData(doc)
        setLoading(false)
        setError(null)
      }
    )

    return () => unsubscribe()
  }, [collectionName, docId])

  return { data, loading, error }
}

export function useCollection<T>(
  collectionName: string,
  options: UseCollectionOptions = {}
) {
  const { constraints = [], enabled = true } = options
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = firestoreService.subscribeToCollection<T>(
      collectionName,
      constraints,
      (items) => {
        setData(items)
        setLoading(false)
        setError(null)
      }
    )

    return () => unsubscribe()
  }, [collectionName, enabled, JSON.stringify(constraints)])

  return { data, loading, error }
}

export function useMutation<T, R = string>(
  mutationFn: (data: T) => Promise<R>
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(
    async (data: T): Promise<R> => {
      setLoading(true)
      setError(null)
      try {
        const result = await mutationFn(data)
        setLoading(false)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Mutation failed')
        setError(error)
        setLoading(false)
        throw error
      }
    },
    [mutationFn]
  )

  return { mutate, loading, error }
}

// CRUD hooks factory
export function createCrudHooks<T extends { id: string }>(collectionName: string) {
  return {
    useList: (options?: UseCollectionOptions) => useCollection<T>(collectionName, options),
    useGet: (id: string | null) => useDocument<T>(collectionName, id),
    useCreate: () =>
      useMutation((data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) =>
        firestoreService.create<T>(collectionName, data)
      ),
    useUpdate: () =>
      useMutation(({ id, data }: { id: string; data: Partial<T> }) =>
        firestoreService.update(collectionName, id, data)
      ),
    useDelete: () =>
      useMutation((id: string) => firestoreService.delete(collectionName, id))
  }
}

// Export query helpers for use in components
export { where, orderBy }
