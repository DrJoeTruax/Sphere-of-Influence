'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface EnhancedStarfieldProps {
  count?: number
  minRadius?: number
  maxRadius?: number
}

export default function EnhancedStarfield({
  count = 9000,
  minRadius = 2000,
  maxRadius = 4000
}: EnhancedStarfieldProps) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      // Distribute stars in a shell between minRadius and maxRadius
      const range = maxRadius - minRadius
      const r = minRadius + range * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i] = r * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = r * Math.cos(phi)
    }
    return positions
  }, [count, minRadius, maxRadius])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(points, 3))
    return geom
  }, [points])

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={2}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  )
}
