'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BlackHoleProps {
  position?: [number, number, number]
  size?: number
}

export default function BlackHole({ position = [0, 0, -20], size = 5 }: BlackHoleProps) {
  const blackHoleRef = useRef<THREE.Mesh>(null)
  const accretionDiskRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Black hole shader
  const blackHoleShader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x000000) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);

          // Event horizon effect
          float eventHorizon = 0.3;
          if (dist < eventHorizon) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
          } else {
            // Gravitational lensing glow
            float glow = 0.1 / (dist - eventHorizon);
            gl_FragColor = vec4(glow * 0.3, glow * 0.5, glow * 1.0, 1.0);
          }
        }
      `
    }),
    []
  )

  // Accretion disk shader with rotation and glow
  const accretionDiskShader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);

          // Rotating spiral pattern
          float spiral = sin(angle * 5.0 - time * 2.0 + dist * 20.0) * 0.5 + 0.5;

          // Inner and outer radius
          float innerRadius = 0.3;
          float outerRadius = 0.8;

          if (dist > innerRadius && dist < outerRadius) {
            // Color based on distance (hot inner, cooler outer)
            vec3 innerColor = vec3(1.0, 0.8, 0.4); // Orange-yellow
            vec3 outerColor = vec3(0.6, 0.4, 1.0); // Blue-purple

            float mix_factor = (dist - innerRadius) / (outerRadius - innerRadius);
            vec3 color = mix(innerColor, outerColor, mix_factor);

            float alpha = spiral * (1.0 - mix_factor) * 0.8;
            gl_FragColor = vec4(color, alpha);
          } else {
            discard;
          }
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    }),
    []
  )

  // Particle system for matter being pulled in
  const particles = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Spiral distribution
      const angle = Math.random() * Math.PI * 2
      const radius = 10 + Math.random() * 20

      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = (Math.random() - 0.5) * 5
      positions[i3 + 2] = Math.sin(angle) * radius

      // Color gradient (blue to orange)
      const colorMix = Math.random()
      colors[i3] = colorMix * 1.0 + (1 - colorMix) * 0.3
      colors[i3 + 1] = colorMix * 0.6 + (1 - colorMix) * 0.5
      colors[i3 + 2] = colorMix * 0.2 + (1 - colorMix) * 1.0

      sizes[i] = Math.random() * 0.5 + 0.1
    }

    return { positions, colors, sizes }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Rotate accretion disk
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z = t * 0.5
      ;(accretionDiskRef.current.material as THREE.ShaderMaterial).uniforms.time.value = t
    }

    // Update black hole shader
    if (blackHoleRef.current) {
      ;(blackHoleRef.current.material as THREE.ShaderMaterial).uniforms.time.value = t
    }

    // Animate particles spiraling inward
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const z = positions[i + 2]

        const angle = Math.atan2(z, x)
        const radius = Math.sqrt(x * x + z * z)

        // Spiral inward
        const newRadius = radius - 0.05
        const newAngle = angle - 0.02

        if (newRadius < 1) {
          // Reset particle to outer edge
          const resetAngle = Math.random() * Math.PI * 2
          const resetRadius = 30
          positions[i] = Math.cos(resetAngle) * resetRadius
          positions[i + 2] = Math.sin(resetAngle) * resetRadius
        } else {
          positions[i] = Math.cos(newAngle) * newRadius
          positions[i + 2] = Math.sin(newAngle) * newRadius
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      {/* Black hole core with event horizon */}
      <mesh ref={blackHoleRef}>
        <sphereGeometry args={[size * 0.8, 64, 64]} />
        <shaderMaterial
          {...blackHoleShader}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Accretion disk */}
      <mesh ref={accretionDiskRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <planeGeometry args={[size * 6, size * 6, 1, 1]} />
        <shaderMaterial
          {...accretionDiskShader}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particles.sizes.length}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Gravitational lensing ring effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 2, 0.1, 16, 100]} />
        <meshBasicMaterial
          color={0x4488ff}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
