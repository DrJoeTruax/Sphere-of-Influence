'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface SpaceStationProps {
  onClick?: () => void
  showLabel?: boolean
}

export default function SpaceStation({ onClick, showLabel = false }: SpaceStationProps) {
  const stationRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  // Orbit around Earth - positioned between Earth and Moon
  useFrame((state) => {
    if (stationRef.current) {
      const time = state.clock.elapsedTime * 0.2
      const radius = 2.5 // Between Earth (0) and Moon (6)
      stationRef.current.position.x = Math.cos(time) * radius
      stationRef.current.position.z = Math.sin(time) * radius
      stationRef.current.position.y = 0.5

      // Face direction of travel
      stationRef.current.rotation.y = time + Math.PI / 2
    }

    // Rotate ring
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01
    }
  })

  return (
    <group ref={stationRef}>
      {/* Central hub */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#8B5CF6" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rotating ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.05, 16, 32]} />
        <meshStandardMaterial color="#A78BFA" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Solar panels */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[0.6, 0.02, 0.3]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[0.6, 0.02, 0.3]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.5} />
      </mesh>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Interactive hitbox */}
      <mesh onClick={onClick} visible={false}>
        <sphereGeometry args={[0.5, 8, 8]} />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Html
          position={[0, 0.6, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-purple-500/50">
            <div className="font-bold">Space Station</div>
            <div className="text-xs text-gray-400">Global Hub</div>
          </div>
        </Html>
      )}
    </group>
  )
}
