import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-dark flex items-center justify-center z-50">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated drone icon */}
        <motion.div
          className="relative w-16 h-16"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            viewBox="0 0 64 64"
            fill="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Drone body */}
            <rect
              x="24"
              y="28"
              width="16"
              height="8"
              rx="2"
              className="fill-accent-blue"
            />
            {/* Arms */}
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '16px 28px' }}
            >
              <circle cx="16" cy="28" r="6" className="stroke-accent-purple stroke-2 fill-none" />
            </motion.g>
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '48px 28px' }}
            >
              <circle cx="48" cy="28" r="6" className="stroke-accent-purple stroke-2 fill-none" />
            </motion.g>
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '16px 36px' }}
            >
              <circle cx="16" cy="36" r="6" className="stroke-accent-cyan stroke-2 fill-none" />
            </motion.g>
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '48px 36px' }}
            >
              <circle cx="48" cy="36" r="6" className="stroke-accent-cyan stroke-2 fill-none" />
            </motion.g>
            {/* Connection lines */}
            <line x1="24" y1="30" x2="16" y2="28" className="stroke-white/50 stroke-1" />
            <line x1="40" y1="30" x2="48" y2="28" className="stroke-white/50 stroke-1" />
            <line x1="24" y1="34" x2="16" y2="36" className="stroke-white/50 stroke-1" />
            <line x1="40" y1="34" x2="48" y2="36" className="stroke-white/50 stroke-1" />
            {/* Camera */}
            <circle cx="32" cy="40" r="3" className="fill-white/80" />
          </svg>
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-white/60 text-sm">Loading</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-accent-blue"
          >
            ...
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}
