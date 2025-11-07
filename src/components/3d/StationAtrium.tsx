'use client'

import { Suspense } from 'react'
import { OrbitControls, Stars, Environment } from '@react-three/drei'
import ProofPillar from './ProofPillar'
import type { Proof } from '@/lib/api/proof-station'

interface StationAtriumProps {
  proofs: Proof[]
  selectedProof: Proof | null
  onProofClick: (proof: Proof) => void
}

export default function StationAtrium({ proofs, selectedProof, onProofClick }: StationAtriumProps) {
  // Arrange pillars in a circular pattern
  const radius = 8
  const positions = proofs.map((proof, index) => {
    const angle = (index / proofs.length) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    return [x, 0, z] as [number, number, number]
  })

  return (
    <>
      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        color="#4A90E2"
      />

      {/* Environment */}
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />

      {/* Floor (transparent to see Earth below) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <circleGeometry args={[15, 64]} />
        <meshPhysicalMaterial
          color="#0A1128"
          transparent
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Central platform */}
      <mesh position={[0, -2.9, 0]}>
        <cylinderGeometry args={[12, 12, 0.2, 64]} />
        <meshStandardMaterial
          color="#1A2332"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Central light reactor (Truth Reactor) */}
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#4A90E2"
            transparent
            opacity={0.6}
            emissive="#4A90E2"
            emissiveIntensity={1.5}
            transmission={0.8}
          />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={2} color="#4A90E2" distance={20} />
      </group>

      {/* Proof pillars */}
      {proofs.map((proof, index) => (
        <ProofPillar
          key={proof.id}
          proof={proof}
          position={positions[index]}
          onClick={onProofClick}
          isSelected={selectedProof?.id === proof.id}
        />
      ))}

      {/* Ceiling lights */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 10
        const z = Math.sin(angle) * 10
        return (
          <pointLight
            key={i}
            position={[x, 8, z]}
            intensity={0.5}
            color="#ffffff"
            distance={15}
          />
        )
      })}

      {/* Orbit rings (decorative) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[14, 0.05, 16, 100]} />
        <meshBasicMaterial color="#4A90E2" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[16, 0.03, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </>
  )
}
