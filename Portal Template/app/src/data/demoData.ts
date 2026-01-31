// Demo data for development and testing
import type { User, Task, Equipment, Announcement, ContentItem, FAQ, Idea, Event } from '../types'

export const DEMO_EVENT: Event = {
  id: 'ec25',
  name: 'EC Media 2025',
  year: 2025,
  startDate: { seconds: Math.floor(new Date('2025-04-17').getTime() / 1000), nanoseconds: 0 },
  endDate: { seconds: Math.floor(new Date('2025-04-21').getTime() / 1000), nanoseconds: 0 },
  status: 'planning',
  createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 30, nanoseconds: 0 },
  updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
}

export const DEMO_USERS: User[] = [
  {
    id: 'user1',
    email: 'joel@example.com',
    displayName: 'Joel Tempero',
    role: 'admin',
    teams: ['video', 'support'],
    skills: ['Video Editing', 'Drone', 'Photography'],
    status: 'available',
    notificationPrefs: {
      taskAssigned: true,
      taskDueSoon: true,
      scheduleChange: true,
      announcement: true,
      directMessage: true,
      contentStatusChange: true,
      equipmentAssigned: true,
      dueSoonHours: 24,
      mentionInChannel: true,
      achievementEarned: true,
      contentApprovalRequired: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00'
    },
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 60, nanoseconds: 0 },
    lastActive: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
  },
  {
    id: 'user2',
    email: 'jess@example.com',
    displayName: 'Jess Roberts',
    role: 'admin',
    teams: ['photo', 'socials'],
    skills: ['Photography', 'Social Media', 'Content Curation'],
    status: 'available',
    notificationPrefs: {
      taskAssigned: true,
      taskDueSoon: true,
      scheduleChange: true,
      announcement: true,
      directMessage: true,
      contentStatusChange: true,
      equipmentAssigned: true,
      dueSoonHours: 24,
      mentionInChannel: true,
      achievementEarned: true,
      contentApprovalRequired: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00'
    },
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 45, nanoseconds: 0 },
    lastActive: { seconds: Math.floor(Date.now() / 1000) - 3600, nanoseconds: 0 }
  },
  {
    id: 'user3',
    email: 'ben@example.com',
    displayName: 'Benjamin Yap',
    role: 'member',
    teams: ['video'],
    skills: ['Video Editing', 'Color Grading'],
    status: 'busy',
    notificationPrefs: {
      taskAssigned: true,
      taskDueSoon: true,
      scheduleChange: true,
      announcement: true,
      directMessage: true,
      contentStatusChange: true,
      equipmentAssigned: true,
      dueSoonHours: 24,
      mentionInChannel: true,
      achievementEarned: true,
      contentApprovalRequired: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00'
    },
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 30, nanoseconds: 0 },
    lastActive: { seconds: Math.floor(Date.now() / 1000) - 1800, nanoseconds: 0 }
  },
  {
    id: 'user4',
    email: 'blythe@example.com',
    displayName: 'Blythe Chen',
    role: 'member',
    teams: ['socials'],
    skills: ['Social Media', 'Content Writing'],
    status: 'offline',
    notificationPrefs: {
      taskAssigned: true,
      taskDueSoon: true,
      scheduleChange: true,
      announcement: true,
      directMessage: true,
      contentStatusChange: true,
      equipmentAssigned: true,
      dueSoonHours: 24,
      mentionInChannel: true,
      achievementEarned: true,
      contentApprovalRequired: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00'
    },
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 20, nanoseconds: 0 },
    lastActive: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 }
  },
  {
    id: 'user5',
    email: 'joe@example.com',
    displayName: 'Joe Sutton',
    role: 'admin',
    teams: ['video', 'support'],
    skills: ['Technical Director', 'Networking', 'Storage'],
    status: 'available',
    notificationPrefs: {
      taskAssigned: true,
      taskDueSoon: true,
      scheduleChange: true,
      announcement: true,
      directMessage: true,
      contentStatusChange: true,
      equipmentAssigned: true,
      dueSoonHours: 24,
      mentionInChannel: true,
      achievementEarned: true,
      contentApprovalRequired: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00'
    },
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 50, nanoseconds: 0 },
    lastActive: { seconds: Math.floor(Date.now() / 1000) - 600, nanoseconds: 0 }
  }
]

