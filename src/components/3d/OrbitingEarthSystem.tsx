'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import EnhancedEarth from './EnhancedEarth'
import SpaceStation from './SpaceStation'
import NaderSatellite from './NaderSatellite'

interface OrbitingEarthSystemProps {
  onHubSelect?: (hubId: string) => void
  showLabels?: boolean
  selectedHubIndex?: number
  posRef?: React.MutableRefObject<THREE.Vector3>
}

export default function OrbitingEarthSystem({
  onHubSelect,
  showLabels,
  selectedHubIndex = 0,
  posRef
}: OrbitingEarthSystemProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Earth's orbital parameters - 3rd orbit position (pushed much further from massive sun)
  const semiMajor = 270
  const eccentricity = 0.017
  const orbitPeriod = 75
  const semiMinor = semiMajor * Math.sqrt(1 - eccentricity ** 2)
  const phaseOffset = useRef(Math.random() * Math.PI * 2)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1
    const angle = (t / orbitPeriod) * Math.PI * 2 + phaseOffset.current
    const x = semiMajor * Math.cos(angle) - semiMajor * eccentricity
    const z = semiMinor * Math.sin(angle)

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z)
    }

    if (posRef) {
      posRef.current.set(x, 0, z)
    }
  })

  return (
    <>
      {/* Earth's orbit path */}
      <EarthOrbitPath semiMajor={semiMajor} eccentricity={eccentricity} />

      {/* Earth system (planet + satellites) */}
      <group ref={groupRef}>
        <EnhancedEarth
          onHubSelect={onHubSelect}
          showLabels={showLabels}
          selectedHubIndex={selectedHubIndex}
        />

        {/* Moon orbiting Earth */}
        <Moon />

        {/* Space Station orbiting Earth */}
        <SpaceStation
          onClick={() => onHubSelect?.('space-station')}
          showLabel={showLabels}
        />

        {/* Nader Satellite orbiting Earth */}
        <NaderSatellite
          onClick={() => onHubSelect?.('nader-station')}
          showLabel={showLabels}
        />
      </group>
    </>
  )
}

// Moon component orbiting Earth
function Moon() {
  const moonRef = useRef<THREE.Mesh>(null)
  const moonOrbitRadius = 6.0 // Farther than both satellites
  const moonSize = 0.4
  // Real moon orbits Earth every ~27.3 days, Earth orbits sun every ~365 days
  // Ratio is ~13.4:1, so moon should be ~13.4x slower than Earth's orbit
  // Earth's orbit period is 75 (orbitPeriod in parent), and time is multiplied by 0.1 in useFrame
  // So effective Earth speed is 0.1/75. Moon should be 13.4x slower: 0.1/(75*13.4) ≈ 0.0001
  const moonOrbitSpeed = 0.0001

  useFrame(({ clock }) => {
    if (moonRef.current) {
      const t = clock.getElapsedTime() * moonOrbitSpeed
      moonRef.current.position.x = Math.cos(t) * moonOrbitRadius
      moonRef.current.position.z = Math.sin(t) * moonOrbitRadius
    }
  })

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[moonSize, 32, 32]} />
      <meshStandardMaterial color="#c0c0c0" roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

// Earth's orbital path
function EarthOrbitPath({ semiMajor, eccentricity }: { semiMajor: number; eccentricity: number }) {
  const pts: THREE.Vector3[] = []
  const seg = 256
  const semiMinor = semiMajor * Math.sqrt(1 - eccentricity ** 2)

  for (let i = 0; i <= seg; i++) {
    const θ = (i / seg) * Math.PI * 2
    const x = semiMajor * Math.cos(θ) - semiMajor * eccentricity
    const z = semiMinor * Math.sin(θ)
    pts.push(new THREE.Vector3(x, 0, z))
  }

  const geom = new THREE.BufferGeometry().setFromPoints(pts)

  return (
    <lineLoop geometry={geom}>
      <lineBasicMaterial color="#333" transparent opacity={0.3} />
    </lineLoop>
  )
}
