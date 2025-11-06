'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StarfieldProps {
  count?: number
  onLoadComplete?: () => void
}

function Stars({ count = 5000, onLoadComplete }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const progressRef = useRef(0)

  // Generate random star positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return pos
  }, [count])

  // Animate stars fading in and rotating
  useFrame((state, delta) => {
    if (!pointsRef.current) return

    // Fade in effect
    if (progressRef.current < 1) {
      progressRef.current += delta * 0.5
      if (progressRef.current >= 1) {
        progressRef.current = 1
        if (onLoadComplete) {
          onLoadComplete()
        }
      }
    }

    // Gentle rotation
    pointsRef.current.rotation.x += delta * 0.02
    pointsRef.current.rotation.y += delta * 0.03

    // Pulse opacity
    const material = pointsRef.current.material as THREE.PointsMaterial
    material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0.8}
        color="#ffffff"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default function Starfield({ count, onLoadComplete }: StarfieldProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.1} />
        <Stars count={count} onLoadComplete={onLoadComplete} />
      </Canvas>
    </div>
  )
}
