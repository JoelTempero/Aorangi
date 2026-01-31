import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  getAuth,
  type User as FirebaseUser
} from 'firebase/auth'
import { initializeApp, deleteApp } from 'firebase/app'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, firebaseConfig } from './firebase'
import type { User, Invite, UserRole, TeamType, DEFAULT_NOTIFICATION_PREFS } from '../types'

export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await updateDoc(doc(db, 'users', result.user.uid), {
      lastActive: serverTimestamp()
    })
    return result.user
  },

  // Register with invite code
  async register(
    email: string,
    password: string,
    displayName: string,
    inviteCode: string
  ): Promise<FirebaseUser> {
    // Verify invite code
    const inviteRef = doc(db, 'invites', inviteCode)
    const inviteSnap = await getDoc(inviteRef)

    if (!inviteSnap.exists()) {
      throw new Error('Invalid invite code')
    }

    const invite = inviteSnap.data() as Invite
    if (invite.used) {
      throw new Error('Invite code has already been used')
    }

    const now = new Date()
    const expiresAt = invite.expiresAt as { seconds: number }
    if (expiresAt && new Date(expiresAt.seconds * 1000) < now) {
      throw new Error('Invite code has expired')
    }

    // Create user account
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })

    // Create user document
    const userData: Omit<User, 'id'> = {
      email,
      displayName,
      role: invite.assignedRole,
      teams: invite.assignedTeams,
      skills: [],
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
      createdAt: serverTimestamp() as any,
      lastActive: serverTimestamp() as any
    }

    await setDoc(doc(db, 'users', result.user.uid), userData)

    // Mark invite as used
    await updateDoc(inviteRef, {
      used: true,
      usedBy: result.user.uid
    })

    return result.user
  },

  // Sign out
  async signOut(): Promise<void> {
    await firebaseSignOut(auth)
  },

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email)
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  },

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback)
  },

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<User | null> {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User
    }
    return null
  },

  // Update user profile
  async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  },

  // Update FCM token
  async updateFcmToken(uid: string, token: string): Promise<void> {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { fcmToken: token })
  },

  // Create a user account (admin only - uses secondary app to not affect current session)
  async createUserAccount(
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    teams: TeamType[]
  ): Promise<void> {
    // Create a secondary Firebase app to create the user without affecting current auth state
    const secondaryApp = initializeApp(firebaseConfig, 'secondary')
    const secondaryAuth = getAuth(secondaryApp)

    try {
      // Create the user with the secondary auth instance
      const result = await createUserWithEmailAndPassword(secondaryAuth, email, password)
      await updateProfile(result.user, { displayName })

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email,
        displayName,
        role,
        teams,
        skills: [],
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
        createdAt: serverTimestamp() as any,
        lastActive: serverTimestamp() as any
      }

      await setDoc(doc(db, 'users', result.user.uid), userData)

      // Sign out from secondary auth and delete the secondary app
      await firebaseSignOut(secondaryAuth)
    } finally {
      // Clean up the secondary app
      await deleteApp(secondaryApp)
    }
  },

  // Bootstrap first admin user (only works when no users exist)
  async bootstrapAdmin(
    email: string,
    password: string,
    displayName: string
  ): Promise<FirebaseUser> {
    // Create user account
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })

    // Create admin user document
    const userData: Omit<User, 'id'> = {
      email,
      displayName,
      role: 'admin',
      teams: ['video', 'support'],
      skills: [],
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
      createdAt: serverTimestamp() as any,
      lastActive: serverTimestamp() as any
    }

    await setDoc(doc(db, 'users', result.user.uid), userData)

    // Create a default event for the team
    const eventData = {
      id: 'ec25',
      name: 'EC Media 2025',
      year: 2025,
      startDate: { seconds: Math.floor(new Date('2025-04-17').getTime() / 1000), nanoseconds: 0 },
      endDate: { seconds: Math.floor(new Date('2025-04-21').getTime() / 1000), nanoseconds: 0 },
      status: 'planning',
      createdAt: serverTimestamp()
    }
    await setDoc(doc(db, 'events', 'ec25'), eventData)

    return result.user
  }
}
