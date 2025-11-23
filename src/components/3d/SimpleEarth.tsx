'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useJourney } from '@/contexts/JourneyContext'
import * as THREE from 'three'

export default function SimpleEarth() {
  const { state } = useJourney()
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001
    }
  })

  // Only visible when arrived
  const visible = state === 'ARRIVED'

  return (
    <group visible={visible}>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial
          color="#1e88e5"
          emissive="#0d47a1"
          emissiveIntensity={0.2}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={1.1}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color="#64b5f6"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Clouds layer */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <sphereGeometry args={[5.05, 48, 48]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={1}
        />
      </mesh>

      {/* Point light to illuminate Earth */}
      <pointLight position={[20, 10, 20]} intensity={2} color="#ffffff" />
      <pointLight position={[-20, -10, -20]} intensity={0.5} color="#1e88e5" />
    </group>
  )
}
