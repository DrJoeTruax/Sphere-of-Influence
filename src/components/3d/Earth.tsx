'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'

interface HubMarker {
  id: string
  name: string
  position: [number, number, number] // lat, lon, altitude
  activeContributors: number
  languages: string[]
}

interface EarthProps {
  onHubSelect?: (hubId: string) => void
  hubs?: HubMarker[]
  showLabels?: boolean
}

// Convert lat/lon to 3D coordinates on sphere
function latLonToVector3(lat: number, lon: number, radius: number = 2): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

// Default hub positions (approximate geographic centers)
const DEFAULT_HUBS: HubMarker[] = [
  { id: 'north-america', name: 'North America', position: [40, -100, 0], activeContributors: 0, languages: ['en'] },
  { id: 'latin-america', name: 'Latin America', position: [-15, -60, 0], activeContributors: 0, languages: ['es', 'pt'] },
  { id: 'western-europe', name: 'Western Europe', position: [50, 10, 0], activeContributors: 0, languages: ['en', 'fr', 'de'] },
  { id: 'eastern-europe', name: 'Eastern Europe', position: [55, 35, 0], activeContributors: 0, languages: ['ru', 'pl'] },
  { id: 'middle-east', name: 'Middle East', position: [30, 45, 0], activeContributors: 0, languages: ['ar', 'he'] },
  { id: 'africa', name: 'Africa', position: [0, 20, 0], activeContributors: 0, languages: ['en', 'fr', 'sw'] },
  { id: 'india', name: 'India', position: [20, 80, 0], activeContributors: 0, languages: ['hi', 'en'] },
  { id: 'china', name: 'China', position: [35, 105, 0], activeContributors: 0, languages: ['zh'] },
  { id: 'southeast-asia', name: 'Southeast Asia', position: [5, 110, 0], activeContributors: 0, languages: ['id', 'th'] },
  { id: 'east-asia', name: 'East Asia', position: [37, 127, 0], activeContributors: 0, languages: ['ja', 'ko'] },
  { id: 'oceania', name: 'Oceania', position: [-25, 135, 0], activeContributors: 0, languages: ['en'] },
  { id: 'space-station', name: 'Space Station', position: [0, 0, 4], activeContributors: 0, languages: ['all'] },
]

function HubMarkerComponent({
  hub,
  onClick,
  showLabel
}: {
  hub: HubMarker
  onClick: () => void
  showLabel: boolean
}) {
  const [lat, lon] = hub.position
  const position = useMemo(() => latLonToVector3(lat, lon, 2.05), [lat, lon])
  const [isHovered, setIsHovered] = useState(false)

  return (
    <group position={position}>
      {/* Marker sphere */}
      <mesh
        onClick={onClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial
          color={isHovered ? '#60A5FA' : '#3B82F6'}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow effect */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color="#3B82F6"
          transparent
          opacity={isHovered ? 0.3 : 0.15}
        />
      </mesh>

      {/* Label */}
      {(showLabel || isHovered) && (
        <Html
          position={[0, 0.15, 0]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-blue-500/50">
            <div className="font-bold">{hub.name}</div>
            {hub.activeContributors > 0 && (
              <div className="text-xs text-gray-400">
                {hub.activeContributors} active
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

export default function Earth({ onHubSelect, hubs = DEFAULT_HUBS, showLabels = false }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)

  // Rotate Earth
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05 // Slow rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.06 // Slightly faster clouds
    }
  })

  return (
    <group>
      {/* Earth sphere */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1e40af" // Deep blue as placeholder for texture
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[2.1, 64, 64]}>
        <meshBasicMaterial
          color="#60A5FA"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.02, 64, 64]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          roughness={1}
        />
      </Sphere>

      {/* Hub markers */}
      {hubs.map((hub) => (
        <HubMarkerComponent
          key={hub.id}
          hub={hub}
          onClick={() => onHubSelect?.(hub.id)}
          showLabel={showLabels}
        />
      ))}
    </group>
  )
}
