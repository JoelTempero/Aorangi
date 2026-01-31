import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface LoadingContextType {
  isInitialLoading: boolean
  setLoadingComplete: () => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isInitialLoading, setIsInitialLoading] = useState(() => {
    const hasVisited = sessionStorage.getItem('aorangi-visited')
    return !hasVisited
  })

  const setLoadingComplete = useCallback(() => {
    sessionStorage.setItem('aorangi-visited', 'true')
    setIsInitialLoading(false)
  }, [])

  return (
    <LoadingContext.Provider value={{ isInitialLoading, setLoadingComplete }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
