import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Environment } from '@react-three/drei'
import * as THREE from 'three'

function Drone({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null)
  const propellerRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    if (!groupRef.current) return

    // Smooth follow mouse
    const targetX = mousePosition.x * 0.5
    const targetY = mousePosition.y * 0.3
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY * 0.2, 0.05)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetX * 0.1, 0.05)

    // Hover animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1

    // Spin propellers
    propellerRefs.current.forEach((propeller) => {
      if (propeller) {
        propeller.rotation.y += 0.5
      }
    })
  })

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1a22',
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  )

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3b82f6',
        metalness: 0.6,
        roughness: 0.3,
        emissive: '#3b82f6',
        emissiveIntensity: 0.3,
      }),
    []
  )

  const propellerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8b5cf6',
        metalness: 0.7,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8,
      }),
    []
  )

  const armPositions: [number, number, number][] = [
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
  ]

  return (
    <group ref={groupRef} scale={0.6}>
      {/* Main body */}
      <mesh material={bodyMaterial}>
        <boxGeometry args={[1.2, 0.3, 0.8]} />
      </mesh>

      {/* Camera housing */}
      <mesh position={[0, -0.25, 0.2]} material={accentMaterial}>
        <sphereGeometry args={[0.15, 16, 16]} />
      </mesh>

      {/* Camera lens */}
      <mesh position={[0, -0.25, 0.35]}>
        <cylinderGeometry args={[0.08, 0.06, 0.1, 16]} />
        <meshStandardMaterial color="#000" metalness={1} roughness={0} />
      </mesh>

      {/* Arms and propellers */}
      {armPositions.map((pos, i) => (
        <group key={i}>
          {/* Arm */}
          <mesh position={[pos[0] * 0.5, 0, pos[2] * 0.3]} material={bodyMaterial}>
            <boxGeometry args={[Math.abs(pos[0]) * 0.8, 0.08, 0.08]} />
          </mesh>

          {/* Motor housing */}
          <mesh position={[pos[0] * 0.9, 0.1, pos[2] * 0.9]} material={accentMaterial}>
            <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
          </mesh>

          {/* Propeller */}
          <mesh
            ref={(el) => {
              if (el) propellerRefs.current[i] = el
            }}
            position={[pos[0] * 0.9, 0.2, pos[2] * 0.9]}
            material={propellerMaterial}
          >
            <torusGeometry args={[0.35, 0.02, 8, 32]} />
          </mesh>

          {/* LED light */}
          <mesh position={[pos[0] * 0.9, 0.05, pos[2] * 0.9]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color={i < 2 ? '#22c55e' : '#ef4444'}
              emissive={i < 2 ? '#22c55e' : '#ef4444'}
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}

      {/* Landing gear */}
      {[[-0.4, -0.2, 0], [0.4, -0.2, 0]].map((pos, i) => (
        <mesh key={`gear-${i}`} position={pos as [number, number, number]} material={bodyMaterial}>
          <boxGeometry args={[0.05, 0.3, 0.6]} />
        </mesh>
      ))}
    </group>
  )
}

function BackgroundSpheres() {
  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1, 32, 32]} position={[3, 1, -3]}>
          <MeshDistortMaterial
            color="#3b82f6"
            distort={0.4}
            speed={2}
            roughness={0.5}
            metalness={0.8}
            opacity={0.3}
            transparent
          />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Sphere args={[0.6, 32, 32]} position={[-3, -1, -2]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            distort={0.3}
            speed={1.5}
            roughness={0.5}
            metalness={0.8}
            opacity={0.3}
            transparent
          />
        </Sphere>
      </Float>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <Sphere args={[0.4, 32, 32]} position={[2, -2, -1]}>
          <MeshDistortMaterial
            color="#06b6d4"
            distort={0.5}
            speed={2}
            roughness={0.5}
            metalness={0.8}
            opacity={0.2}
            transparent
          />
        </Sphere>
      </Float>
    </>
  )
}

interface DroneSceneProps {
  className?: string
}

export function DroneScene({ className = '' }: DroneSceneProps) {
  const mousePosition = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mousePosition.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    }
  }

  return (
    <div className={`${className} cursor-crosshair`} onMouseMove={handleMouseMove}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[0, -2, 2]} intensity={0.5} color="#3b82f6" />

        <Drone mousePosition={mousePosition.current} />
        <BackgroundSpheres />

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
