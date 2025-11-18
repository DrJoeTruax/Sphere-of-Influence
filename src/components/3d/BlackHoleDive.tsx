'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import gsap from 'gsap'

interface BlackHoleDiveProps {
  blackHolePosition: [number, number, number]
  onComplete?: () => void
}

export default function BlackHoleDive({ blackHolePosition, onComplete }: BlackHoleDiveProps) {
  const { camera } = useThree()
  const hasStarted = useRef(false)
  const progressRef = useRef(0)
  const router = useRouter()

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true

      // Start camera far from black hole
      camera.position.set(0, 0, 30)
      camera.lookAt(new THREE.Vector3(...blackHolePosition))

      // Widen FOV for dramatic effect
      gsap.to(camera, {
        fov: 120,
        duration: 3,
        ease: "power2.in",
        onUpdate: () => {
          camera.updateProjectionMatrix()
        }
      })

      // Animate camera diving INTO the black hole
      gsap.to(camera.position, {
        x: blackHolePosition[0],
        y: blackHolePosition[1],
        z: blackHolePosition[2] + 1, // Stop just before event horizon
        duration: 4,
        ease: "power2.in",
        onUpdate: () => {
          // Always look at black hole center
          camera.lookAt(new THREE.Vector3(...blackHolePosition))
        },
        onComplete: () => {
          // Transition to wormhole
          if (onComplete) {
            onComplete()
          } else {
            router.push('/wormhole')
          }
        }
      })

      // Update progress for effects
      gsap.to(progressRef, {
        current: 1,
        duration: 4,
        ease: "power2.in"
      })
    }
  }, [camera, blackHolePosition, onComplete, router])

  useFrame(() => {
    // Add camera shake effect as we get closer
    if (progressRef.current > 0.5) {
      const intensity = (progressRef.current - 0.5) * 2 // 0 to 1
      const shake = (Math.random() - 0.5) * intensity * 0.5
      camera.position.x += shake
      camera.position.y += shake
    }

    // Add barrel roll effect
    if (progressRef.current > 0.3) {
      camera.rotation.z = Math.sin(progressRef.current * Math.PI * 6) * 0.5
    }
  })

  return null
}
