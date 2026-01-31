import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Card, CardHeader, Button, Switch } from '../ui'
import { Bell, BellOff, Volume2, VolumeX, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface NotificationPreference {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface NotificationSettingsProps {
  preferences: NotificationPreference[]
  onUpdate: (id: string, enabled: boolean) => void
  soundEnabled: boolean
  onSoundToggle: (enabled: boolean) => void
  className?: string
}

export function NotificationSettings({
  preferences,
  onUpdate,
  soundEnabled,
  onSoundToggle,
  className
}: NotificationSettingsProps) {
  const [testingSound, setTestingSound] = useState(false)

  const testNotificationSound = () => {
    setTestingSound(true)
    // Play a notification sound (using Web Audio API)
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 880 // A5 note
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)

    setTimeout(() => setTestingSound(false), 300)
  }

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        toast.success('Notifications enabled!')
        new Notification('EC Media', {
          body: 'Notifications are now enabled',
          icon: '/icons/icon-192.png'
        })
      } else {
        toast.error('Notification permission denied')
      }
    }
  }

  const browserPermission = 'Notification' in window ? Notification.permission : 'unsupported'

  return (
    <div className={cn('space-y-6', className)}>
      {/* Browser permission */}
      <Card>
        <CardHeader title="Browser Notifications" />
        <div className="mt-4">
          {browserPermission === 'unsupported' ? (
            <p className="text-sm text-surface-500">
              Your browser does not support notifications.
            </p>
          ) : browserPermission === 'granted' ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Notifications enabled</span>
            </div>
          ) : browserPermission === 'denied' ? (
            <div className="flex items-center gap-2 text-red-600">
              <BellOff className="h-5 w-5" />
              <span className="text-sm">
                Notifications are blocked. Please enable them in your browser settings.
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-surface-400" />
                <span className="text-sm">Enable browser notifications?</span>
              </div>
              <Button onClick={requestBrowserPermission}>
                Enable
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Sound settings */}
      <Card>
        <CardHeader title="Notification Sounds" />
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary-500" />
              ) : (
                <VolumeX className="h-5 w-5 text-surface-400" />
              )}
              <div>
                <p className="text-sm font-medium">Play notification sounds</p>
                <p className="text-xs text-surface-500">Hear a sound when you receive notifications</p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onChange={onSoundToggle}
            />
          </div>

          {soundEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={testNotificationSound}
              disabled={testingSound}
            >
              Test Sound
            </Button>
          )}
        </div>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader title="Notification Preferences" />
        <div className="mt-4 divide-y divide-surface-100 dark:divide-surface-800">
          {preferences.map((pref) => (
            <div key={pref.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{pref.label}</p>
                  <p className="text-xs text-surface-500">{pref.description}</p>
                </div>
                <Switch
                  checked={pref.enabled}
                  onChange={(checked) => onUpdate(pref.id, checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// Default notification preferences
export const defaultNotificationPreferences: NotificationPreference[] = [
  {
    id: 'task_assigned',
    label: 'Task assignments',
    description: 'When a task is assigned to you',
    enabled: true
  },
  {
    id: 'task_due_soon',
    label: 'Upcoming deadlines',
    description: 'When a task is due within 24 hours',
    enabled: true
  },
  {
    id: 'task_completed',
    label: 'Task completions',
    description: 'When a task you created is completed',
    enabled: true
  },
  {
    id: 'announcements',
    label: 'Announcements',
    description: 'When a new announcement is posted',
    enabled: true
  },
  {
    id: 'mentions',
    label: 'Mentions',
    description: 'When someone mentions you',
    enabled: true
  },
  {
    id: 'schedule_changes',
    label: 'Schedule changes',
    description: 'When your schedule is updated',
    enabled: true
  },
  {
    id: 'content_status',
    label: 'Content updates',
    description: 'When content you\'re working on changes status',
    enabled: false
  }
]

// Simple notification hook for triggering in-app notifications
export function useNotificationSound() {
  const playSound = (type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const frequencies = {
      success: [523, 659],    // C5, E5
      info: [440],            // A4
      warning: [440, 349],    // A4, F4
      error: [311, 233]       // Eb4, Bb3
    }

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

      frequencies[type].forEach((freq, idx) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = freq
        oscillator.type = 'sine'

        const startTime = audioContext.currentTime + idx * 0.15
        gainNode.gain.setValueAtTime(0.2, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)

        oscillator.start(startTime)
        oscillator.stop(startTime + 0.2)
      })
    } catch (e) {
      // Audio not supported, fail silently
    }
  }

  return { playSound }
}
