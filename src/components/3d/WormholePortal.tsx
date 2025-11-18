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

  // Earth's orbital parameters (matching OrbitingEarthSystem)
  const EARTH_SEMI_MAJOR = 270
  const EARTH_ECCENTRICITY = 0.017
  const EARTH_SEMI_MINOR = EARTH_SEMI_MAJOR * Math.sqrt(1 - EARTH_ECCENTRICITY ** 2)

  // Create a dynamic tube path that extends from high above the solar system
  // down to the opposite side of Earth's orbit
  const { tubePath, exitPosition } = useMemo(() => {
    // High anchor point - well above the solar system (Neptune is at ~1757 max)
    const anchorY = 2500
    const anchorPoint = new THREE.Vector3(0, anchorY, 0)

    // We'll calculate the exit point dynamically in useFrame, but need an initial value
    const initialExitPoint = new THREE.Vector3(-EARTH_SEMI_MAJOR, 0, 0)

    // Create a curved path with multiple control points to avoid planets
    // The path twists and bends from above down to the exit
    const controlPoints = [
      anchorPoint,
      // High curve - start bending to the side
      new THREE.Vector3(400, 2000, 200),
      // Mid-high - continue curving
      new THREE.Vector3(700, 1500, -300),
      // Mid - twist around Jupiter/Saturn region
      new THREE.Vector3(500, 1000, -600),
      // Lower-mid - curve toward exit
      new THREE.Vector3(200, 500, -400),
      // Near exit - straighten out
      new THREE.Vector3(-100, 100, -200),
      // Exit point (will be updated dynamically)
      initialExitPoint
    ]

    return {
      tubePath: new THREE.CatmullRomCurve3(controlPoints),
      exitPosition: initialExitPoint
    }
  }, [])

  // Store the initial tube geometry but we'll update it each frame
  const tubeGeometryRef = useRef<THREE.TubeGeometry>(
    new THREE.TubeGeometry(tubePath, 100, 2, 16, false)
  )

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

    // Calculate the exit position on the OPPOSITE side of Earth's orbit
    if (groupRef.current && earthPosition.current) {
      // Calculate Earth's current angle in its orbit
      const earthAngle = Math.atan2(earthPosition.current.z, earthPosition.current.x)

      // Opposite side is 180 degrees (PI radians) away
      const oppositeAngle = earthAngle + Math.PI

      // Calculate the exit point on the opposite side of the orbit
      const exitX = EARTH_SEMI_MAJOR * Math.cos(oppositeAngle) - EARTH_SEMI_MAJOR * EARTH_ECCENTRICITY
      const exitZ = EARTH_SEMI_MINOR * Math.sin(oppositeAngle)

      // Update the exit position
      exitPosition.set(exitX, 0, exitZ)

      // Update the last control point of the tube path to match the exit
      const points = tubePath.points
      if (points.length > 0) {
        points[points.length - 1].copy(exitPosition)
        // Also update the second-to-last point to create a smooth approach
        if (points.length > 1) {
          const approachHeight = 50
          const approachDistance = 30
          const directionToExit = new THREE.Vector3(exitX, 0, exitZ).normalize()
          points[points.length - 2].set(
            exitX - directionToExit.x * approachDistance,
            approachHeight,
            exitZ - directionToExit.z * approachDistance
          )
        }

        // Regenerate the tube geometry with the updated path
        if (tubeRef.current && tubeGeometryRef.current) {
          const newGeometry = new THREE.TubeGeometry(tubePath, 100, 2, 16, false)
          tubeRef.current.geometry.dispose() // Clean up old geometry
          tubeRef.current.geometry = newGeometry
          tubeGeometryRef.current = newGeometry
        }
      }

      // Position the portal group at the exit point
      groupRef.current.position.copy(exitPosition)

      // Orient the portal to face Earth (so it opens toward Earth)
      const directionToEarth = new THREE.Vector3()
        .subVectors(earthPosition.current, exitPosition)
        .normalize()

      const up = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion()
      const targetMatrix = new THREE.Matrix4()
      targetMatrix.lookAt(new THREE.Vector3(0, 0, 0), directionToEarth, up)
      quaternion.setFromRotationMatrix(targetMatrix)
      groupRef.current.quaternion.copy(quaternion)
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

      {/* Long wormhole tube extending from above solar system to exit point */}
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

      {/* Point light for ambient glow */}
      <pointLight position={[0, 0, 2]} intensity={50} color="#00d4ff" distance={30} />
    </group>
  )
}
