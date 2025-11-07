'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Earth from './Earth'
import SpaceStation from './SpaceStation'
import NaderSatellite from './NaderSatellite'

interface SolarSystemProps {
  onCameraAnimationComplete?: () => void
  showEarthDetails?: boolean
  onHubSelect?: (hubId: string) => void
  autoZoom?: boolean
}

export default function SolarSystem({
  onCameraAnimationComplete,
  showEarthDetails = false,
  onHubSelect,
  autoZoom = true
}: SolarSystemProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const sunRef = useRef<THREE.Mesh>(null)
  const animationProgress = useRef(0)
  const { camera } = useThree()

  // Animate camera from outer space to Earth
  useEffect(() => {
    if (autoZoom && cameraRef.current) {
      animationProgress.current = 0
    }
  }, [autoZoom])

  useFrame((state, delta) => {
    // Rotate sun
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1
    }

    // Camera zoom animation
    if (autoZoom && animationProgress.current < 1) {
      animationProgress.current += delta * 0.15 // Slower zoom for cinematic effect

      if (animationProgress.current >= 1) {
        animationProgress.current = 1
        if (onCameraAnimationComplete) {
          onCameraAnimationComplete()
        }
      }

      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - animationProgress.current, 3)

      // Camera path: start far away, zoom to Earth
      const startPos = new THREE.Vector3(50, 30, 50)
      const endPos = new THREE.Vector3(0, 0, 6)

      camera.position.lerpVectors(startPos, endPos, easeProgress)
      camera.lookAt(0, 0, 0)
    }
  })

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[50, 30, 50]}
        fov={60}
      />

      {/* Orbit controls (disabled during animation) */}
      <OrbitControls
        enabled={!autoZoom || animationProgress.current >= 1}
        enableDamping
        dampingFactor={0.05}
        minDistance={4}
        maxDistance={100}
        target={[0, 0, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
      <directionalLight position={[-10, 5, 5]} intensity={0.5} />

      {/* Sun */}
      <mesh ref={sunRef} position={[0, 0, -50]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>

      {/* Sun glow */}
      <mesh position={[0, 0, -50]}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial
          color="#FDB813"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Earth at center */}
      <Earth
        onHubSelect={onHubSelect}
        showLabels={showEarthDetails}
      />

      {/* Space Station orbiting Earth */}
      <SpaceStation
        onClick={() => onHubSelect?.('space-station')}
        showLabel={showEarthDetails}
      />

      {/* Proof Station One (Nader Satellite) orbiting Earth */}
      <NaderSatellite
        onClick={() => onHubSelect?.('nader-station')}
        showLabel={showEarthDetails}
      />

      {/* Stars background */}
      <Stars />
    </>
  )
}

// Background stars for depth
function Stars() {
  const starsRef = useRef<THREE.Points>(null)

  const positions = new Float32Array(
    Array.from({ length: 2000 }, () => [
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
    ]).flat()
  )

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={starsRef}>
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
        size={0.5}
        sizeAttenuation
        transparent
        opacity={0.6}
        color="#ffffff"
      />
    </points>
  )
}
