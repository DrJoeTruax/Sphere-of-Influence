'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useJourney } from '@/contexts/JourneyContext'
import * as THREE from 'three'

export default function ContinuousCamera() {
  const { camera } = useThree()
  const { state, setState, progress, setProgress } = useJourney()
  const targetPosition = useRef(new THREE.Vector3(0, 0, 30))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const enterStartTime = useRef(0)
  const traversalStartTime = useRef(0)

  useEffect(() => {
    if (state === 'ENTERING') {
      enterStartTime.current = Date.now()
    } else if (state === 'TRAVERSING') {
      traversalStartTime.current = Date.now()
    }
  }, [state])

  useFrame(() => {
    const now = Date.now()

    switch (state) {
      case 'LANDING':
        // Idle at starting position
        targetPosition.current.set(0, 0, 30)
        targetLookAt.current.set(0, 0, 0)
        break

      case 'ENTERING': {
        // Duration: 3 seconds
        const elapsed = (now - enterStartTime.current) / 1000
        const duration = 3
        const t = Math.min(elapsed / duration, 1)

        // Smooth easing
        const eased = 1 - Math.pow(1 - t, 3) // Cubic ease-out

        // Move camera toward neural sphere center
        targetPosition.current.set(0, 0, 30 - eased * 25) // Move from z=30 to z=5
        targetLookAt.current.set(0, 0, -20) // Look at sphere center

        if (t >= 1) {
          setState('TRAVERSING')
        }
        break
      }

      case 'TRAVERSING': {
        // Duration: 8 seconds (matching wormhole traversal)
        const elapsed = (now - traversalStartTime.current) / 1000
        const duration = 8
        const t = Math.min(elapsed / duration, 1)

        setProgress(t * 100)

        // Camera path through wormhole
        // Start at z=5, move through to z=-500
        const z = 5 - t * 505

        // Add subtle side-to-side motion for immersion
        const x = Math.sin(t * Math.PI * 4) * 2
        const y = Math.cos(t * Math.PI * 3) * 1.5

        targetPosition.current.set(x, y, z)
        targetLookAt.current.set(x, y, z - 10)

        if (t >= 1) {
          setState('ARRIVED')
        }
        break
      }

      case 'ARRIVED': {
        // Orbit around Earth
        const t = (now / 1000) * 0.1 // Slow orbit
        const radius = 15
        const x = Math.sin(t) * radius
        const z = Math.cos(t) * radius

        targetPosition.current.set(x, 5, z)
        targetLookAt.current.set(0, 0, 0) // Look at Earth center
        break
      }
    }

    // Smoothly interpolate camera position and rotation
    camera.position.lerp(targetPosition.current, 0.05)

    const lookAtPoint = new THREE.Vector3()
    lookAtPoint.lerp(targetLookAt.current, 0.05)
    camera.lookAt(lookAtPoint)
  })

  return null
}
