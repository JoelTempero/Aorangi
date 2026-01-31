import { motion } from 'framer-motion'

interface AnimatedLogoProps {
  className?: string
  animate?: boolean
}

export function AnimatedLogo({ className = '', animate = true }: AnimatedLogoProps) {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: 'easeInOut' as const },
        opacity: { duration: 0.5 },
      },
    },
  }

  const fillVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 1.5, duration: 0.5 },
    },
  }

  return (
    <motion.svg
      viewBox="0 0 200 60"
      className={className}
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
    >
      {/* Stylized "A" representing mountain/aerial */}
      <motion.path
        d="M20 50 L35 15 L50 50 M27 38 L43 38"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={pathVariants}
      />

      {/* Drone icon */}
      <motion.g variants={fillVariants}>
        <circle cx="35" cy="8" r="3" fill="#3b82f6" />
        <line x1="32" y1="8" x2="25" y2="5" stroke="#8b5cf6" strokeWidth="1.5" />
        <line x1="38" y1="8" x2="45" y2="5" stroke="#8b5cf6" strokeWidth="1.5" />
        <circle cx="25" cy="5" r="2" stroke="#06b6d4" strokeWidth="1" fill="none" />
        <circle cx="45" cy="5" r="2" stroke="#06b6d4" strokeWidth="1" fill="none" />
      </motion.g>

      {/* Text "AORANGI" */}
      <motion.text
        x="60"
        y="35"
        className="font-display font-bold text-lg"
        fill="white"
        variants={fillVariants}
      >
        AORANGI
      </motion.text>

      {/* Text "AERIALS" */}
      <motion.text
        x="60"
        y="50"
        className="font-body text-sm tracking-widest"
        fill="white"
        fillOpacity="0.7"
        variants={fillVariants}
      >
        AERIALS
      </motion.text>

      {/* Gradient definition */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}
