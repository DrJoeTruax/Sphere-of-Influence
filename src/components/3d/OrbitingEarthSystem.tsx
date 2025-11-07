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

  // Earth's orbital parameters
  const semiMajor = 52
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
