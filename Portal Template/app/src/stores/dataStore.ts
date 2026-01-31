import { create } from 'zustand'
import type { Task, User, Equipment, Announcement, ContentItem, ScheduleSlot, FAQ, Idea } from '../types'

interface DataState {
  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void

  // Team members
  teamMembers: User[]
  setTeamMembers: (members: User[]) => void
  updateTeamMember: (id: string, updates: Partial<User>) => void

  // Equipment
  equipment: Equipment[]
  setEquipment: (equipment: Equipment[]) => void
  addEquipment: (item: Equipment) => void
  updateEquipment: (id: string, updates: Partial<Equipment>) => void
  removeEquipment: (id: string) => void

  // Announcements
  announcements: Announcement[]
  setAnnouncements: (announcements: Announcement[]) => void
  addAnnouncement: (announcement: Announcement) => void

  // Content
  content: ContentItem[]
  setContent: (content: ContentItem[]) => void
  addContent: (item: ContentItem) => void
  updateContent: (id: string, updates: Partial<ContentItem>) => void

  // Schedule
  scheduleSlots: ScheduleSlot[]
  setScheduleSlots: (slots: ScheduleSlot[]) => void

  // FAQs
  faqs: FAQ[]
  setFaqs: (faqs: FAQ[]) => void

  // Ideas
  ideas: Idea[]
  setIdeas: (ideas: Idea[]) => void
  addIdea: (idea: Idea) => void
  updateIdea: (id: string, updates: Partial<Idea>) => void

  // Loading states
  loading: {
    tasks: boolean
    team: boolean
    equipment: boolean
    announcements: boolean
    content: boolean
    schedule: boolean
    faqs: boolean
    ideas: boolean
  }
  setLoading: (key: keyof DataState['loading'], value: boolean) => void

  // Clear all data (for logout)
  clearAll: () => void
}

export const useDataStore = create<DataState>((set) => ({
  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  // Team members
  teamMembers: [],
  setTeamMembers: (teamMembers) => set({ teamMembers }),
  updateTeamMember: (id, updates) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((m) => (m.id === id ? { ...m, ...updates } : m))
    })),

  // Equipment
  equipment: [],
  setEquipment: (equipment) => set({ equipment }),
  addEquipment: (item) => set((state) => ({ equipment: [item, ...state.equipment] })),
  updateEquipment: (id, updates) =>
    set((state) => ({
      equipment: state.equipment.map((e) => (e.id === id ? { ...e, ...updates } : e))
    })),
  removeEquipment: (id) =>
    set((state) => ({ equipment: state.equipment.filter((e) => e.id !== id) })),

  // Announcements
  announcements: [],
  setAnnouncements: (announcements) => set({ announcements }),
  addAnnouncement: (announcement) =>
    set((state) => ({ announcements: [announcement, ...state.announcements] })),

  // Content
  content: [],
  setContent: (content) => set({ content }),
  addContent: (item) => set((state) => ({ content: [item, ...state.content] })),
  updateContent: (id, updates) =>
    set((state) => ({
      content: state.content.map((c) => (c.id === id ? { ...c, ...updates } : c))
    })),

  // Schedule
  scheduleSlots: [],
  setScheduleSlots: (scheduleSlots) => set({ scheduleSlots }),

  // FAQs
  faqs: [],
  setFaqs: (faqs) => set({ faqs }),

  // Ideas
  ideas: [],
  setIdeas: (ideas) => set({ ideas }),
  addIdea: (idea) => set((state) => ({ ideas: [idea, ...state.ideas] })),
  updateIdea: (id, updates) =>
    set((state) => ({
      ideas: state.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i))
    })),

  // Loading states
  loading: {
    tasks: false,
    team: false,
    equipment: false,
    announcements: false,
    content: false,
    schedule: false,
    faqs: false,
    ideas: false
  },
  setLoading: (key, value) =>
    set((state) => ({ loading: { ...state.loading, [key]: value } })),

  // Clear all
  clearAll: () =>
    set({
      tasks: [],
      teamMembers: [],
      equipment: [],
      announcements: [],
      content: [],
      scheduleSlots: [],
      faqs: [],
      ideas: [],
      loading: {
        tasks: false,
        team: false,
        equipment: false,
        announcements: false,
        content: false,
        schedule: false,
        faqs: false,
        ideas: false
      }
    })
}))
