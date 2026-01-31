import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  velocityX: number
  velocityY: number
}

const COLORS = [
  '#6366f1', // primary
  '#d946ef', // accent
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#ec4899'  // pink
]

interface ConfettiAnimationProps {
  active: boolean
  duration?: number
  particleCount?: number
  onComplete?: () => void
}

export function ConfettiAnimation({
  active,
  duration = 3000,
  particleCount = 50,
  onComplete
}: ConfettiAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!active) {
      setParticles([])
      return
    }

    // Generate particles
    const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      rotation: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 8 + Math.random() * 8,
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: 2 + Math.random() * 3
    }))

    setParticles(newParticles)

    // Clear after duration
    const timer = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [active, duration, particleCount, onComplete])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            '--velocity-x': particle.velocityX,
            '--velocity-y': particle.velocityY
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// Add CSS animation
const style = document.createElement('style')
style.textContent = `
  @keyframes confetti {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
  .animate-confetti {
    animation: confetti 3s ease-out forwards;
  }
`
if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
