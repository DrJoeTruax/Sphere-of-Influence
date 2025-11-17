'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import OrbitingEarthSystem from './OrbitingEarthSystem'
import EnhancedStarfield from './EnhancedStarfield'
import Planet from './Planet'
import SphereOfInfluenceRing from './SphereOfInfluenceRing'
import AsteroidBelt from './AsteroidBelt'
import WormholePortal from './WormholePortal'

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

    // 1. Calculate the point ON THE GLOBE's surface to look at (relative to Earth's center)
    const [lx, ly, lz] = latLonToVector3(hub.lat, hub.lon, EARTH_RADIUS)
    // Add Earth's position to get world coordinates
    targetLookAt.set(
      target.current.x + lx,
      target.current.y + ly,
      target.current.z + lz
    )

    // 2. Calculate the CAMERA's position (further out, relative to Earth's center)
    const [cx, cy, cz] = latLonToVector3(hub.lat, hub.lon, EARTH_RADIUS + endDist)
    // Add Earth's position to get world coordinates
    targetCamPos.set(
      target.current.x + cx,
      target.current.y + cy,
      target.current.z + cz
    )

    // 3. Trigger the flight animation
    setIsFlying(true)

  }, [cycleIndex, isZooming, targetLookAt, targetCamPos, target])

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
      c.target.copy(target.current)
      camera.lookAt(target.current)

    } else if (isZooming && elapsed >= duration) {
      // Intro zoom finished
      setIsZooming(false)
      onZoomComplete()

      camera.position.set(
        target.current.x,
        target.current.y + endYPos,
        target.current.z + endDist
      )
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
      // Always track Earth's position
      c.target.copy(target.current)
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
      target={target.current}
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
  // Earth's position (will be updated by OrbitingEarthSystem)
  const earthPos = useRef(new THREE.Vector3(0, 0, 0))
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
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#fff5b3" />
      <directionalLight position={[-10, 5, 5]} intensity={0.5} />

      {/* Starfield background - stars far from solar system */}
      <EnhancedStarfield count={9000} />

      {/* Sun at center of solar system - MASSIVELY LARGER */}
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[25, 64, 64]} />
        <meshBasicMaterial color="#ffdd55" />
      </mesh>

      {/* Sun glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[28, 64, 64]} />
        <meshBasicMaterial
          color="#ffdd55"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner Planets - Orbits pushed MUCH further out from massive sun */}
      <Planet
        name="Mercury"
        size={0.4}
        semiMajor={100}
        eccentricity={0.205}
        orbitPeriod={20}
        color="#b5b5b5"
      />
      <Planet
        name="Venus"
        size={0.95}
        semiMajor={180}
        eccentricity={0.007}
        orbitPeriod={50}
        color="#d4a15f"
      />

      {/* Earth orbiting the Sun (with satellites orbiting Earth) - 3rd orbit */}
      <OrbitingEarthSystem
        onHubSelect={onHubSelect}
        showLabels={showEarthDetails}
        selectedHubIndex={cycleIndex}
        posRef={earthPos}
      />

      {/* Mars - 4th orbit */}
      <Planet
        name="Mars"
        size={0.7}
        semiMajor={350}
        eccentricity={0.093}
        orbitPeriod={142}
        color="#d15b5b"
        moons={[
          { size: 0.08, distance: 1.2, color: "#6b5d54", orbitSpeed: 0.3 }, // Phobos
          { size: 0.06, distance: 1.7, color: "#7a6d64", orbitSpeed: 0.15 }  // Deimos
        ]}
      />

      {/* Asteroid Belt between Mars and Jupiter */}
      <AsteroidBelt />

      <Planet
        name="Jupiter"
        size={16.0}
        semiMajor={650}
        eccentricity={0.049}
        orbitPeriod={890}
        color="#b08968"
        moons={[
          { size: 0.22, distance: 17.0, color: "#c4a55a", orbitSpeed: 0.5 },  // Io
          { size: 0.18, distance: 20.0, color: "#c9b895", orbitSpeed: 0.35 }, // Europa
          { size: 0.30, distance: 24.0, color: "#8b7d6b", orbitSpeed: 0.2 },  // Ganymede
          { size: 0.28, distance: 28.0, color: "#6d6354", orbitSpeed: 0.12 }  // Callisto
        ]}
      />
      <Planet
        name="Saturn"
        size={14.0}
        semiMajor={950}
        eccentricity={0.056}
        orbitPeriod={2200}
        color="#cdb79e"
        rings={{
          innerRadius: 16.0,
          outerRadius: 26.0,
          color: "#d4c5a0"
        }}
        moons={[
          { size: 0.30, distance: 30.0, color: "#daa855", orbitSpeed: 0.1 } // Titan
        ]}
      />
      <Planet
        name="Uranus"
        size={7.0}
        semiMajor={1350}
        eccentricity={0.047}
        orbitPeriod={6400}
        color="#7ec8e3"
        rings={{
          innerRadius: 8.0,
          outerRadius: 12.0,
          color: "#95b3c9"
        }}
      />
      <Planet
        name="Neptune"
        size={7.0}
        semiMajor={1750}
        eccentricity={0.009}
        orbitPeriod={12800}
        color="#4b6cb7"
      />

      {/* Sphere of Influence ring at the outer edge */}
      <SphereOfInfluenceRing />

      {/* Wormhole portal back to enter page */}
      {showEarthDetails && <WormholePortal earthPosition={earthPos} />}

      {/* Camera Controller */}
      <CameraController
        target={earthPos}
        onZoomComplete={() => onCameraAnimationComplete?.()}
        cycleIndex={cycleIndex}
      />
    </>
  )
}
