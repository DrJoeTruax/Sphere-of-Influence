'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface UniverseBackgroundProps {
  count?: number
  nebulaEnabled?: boolean
}

export default function UniverseBackground({
  count = 3000,
  nebulaEnabled = true
}: UniverseBackgroundProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const nebulaGroupRef = useRef<THREE.Group>(null)

  // Create star particles
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute stars in a large sphere
      const radius = 500 + Math.random() * 1500
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Varied star colors (white, blue-white, yellow-white)
      const colorVariation = Math.random()
      if (colorVariation > 0.7) {
        // Blue-white stars
        colors[i * 3] = 0.7 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 2] = 1.0
      } else if (colorVariation > 0.3) {
        // White stars
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 1.0
        colors[i * 3 + 2] = 1.0
      } else {
        // Yellow-white stars
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.2
      }

      // Varied sizes
      sizes[i] = 1 + Math.random() * 3
    }

    return { positions, colors, sizes }
  }, [count])

  // Create nebula clouds
  const nebulaClouds = useMemo(() => {
    if (!nebulaEnabled) return []

    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 1000,
      z: -500 - Math.random() * 1500,
      scale: 200 + Math.random() * 300,
      color: [
        new THREE.Color(0.2, 0.1, 0.5), // Purple
        new THREE.Color(0.1, 0.3, 0.6), // Blue
        new THREE.Color(0.6, 0.2, 0.4), // Pink
        new THREE.Color(0.1, 0.2, 0.4), // Dark blue
        new THREE.Color(0.3, 0.1, 0.3), // Dark purple
      ][i],
      rotation: Math.random() * Math.PI * 2
    }))
  }, [nebulaEnabled])

  // Animate stars (slow twinkle)
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime
      pointsRef.current.rotation.y = time * 0.005
    }

    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y = state.clock.elapsedTime * 0.002
    }
  })

  return (
    <>
      {/* Stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Nebula Clouds */}
      {nebulaEnabled && (
        <group ref={nebulaGroupRef}>
          {nebulaClouds.map((cloud) => (
            <mesh
              key={cloud.id}
              position={[cloud.x, cloud.y, cloud.z]}
              scale={cloud.scale}
              rotation={[0, 0, cloud.rotation]}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                color={cloud.color}
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  )
}
