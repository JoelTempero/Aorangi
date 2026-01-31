import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface PageLayoutProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

export function PageLayout({
  title,
  description,
  action,
  children,
  className,
  fullWidth = false
}: PageLayoutProps) {
  return (
    <div className={cn('flex-1 overflow-auto', className)}>
      <div className={cn('p-4 md:p-6 lg:p-8', !fullWidth && 'max-w-7xl mx-auto')}>
        {(title || action) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              {title && (
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="flex items-center gap-2">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export interface PageSectionProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function PageSection({
  title,
  description,
  action,
  children,
  className
}: PageSectionProps) {
  return (
    <section className={cn('mb-8', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
