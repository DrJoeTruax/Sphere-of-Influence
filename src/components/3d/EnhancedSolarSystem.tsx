'use client'

import { useRef, useEffect, useState, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
import OrbitingEarthSystem from './OrbitingEarthSystem'
import Planet from './Planet'
import SphereOfInfluenceRing from './SphereOfInfluenceRing'
import EnhancedStarfield from './EnhancedStarfield'

interface EnhancedSolarSystemProps {
  onCameraAnimationComplete?: () => void
  showEarthDetails?: boolean
  onHubSelect?: (hubId: string) => void
  autoZoom?: boolean
}

export default function EnhancedSolarSystem({
  onCameraAnimationComplete,
  showEarthDetails = false,
  onHubSelect,
  autoZoom = true
}: EnhancedSolarSystemProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const sunRef = useRef<THREE.Mesh>(null)
  const controlsRef = useRef<any>(null)
  const animationProgress = useRef(0)
  const [isAnimating, setIsAnimating] = useState(autoZoom)
  const { camera } = useThree()

  // For tracking Earth's position if needed
  const earthPos = useRef(new THREE.Vector3(0, 0, 0))

  // Animate camera from deep space to Earth orbit
  useEffect(() => {
    if (autoZoom && cameraRef.current) {
      animationProgress.current = 0
      setIsAnimating(true)
    }
  }, [autoZoom])

  useFrame((state, delta) => {
    // Rotate sun slowly
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05
    }

    // Update OrbitControls target to follow Earth
    if (controlsRef.current && earthPos.current) {
      controlsRef.current.target.copy(earthPos.current)
      controlsRef.current.update()
    }

    // Camera zoom animation - starts far out and zooms to Earth
    if (autoZoom && animationProgress.current < 1) {
      animationProgress.current += delta * 0.1 // Slow cinematic zoom

      if (animationProgress.current >= 1) {
        animationProgress.current = 1
        setIsAnimating(false)
        if (onCameraAnimationComplete) {
          onCameraAnimationComplete()
        }
      }

      // Cubic easing for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - animationProgress.current, 3)

      // Start very far away for dramatic effect
      const startPos = new THREE.Vector3(0, 50, 800)
      const endPos = new THREE.Vector3(0, 5, 15)

      camera.position.lerpVectors(startPos, endPos, easeProgress)
      camera.lookAt(earthPos.current)
    }
  })

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 50, 800]}
        fov={60}
      />

      {/* Orbit controls (disabled during intro animation) */}
      <OrbitControls
        ref={controlsRef}
        enabled={!isAnimating}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.4}
        zoomSpeed={0.8}
        minDistance={3}
        maxDistance={800}
        enablePan={false}
      />

      {/* Lighting setup */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#fff5b3" />
      <directionalLight position={[-10, 5, 5]} intensity={0.5} />

      {/* Environment for reflections */}
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      {/* Enhanced starfield background - stars far from solar system */}
      <EnhancedStarfield count={9000} />

      {/* Sun at center */}
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial color="#ffdd55" />
      </mesh>

      {/* Sun glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshBasicMaterial
          color="#ffdd55"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner Planets */}
      <Planet
        name="Mercury"
        size={0.2}
        semiMajor={20}
        eccentricity={0.205}
        orbitPeriod={20}
        color="#b5b5b5"
      />
      <Planet
        name="Venus"
        size={0.45}
        semiMajor={36}
        eccentricity={0.007}
        orbitPeriod={50}
        color="#d4a15f"
      />

      {/* Earth orbiting the Sun (with satellites orbiting Earth) */}
      <OrbitingEarthSystem
        onHubSelect={onHubSelect}
        showLabels={showEarthDetails}
        posRef={earthPos}
      />

      {/* Outer Planets */}
      <Planet
        name="Mars"
        size={0.6}
        semiMajor={76}
        eccentricity={0.093}
        orbitPeriod={142}
        color="#d15b5b"
      />
      <Planet
        name="Jupiter"
        size={6.0}
        semiMajor={140}
        eccentricity={0.049}
        orbitPeriod={890}
        color="#b08968"
      />
      <Planet
        name="Saturn"
        size={5.0}
        semiMajor={200}
        eccentricity={0.056}
        orbitPeriod={2200}
        color="#cdb79e"
      />
      <Planet
        name="Uranus"
        size={2.5}
        semiMajor={280}
        eccentricity={0.047}
        orbitPeriod={6400}
        color="#7ec8e3"
      />
      <Planet
        name="Neptune"
        size={2.5}
        semiMajor={360}
        eccentricity={0.009}
        orbitPeriod={12800}
        color="#4b6cb7"
      />

      {/* Sphere of Influence ring at the outer edge */}
      <SphereOfInfluenceRing />
    </>
  )
}
