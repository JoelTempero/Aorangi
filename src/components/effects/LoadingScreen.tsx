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
    const duration = minimumDuration
    const interval = 20
    const steps = duration / interval
    const increment = 100 / steps

    let currentProgress = 0
    const timer = setInterval(() => {
      currentProgress += increment
      const easedProgress = Math.min(100, currentProgress)
      setProgress(easedProgress)

      if (currentProgress >= 100) {
        clearInterval(timer)
        setTimeout(() => {
          setIsLoading(false)
          onComplete?.()
        }, 300)
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
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] bg-dark flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
            {/* Logo */}
            <motion.img
              src={images.logo}
              alt="Aorangi Aerials"
              className="w-20 h-20 mb-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-48 h-1 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
