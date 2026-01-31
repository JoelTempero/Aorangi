import { useState, useEffect } from 'react'
import { PageLayout } from '../../components/layout'
import { Card } from '../../components/ui'
import { ChannelList } from './ChannelList'
import { ChatView } from './ChatView'
import { useAuth } from '../../hooks/useAuth'
import { useDataStore } from '../../stores/dataStore'
import { firestoreService } from '../../services/firestore.service'
import type { Channel, Message } from '../../types/messaging.types'
import { DEFAULT_CHANNELS } from '../../types/messaging.types'
import { orderBy } from 'firebase/firestore'

export function MessagingPage() {
  const { user } = useAuth()
  const { teamMembers } = useDataStore()
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingChannels, setLoadingChannels] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Load channels
  useEffect(() => {
    const unsubscribe = firestoreService.subscribeToCollection<Channel>(
      'channels',
      [orderBy('name', 'asc')],
      (items) => {
        setChannels(items)
        setLoadingChannels(false)
        // Auto-select first channel if none selected
        if (!selectedChannel && items.length > 0) {
          setSelectedChannel(items[0])
        }
      }
    )

    return () => unsubscribe()
  }, [])

  // Load messages for selected channel
  useEffect(() => {
    if (!selectedChannel) {
      setMessages([])
      return
    }

    setLoadingMessages(true)
    const unsubscribe = firestoreService.subscribeToCollection<Message>(
      `channels/${selectedChannel.id}/messages`,
      [orderBy('createdAt', 'asc')],
      (items) => {
        setMessages(items)
        setLoadingMessages(false)
      }
    )

    return () => unsubscribe()
  }, [selectedChannel?.id])

  // Initialize default channels if none exist
  useEffect(() => {
    if (!loadingChannels && channels.length === 0 && user) {
      initializeDefaultChannels()
    }
  }, [loadingChannels, channels.length, user])

  const initializeDefaultChannels = async () => {
    if (!user) return

    try {
      for (const channelData of DEFAULT_CHANNELS) {
        await firestoreService.create('channels', {
          ...channelData,
          memberIds: [],
          createdBy: user.id
        })
      }
    } catch (error) {
      console.error('Failed to initialize channels:', error)
    }
  }

  const handleSendMessage = async (content: string, mentions: string[]) => {
    if (!selectedChannel || !user || !content.trim()) return

    try {
      await firestoreService.create(`channels/${selectedChannel.id}/messages`, {
        channelId: selectedChannel.id,
        authorId: user.id,
        content: content.trim(),
        mentions,
        attachments: [],
        reactions: {},
        edited: false,
        deleted: false
      })

      // Update channel's last message
      await firestoreService.update('channels', selectedChannel.id, {
        lastMessageAt: firestoreService.serverTimestamp(),
        lastMessagePreview: content.trim().substring(0, 50)
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!selectedChannel || !user) return

    const message = messages.find(m => m.id === messageId)
    if (!message) return

    const currentReactions = message.reactions[emoji] || []
    const hasReacted = currentReactions.includes(user.id)

    const newReactions = hasReacted
      ? currentReactions.filter(id => id !== user.id)
      : [...currentReactions, user.id]

    try {
      await firestoreService.update(
        `channels/${selectedChannel.id}/messages`,
        messageId,
        {
          reactions: {
            ...message.reactions,
            [emoji]: newReactions.length > 0 ? newReactions : undefined
          }
        }
      )
    } catch (error) {
      console.error('Failed to update reaction:', error)
    }
  }

  return (
    <PageLayout title="Messages" description="Team communication channels">
      <div className="flex gap-6 h-[calc(100vh-12rem)]">
        {/* Channel List */}
        <div className="w-64 shrink-0">
          <ChannelList
            channels={channels}
            selectedChannel={selectedChannel}
            onSelectChannel={setSelectedChannel}
            loading={loadingChannels}
            currentUserId={user?.id}
          />
        </div>

        {/* Chat View */}
        <div className="flex-1 min-w-0">
          <ChatView
            channel={selectedChannel}
            messages={messages}
            teamMembers={teamMembers}
            currentUserId={user?.id}
            onSendMessage={handleSendMessage}
            onReaction={handleReaction}
            loading={loadingMessages}
          />
        </div>
      </div>
    </PageLayout>
  )
}
