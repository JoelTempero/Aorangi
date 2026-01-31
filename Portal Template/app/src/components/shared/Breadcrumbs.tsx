import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../utils/cn'

const routeNames: Record<string, string> = {
  '': 'Dashboard',
  'tasks': 'Tasks',
  'schedule': 'Schedule',
  'content': 'Content',
  'team': 'Team',
  'equipment': 'Equipment',
  'announcements': 'Announcements',
  'brainstorm': 'Brainstorm',
  'faqs': 'FAQs',
  'reports': 'Reports',
  'import': 'Import',
  'settings': 'Settings',
  'profile': 'Profile',
  'new': 'New'
}

interface BreadcrumbsProps {
  className?: string
  items?: { label: string; href?: string }[]
}

export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  const location = useLocation()

  // Generate breadcrumbs from URL if items not provided
  const breadcrumbs = items || generateBreadcrumbs(location.pathname)

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className={cn('flex items-center text-sm', className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={crumb.label} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-surface-400 mx-1" />
              )}
              {isLast || !crumb.href ? (
                <span className={cn(
                  'font-medium',
                  isLast
                    ? 'text-surface-900 dark:text-surface-100'
                    : 'text-surface-500 dark:text-surface-400'
                )}>
                  {index === 0 ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only">{crumb.label}</span>
                    </span>
                  ) : (
                    crumb.label
                  )}
                </span>
              ) : (
                <Link
                  to={crumb.href}
                  className="text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                >
                  {index === 0 ? (
                    <>
                      <Home className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only">{crumb.label}</span>
                    </>
                  ) : (
                    crumb.label
                  )}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: { label: string; href?: string }[] = [
    { label: 'Home', href: '/' }
  ]

  let path = ''
  for (const segment of segments) {
    path += `/${segment}`

    // Check if it's a known route or an ID
    const label = routeNames[segment] || (
      // If it's a UUID or number, skip or use previous route + "Details"
      /^[a-f0-9-]{36}$|^\d+$/.test(segment)
        ? 'Details'
        : segment.charAt(0).toUpperCase() + segment.slice(1)
    )

    breadcrumbs.push({
      label,
      href: path
    })
  }

  // Remove href from last item
  if (breadcrumbs.length > 0) {
    breadcrumbs[breadcrumbs.length - 1].href = undefined
  }

  return breadcrumbs
}
