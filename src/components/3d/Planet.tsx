'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface EllipticalOrbitProps {
  semiMajor: number
  eccentricity: number
}

function EllipticalOrbit({ semiMajor, eccentricity }: EllipticalOrbitProps) {
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

interface Moon {
  size: number
  distance: number
  color: string
  orbitSpeed: number
}

interface PlanetProps {
  name: string
  size: number
  semiMajor: number
  eccentricity: number
  orbitPeriod: number
  color: string
  posRef?: React.MutableRefObject<THREE.Vector3>
  rings?: {
    innerRadius: number
    outerRadius: number
    color: string
  }
  moons?: Moon[]
}

// Moon component that orbits the planet
function MoonOrbit({ moon, clockTime }: { moon: Moon; clockTime: number }) {
  const angle = clockTime * moon.orbitSpeed
  const x = Math.cos(angle) * moon.distance
  const z = Math.sin(angle) * moon.distance

  return (
    <mesh position={[x, 0, z]}>
      <sphereGeometry args={[moon.size, 16, 16]} />
      <meshStandardMaterial color={moon.color} roughness={0.9} />
    </mesh>
  )
}

export default function Planet({
  name,
  size,
  semiMajor,
  eccentricity,
  orbitPeriod,
  color,
  posRef,
  rings,
  moons
}: PlanetProps) {
  const meshRef = useRef<THREE.Group>(null)
  const semiMinor = semiMajor * Math.sqrt(1 - eccentricity ** 2)
  const phaseOffset = useRef(Math.random() * Math.PI * 2)
  const clockTime = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1
    clockTime.current = t

    const angle = (t / orbitPeriod) * Math.PI * 2 + phaseOffset.current
    const x = semiMajor * Math.cos(angle) - semiMajor * eccentricity
    const z = semiMinor * Math.sin(angle)

    if (meshRef.current) {
      meshRef.current.position.set(x, 0, z)
      meshRef.current.rotation.y += 0.004
    }

    if (posRef) {
      posRef.current.set(x, 0, z)
    }
  })

  return (
    <>
      <EllipticalOrbit semiMajor={semiMajor} eccentricity={eccentricity} />
      <group ref={meshRef}>
        <mesh>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.8}
            metalness={0.25}
          />
        </mesh>

        {/* Planetary rings if present */}
        {rings && (
          <mesh rotation={[Math.PI / 2.3, 0, 0]}>
            <ringGeometry args={[rings.innerRadius, rings.outerRadius, 64]} />
            <meshStandardMaterial
              color={rings.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
              roughness={0.8}
            />
          </mesh>
        )}

        {/* Moons if present */}
        {moons?.map((moon, i) => (
          <MoonOrbit key={i} moon={moon} clockTime={clockTime.current} />
        ))}
      </group>
    </>
  )
}
