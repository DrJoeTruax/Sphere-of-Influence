'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import EnhancedEarth from './EnhancedEarth'
import SpaceStation from './SpaceStation'
import NaderSatellite from './NaderSatellite'
import EnhancedStarfield from './EnhancedStarfield'
import Planet from './Planet'
import SphereOfInfluenceRing from './SphereOfInfluenceRing'

const EARTH_RADIUS = 1.5

interface EarthSceneProps {
  onCameraAnimationComplete?: () => void
  onHubSelect?: (hubId: string) => void
  cycleIndex: number
  showEarthDetails?: boolean
  autoZoom?: boolean
}

// Hub data matching the user's regionalHubs structure
interface RegionalHub {
  id: string
  name: string
  position: [number, number, number] // [lat, lon, alt]
  lat: number
  lon: number
  languages: string[]
  color: string
}

// Convert lat/lon to 3D coordinates
function latLonToVector3(lat: number, lon: number, radius = EARTH_RADIUS): [number, number, number] {
  const latRad = lat * (Math.PI / 180)
  const lonRad = (lon + 90) * (Math.PI / 180) // +90 deg offset for texture alignment

  const x = radius * Math.cos(latRad) * Math.sin(lonRad)
  const y = radius * Math.sin(latRad)
  const z = radius * Math.cos(latRad) * Math.cos(lonRad)
  return [x, y, z]
}

const regionalHubs: RegionalHub[] = [
  { id: 'north-america', name: 'North America', lat: 40, lon: -100, position: [40, -100, 0], languages: ['en'], color: '#4CAF50' },
  { id: 'latin-america', name: 'Latin America', lat: -10, lon: -60, position: [-10, -60, 0], languages: ['es', 'pt'], color: '#FFC107' },
  { id: 'western-europe', name: 'Western Europe', lat: 50, lon: 10, position: [50, 10, 0], languages: ['en', 'fr', 'de'], color: '#2196F3' },
  { id: 'eastern-europe', name: 'Eastern Europe', lat: 55, lon: 40, position: [55, 40, 0], languages: ['ru', 'pl'], color: '#9C27B0' },
  { id: 'middle-east', name: 'Middle East', lat: 30, lon: 45, position: [30, 45, 0], languages: ['ar', 'he'], color: '#FF5722' },
  { id: 'africa', name: 'Africa', lat: 0, lon: 20, position: [0, 20, 0], languages: ['en', 'fr', 'sw'], color: '#795548' },
  { id: 'india', name: 'India', lat: 20, lon: 77, position: [20, 77, 0], languages: ['hi', 'en'], color: '#FF9800' },
  { id: 'china', name: 'China', lat: 35, lon: 105, position: [35, 105, 0], languages: ['zh'], color: '#F44336' },
  { id: 'southeast-asia', name: 'Southeast Asia', lat: 10, lon: 120, position: [10, 120, 0], languages: ['en'], color: '#00BCD4' },
  { id: 'east-asia', name: 'East Asia', lat: 35, lon: 135, position: [35, 135, 0], languages: ['ja', 'ko'], color: '#E91E63' },
  { id: 'oceania', name: 'Oceania', lat: -25, lon: 135, position: [-25, 135, 0], languages: ['en'], color: '#009688' },
]

/**
 * CameraController - Handles intro zoom and fly-to-region animations
 */
