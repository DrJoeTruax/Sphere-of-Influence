'use client'

import { useRef, useMemo, useState, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Html, Line, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface HubMarker {
  id: string
  name: string
  position: [number, number, number] // lat, lon, altitude
  activeContributors: number
  languages: string[]
  color?: string
  bounds?: { minLat: number; maxLat: number; minLon: number; maxLon: number }
}

interface EnhancedEarthProps {
  onHubSelect?: (hubId: string) => void
  hubs?: HubMarker[]
  showLabels?: boolean
  selectedHubIndex?: number
  radius?: number
}

const EARTH_RADIUS = 1.5

// Convert lat/lon to 3D coordinates - ALIGNED WITH TEXTURE
function latLonToVector3(lat: number, lon: number, radius = EARTH_RADIUS): [number, number, number] {
  const latRad = lat * (Math.PI / 180)
  const lonRad = (lon + 90) * (Math.PI / 180) // +90 deg offset for texture alignment

  const x = radius * Math.cos(latRad) * Math.sin(lonRad)
  const y = radius * Math.sin(latRad)
  const z = radius * Math.cos(latRad) * Math.cos(lonRad)
  return [x, y, z]
}

// Default hub positions with region bounds
const DEFAULT_HUBS: HubMarker[] = [
  {
    id: 'north-america',
    name: 'North America',
    position: [40, -100, 0],
    activeContributors: 0,
    languages: ['en'],
    color: '#4CAF50',
    bounds: { minLat: 8, maxLat: 80, minLon: -170, maxLon: -50 }
  },
  {
    id: 'latin-america',
    name: 'Latin America',
    position: [-10, -60, 0],
    activeContributors: 0,
    languages: ['es', 'pt'],
    color: '#FFC107',
    bounds: { minLat: -55, maxLat: 15, minLon: -85, maxLon: -35 }
  },
  {
    id: 'western-europe',
    name: 'Western Europe',
    position: [50, 10, 0],
    activeContributors: 0,
    languages: ['en', 'fr', 'de'],
    color: '#2196F3',
    bounds: { minLat: 36, maxLat: 72, minLon: -10, maxLon: 30 }
  },
  {
    id: 'eastern-europe',
    name: 'Eastern Europe',
    position: [55, 40, 0],
    activeContributors: 0,
    languages: ['ru', 'pl'],
    color: '#9C27B0',
    bounds: { minLat: 44, maxLat: 62, minLon: 19, maxLon: 42 }
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    position: [30, 45, 0],
    activeContributors: 0,
    languages: ['ar', 'he'],
    color: '#FF5722',
    bounds: { minLat: 12, maxLat: 42, minLon: 24, maxLon: 63 }
  },
  {
    id: 'africa',
    name: 'Africa',
    position: [0, 20, 0],
    activeContributors: 0,
    languages: ['en', 'fr', 'sw'],
    color: '#795548',
    bounds: { minLat: -36, maxLat: 38, minLon: -18, maxLon: 52 }
  },
  {
    id: 'india',
    name: 'India',
    position: [20, 77, 0],
    activeContributors: 0,
    languages: ['hi', 'en'],
    color: '#FF9800',
    bounds: { minLat: 8, maxLat: 36, minLon: 66, maxLon: 98 }
  },
  {
    id: 'china',
    name: 'China',
    position: [35, 105, 0],
    activeContributors: 0,
    languages: ['zh'],
    color: '#F44336',
    bounds: { minLat: 18, maxLat: 54, minLon: 73, maxLon: 135 }
  },
  {
    id: 'southeast-asia',
    name: 'Southeast Asia',
    position: [10, 120, 0],
    activeContributors: 0,
    languages: ['id', 'th'],
    color: '#00BCD4',
    bounds: { minLat: -11, maxLat: 29, minLon: 92, maxLon: 145 }
  },
  {
    id: 'east-asia',
    name: 'East Asia',
    position: [35, 135, 0],
    activeContributors: 0,
    languages: ['ja', 'ko'],
    color: '#E91E63',
    bounds: { minLat: 24, maxLat: 46, minLon: 122, maxLon: 146 }
  },
  {
    id: 'oceania',
    name: 'Oceania',
    position: [-25, 135, 0],
    activeContributors: 0,
    languages: ['en'],
    color: '#009688',
    bounds: { minLat: -48, maxLat: -10, minLon: 110, maxLon: 180 }
  },
]

// Region outline component
function RegionOutline({ bounds, color }: {
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number };
  color: string;
}) {
  const { minLat, maxLat, minLon, maxLon } = bounds
  const radius = EARTH_RADIUS + 0.03 // Slightly above clouds

  const corners = useMemo(() => [
    latLonToVector3(maxLat, minLon, radius),
    latLonToVector3(maxLat, maxLon, radius),
    latLonToVector3(minLat, maxLon, radius),
    latLonToVector3(minLat, minLon, radius),
  ], [minLat, maxLat, minLon, maxLon])

  const segments = useMemo(() => [
    [corners[0], corners[1]], // Top
    [corners[1], corners[2]], // Right
    [corners[2], corners[3]], // Bottom
    [corners[3], corners[0]], // Left
  ], [corners])

  return (
    <group>
      {segments.map((segment, i) => (
        <Line
          key={i}
          points={segment}
          color={color}
          lineWidth={3}
          transparent
          opacity={0.8}
        />
      ))}
    </group>
  )
}

