import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // Start fade out
    setIsVisible(false)

    // After fade out, update children and fade in
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [location.pathname])

  // Initial mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-1',
        className
      )}
    >
      {displayChildren}
    </div>
  )
}

// Simpler fade-only variant
export function FadeTransition({ children, className }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn(
        'transition-opacity duration-300',
        mounted ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {children}
    </div>
  )
}

// Slide in from right (for modals/drawers)
interface SlideTransitionProps {
  children: ReactNode
  show: boolean
  direction?: 'left' | 'right' | 'up' | 'down'
  className?: string
}

export function SlideTransition({
  children,
  show,
  direction = 'right',
  className
}: SlideTransitionProps) {
  const translateClass = {
    left: show ? 'translate-x-0' : '-translate-x-full',
    right: show ? 'translate-x-0' : 'translate-x-full',
    up: show ? 'translate-y-0' : '-translate-y-full',
    down: show ? 'translate-y-0' : 'translate-y-full'
  }

  return (
    <div
      className={cn(
        'transition-transform duration-300 ease-out',
        translateClass[direction],
        className
      )}
    >
      {children}
    </div>
  )
}

// Staggered list animation
interface StaggeredListProps {
  children: ReactNode[]
  staggerDelay?: number
  className?: string
}

export function StaggeredList({ children, staggerDelay = 50, className }: StaggeredListProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    children.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleItems((prev) => [...prev, index])
      }, index * staggerDelay)
      timers.push(timer)
    })

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [children.length, staggerDelay])

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            'transition-all duration-300',
            visibleItems.includes(index)
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          )}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
