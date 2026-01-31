import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { images } from '@/data/images'

interface LoadingScreenProps {
  minimumDuration?: number
  onComplete?: () => void
}

export function LoadingScreen({ minimumDuration = 2000, onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar
    const duration = minimumDuration
    const interval = 20 // Update every 20ms for smooth animation
    const steps = duration / interval
    const increment = 100 / steps

    let currentProgress = 0
    const timer = setInterval(() => {
      currentProgress += increment
      // Add some easing - slow down near the end
      const easedProgress = Math.min(100, currentProgress * (1 + Math.sin((currentProgress / 100) * Math.PI) * 0.1))
      setProgress(easedProgress)

      if (currentProgress >= 100) {
        clearInterval(timer)
        // Small delay before hiding
        setTimeout(() => {
          setIsLoading(false)
          onComplete?.()
        }, 200)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [minimumDuration, onComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-dark flex flex-col items-center justify-center"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-dark-lighter" />

          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-accent-blue/30 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: [null, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.img
                src={images.logo}
                alt="Aorangi Aerials"
                className="w-20 h-20 sm:w-24 sm:h-24"
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
                    'drop-shadow(0 0 40px rgba(59, 130, 246, 0.5))',
                    'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Company name */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="heading-display text-2xl sm:text-3xl text-white mb-2"
            >
              Aorangi Aerials
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white/50 text-sm mb-10"
            >
              Precision From Above
            </motion.p>

            {/* Loading bar container */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 200 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="relative"
            >
              {/* Background track */}
              <div className="w-[200px] sm:w-[280px] h-1 bg-white/10 rounded-full overflow-hidden">
                {/* Progress bar */}
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </div>

              {/* Percentage */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/40 text-xs mt-3 text-center tabular-nums"
              >
                {Math.round(progress)}%
              </motion.p>
            </motion.div>
          </div>

          {/* Bottom decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-8 text-white/30 text-xs"
          >
            Professional Drone Services
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
