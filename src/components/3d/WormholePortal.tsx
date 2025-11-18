'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'

// Use the same wormhole shader from the wormhole page
const WormholeMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color("#00d4ff"),
    color2: new THREE.Color("#ff00ff"),
    color3: new THREE.Color("#ffaa00"),
    intensity: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform float intensity;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float n = i.x + i.y * 157.0 + 113.0 * i.z;
      return mix(
        mix(mix(rand(vec2(n + 0.0, n)), rand(vec2(n + 1.0, n)), f.x),
            mix(rand(vec2(n + 157.0, n)), rand(vec2(n + 158.0, n)), f.x), f.y),
        mix(mix(rand(vec2(n + 113.0, n)), rand(vec2(n + 114.0, n)), f.x),
            mix(rand(vec2(n + 270.0, n)), rand(vec2(n + 271.0, n)), f.x), f.y), f.z);
    }

    void main() {
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float radius = length(vUv - 0.5) * 2.0;

      float spiral1 = sin(angle * 12.0 + time * 3.0 - radius * 15.0) * 0.5 + 0.5;
      float spiral2 = sin(angle * 8.0 - time * 2.5 + radius * 10.0) * 0.5 + 0.5;
      float spiral3 = sin(angle * 16.0 + time * 4.0 - radius * 20.0) * 0.5 + 0.5;

      float tunnel = 1.0 - smoothstep(0.0, 0.6, radius);
      float pulse = sin(time * 3.0) * 0.2 + 0.8;
      tunnel *= pulse;

      float rings = sin(vUv.y * 40.0 - time * 8.0) * 0.5 + 0.5;
      rings *= sin(vUv.x * 40.0 + time * 6.0) * 0.5 + 0.5;

      vec3 noiseCoord = vec3(vUv * 10.0, time * 0.5);
      float particles = noise(noiseCoord);
      particles = pow(particles, 3.0);

      float lightning = noise(vec3(vUv * 20.0, time * 2.0));
      lightning = smoothstep(0.85, 0.95, lightning);

      float pattern = spiral1 * 0.4 + spiral2 * 0.3 + spiral3 * 0.3;
      pattern = pattern * tunnel * (0.7 + rings * 0.3);
      pattern += particles * 0.4 + lightning * 0.8;

      vec3 color = mix(color1, color2, pattern);
      color = mix(color, color3, smoothstep(0.4, 0.8, pattern));

      color += vec3(1.0) * lightning * 0.5;
      color += vec3(particles) * color1 * 0.3;

      float edge = smoothstep(0.5, 0.6, radius);
      float glow = (1.0 - edge) * tunnel;

      float alpha = tunnel * (0.7 + pattern * 0.3) * intensity;
      alpha += glow * 0.3;

      float centerFade = mix(0.4, 1.0, 1.0 - smoothstep(0.4, 0.65, radius));
      alpha *= centerFade;

      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
      color += fresnel * color2 * 0.5;
      alpha += fresnel * 0.2;

      gl_FragColor = vec4(color, alpha);
    }
  `
)

interface WormholePortalProps {
  earthPosition: React.MutableRefObject<THREE.Vector3>
}

export default function WormholePortal({ earthPosition }: WormholePortalProps) {
  const router = useRouter()
  const { raycaster, camera, gl } = useThree()
  const portalRef = useRef<THREE.Mesh>(null)
  const tubeRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial & { uniforms: { time: { value: number }; intensity: { value: number } } } | null>(null)
  const tubeMaterialRef = useRef<THREE.ShaderMaterial & { uniforms: { time: { value: number }; intensity: { value: number } } } | null>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Moon orbit radius from OrbitingEarthSystem
  const MOON_ORBIT_RADIUS = 6.0
  // Portal distance just beyond the Moon
  const PORTAL_DISTANCE = 7.5

  // Outer edge of solar system (Sphere of Influence ring radius)
  const OUTER_EDGE_RADIUS = 2100

  // Create a dynamic tube path that weaves through the solar system
  // Portal stays near Earth, tube extends to outer edge with many twists
  const controlPointsRef = useRef<THREE.Vector3[]>([])
  const tubePath = useRef<THREE.CatmullRomCurve3 | null>(null)

  // Initialize control points
  useMemo(() => {
    // Start point: near Earth (will be updated dynamically)
    const startPoint = new THREE.Vector3(PORTAL_DISTANCE, 0, 0)

    // Create many control points that weave in and out of planetary orbits
    // Mercury orbit: ~100, Venus: ~180, Earth: ~270, Mars: ~350,
    // Asteroid belt: ~450, Jupiter: ~650, Saturn: ~950, Uranus: ~1350, Neptune: ~1750
    const points = [
      startPoint,
      // Weave outward from Earth with many twists
      new THREE.Vector3(50, 20, -30),
      new THREE.Vector3(120, -40, 60),   // Between Mercury and Venus
      new THREE.Vector3(200, 80, -90),   // Around Venus orbit
      new THREE.Vector3(280, -50, 120),  // Just beyond Earth orbit
      new THREE.Vector3(360, 100, -70),  // Around Mars orbit
      new THREE.Vector3(420, -80, 150),  // Entering asteroid belt
      new THREE.Vector3(500, 120, -100), // Through asteroid belt
      new THREE.Vector3(580, -90, 180),  // Exiting asteroid belt
      new THREE.Vector3(700, 150, -130), // Around Jupiter
      new THREE.Vector3(820, -120, 200), // Between Jupiter and Saturn
      new THREE.Vector3(950, 180, -160), // Around Saturn
      new THREE.Vector3(1100, -150, 220),// Between Saturn and Uranus
      new THREE.Vector3(1300, 200, -180),// Around Uranus
      new THREE.Vector3(1500, -170, 250),// Between Uranus and Neptune
      new THREE.Vector3(1700, 220, -200),// Around Neptune
      new THREE.Vector3(1900, -190, 280),// Beyond Neptune
      new THREE.Vector3(OUTER_EDGE_RADIUS, 0, 0) // Exit at 90° on outer edge
    ]

    controlPointsRef.current = points
    tubePath.current = new THREE.CatmullRomCurve3(points)

    return null
  }, [])

  // Store the initial tube geometry but we'll update it each frame
  const tubeGeometryRef = useRef<THREE.TubeGeometry | null>(null)

  // Initialize geometry once tubePath is ready
  if (!tubeGeometryRef.current && tubePath.current) {
    tubeGeometryRef.current = new THREE.TubeGeometry(tubePath.current, 100, 2, 16, false)
  }

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
      materialRef.current.uniforms.intensity.value = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }

    if (tubeMaterialRef.current) {
      tubeMaterialRef.current.uniforms.time.value = state.clock.elapsedTime
      tubeMaterialRef.current.uniforms.intensity.value = 0.8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2
    }

    // Pulsing glow effect
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1
      glowRef.current.scale.set(scale, scale, 1)
    }

    // Keep the wormhole portal connected to Earth
    if (groupRef.current && earthPosition.current && tubePath.current) {
      const time = state.clock.elapsedTime

      // Position portal just beyond the Moon's orbit from Earth
      // Add some gentle floating motion to make it "alive"
      const floatOffset = Math.sin(time * 0.5) * 0.3
      const portalOffsetAngle = time * 0.1 // Slowly orbit around Earth
      const portalX = earthPosition.current.x + Math.cos(portalOffsetAngle) * PORTAL_DISTANCE
      const portalY = earthPosition.current.y + floatOffset
      const portalZ = earthPosition.current.z + Math.sin(portalOffsetAngle) * PORTAL_DISTANCE

      // Position the portal group
      groupRef.current.position.set(portalX, portalY, portalZ)

      // Orient the portal perpendicular to Earth's direction
      const directionFromEarth = new THREE.Vector3(
        portalX - earthPosition.current.x,
        portalY - earthPosition.current.y,
        portalZ - earthPosition.current.z
      ).normalize()

      const up = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion()
      const targetMatrix = new THREE.Matrix4()
      targetMatrix.lookAt(new THREE.Vector3(0, 0, 0), directionFromEarth, up)
      quaternion.setFromRotationMatrix(targetMatrix)
      groupRef.current.quaternion.copy(quaternion)

      // Update the first control point to match portal position
      controlPointsRef.current[0].set(portalX, portalY, portalZ)

      // Add "alive" behavior: make control points breathe and avoid bodies
      const points = controlPointsRef.current
      for (let i = 1; i < points.length - 1; i++) {
        const point = points[i]
        const baseRadius = Math.sqrt(point.x * point.x + point.z * point.z)

        // Breathing motion - subtle wave along the tube
        const breathPhase = time * 0.8 + i * 0.3
        const breathAmount = Math.sin(breathPhase) * 15

        // Perpendicular offset for breathing
        const angle = Math.atan2(point.z, point.x)
        const perpAngle = angle + Math.PI / 2
        const breathX = Math.cos(perpAngle) * breathAmount
        const breathZ = Math.sin(perpAngle) * breathAmount

        // Vertical undulation
        const undulatePhase = time * 0.6 + i * 0.2
        const undulateAmount = Math.sin(undulatePhase) * 20

        // Apply gentle movement
        point.x += (breathX - point.x * 0.01) * 0.1
        point.z += (breathZ - point.z * 0.01) * 0.1
        point.y += (undulateAmount - point.y * 0.01) * 0.1

        // Keep points roughly at their orbital radius (soft constraint)
        const currentRadius = Math.sqrt(point.x * point.x + point.z * point.z)
        const radiusCorrection = (baseRadius - currentRadius) * 0.02
        const corrAngle = Math.atan2(point.z, point.x)
        point.x += Math.cos(corrAngle) * radiusCorrection
        point.z += Math.sin(corrAngle) * radiusCorrection
      }

      // Update the curve with new control points
      tubePath.current.points = points

      // Regenerate the tube geometry with the updated path
      if (tubeRef.current && tubeGeometryRef.current && tubePath.current) {
        const newGeometry = new THREE.TubeGeometry(tubePath.current, 100, 2, 16, false)
        tubeRef.current.geometry.dispose() // Clean up old geometry
        tubeRef.current.geometry = newGeometry
        tubeGeometryRef.current = newGeometry
      }
    }
  })

  const handleClick = (event: THREE.Event) => {
    event.stopPropagation()
    // Navigate to wormhole page in reverse mode
    router.push('/wormhole?reverse=true')
  }

  return (
    <group ref={groupRef}>
      {/* Wormhole portal entrance */}
      <mesh
        ref={portalRef}
        onClick={handleClick}
        onPointerOver={() => {
          if (gl.domElement) {
            gl.domElement.style.cursor = 'pointer'
          }
        }}
        onPointerOut={() => {
          if (gl.domElement) {
            gl.domElement.style.cursor = 'default'
          }
        }}
      >
        <circleGeometry args={[5, 64]} />
        <primitive
          ref={materialRef}
          object={new WormholeMaterial()}
          attach="material"
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Glowing ring around portal entrance */}
      <mesh ref={glowRef}>
        <ringGeometry args={[4.8, 5.2, 64]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Long wormhole tube weaving through solar system */}
      {tubeGeometryRef.current && (
        <mesh ref={tubeRef} geometry={tubeGeometryRef.current}>
          <primitive
            ref={tubeMaterialRef}
            object={new WormholeMaterial()}
            attach="material"
            transparent
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Point light for ambient glow */}
      <pointLight position={[0, 0, 2]} intensity={50} color="#00d4ff" distance={30} />
    </group>
  )
}
