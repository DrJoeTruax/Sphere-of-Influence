'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface GravitationalTextProps {
  children: string
  position?: [number, number, number]
  fontSize?: number
  color?: string
  blackHolePosition?: [number, number, number]
  blackHoleMass?: number
}

export default function GravitationalText({
  children,
  position = [0, 0, 0],
  fontSize = 1,
  color = '#ffffff',
  blackHolePosition = [0, 0, -20],
  blackHoleMass = 100
}: GravitationalTextProps) {
  const textRef = useRef<any>(null)
  const originalPositions = useRef<Float32Array | null>(null)

  useFrame(() => {
    if (!textRef.current || !textRef.current.geometry) return

    const geometry = textRef.current.geometry
    const positionAttribute = geometry.attributes.position

    // Store original positions on first frame
    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(positionAttribute.array)
    }

    // Apply gravitational warping to each vertex
    for (let i = 0; i < positionAttribute.count; i++) {
      const i3 = i * 3

      // Get original position
      const x = originalPositions.current[i3]
      const y = originalPositions.current[i3 + 1]
      const z = originalPositions.current[i3 + 2]

      // Calculate distance to black hole
      const worldPos = new THREE.Vector3(
        x + position[0],
        y + position[1],
        z + position[2]
      )

      const blackHole = new THREE.Vector3(...blackHolePosition)
      const distance = worldPos.distanceTo(blackHole)

      // Calculate gravitational effect (inverse square law)
      const gravitationalForce = blackHoleMass / (distance * distance + 1)

      // Direction toward black hole
      const direction = new THREE.Vector3()
        .subVectors(blackHole, worldPos)
        .normalize()

      // Apply warping effect
      const warpFactor = Math.min(gravitationalForce * 0.1, 2)

      positionAttribute.array[i3] = x + direction.x * warpFactor
      positionAttribute.array[i3 + 1] = y + direction.y * warpFactor
      positionAttribute.array[i3 + 2] = z + direction.z * warpFactor
    }

    positionAttribute.needsUpdate = true
  })

  return (
    <group position={position}>
      <Text
        ref={textRef}
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {children}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Text>

      {/* Glow layer */}
      <Text
        position={[0, 0, -0.2]}
        fontSize={fontSize * 1.05}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {children}
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Text>
    </group>
  )
}
