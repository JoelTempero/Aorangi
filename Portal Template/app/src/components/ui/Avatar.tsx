import { forwardRef, type ImgHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { User } from 'lucide-react'

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl'
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-surface-400',
  busy: 'bg-red-500',
  away: 'bg-amber-500'
}

const statusSizes = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500'
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = 'md', status, alt, ...props }, ref) => {
    const initials = name ? getInitials(name) : ''
    const bgColor = name ? getColorFromName(name) : 'bg-surface-300'

    return (
      <div ref={ref} className={cn('relative inline-block', className)}>
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn(
              'rounded-full object-cover',
              sizes[size]
            )}
            {...props}
          />
        ) : (
          <div
            className={cn(
              'flex items-center justify-center rounded-full font-medium text-white',
              sizes[size],
              bgColor
            )}
          >
            {initials || <User className="h-1/2 w-1/2" />}
          </div>
        )}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-surface-900',
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: AvatarProps['size']
}

export function AvatarGroup({ children, max = 4, size = 'md' }: AvatarGroupProps) {
  const avatars = Array.isArray(children) ? children : [children]
  const shown = avatars.slice(0, max)
  const remaining = avatars.length - max

  return (
    <div className="flex -space-x-2">
      {shown.map((avatar, i) => (
        <div key={i} className="ring-2 ring-white dark:ring-surface-900 rounded-full">
          {avatar}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-surface-200 text-surface-600 font-medium ring-2 ring-white dark:ring-surface-900 dark:bg-surface-700 dark:text-surface-300',
            sizes[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
