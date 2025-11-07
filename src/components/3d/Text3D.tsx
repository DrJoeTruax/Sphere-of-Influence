'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface Text3DProps {
  children: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  fontSize?: number
  color?: string
  glowColor?: string
  maxWidth?: number
  anchorX?: 'left' | 'center' | 'right'
  anchorY?: 'top' | 'middle' | 'bottom'
  depth?: number
  animate?: boolean
}

export default function Text3D({
  children,
  position = [0, 0, 0],
  rotation = [-0.3, 0, 0], // Default angle into background
  fontSize = 1,
  color = '#ffffff',
  glowColor = '#3B82F6',
  maxWidth = 10,
  anchorX = 'center',
  anchorY = 'middle',
  depth = 0.2,
  animate = false
}: Text3DProps) {
  const textRef = useRef<any>(null)
  const glowRef = useRef<any>(null)

  // Gentle animation
  useFrame(({ clock }) => {
    if (animate && textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.1
    }

    // Pulse the glow
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2) * 0.05)
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Main text with depth */}
      <Text
        ref={textRef}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {children}
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Text>

      {/* Glow layer behind text */}
      <Text
        ref={glowRef}
        position={[0, 0, -0.1]}
        fontSize={fontSize * 1.02}
        color={glowColor}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
      >
        {children}
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Text>

      {/* Depth extrusion effect */}
      {depth > 0 && (
        <Text
          position={[0, 0, -depth]}
          fontSize={fontSize}
          color={new THREE.Color(color).multiplyScalar(0.3)}
          anchorX={anchorX}
          anchorY={anchorY}
          maxWidth={maxWidth}
        >
          {children}
          <meshBasicMaterial color={new THREE.Color(color).multiplyScalar(0.3)} />
        </Text>
      )}
    </group>
  )
}
