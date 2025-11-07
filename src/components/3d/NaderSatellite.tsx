'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import * as THREE from 'three'

interface NaderSatelliteProps {
  onClick?: () => void
  showLabel?: boolean
}

export default function NaderSatellite({ onClick, showLabel = false }: NaderSatelliteProps) {
  const satelliteRef = useRef<THREE.Group>(null)
  const shellRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Group>(null)

  // Orbit around Earth at different altitude than space station - positioned between Earth and Moon
  useFrame((state) => {
    if (satelliteRef.current) {
      const time = state.clock.elapsedTime * 0.15 // Slightly slower orbit
      const radius = 4.0 // Between Space Station (2.5) and Moon (6)
      satelliteRef.current.position.x = Math.cos(time + Math.PI) * radius // Offset phase
      satelliteRef.current.position.z = Math.sin(time + Math.PI) * radius
      satelliteRef.current.position.y = 1 // Higher altitude

      // Face direction of travel
      satelliteRef.current.rotation.y = time + Math.PI / 2
    }

    // Slow rotation of lattice shell
    if (shellRef.current) {
      shellRef.current.rotation.y += 0.005
    }

    // Pulsing glow effect on rings
    if (ringRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5
      ringRef.current.scale.setScalar(1 + pulse * 0.05)
    }
  })

  return (
    <group ref={satelliteRef}>
      {/* Main cylindrical body */}
      <mesh rotation={[0, 0, Math.PI / 2]} raycast={() => null}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial
          color="#C0C0C0"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Lattice shell (wireframe) */}
      <mesh ref={shellRef} rotation={[0, 0, Math.PI / 2]} raycast={() => null}>
        <cylinderGeometry args={[0.25, 0.25, 0.9, 12]} />
        <meshBasicMaterial
          color="#00CED1"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Glowing rings with text */}
      <group ref={ringRef}>
        {/* Ring 1 - THE NADER INSTITUTE */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.3, 0, 0]} raycast={() => null}>
          <torusGeometry args={[0.3, 0.02, 8, 24]} />
          <meshStandardMaterial
            color="#00CED1"
            emissive="#00CED1"
            emissiveIntensity={1}
          />
        </mesh>

        {/* Ring 2 - HOUSE OF PROOF */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.3, 0, 0]} raycast={() => null}>
          <torusGeometry args={[0.3, 0.02, 8, 24]} />
          <meshStandardMaterial
            color="#4A90E2"
            emissive="#4A90E2"
            emissiveIntensity={1}
          />
        </mesh>
      </group>

      {/* Solar panels */}
      <mesh position={[0, 0, 0.5]} raycast={() => null}>
        <boxGeometry args={[0.8, 0.02, 0.4]} />
        <meshStandardMaterial
          color="#1E3A8A"
          metalness={0.7}
          emissive="#3B82F6"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 0, -0.5]} raycast={() => null}>
        <boxGeometry args={[0.8, 0.02, 0.4]} />
        <meshStandardMaterial
          color="#1E3A8A"
          metalness={0.7}
          emissive="#3B82F6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Antenna */}
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} raycast={() => null}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial color="#00CED1" emissive="#00CED1" emissiveIntensity={0.5} />
      </mesh>

      {/* Glow aura */}
      <mesh raycast={() => null}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color="#00CED1"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Point light for illumination */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00CED1" distance={2} />

      {/* Interactive hitbox */}
      <mesh onClick={onClick} visible={false}>
        <sphereGeometry args={[0.7, 8, 8]} />
      </mesh>

      {/* Floating text labels */}
      {showLabel && (
        <>
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.1}
            color="#00CED1"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
            raycast={() => null}
          >
            PROOF STATION ONE
          </Text>
          <Text
            position={[0, 0.65, 0]}
            fontSize={0.06}
            color="#4A90E2"
            anchorX="center"
            anchorY="middle"
            raycast={() => null}
          >
            The Nader Institute
          </Text>
        </>
      )}

      {/* HTML Label (fallback) */}
      {showLabel && (
        <Html
          position={[0, 0.9, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap backdrop-blur-sm border border-cyan-500/50 shadow-lg shadow-cyan-500/20">
            <div className="font-bold text-cyan-400">🛰️ Proof Station One</div>
            <div className="text-[10px] text-gray-400">The Nader Institute</div>
          </div>
        </Html>
      )}
    </group>
  )
}
