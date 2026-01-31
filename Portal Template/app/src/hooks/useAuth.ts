import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useDataStore } from '../stores/dataStore'
import { authService } from '../services/auth.service'

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, setUser, setLoading, setError, logout } = useAuthStore()
  const clearAllData = useDataStore((state) => state.clearAll)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await authService.getUserProfile(firebaseUser.uid)
          if (userProfile) {
            setUser(userProfile)
          } else {
            // User exists in Auth but not in Firestore yet
            // This can happen during registration - don't sign out immediately
            // The registration flow will create the profile
            // Wait a moment and retry once for registration race condition
            await new Promise(resolve => setTimeout(resolve, 1000))
            const retryProfile = await authService.getUserProfile(firebaseUser.uid)
            if (retryProfile) {
              setUser(retryProfile)
            } else {
              // Still no profile after retry - sign out
              console.warn('User profile not found after retry, signing out')
              await authService.signOut()
              setUser(null)
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err)
          setError('Failed to load user profile')
        }
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [setUser, setError])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const firebaseUser = await authService.signIn(email, password)
      const userProfile = await authService.getUserProfile(firebaseUser.uid)
      if (userProfile) {
        setUser(userProfile)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      setError(message)
      throw err
    }
  }

  const register = async (
    email: string,
    password: string,
    displayName: string,
    inviteCode: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      const firebaseUser = await authService.register(email, password, displayName, inviteCode)
      const userProfile = await authService.getUserProfile(firebaseUser.uid)
      if (userProfile) {
        setUser(userProfile)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register'
      setError(message)
      throw err
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      logout()
      clearAllData()
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email'
      throw new Error(message)
    }
  }

  const updateProfile = async (updates: Parameters<typeof authService.updateUserProfile>[1]) => {
    if (!user) return
    try {
      await authService.updateUserProfile(user.id, updates)
      useAuthStore.getState().updateUser(updates)
    } catch (err) {
      console.error('Error updating profile:', err)
      throw err
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    register,
    signOut,
    resetPassword,
    updateProfile,
    isAdmin: user?.role === 'admin'
  }
}
