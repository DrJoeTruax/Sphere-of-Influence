'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

export default function HolographicEarth() {
  const earthRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Line>(null)

  // Create orbit ring
  const orbitPoints = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    orbitPoints.push(new THREE.Vector3(Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5))
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Rotate Earth
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.2
    }

    // Pulse glow
    if (glowRef.current) {
      const pulse = Math.sin(time * 2) * 0.1 + 0.9
      glowRef.current.scale.setScalar(pulse)
    }

    // Rotate orbit ring
    if (orbitRef.current) {
      orbitRef.current.rotation.y = time * 0.3
    }
  })

  return (
    <group>
      {/* Main Earth sphere - holographic style */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          color="#4169E1"
          emissive="#1E90FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
          wireframe={false}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[1.02, 16, 16]}>
        <meshBasicMaterial
          color="#60A5FA"
          wireframe
          transparent
          opacity={0.4}
        />
      </Sphere>

      {/* Glow effect */}
      <Sphere ref={glowRef} args={[1.2, 32, 32]}>
        <meshBasicMaterial
          color="#3B82F6"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Orbit ring */}
      <line ref={orbitRef} geometry={orbitGeometry}>
        <lineBasicMaterial
          color="#60A5FA"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Ambient particles around Earth */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={
              new Float32Array(
                Array.from({ length: 300 }, () => (Math.random() - 0.5) * 4)
              )
            }
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#60A5FA"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Point light from Earth */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#3B82F6" distance={5} />
    </group>
  )
}
