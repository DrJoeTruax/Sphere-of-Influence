'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Proof } from '@/lib/api/proof-station'

interface ProofPillarProps {
  proof: Proof
  position: [number, number, number]
  onClick: (proof: Proof) => void
  isSelected: boolean
}

export default function ProofPillar({ proof, position, onClick, isSelected }: ProofPillarProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1

      // Rotation for selected/hovered
      if (isSelected || isHovered) {
        meshRef.current.rotation.y += 0.01
      }
    }
  })

  const color = proof.field_color || '#3B82F6'

  return (
    <group position={position}>
      {/* Glass pillar */}
      <RoundedBox
        ref={meshRef}
        args={[0.5, 3, 0.5]}
        radius={0.05}
        onClick={() => onClick(proof)}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.8 : isHovered ? 0.6 : 0.4}
          metalness={0.9}
          roughness={0.1}
          transmission={0.5}
          thickness={0.5}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : 0.1}
        />
      </RoundedBox>

      {/* Light beam from pillar */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.6 : isHovered ? 0.4 : 0.2}
        />
      </mesh>

      {/* Floating text label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {proof.name}
      </Text>

      {/* Field name label */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.1}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
      >
        {proof.field_name || 'Unknown Field'}
      </Text>

      {/* Impact score indicator */}
      {proof.impact_score > 0 && (
        <Text
          position={[0, -2.3, 0]}
          fontSize={0.08}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          ⭐ {proof.impact_score} Impact
        </Text>
      )}
    </group>
  )
}
