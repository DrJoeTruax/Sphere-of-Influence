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
  const glowRef = useRef<THREE.Mesh>(null)

  // Photorealistic black hole shader with gravitational lensing
  const blackHoleShader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);

          // Pure black event horizon
          float eventHorizon = 0.35;

          if (dist < eventHorizon) {
            // Absolute black - nothing escapes
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
          } else {
            // Photon sphere - gravitational lensing effect
            float photonDist = dist - eventHorizon;

            // Intense blue-shifted light from gravitational lensing
            float intensity = 1.0 / (photonDist * photonDist * 10.0);
            intensity = clamp(intensity, 0.0, 1.0);

            // Doppler shift - approaching side bluer, receding redder
            float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
            float doppler = sin(angle - time * 0.5) * 0.5 + 0.5;

            vec3 blueShift = vec3(0.4, 0.6, 1.0);
            vec3 redShift = vec3(1.0, 0.5, 0.3);
            vec3 color = mix(blueShift, redShift, doppler);

            // Add subtle noise for realism
            float noise = fract(sin(dot(vUv * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
            intensity += noise * 0.05;

            gl_FragColor = vec4(color * intensity, intensity);
          }
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    }),
    []
  )

  // High-quality accretion disk shader
  const accretionDiskShader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vNoise;

        // Simplex noise function for disk variation
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vUv = uv;
          vPosition = position;
          vNoise = snoise(uv * 5.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vNoise;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);

          // Inner and outer radius
          float innerRadius = 0.15;
          float outerRadius = 0.5;

          if (dist > innerRadius && dist < outerRadius) {
            // Keplerian motion - faster near center
            float orbitalSpeed = 1.0 / sqrt(dist);
            float rotatingAngle = angle - time * orbitalSpeed * 0.5;

            // Multiple spiral arms with turbulence
            float spirals = sin(rotatingAngle * 12.0 + dist * 30.0) * 0.5 + 0.5;
            float turbulence = vNoise * 0.3;
            spirals += turbulence;

            // Temperature gradient - Planck radiation
            // Hot inner (blue-white), cool outer (red-orange)
            float temperature = 1.0 - ((dist - innerRadius) / (outerRadius - innerRadius));

            vec3 hotColor = vec3(1.0, 0.95, 0.9);    // Almost white
            vec3 mediumColor = vec3(1.0, 0.7, 0.3);  // Orange
            vec3 coolColor = vec3(0.8, 0.3, 0.1);    // Deep red

            vec3 color;
            if (temperature > 0.5) {
              color = mix(mediumColor, hotColor, (temperature - 0.5) * 2.0);
            } else {
              color = mix(coolColor, mediumColor, temperature * 2.0);
            }

            // Spiral density variations
            float density = spirals * (0.5 + temperature * 0.5);

            // Edge falloff for smooth blending
            float innerFade = smoothstep(innerRadius, innerRadius + 0.05, dist);
            float outerFade = smoothstep(outerRadius, outerRadius - 0.1, dist);
            float edgeFade = innerFade * outerFade;

            float alpha = density * edgeFade * 0.9;

            // Boost brightness in hot regions
            color *= (1.0 + temperature * 2.0);

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

    // Rotate accretion disk with Keplerian motion
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z = t * 0.3
      ;(accretionDiskRef.current.material as THREE.ShaderMaterial).uniforms.time.value = t
    }

    // Rotate secondary glow layer at different speed for depth
    if (glowRef.current) {
      glowRef.current.rotation.z = t * 0.2
      ;(glowRef.current.material as THREE.ShaderMaterial).uniforms.time.value = t * 0.8
    }

    // Update black hole shader for Doppler shift animation
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
      {/* Black hole core with event horizon - HIGH POLY SPHERE */}
      <mesh ref={blackHoleRef}>
        <sphereGeometry args={[size * 0.8, 128, 128]} />
        <shaderMaterial
          {...blackHoleShader}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Accretion disk - HIGH POLY RING with subdivision */}
      <mesh ref={accretionDiskRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[size * 1.5, size * 5, 256, 64]} />
        <shaderMaterial
          {...accretionDiskShader}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary glow layer for depth */}
      <mesh ref={glowRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[size * 1.8, size * 4.5, 128, 32]} />
        <shaderMaterial
          {...accretionDiskShader}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Particle system - Enhanced */}
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
          size={0.2}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Outer glow/photon sphere */}
      <mesh>
        <sphereGeometry args={[size * 1.2, 128, 128]} />
        <meshBasicMaterial
          color={0x6699ff}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
