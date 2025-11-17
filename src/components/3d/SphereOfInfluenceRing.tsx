'use client'

import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import * as THREE from 'three'

// Single ring component that rotates on a specific axis
function SingleRing({ axis }: { axis: 'x' | 'y' | 'z' }) {
  const groupRef = useRef<THREE.Group>(null)
  const text = "SPHERE OF INFLUENCE "
  const repeat = 4
  const fullText = Array(repeat).fill(text).join("")
  const chars = fullText.split("")
  const radius = 880

  useFrame(() => {
    if (groupRef.current) {
      // Each ring rotates continuously on its designated axis
      if (axis === 'x') {
        groupRef.current.rotation.x += 0.001
      } else if (axis === 'y') {
        groupRef.current.rotation.y += 0.001
      } else if (axis === 'z') {
        groupRef.current.rotation.z += 0.001
      }
    }
  })

  // Position characters in a circle based on the rotation axis
  const getCharacterPosition = (angle: number) => {
    if (axis === 'x') {
      // Ring perpendicular to X axis (circle in YZ plane)
      return {
        position: [0, Math.cos(angle) * radius, Math.sin(angle) * radius] as [number, number, number],
        rotation: [Math.PI / 2, 0, -angle] as [number, number, number]
      }
    } else if (axis === 'y') {
      // Ring perpendicular to Y axis (circle in XZ plane)
      return {
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number],
        rotation: [0, -angle - Math.PI / 2, 0] as [number, number, number]
      }
    } else {
      // Ring perpendicular to Z axis (circle in XY plane)
      return {
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0] as [number, number, number],
        rotation: [0, 0, -angle - Math.PI / 2] as [number, number, number]
      }
    }
  }

  return (
    <group ref={groupRef}>
      {chars.map((ch, i) => {
        const angle = (i / chars.length) * Math.PI * 2
        const { position, rotation } = getCharacterPosition(angle)

        return (
          <Text3D
            key={`${axis}-${i}`}
            font="/fonts/helvetiker_regular.typeface.json"
            size={12}
            height={2}
            position={position}
            rotation={rotation}
            bevelEnabled
            bevelThickness={0.8}
            bevelSize={0.4}
            bevelSegments={3}
          >
            {ch}
            <meshStandardMaterial
              color="#b0c6ff"
              metalness={1}
              roughness={0.25}
              emissive="#b0c6ff"
              emissiveIntensity={0.5}
            />
          </Text3D>
        )
      })}
    </group>
  )
}

export default function SphereOfInfluenceRing() {
  return (
    <Suspense fallback={null}>
      <group>
        {/* Three rings, each rotating on a different axis */}
        <SingleRing axis="x" />
        <SingleRing axis="y" />
        <SingleRing axis="z" />
      </group>
    </Suspense>
  )
}
