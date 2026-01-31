import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

interface GameObject {
  x: number
  y: number
  width: number
  height: number
}

interface Cloud extends GameObject {
  speed: number
}

export default function DroneGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === 'undefined') return 0
    const saved = localStorage.getItem('droneGameHighScore')
    return saved ? parseInt(saved, 10) : 0
  })
  const [droneY, setDroneY] = useState(250)
  const [clouds, setClouds] = useState<Cloud[]>([])

  const gameLoopRef = useRef<number | undefined>(undefined)
  const droneRef = useRef({ y: 250, velocity: 0 })

  const GRAVITY = 0.5
  const JUMP_FORCE = -10
  const GAME_HEIGHT = 500
  const GAME_WIDTH = 800
  const DRONE_SIZE = 40
  const CLOUD_GAP = 180
  const CLOUD_WIDTH = 60

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true)
      setGameOver(false)
      setScore(0)
      droneRef.current = { y: 250, velocity: 0 }
      setClouds([])
    }
    droneRef.current.velocity = JUMP_FORCE
  }, [gameStarted])

  const checkCollision = useCallback((drone: GameObject, cloud: Cloud): boolean => {
    const droneRight = drone.x + drone.width
    const droneBottom = drone.y + drone.height
    const cloudRight = cloud.x + cloud.width

    // Check if drone overlaps with top or bottom cloud
    if (droneRight > cloud.x && drone.x < cloudRight) {
      // Top cloud collision
      if (drone.y < cloud.y + cloud.height) {
        return true
      }
      // Bottom cloud collision (gap is at cloud.y + cloud.height to cloud.y + cloud.height + CLOUD_GAP)
      if (droneBottom > cloud.y + cloud.height + CLOUD_GAP) {
        return true
      }
    }
    return false
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (!gameOver) jump()
      }
      if (e.code === 'Escape') {
        window.location.reload()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jump, gameOver])

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameLoop = () => {
      // Update drone physics
      droneRef.current.velocity += GRAVITY
      droneRef.current.y += droneRef.current.velocity

      // Clamp drone position
      if (droneRef.current.y < 0) {
        droneRef.current.y = 0
        droneRef.current.velocity = 0
      }
      if (droneRef.current.y > GAME_HEIGHT - DRONE_SIZE) {
        droneRef.current.y = GAME_HEIGHT - DRONE_SIZE
        setGameOver(true)
        if (score > highScore) {
          setHighScore(score)
          localStorage.setItem('droneGameHighScore', score.toString())
        }
        return
      }

      setDroneY(droneRef.current.y)

      // Update clouds
      setClouds((prev) => {
        let newClouds = prev.map((cloud) => ({
          ...cloud,
          x: cloud.x - cloud.speed,
        }))

        // Remove clouds that are off screen
        newClouds = newClouds.filter((cloud) => cloud.x > -CLOUD_WIDTH)

        // Add new clouds
        const lastCloud = newClouds[newClouds.length - 1]
        if (!lastCloud || lastCloud.x < GAME_WIDTH - 300) {
          const gapY = Math.random() * (GAME_HEIGHT - CLOUD_GAP - 100) + 50
          newClouds.push({
            x: GAME_WIDTH,
            y: gapY - 200, // Top cloud position
            width: CLOUD_WIDTH,
            height: 200,
            speed: 5,
          })
        }

        // Check collisions and update score
        const drone = {
          x: 100,
          y: droneRef.current.y,
          width: DRONE_SIZE,
          height: DRONE_SIZE,
        }

        for (const cloud of newClouds) {
          if (checkCollision(drone, cloud)) {
            setGameOver(true)
            if (score > highScore) {
              setHighScore(score)
              localStorage.setItem('droneGameHighScore', score.toString())
            }
            return prev
          }

          // Score when passing cloud
          if (cloud.x + cloud.width < drone.x && cloud.x + cloud.width > drone.x - 5) {
            setScore((s) => s + 1)
          }
        }

        return newClouds
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [gameStarted, gameOver, score, highScore, checkCollision])

  const restart = () => {
    setGameOver(false)
    setGameStarted(false)
    setScore(0)
    setDroneY(250)
    setClouds([])
    droneRef.current = { y: 250, velocity: 0 }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heading-display text-3xl text-gradient mb-4"
        >
          Flappy Drone
        </motion.h1>
        <p className="text-white/40 text-sm mb-4">You found the Easter egg!</p>

        <div
          className="relative bg-gradient-to-b from-sky-900 to-sky-700 rounded-xl overflow-hidden border border-dark-border cursor-pointer"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          onClick={() => !gameOver && jump()}
        >
          {/* Clouds (obstacles) */}
          {clouds.map((cloud, i) => (
            <div key={i}>
              {/* Top cloud */}
              <div
                className="absolute bg-white/80 rounded-lg"
                style={{
                  left: cloud.x,
                  top: 0,
                  width: cloud.width,
                  height: cloud.y + cloud.height,
                }}
              />
              {/* Bottom cloud */}
              <div
                className="absolute bg-white/80 rounded-lg"
                style={{
                  left: cloud.x,
                  top: cloud.y + cloud.height + CLOUD_GAP,
                  width: cloud.width,
                  height: GAME_HEIGHT - (cloud.y + cloud.height + CLOUD_GAP),
                }}
              />
            </div>
          ))}

          {/* Drone */}
          <motion.div
            className="absolute"
            style={{
              left: 100,
              top: droneY,
              width: DRONE_SIZE,
              height: DRONE_SIZE,
            }}
            animate={{
              rotate: Math.min(Math.max(droneRef.current.velocity * 3, -30), 30),
            }}
          >
            <svg viewBox="0 0 40 40" className="w-full h-full">
              {/* Body */}
              <rect x="12" y="16" width="16" height="8" rx="2" fill="#1a1a22" />
              {/* Arms & props */}
              <circle cx="8" cy="16" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              <circle cx="32" cy="16" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              <circle cx="8" cy="24" r="6" fill="none" stroke="#06b6d4" strokeWidth="2" />
              <circle cx="32" cy="24" r="6" fill="none" stroke="#06b6d4" strokeWidth="2" />
              {/* Camera */}
              <circle cx="20" cy="28" r="3" fill="#3b82f6" />
            </svg>
          </motion.div>

          {/* Score */}
          <div className="absolute top-4 left-4 text-white font-display text-2xl font-bold">
            {score}
          </div>

          {/* Start screen */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <p className="text-white text-xl mb-4">Click or press Space to fly!</p>
                <p className="text-white/60 text-sm">Press Escape to exit</p>
              </div>
            </div>
          )}

          {/* Game over screen */}
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-center">
                <h2 className="text-white text-3xl font-display font-bold mb-2">Game Over!</h2>
                <p className="text-white text-xl mb-1">Score: {score}</p>
                <p className="text-white/60 mb-4">High Score: {highScore}</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={restart}>Play Again</Button>
                  <Button variant="secondary" onClick={() => window.location.reload()}>
                    Exit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-white/30 text-xs mt-4">
          Press Escape at any time to return to the website
        </p>
      </div>
    </div>
  )
}
