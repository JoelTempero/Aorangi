import { useState } from 'react'
import { PageLayout, PageSection } from '../../components/layout'
import { Card, CardHeader, Button, Input, Select, Checkbox, Avatar, Modal, ModalFooter } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useAppStore } from '../../stores/appStore'
import { authService } from '../../services/auth.service'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  UserPlus,
  Copy,
  Plus,
  Lock
} from 'lucide-react'
import type { NotificationPrefs, TeamType, UserRole } from '../../types'
import { TEAM_LABELS, ROLE_LABELS, DEFAULT_NOTIFICATION_PREFS } from '../../types'

export function SettingsPage() {
  const { user, isAdmin } = useAuth()
  const { theme, setTheme } = useAppStore()

  return (
    <PageLayout title="Settings" description="Manage your account and preferences">
      <div className="max-w-3xl space-y-8">
        {/* Profile */}
        <ProfileSection />

        {/* Password */}
        <PasswordSection />

        {/* Notifications */}
        <NotificationSection />

        {/* Appearance */}
        <PageSection title="Appearance">
          <Card>
            <div className="space-y-4">
              <Select
                label="Theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                options={[
                  { value: 'system', label: 'System (Auto)' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' }
                ]}
              />
            </div>
          </Card>
        </PageSection>

        {/* Admin - Create Accounts */}
        {isAdmin && <CreateAccountSection />}
      </div>
    </PageLayout>
  )
}

function ProfileSection() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ displayName, phone })
      toast.success('Profile updated')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageSection title="Profile">
      <Card>
        <div className="flex items-start gap-6">
          <Avatar
            src={user?.photoURL}
            name={user?.displayName}
            size="xl"
          />
          <div className="flex-1 space-y-4">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              hint="Contact an admin to change your email"
            />
            <Input
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
            />
            <Button onClick={handleSave} loading={loading}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </PageSection>
  )
}

function PasswordSection() {
  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const user = auth.currentUser
      if (!user || !user.email) {
        throw new Error('Not authenticated')
      }

      // Re-authenticate the user first
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, newPassword)

      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect')
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in, then try again')
      } else {
        toast.error(error.message || 'Failed to update password')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageSection title="Password">
      <Card>
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
          <Button
            onClick={handleChangePassword}
            loading={loading}
            disabled={!currentPassword || !newPassword || !confirmPassword}
            leftIcon={<Lock className="h-4 w-4" />}
          >
            Change Password
          </Button>
        </div>
      </Card>
    </PageSection>
  )
}

function NotificationSection() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [prefs, setPrefs] = useState<NotificationPrefs>(
    user?.notificationPrefs || DEFAULT_NOTIFICATION_PREFS
  )

  const handleToggle = (key: keyof NotificationPrefs) => {
    if (typeof prefs[key] === 'boolean') {
      setPrefs({ ...prefs, [key]: !prefs[key] })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ notificationPrefs: prefs })
      toast.success('Notification preferences updated')
    } catch (error) {
      toast.error('Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageSection title="Notifications">
      <Card>
        <div className="space-y-4">
          <Checkbox
            label="Task assigned to me"
            description="Get notified when you're assigned to a task"
            checked={prefs.taskAssigned}
            onChange={() => handleToggle('taskAssigned')}
          />
          <Checkbox
            label="Task due soon"
            description="Get reminded before tasks are due"
            checked={prefs.taskDueSoon}
            onChange={() => handleToggle('taskDueSoon')}
          />
          <Checkbox
            label="Schedule changes"
            description="Get notified of changes to your schedule"
            checked={prefs.scheduleChange}
            onChange={() => handleToggle('scheduleChange')}
          />
          <Checkbox
            label="Announcements"
            description="Receive team announcements"
            checked={prefs.announcement}
            onChange={() => handleToggle('announcement')}
          />
          <Checkbox
            label="Content status changes"
            description="Updates on content you're assigned to"
            checked={prefs.contentStatusChange}
            onChange={() => handleToggle('contentStatusChange')}
          />
          <Checkbox
            label="Equipment assignments"
            description="When equipment is assigned to you"
            checked={prefs.equipmentAssigned}
            onChange={() => handleToggle('equipmentAssigned')}
          />

          <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
            <Input
              label="Due soon threshold (hours)"
              type="number"
              value={prefs.dueSoonHours}
              onChange={(e) => setPrefs({ ...prefs, dueSoonHours: parseInt(e.target.value) || 24 })}
              hint="How many hours before a deadline to send reminders"
            />
          </div>

          <Button onClick={handleSave} loading={loading}>
            Save Preferences
          </Button>
        </div>
      </Card>
    </PageSection>
  )
}

function CreateAccountSection() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createdAccounts, setCreatedAccounts] = useState<{ email: string; password: string }[]>([])

  return (
    <PageSection
      title="Create Team Accounts"
      action={
        <Button
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          Create Account
        </Button>
      }
    >
      <Card>
        <p className="text-sm text-surface-500 mb-4">
          Create accounts for team members directly. They will receive login credentials.
        </p>

        {createdAccounts.length === 0 ? (
          <div className="text-center py-8 text-surface-500">
            <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No accounts created this session</p>
            <p className="text-sm mt-1">Create accounts for your team members</p>
          </div>
        ) : (
          <div className="space-y-2">
            {createdAccounts.map((account, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{account.email}</p>
                  <p className="text-xs text-surface-500 font-mono mt-1">
                    Password: {account.password}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(`Email: ${account.email}\nPassword: ${account.password}`)
                    toast.success('Credentials copied!')
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <CreateAccountModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(account) => setCreatedAccounts([...createdAccounts, account])}
      />
    </PageSection>
  )
}

interface CreateAccountModalProps {
  open: boolean
  onClose: () => void
  onCreated: (account: { email: string; password: string }) => void
}

function CreateAccountModal({ open, onClose, onCreated }: CreateAccountModalProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('member')
  const [tags, setTags] = useState<TeamType[]>([])

  const generatePassword = () => {
    const generated = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6).toUpperCase()
    setPassword(generated)
  }

  const handleCreate = async () => {
    if (!email || !displayName || !password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {

      await authService.createUserAccount(email, password, displayName, role, tags)

      toast.success('Account created successfully')
      onCreated({ email, password })
      onClose()

      // Reset form
      setEmail('')
      setDisplayName('')
      setPassword('')
      setRole('member')
      setTags([])
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Team Account" size="md">
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="team.member@example.com"
          required
        />

        <Input
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="John Smith"
          required
        />

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password or generate"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={generatePassword}>
              Generate
            </Button>
          </div>
          <p className="text-xs text-surface-500 mt-1">Minimum 6 characters</p>
        </div>

        <Select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          options={[
            { value: 'member', label: 'Member' },
            { value: 'admin', label: 'Admin' }
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg border-surface-300 dark:border-surface-600">
            {(Object.entries(TEAM_LABELS) as [TeamType, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setTags((prev) =>
                    prev.includes(value)
                      ? prev.filter((t) => t !== value)
                      : [...prev, value]
                  )
                }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-colors',
                  tags.includes(value)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} loading={loading} disabled={!email || !displayName || !password || password.length < 6}>
            Create Account
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  )
}
