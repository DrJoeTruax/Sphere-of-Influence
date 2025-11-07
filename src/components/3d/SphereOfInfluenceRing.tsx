'use client'

import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import * as THREE from 'three'

export default function SphereOfInfluenceRing() {
  const groupRef = useRef<THREE.Group>(null)
  const text = "SPHERE OF INFLUENCE "
  const repeat = 4
  const fullText = Array(repeat).fill(text).join("")
  const chars = fullText.split("")
  const radius = 220
  const tilt = 0.1

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005
    }
  })

  return (
    <Suspense fallback={null}>
      <group ref={groupRef}>
        <group rotation={[tilt, 0, 0]}>
          {chars.map((ch, i) => {
            const a = (i / chars.length) * Math.PI * 2
            const x = Math.cos(a) * radius
            const z = Math.sin(a) * radius

            return (
              <Text3D
                key={i}
                font="/fonts/helvetiker_regular.typeface.json"
                size={6}
                height={1}
                position={[x, 0, z]}
                rotation={[0, -a - Math.PI / 2, 0]}
                bevelEnabled
                bevelThickness={0.4}
                bevelSize={0.2}
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
      </group>
    </Suspense>
  )
}
