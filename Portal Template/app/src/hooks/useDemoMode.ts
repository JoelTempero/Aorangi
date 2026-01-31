import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useAppStore } from '../stores/appStore'
import { useDataStore } from '../stores/dataStore'
import {
  DEMO_USERS,
  DEMO_EVENT,
  DEMO_TASKS,
  DEMO_EQUIPMENT,
  DEMO_ANNOUNCEMENTS,
  DEMO_CONTENT,
  DEMO_FAQS,
  DEMO_IDEAS
} from '../data/demoData'

// Check if we're in demo mode (no real Firebase config)
const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key' ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'your-api-key'

export function useDemoMode() {
  const setUser = useAuthStore((state) => state.setUser)
  const setCurrentEvent = useAppStore((state) => state.setCurrentEvent)
  const {
    setTeamMembers,
    setTasks,
    setEquipment,
    setAnnouncements,
    setContent,
    setFaqs,
    setIdeas,
    setLoading
  } = useDataStore()

  useEffect(() => {
    if (!isDemoMode) return

    // Initialize demo data
    console.log('Running in demo mode - populating with sample data')

    // Set demo user
    setUser(DEMO_USERS[0])

    // Set current event
    setCurrentEvent(DEMO_EVENT)

    // Populate data stores
    setTeamMembers(DEMO_USERS)
    setTasks(DEMO_TASKS)
    setEquipment(DEMO_EQUIPMENT)
    setAnnouncements(DEMO_ANNOUNCEMENTS)
    setContent(DEMO_CONTENT)
    setFaqs(DEMO_FAQS)
    setIdeas(DEMO_IDEAS)

    // Clear loading states
    setLoading('tasks', false)
    setLoading('team', false)
    setLoading('equipment', false)
    setLoading('announcements', false)
    setLoading('content', false)
    setLoading('faqs', false)
    setLoading('ideas', false)
  }, [])

  return isDemoMode
}

export { isDemoMode }
