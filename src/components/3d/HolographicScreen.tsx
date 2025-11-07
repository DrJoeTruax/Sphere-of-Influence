'use client'

import { useRef } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface HolographicScreenProps {
  hubName: string
  contributors: number
  languages: string[]
  color: string
  position: [number, number, number]
}

export default function HolographicScreen({
  hubName,
  contributors,
  languages,
  color,
  position
}: HolographicScreenProps) {
  const screenRef = useRef<THREE.Mesh>(null)

  // Format languages for display
  const langDisplay = languages.map(lang => lang.toUpperCase()).join('/')

  return (
    <group position={position}>
      {/* Holographic screen frame */}
      <mesh ref={screenRef}>
        <planeGeometry args={[1.5, 1.0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Screen border */}
      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.PlaneGeometry(1.5, 1.0)]}
        />
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineSegments>

      {/* HTML content overlay */}
      <Html
        position={[0, 0, 0.01]}
        center
        distanceFactor={4}
        transform
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: '200px',
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.8)',
            border: `2px solid ${color}`,
            borderRadius: '8px',
            color: 'white',
            fontSize: '11px',
            fontFamily: 'monospace',
            boxShadow: `0 0 20px ${color}40`,
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: color,
              textTransform: 'uppercase',
            }}
          >
            {hubName}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#888' }}>◉</span> {contributors.toLocaleString()} active
          </div>
          <div>
            <span style={{ color: '#888' }}>◉</span> {langDisplay}
          </div>
        </div>
      </Html>

      {/* Glow effect */}
      <pointLight position={[0, 0, 0.1]} color={color} intensity={0.3} distance={2} />
    </group>
  )
}
