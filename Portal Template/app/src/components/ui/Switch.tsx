import { cn } from '../../utils/cn'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  description?: string
  className?: string
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className
}: SwitchProps) {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'h-3 w-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'h-5 w-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'h-6 w-6', translate: 'translate-x-7' }
  }

  const s = sizes[size]

  const toggle = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-900',
        s.track,
        checked
          ? 'bg-primary-600'
          : 'bg-surface-200 dark:bg-surface-700',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          s.thumb,
          checked ? s.translate : 'translate-x-0'
        )}
      />
    </button>
  )

  if (label || description) {
    return (
      <label className={cn('flex items-start gap-3 cursor-pointer', disabled && 'cursor-not-allowed', className)}>
        {switchElement}
        <div>
          {label && (
            <span className={cn('text-sm font-medium', disabled && 'opacity-50')}>
              {label}
            </span>
          )}
          {description && (
            <p className={cn('text-xs text-surface-500', disabled && 'opacity-50')}>
              {description}
            </p>
          )}
        </div>
      </label>
    )
  }

  return <div className={className}>{switchElement}</div>
}

// Toggle with icons (e.g., sun/moon for theme)
interface IconSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  offIcon: React.ReactNode
  onIcon: React.ReactNode
  disabled?: boolean
  className?: string
}

export function IconSwitch({
  checked,
  onChange,
  offIcon,
  onIcon,
  disabled = false,
  className
}: IconSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        checked
          ? 'bg-primary-600'
          : 'bg-surface-200 dark:bg-surface-700',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none flex h-7 w-7 items-center justify-center rounded-full bg-white shadow transform transition-transform duration-300',
          checked ? 'translate-x-8' : 'translate-x-0'
        )}
      >
        {checked ? onIcon : offIcon}
      </span>
    </button>
  )
}