export const DEMO_TASKS: Task[] = [
  {
    id: 'task1',
    title: 'Finalize Big Top content schedule',
    description: 'Create the final schedule for Big Top AM and PM content for all 5 days',
    status: 'in_progress',
    priority: 'high',
    category: 'pre_camp',
    team: 'video',
    assignees: ['user1', 'user5'],
    dueDate: { seconds: Math.floor(Date.now() / 1000) + 86400 * 3, nanoseconds: 0 },
    subtasks: [
      { id: 'sub1', title: 'Draft Thursday schedule', completed: true },
      { id: 'sub2', title: 'Draft Friday schedule', completed: true },
      { id: 'sub3', title: 'Draft Saturday schedule', completed: false },
      { id: 'sub4', title: 'Draft Sunday schedule', completed: false },
      { id: 'sub5', title: 'Get approval from leadership', completed: false }
    ],
    blockedBy: [],
    blocks: ['task3'],
    tags: ['content', 'schedule'],
    comments: [],
    attachments: [],
    createdBy: 'user1',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 3600, nanoseconds: 0 }
  },
  {
    id: 'task2',
    title: 'Prepare social media content calendar',
    description: 'Plan Instagram posts, stories, and reels for each day of camp',
    status: 'not_started',
    priority: 'high',
    category: 'pre_camp',
    team: 'socials',
    assignees: ['user2', 'user4'],
    dueDate: { seconds: Math.floor(Date.now() / 1000) + 86400 * 5, nanoseconds: 0 },
    subtasks: [
      { id: 'sub6', title: 'Create content templates', completed: false },
      { id: 'sub7', title: 'Schedule post times', completed: false },
      { id: 'sub8', title: 'Assign team responsibilities', completed: false }
    ],
    blockedBy: [],
    blocks: [],
    tags: ['social', 'content'],
    comments: [],
    attachments: [],
    createdBy: 'user2',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 }
  },
  {
    id: 'task3',
    title: 'Equipment check and inventory',
    description: 'Verify all equipment is accounted for and in working condition',
    status: 'not_started',
    priority: 'urgent',
    category: 'pre_camp',
    team: 'support',
    assignees: ['user5'],
    dueDate: { seconds: Math.floor(Date.now() / 1000) + 86400 * 2, nanoseconds: 0 },
    subtasks: [
      { id: 'sub9', title: 'Check cameras', completed: false },
      { id: 'sub10', title: 'Check lenses', completed: false },
      { id: 'sub11', title: 'Test networking equipment', completed: false },
      { id: 'sub12', title: 'Update insurance list', completed: false }
    ],
    blockedBy: [],
    blocks: [],
    tags: ['equipment', 'urgent'],
    comments: [],
    attachments: [],
    createdBy: 'user1',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 43200, nanoseconds: 0 }
  },
  {
    id: 'task4',
    title: 'Create highlight reel template',
    description: 'Design the template for daily highlight reels with intro, music bed, and outro',
    status: 'completed',
    priority: 'medium',
    category: 'pre_camp',
    team: 'video',
    assignees: ['user3'],
    subtasks: [],
    blockedBy: [],
    blocks: [],
    tags: ['editing', 'template'],
    comments: [],
    attachments: [],
    createdBy: 'user1',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
    completedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
    completedBy: 'user3'
  }
]

