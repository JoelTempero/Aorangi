import { useEffect } from 'react'
import { useDataStore } from '../stores/dataStore'
import { useAppStore } from '../stores/appStore'
import { useAuthStore } from '../stores/authStore'
import { firestoreService, orderBy, where } from '../services/firestore.service'
import type { Task, User, Equipment, Announcement, ContentItem, FAQ, Idea, Event } from '../types'

export function useRealtimeSync() {
  const { user } = useAuthStore()
  const currentEvent = useAppStore((state) => state.currentEvent)
  const setCurrentEvent = useAppStore((state) => state.setCurrentEvent)
  const {
    setTasks,
    setTeamMembers,
    setEquipment,
    setAnnouncements,
    setContent,
    setFaqs,
    setIdeas,
    setLoading
  } = useDataStore()

  // Load current event (get the most recent event)
  useEffect(() => {
    if (!user) return

    const unsubscribe = firestoreService.subscribeToCollection<Event>(
      'events',
      [orderBy('createdAt', 'desc')],
      (events) => {
        if (events.length > 0 && !currentEvent) {
          setCurrentEvent(events[0])
        }
      }
    )

    return () => unsubscribe()
  }, [user, currentEvent, setCurrentEvent])

  // Sync team members
  useEffect(() => {
    if (!user) return

    setLoading('team', true)
    const unsubscribe = firestoreService.subscribeToCollection<User>(
      'users',
      [orderBy('displayName', 'asc')],
      (members) => {
        setTeamMembers(members)
        setLoading('team', false)
      }
    )

    return () => unsubscribe()
  }, [user, setTeamMembers, setLoading])

  // Sync tasks for current event
  useEffect(() => {
    if (!user || !currentEvent) return

    setLoading('tasks', true)
    const unsubscribe = firestoreService.subscribeToCollection<Task>(
      `events/${currentEvent.id}/tasks`,
      [orderBy('createdAt', 'desc')],
      (tasks) => {
        setTasks(tasks)
        setLoading('tasks', false)
      }
    )

    return () => unsubscribe()
  }, [user, currentEvent, setTasks, setLoading])

  // Sync equipment
  useEffect(() => {
    if (!user) return

    setLoading('equipment', true)
    const unsubscribe = firestoreService.subscribeToCollection<Equipment>(
      'equipment',
      [orderBy('name', 'asc')],
      (items) => {
        setEquipment(items)
        setLoading('equipment', false)
      }
    )

    return () => unsubscribe()
  }, [user, setEquipment, setLoading])

  // Sync announcements
  useEffect(() => {
    if (!user) return

    setLoading('announcements', true)
    const unsubscribe = firestoreService.subscribeToCollection<Announcement>(
      'announcements',
      [orderBy('createdAt', 'desc')],
      (items) => {
        setAnnouncements(items)
        setLoading('announcements', false)
      }
    )

    return () => unsubscribe()
  }, [user, setAnnouncements, setLoading])

  // Sync content for current event
  useEffect(() => {
    if (!user || !currentEvent) return

    setLoading('content', true)
    const unsubscribe = firestoreService.subscribeToCollection<ContentItem>(
      `events/${currentEvent.id}/content`,
      [orderBy('createdAt', 'desc')],
      (items) => {
        setContent(items)
        setLoading('content', false)
      }
    )

    return () => unsubscribe()
  }, [user, currentEvent, setContent, setLoading])

  // Sync FAQs
  useEffect(() => {
    if (!user) return

    setLoading('faqs', true)
    const unsubscribe = firestoreService.subscribeToCollection<FAQ>(
      'faqs',
      [orderBy('order', 'asc')],
      (items) => {
        setFaqs(items)
        setLoading('faqs', false)
      }
    )

    return () => unsubscribe()
  }, [user, setFaqs, setLoading])

  // Sync ideas
  useEffect(() => {
    if (!user) return

    setLoading('ideas', true)
    const unsubscribe = firestoreService.subscribeToCollection<Idea>(
      'ideas',
      [orderBy('createdAt', 'desc')],
      (items) => {
        setIdeas(items)
        setLoading('ideas', false)
      }
    )

    return () => unsubscribe()
  }, [user, setIdeas, setLoading])
}