function CameraController({
  target,
  onZoomComplete,
  cycleIndex
}: {
  target: React.MutableRefObject<THREE.Vector3>
  onZoomComplete: () => void
  cycleIndex: number
}) {
  const { camera, gl } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const [isZooming, setIsZooming] = useState(true)
  const [isFlying, setIsFlying] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  const startDist = 800
  const endDist = 5
  const startYPos = 80
  const endYPos = 0
  const duration = 2
  const startPos = useRef(new THREE.Vector3(0, startYPos, startDist)).current
  const endPos = useMemo(() => new THREE.Vector3(), [])

  const targetCamPos = useMemo(() => new THREE.Vector3(), [])
  const targetLookAt = useMemo(() => new THREE.Vector3(), [])

  // Set initial camera position
  useEffect(() => {
    camera.position.copy(startPos)
    camera.lookAt(target.current)
  }, [camera, target, startPos])

  // This effect triggers the "fly-to" animation when cycleIndex changes
  useEffect(() => {
    if (isZooming) return // Don't fly during intro zoom

    const hub = regionalHubs[cycleIndex]

    // 1. Calculate the point ON THE GLOBE's surface to look at
    const [lx, ly, lz] = latLonToVector3(hub.lat, hub.lon, EARTH_RADIUS)
    targetLookAt.set(lx, ly, lz)

    // 2. Calculate the CAMERA's position (further out)
    const [cx, cy, cz] = latLonToVector3(hub.lat, hub.lon, EARTH_RADIUS + endDist)
    targetCamPos.set(cx, cy, cz)

    // 3. Trigger the flight animation
    setIsFlying(true)

  }, [cycleIndex, isZooming, targetLookAt, targetCamPos])

  // Listen for user interaction to stop auto-rotate
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const onStart = () => setIsUserInteracting(true)
    const onEnd = () => setIsUserInteracting(false)

    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)
    return () => {
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
    }
  }, [controlsRef])

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    const c = controlsRef.current
    if (!c) return

    // --- 1. INTRO ZOOM LOGIC ---
    if (isZooming && elapsed < duration) {
      c.enabled = false
      const t = elapsed / duration
      const easedT = 1 - Math.pow(1 - t, 4)

      endPos.set(
        target.current.x,
        target.current.y + endYPos,
        target.current.z + endDist
      )

      camera.position.lerpVectors(startPos, endPos, easedT)
      camera.lookAt(target.current)

    } else if (isZooming && elapsed >= duration) {
      // Intro zoom finished
      setIsZooming(false)
      onZoomComplete()

      camera.position.set(0, 0, endDist)
      if (c) {
        c.target.copy(target.current)
        c.update()
      }
      c.enabled = true

    // --- 2. HUB-TO-HUB FLIGHT LOGIC ---
    } else if (!isZooming && isFlying) {
      c.enabled = false // Disable user control during flight
      c.autoRotate = false // Disable auto-rotate

      camera.position.lerp(targetCamPos, 0.05)
      c.target.lerp(targetLookAt, 0.05)
      camera.up.set(0, 1, 0) // Keep camera upright

      // Stop flying when close
      if (camera.position.distanceTo(targetCamPos) < 0.01) {
        camera.position.copy(targetCamPos)
        c.target.copy(targetLookAt)
        setIsFlying(false)
        c.enabled = true // Re-enable user control
      }

    // --- 3. AUTO-ROTATE & USER CONTROL ---
    } else if (!isZooming && !isFlying) {
      c.enabled = true
      // Enable auto-rotate ONLY if user is not interacting
      c.autoRotate = !isUserInteracting
      c.autoRotateSpeed = 0.3 // Set rotation speed
    }

    // Always update controls
    c.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.4}
      zoomSpeed={0.8}
      minDistance={2}
      maxDistance={2000}
      enablePan={false}
    />
  )
}

export default function EarthScene({
  onCameraAnimationComplete,
  onHubSelect,
  cycleIndex,
  showEarthDetails = false,
  autoZoom = true
}: EarthSceneProps) {
  // Earth is stationary at the center [0,0,0] - this is the focal point
  const earthCenter = useRef(new THREE.Vector3(0, 0, 0))
  const sunRef = useRef<THREE.Mesh>(null)

  // Rotate sun slowly
  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <>
      {/* Lighting */}
      <pointLight position={[60, 0, 0]} intensity={3} color="#fff5b3" />
      <directionalLight
        position={[60, 0, 0]}
        intensity={Math.PI * 1.5}
        castShadow
      />
      <ambientLight intensity={Math.PI * 0.1} />

      {/* Starfield background */}
      <EnhancedStarfield count={9000} radius={2000} />

      {/* Sun positioned away from Earth */}
      <mesh ref={sunRef} position={[60, 0, 0]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial color="#ffdd55" />
      </mesh>

      {/* Sun glow */}
      <mesh position={[60, 0, 0]}>
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
        semiMajor={10}
        eccentricity={0.205}
        orbitPeriod={20}
        color="#b5b5b5"
      />
      <Planet
        name="Venus"
        size={0.45}
        semiMajor={18}
        eccentricity={0.007}
        orbitPeriod={50}
        color="#d4a15f"
      />

      {/* Earth at the center [0, 0, 0] - THE FOCAL POINT */}
      <group position={[0, 0, 0]}>
        <EnhancedEarth
          onHubSelect={onHubSelect}
          showLabels={showEarthDetails}
          selectedHubIndex={cycleIndex}
        />

        {/* Space Station orbiting Earth */}
        <SpaceStation
          onClick={() => onHubSelect?.('space-station')}
          showLabel={showEarthDetails}
        />

        {/* Nader Satellite orbiting Earth */}
        <NaderSatellite
          onClick={() => onHubSelect?.('nader-station')}
          showLabel={showEarthDetails}
        />
      </group>

      {/* Outer Planets */}
      <Planet
        name="Mars"
        size={0.35}
        semiMajor={38}
        eccentricity={0.093}
        orbitPeriod={142}
        color="#d15b5b"
      />
      <Planet
        name="Jupiter"
        size={1.1}
        semiMajor={70}
        eccentricity={0.049}
        orbitPeriod={890}
        color="#b08968"
      />
      <Planet
        name="Saturn"
        size={1.0}
        semiMajor={100}
        eccentricity={0.056}
        orbitPeriod={2200}
        color="#cdb79e"
      />
      <Planet
        name="Uranus"
        size={0.8}
        semiMajor={140}
        eccentricity={0.047}
        orbitPeriod={6400}
        color="#7ec8e3"
      />
      <Planet
        name="Neptune"
        size={0.7}
        semiMajor={180}
        eccentricity={0.009}
        orbitPeriod={12800}
        color="#4b6cb7"
      />

      {/* Sphere of Influence ring at the outer edge */}
      <SphereOfInfluenceRing />

      {/* Camera Controller */}
      <CameraController
        target={earthCenter}
        onZoomComplete={() => onCameraAnimationComplete?.()}
        cycleIndex={cycleIndex}
      />
    </>
  )
}