export const DEMO_EQUIPMENT: Equipment[] = [
  {
    id: 'eq1',
    name: 'Canon 5D Mark IV',
    description: 'Full-frame DSLR camera for main coverage',
    category: 'camera',
    value: 4000,
    ownerId: 'user1',
    serialNumber: 'CAN5D4-001234',
    insuranceVerified: true,
    condition: 'excellent',
    notes: 'Primary A-cam for highlights',
    maintenanceHistory: [],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 365, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 30, nanoseconds: 0 }
  },
  {
    id: 'eq2',
    name: 'Custom Built NAS',
    description: 'Network attached storage for media files',
    category: 'storage',
    value: 10000,
    ownerId: 'user5',
    insuranceVerified: true,
    condition: 'excellent',
    notes: 'Main storage server - 48TB capacity',
    maintenanceHistory: [],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 180, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 14, nanoseconds: 0 }
  },
  {
    id: 'eq3',
    name: 'HP OMEN Laptop',
    description: 'Editing workstation laptop',
    category: 'computer',
    value: 5000,
    ownerId: 'user3',
    insuranceVerified: true,
    condition: 'good',
    notes: 'Used for on-site editing',
    maintenanceHistory: [],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 200, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7, nanoseconds: 0 }
  },
  {
    id: 'eq4',
    name: 'DJI Mavic 3',
    description: 'Drone for aerial footage',
    category: 'camera',
    value: 3500,
    ownerId: 'user1',
    insuranceVerified: true,
    condition: 'excellent',
    notes: 'Used for establishing shots and timelapse',
    maintenanceHistory: [],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 120, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 }
  },
  {
    id: 'eq5',
    name: 'DJI Wireless Mic System',
    description: 'Wireless lavalier microphone system',
    category: 'audio',
    value: 800,
    ownerId: 'user1',
    insuranceVerified: true,
    condition: 'good',
    notes: 'Used for interviews and testimonies',
    maintenanceHistory: [],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 90, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 10, nanoseconds: 0 }
  }
]

export const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: 'Team Meeting - Thursday 7pm',
    content: 'All video team members please join the pre-camp meeting this Thursday at 7pm. We\'ll be going over the schedule, equipment assignments, and any last-minute changes.',
    priority: 'important',
    targets: ['video'],
    mentions: [],
    authorId: 'user1',
    pinned: true,
    requiresConfirmation: true,
    confirmedBy: ['user3', 'user5'],
    reactions: { '': ['user2'] },
    readBy: ['user1', 'user2', 'user3', 'user5'],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 }
  },
  {
    id: 'ann2',
    title: 'Equipment Check-in Reminder',
    content: 'Please make sure all your equipment is checked in and verified by the end of this week. We need to finalize the insurance documentation.',
    priority: 'urgent',
    targets: ['all'],
    mentions: [],
    authorId: 'user5',
    pinned: false,
    requiresConfirmation: false,
    confirmedBy: [],
    reactions: {},
    readBy: ['user1', 'user5'],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 }
  }
]

export const DEMO_CONTENT: ContentItem[] = [
  {
    id: 'content1',
    eventId: 'ec25',
    title: 'Friday Highlights Reel',
    description: 'Compilation of best moments from Friday',
    type: 'highlight',
    platform: 'both',
    status: 'planning',
    targetDuration: 180,
    assignedShooter: 'user1',
    assignedEditor: 'user3',
    assetLinks: [],
    notes: '',
    tags: ['highlights', 'friday'],
    createdBy: 'user1',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 }
  },
  {
    id: 'content2',
    eventId: 'ec25',
    title: 'Welcome Tour Video',
    description: 'Tour of the campsite for social media',
    type: 'reel',
    platform: 'instagram',
    status: 'planning',
    targetDuration: 60,
    assignedShooter: 'user2',
    assetLinks: [],
    notes: '',
    tags: ['tour', 'intro'],
    createdBy: 'user2',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 }
  },
  {
    id: 'content3',
    eventId: 'ec25',
    title: 'Photo Reel - Day 1',
    description: 'Photo slideshow for Big Top',
    type: 'photo_reel',
    platform: 'bigtop',
    status: 'planning',
    targetDuration: 600,
    assignedEditor: 'user2',
    assetLinks: [],
    notes: '10 minutes of photos from Day 1',
    tags: ['photos', 'bigtop'],
    createdBy: 'user1',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 43200, nanoseconds: 0 }
  }
]

