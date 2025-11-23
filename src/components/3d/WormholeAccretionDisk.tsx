'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useJourney } from '@/contexts/JourneyContext'
import * as THREE from 'three'

export default function WormholeAccretionDisk() {
  const { state } = useJourney()
  const particlesRef = useRef<THREE.Points>(null)
  const centerGlowRef = useRef<THREE.Mesh>(null)

  const PARTICLE_COUNT = 8000

  // Generate particle positions in accretion disk pattern
  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spiral pattern around center
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.pow(Math.random(), 0.5) * 15 // Concentr ated near center
      const height = (Math.random() - 0.5) * 2 * Math.pow(1 - radius / 17, 2) // Thinner disk at edges

      // Position in disk
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius - 20

      // Orbital velocity (Keplerian motion - faster closer to center)
      const orbitalSpeed = 0.5 / Math.sqrt(radius + 0.1)
      velocities[i * 3] = -Math.sin(angle) * orbitalSpeed
      velocities[i * 3 + 1] = 0
      velocities[i * 3 + 2] = Math.cos(angle) * orbitalSpeed

      // Temperature-based coloring (hotter near center)
      const temp = 1 - radius / 17
      if (temp > 0.7) {
        // Blue-white (hottest)
        colors[i * 3] = 0.7
        colors[i * 3 + 1] = 0.8
        colors[i * 3 + 2] = 1.0
      } else if (temp > 0.4) {
        // White-yellow
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.9
        colors[i * 3 + 2] = 0.7
      } else {
        // Orange-red (cooler edges)
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.5
        colors[i * 3 + 2] = 0.3
      }

      // Particle size
      sizes[i] = 1 + Math.random() * 2
    }

    return { positions, velocities, colors, sizes }
  }, [])

  useFrame((_, delta) => {
    if (!particlesRef.current) return

    const positionAttr = particlesRef.current.geometry.attributes.position
    const positions = positionAttr.array as Float32Array

    // Animate particles in orbital motion
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = positions[i * 3]
      const z = positions[i * 3 + 2] + 20 // Offset for center

      const radius = Math.sqrt(x * x + z * z)
      const angle = Math.atan2(z, x)

      // Keplerian orbital motion
      const orbitalSpeed = 0.5 / Math.sqrt(radius + 0.1)
      const newAngle = angle + orbitalSpeed * delta

      positions[i * 3] = Math.cos(newAngle) * radius
      positions[i * 3 + 2] = Math.sin(newAngle) * radius - 20
    }

    positionAttr.needsUpdate = true

    // Pulse the center glow
    if (centerGlowRef.current) {
      const pulse = Math.sin(Date.now() / 500) * 0.3 + 1
      centerGlowRef.current.scale.setScalar(pulse)
    }
  })

  // Only visible during ENTERING, TRAVERSING, and ARRIVED states
  const visible = state !== 'LANDING'

  return (
    <group visible={visible}>
      {/* Event horizon - pure black center */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Center glow */}
      <mesh ref={centerGlowRef} position={[0, 0, -20]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Accretion disk particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={PARTICLE_COUNT}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={PARTICLE_COUNT}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Glowing ring at photon sphere */}
      <mesh position={[0, 0, -20]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.5, 64]} />
        <meshBasicMaterial
          color="#ff00ff"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
