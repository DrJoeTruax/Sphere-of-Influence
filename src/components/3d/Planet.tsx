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

interface PlanetProps {
  name: string
  size: number
  semiMajor: number
  eccentricity: number
  orbitPeriod: number
  color: string
  posRef?: React.MutableRefObject<THREE.Vector3>
}

export default function Planet({
  name,
  size,
  semiMajor,
  eccentricity,
  orbitPeriod,
  color,
  posRef
}: PlanetProps) {
  const meshRef = useRef<THREE.Group>(null)
  const semiMinor = semiMajor * Math.sqrt(1 - eccentricity ** 2)
  const phaseOffset = useRef(Math.random() * Math.PI * 2)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1
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
      </group>
    </>
  )
}
