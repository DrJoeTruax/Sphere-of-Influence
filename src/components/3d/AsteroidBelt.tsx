'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AsteroidBelt() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, velocities } = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)

    const innerRadius = 110
    const outerRadius = 130

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
      const yVariation = (Math.random() - 0.5) * 2.5 // Half the vertical spread

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = yVariation
      positions[i * 3 + 2] = Math.sin(angle) * radius

      // Random orbital velocities
      velocities[i] = 0.00005 + Math.random() * 0.00005
    }

    return { positions, velocities }
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame(() => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i)
        const z = posAttr.getZ(i)
        const y = posAttr.getY(i)

        const radius = Math.sqrt(x * x + z * z)
        let angle = Math.atan2(z, x)
        angle += velocities[i]

        posAttr.setXYZ(i, Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      }

      posAttr.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.3}
        color="#8b7355"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  )
}