// Static region label component
function RegionLabel({ hub }: { hub: HubMarker }) {
  // Calculate center position of the region based on hub's lat/lon
  const [lat, lon] = hub.position
  const labelRadius = EARTH_RADIUS + 0.3 // Position label above the region
  const [x, y, z] = latLonToVector3(lat, lon, labelRadius)

  return (
    <Html position={[x, y, z]} center distanceFactor={6}>
      <div
        style={{
          color: hub.color,
          fontSize: '20px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          padding: '4px 8px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '8px',
        }}
      >
        {hub.name}
      </div>
    </Html>
  )
}

// Hub marker/satellite component
function HubSatellite({
  hub,
  onClick,
  showLabel
}: {
  hub: HubMarker
  onClick: () => void
  showLabel: boolean
}) {
  const [lat, lon] = hub.position
  const position = useMemo(() => latLonToVector3(lat, lon, EARTH_RADIUS + 0.3), [lat, lon])
  const [isHovered, setIsHovered] = useState(false)

  return (
    <group position={position}>
      {/* Satellite body */}
      <mesh
        onClick={onClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        raycast={() => null}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial
          color={hub.color || '#3B82F6'}
          toneMapped={false}
        />
      </mesh>

      {/* Glow */}
      <mesh onClick={onClick} raycast={() => null}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial
          color={hub.color || '#3B82F6'}
          transparent
          opacity={isHovered ? 0.3 : 0.15}
          toneMapped={false}
        />
      </mesh>

      {/* Label */}
      {(showLabel || isHovered) && (
        <Html
          position={[0, 0.1, 0]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap backdrop-blur-sm border border-cyan-500/50 shadow-lg">
            <div className="font-bold" style={{ color: hub.color }}>{hub.name}</div>
            {hub.activeContributors > 0 && (
              <div className="text-[10px] text-gray-400">
                {hub.activeContributors} active
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

// Earth with textures component
function EarthWithTextures({ earthRef, cloudsRef }: {
  earthRef: React.RefObject<THREE.Mesh>
  cloudsRef: React.RefObject<THREE.Mesh>
}) {
  // Load all texture files: planet_color, planet_normal, planet_rough, planet_night, planet_clouds
  const [colorMap, normalMap, roughMap, nightMap, cloudMap] = useTexture([
    '/textures/planet_color.jpg',
    '/textures/planet_normal.jpg',
    '/textures/planet_rough.jpg',
    '/textures/planet_night.jpg',
    '/textures/planet_clouds.jpg'
  ])

  return (
    <>
      {/* Main Earth sphere with textures */}
      <Sphere ref={earthRef} args={[EARTH_RADIUS, 128, 128]}>
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughMap}
          emissiveMap={nightMap}
          emissive="#ffffff"
          emissiveIntensity={0.2}
          metalness={0.1}
        />
      </Sphere>

      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[EARTH_RADIUS + 0.02, 128, 128]}>
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.25}
        />
      </Sphere>
    </>
  )
}

// Fallback Earth with solid colors
function EarthFallback({ earthRef, cloudsRef }: {
  earthRef: React.RefObject<THREE.Mesh>
  cloudsRef: React.RefObject<THREE.Mesh>
}) {
  return (
    <>
      {/* Main Earth sphere - solid color fallback */}
      <Sphere ref={earthRef} args={[EARTH_RADIUS, 128, 128]}>
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>

      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[EARTH_RADIUS + 0.02, 64, 64]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          roughness={1}
        />
      </Sphere>
    </>
  )
}

export default function EnhancedEarth({
  onHubSelect,
  hubs = DEFAULT_HUBS,
  showLabels = false,
  selectedHubIndex = 0
}: EnhancedEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)

  // Rotate Earth
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.06
    }
  })

  // Get the selected hub based on index
  const selectedHub = hubs[selectedHubIndex]

  return (
    <group>
      {/* Use Suspense to load textures with fallback */}
      <Suspense fallback={<EarthFallback earthRef={earthRef} cloudsRef={cloudsRef} />}>
        <EarthWithTextures earthRef={earthRef} cloudsRef={cloudsRef} />
      </Suspense>

      {/* Atmosphere glow */}
      <Sphere args={[EARTH_RADIUS + 0.1, 64, 64]}>
        <meshBasicMaterial
          color="#60A5FA"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Region outline - ONLY for selected hub */}
      {showLabels && selectedHub?.bounds && (
        <RegionOutline
          bounds={selectedHub.bounds}
          color={selectedHub.color || '#3B82F6'}
        />
      )}

      {/* Static region label - ONLY for selected hub */}
      {showLabels && selectedHub && (
        <RegionLabel hub={selectedHub} />
      )}

      {/* Hub satellites */}
      {hubs.map((hub) => (
        <HubSatellite
          key={hub.id}
          hub={hub}
          onClick={() => onHubSelect?.(hub.id)}
          showLabel={showLabels}
        />
      ))}
    </group>
  )
}
