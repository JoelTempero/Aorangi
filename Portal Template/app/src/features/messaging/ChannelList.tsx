import { Hash, Users, Lock } from 'lucide-react'
import { Card } from '../../components/ui'
import type { Channel } from '../../types/messaging.types'
import { cn } from '../../utils/cn'

interface ChannelListProps {
  channels: Channel[]
  selectedChannel: Channel | null
  onSelectChannel: (channel: Channel) => void
  loading: boolean
  currentUserId?: string
}

export function ChannelList({
  channels,
  selectedChannel,
  onSelectChannel,
  loading,
  currentUserId
}: ChannelListProps) {
  // Group channels by type (general vs team-specific)
  const generalChannels = channels.filter(c => !c.team)
  const teamChannels = channels.filter(c => c.team)

  if (loading) {
    return (
      <Card className="h-full p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-surface-200 dark:bg-surface-700 rounded" />
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-surface-100 dark:bg-surface-800 rounded" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <h2 className="font-semibold text-surface-900 dark:text-white">Channels</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* General Channels */}
        {generalChannels.length > 0 && (
          <div className="mb-4">
            <div className="px-2 py-1 text-xs font-medium text-surface-500 uppercase tracking-wider">
              General
            </div>
            {generalChannels.map(channel => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isSelected={selectedChannel?.id === channel.id}
                onClick={() => onSelectChannel(channel)}
              />
            ))}
          </div>
        )}

        {/* Team Channels */}
        {teamChannels.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Teams
            </div>
            {teamChannels.map(channel => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isSelected={selectedChannel?.id === channel.id}
                onClick={() => onSelectChannel(channel)}
              />
            ))}
          </div>
        )}

        {channels.length === 0 && (
          <div className="text-center py-8 text-surface-500">
            <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No channels yet</p>
          </div>
        )}
      </div>
    </Card>
  )
}

interface ChannelItemProps {
  channel: Channel
  isSelected: boolean
  onClick: () => void
}

function ChannelItem({ channel, isSelected, onClick }: ChannelItemProps) {
  const Icon = channel.team ? Users : Hash

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors',
        isSelected
          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
          : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate text-sm">{channel.name}</div>
        {channel.lastMessagePreview && (
          <div className="text-xs text-surface-500 truncate">
            {channel.lastMessagePreview}
          </div>
        )}
      </div>
    </button>
  )
}
