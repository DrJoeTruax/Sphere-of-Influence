'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface AmbientParticlesProps {
  count?: number
  mouseInfluence?: number
}

export default function AmbientParticles({
  count = 150,
  mouseInfluence = 2
}: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // Create particle data
  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Random positions in viewport
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20

      // Random initial velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01

      // Gradient colors (blue to purple)
      const colorMix = Math.random()
      colors[i * 3] = 0.3 + colorMix * 0.5 // R
      colors[i * 3 + 1] = 0.5 + colorMix * 0.3 // G
      colors[i * 3 + 2] = 0.9 // B
    }

    return { positions, velocities, colors }
  }, [count])

  // Track mouse position
  useFrame((state) => {
    mousePos.current.x = (state.mouse.x * viewport.width) / 2
    mousePos.current.y = (state.mouse.y * viewport.height) / 2

    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position

      for (let i = 0; i < count; i++) {
        const idx = i * 3

        // Get current position
        let x = posAttr.getX(i)
        let y = posAttr.getY(i)
        let z = posAttr.getZ(i)

        // Apply velocity
        x += velocities[idx]
        y += velocities[idx + 1]
        z += velocities[idx + 2]

        // Mouse influence - attract/repel particles
        const dx = mousePos.current.x - x
        const dy = mousePos.current.y - y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 5 && dist > 0.1) {
          const force = (mouseInfluence / dist) * 0.01
          x += dx * force
          y += dy * force
        }

        // Boundary wrapping
        if (x > 25) x = -25
        if (x < -25) x = 25
        if (y > 25) y = -25
        if (y < -25) y = 25
        if (z > 10) z = -10
        if (z < -10) z = 10

        // Update position
        posAttr.setXYZ(i, x, y, z)
      }

      posAttr.needsUpdate = true
    }
  })

  return (
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
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