export const DEMO_FAQS: FAQ[] = [
  {
    id: 'faq1',
    question: 'How do I upload footage to the server?',
    answer: 'Connect to the local network "EC-Media" and navigate to \\\\nas\\uploads in your file explorer. Create a folder with your name and date, then copy your files there.',
    category: 'Technical',
    order: 1,
    tags: ['upload', 'server', 'footage'],
    helpful: 12,
    notHelpful: 1,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 30, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7, nanoseconds: 0 }
  },
  {
    id: 'faq2',
    question: 'What are the camera settings for Big Top?',
    answer: '1080p 50fps, ISO 1600-3200 depending on lighting, Aperture f/2.8-4. Use Picture Profile: Neutral with -2 sharpness.',
    category: 'Equipment',
    order: 2,
    tags: ['camera', 'settings', 'bigtop'],
    helpful: 8,
    notHelpful: 0,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 25, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 10, nanoseconds: 0 }
  },
  {
    id: 'faq3',
    question: 'Who do I contact for equipment issues?',
    answer: 'Contact Joe Sutton for any equipment problems. He can usually be found in the production tent or reached via the team radio channel.',
    category: 'Contacts',
    order: 3,
    tags: ['equipment', 'contact', 'help'],
    helpful: 15,
    notHelpful: 0,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 20, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 }
  }
]

export const DEMO_IDEAS: Idea[] = [
  {
    id: 'idea1',
    title: 'Drone timelapse of campsite setup',
    description: 'Create a timelapse using the drone showing the campsite being set up from empty field to full camp. Would make great intro footage.',
    category: 'Content Ideas',
    authorId: 'user1',
    status: 'approved',
    upvotes: ['user2', 'user3', 'user4', 'user5'],
    downvotes: [],
    comments: [
      {
        id: 'comment1',
        userId: 'user5',
        content: 'Love this! We should start filming from Wednesday setup.',
        createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 }
      }
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 10, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3, nanoseconds: 0 }
  },
  {
    id: 'idea2',
    title: 'Real-time photo gallery during sessions',
    description: 'Set up a live photo feed that shows on screens around the venue as photos are taken. Would need a dedicated uploader.',
    category: 'Process Improvements',
    authorId: 'user2',
    status: 'proposed',
    upvotes: ['user1', 'user5'],
    downvotes: ['user3'],
    comments: [],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 },
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5, nanoseconds: 0 }
  }
]

// Initialize demo data in stores (for development without Firebase)
// Call this function from your app initialization if needed
export function initializeDemoData(stores: {
  useDataStore: typeof import('../stores/dataStore').useDataStore
  useAppStore: typeof import('../stores/appStore').useAppStore
  useAuthStore: typeof import('../stores/authStore').useAuthStore
}) {
  const { useDataStore, useAppStore, useAuthStore } = stores

  // Set demo user
  useAuthStore.getState().setUser(DEMO_USERS[0])

  // Set current event
  useAppStore.getState().setCurrentEvent(DEMO_EVENT)

  // Populate data store
  useDataStore.getState().setTeamMembers(DEMO_USERS)
  useDataStore.getState().setTasks(DEMO_TASKS)
  useDataStore.getState().setEquipment(DEMO_EQUIPMENT)
  useDataStore.getState().setAnnouncements(DEMO_ANNOUNCEMENTS)
  useDataStore.getState().setContent(DEMO_CONTENT)
  useDataStore.getState().setFaqs(DEMO_FAQS)
  useDataStore.getState().setIdeas(DEMO_IDEAS)
}
