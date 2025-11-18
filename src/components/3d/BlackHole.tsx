'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BlackHoleProps {
  position?: [number, number, number]
  size?: number
  interactive?: boolean
}

export default function BlackHole({ position = [0, 0, -20], size = 5, interactive = false }: BlackHoleProps) {
  const blackHoleRef = useRef<THREE.Mesh>(null)
  const accretionDiskRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const jetsRef = useRef<THREE.Group>(null)
  const lensingRef = useRef<THREE.Mesh>(null)

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

  // Relativistic jets shader (polar emissions)
  const jetsShader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 1.5 }
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
        uniform float intensity;
        varying vec2 vUv;
        varying vec3 vPosition;

        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          float dist = length(vUv - vec2(0.5, 0.5));
          float core = smoothstep(0.3, 0.0, dist);

          // Turbulent jet flow
          float turbulence = noise(vUv * 20.0 + time * 0.5);
          turbulence += noise(vUv * 40.0 - time * 0.3) * 0.5;

          // Synchrotron radiation (magnetic field glow)
          vec3 jetColor = mix(
            vec3(0.4, 0.6, 1.0),  // Blue synchrotron
            vec3(1.0, 0.9, 0.7),  // White core
            core
          );

          float alpha = (core + turbulence * 0.3) * intensity;
          alpha *= smoothstep(1.0, 0.2, dist);

          gl_FragColor = vec4(jetColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    }),
    []
  )

  // Gravitational lensing ring (Einstein ring effect)
  const lensingShader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 }
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

          // Einstein ring - light bending at photon sphere
          float ring = smoothstep(0.35, 0.37, dist) * smoothstep(0.42, 0.40, dist);

          // Shimmer effect
          float shimmer = sin(dist * 50.0 - time * 3.0) * 0.5 + 0.5;

          vec3 color = vec3(0.7, 0.8, 1.0) * (0.8 + shimmer * 0.2);
          float alpha = ring * 0.6;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    }),
    []
  )

  // Enhanced particle system with spaghettification
  const particles = useMemo(() => {
    const count = 3000 // Increased particle count
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const lifetimes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Spiral distribution
      const angle = Math.random() * Math.PI * 2
      const radius = 10 + Math.random() * 25

      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = (Math.random() - 0.5) * 8
      positions[i3 + 2] = Math.sin(angle) * radius

      // Initial velocities for orbital motion
      velocities[i3] = -Math.sin(angle) * 0.02
      velocities[i3 + 1] = 0
      velocities[i3 + 2] = Math.cos(angle) * 0.02

      // Temperature-based color (Doppler + temperature)
      const temp = Math.random()
      colors[i3] = temp * 1.0 + (1 - temp) * 0.3
      colors[i3 + 1] = temp * 0.7 + (1 - temp) * 0.5
      colors[i3 + 2] = temp * 0.3 + (1 - temp) * 1.0

      sizes[i] = Math.random() * 0.5 + 0.2
      lifetimes[i] = Math.random()
    }

    return { positions, velocities, colors, sizes, lifetimes }
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

    // Animate jets (pulsing)
    if (jetsRef.current) {
      jetsRef.current.children.forEach((jet) => {
        const material = (jet as THREE.Mesh).material as THREE.ShaderMaterial
        if (material.uniforms) {
          material.uniforms.time.value = t
          material.uniforms.intensity.value = 1.5 + Math.sin(t * 2) * 0.3
        }
      })
    }

    // Animate gravitational lensing ring
    if (lensingRef.current) {
      ;(lensingRef.current.material as THREE.ShaderMaterial).uniforms.time.value = t
    }

    // Enhanced particle physics with realistic infall
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        const z = positions[i + 2]

        const angle = Math.atan2(z, x)
        const radius = Math.sqrt(x * x + z * z)

        // Schwarzschild radius (event horizon at r = 1)
        const schwarzschildRadius = size * 0.2

        // Keplerian velocity: v = sqrt(GM/r)
        const orbitalSpeed = 1 / Math.sqrt(Math.max(radius, 0.1))
        const infalSpeed = 0.05 / Math.max(radius * radius, 0.01)

        // Spiral inward with orbital motion
        const newRadius = radius - infalSpeed
        const newAngle = angle - orbitalSpeed * 0.02

        // Time dilation effect near event horizon
        const timeDilation = Math.max(0, 1 - schwarzschildRadius / radius)

        if (newRadius < schwarzschildRadius) {
          // Particle crossed event horizon - reset to outer edge
          const resetAngle = Math.random() * Math.PI * 2
          const resetRadius = 30 + Math.random() * 5
          positions[i] = Math.cos(resetAngle) * resetRadius
          positions[i + 1] = (Math.random() - 0.5) * 8
          positions[i + 2] = Math.sin(resetAngle) * resetRadius

          // Reset color
          const temp = Math.random()
          colors[i] = temp * 1.0 + (1 - temp) * 0.3
          colors[i + 1] = temp * 0.7 + (1 - temp) * 0.5
          colors[i + 2] = temp * 0.3 + (1 - temp) * 1.0
        } else {
          // Update position
          positions[i] = Math.cos(newAngle) * newRadius
          positions[i + 2] = Math.sin(newAngle) * newRadius

          // Spaghettification - particles stretch vertically near horizon
          const stretchFactor = 1 + (1 / (radius * radius)) * 0.5
          positions[i + 1] = y * timeDilation * stretchFactor

          // Gravitational redshift - particles get redder as they approach
          const redshift = 1 - timeDilation
          colors[i] = Math.min(1, colors[i] + redshift * 0.3)
          colors[i + 1] = colors[i + 1] * (1 - redshift * 0.5)
          colors[i + 2] = colors[i + 2] * (1 - redshift * 0.7)
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.geometry.attributes.color.needsUpdate = true
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

      {/* Gravitational lensing ring (Einstein ring) */}
      <mesh ref={lensingRef}>
        <sphereGeometry args={[size * 1.1, 128, 128]} />
        <shaderMaterial
          {...lensingShader}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Relativistic jets from poles */}
      <group ref={jetsRef}>
        {/* North pole jet */}
        <mesh position={[0, size * 2, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[size * 0.3, size * 0.8, size * 8, 32, 1, true]} />
          <shaderMaterial
            {...jetsShader}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* South pole jet */}
        <mesh position={[0, -size * 2, 0]} rotation={[0, 0, Math.PI]}>
          <cylinderGeometry args={[size * 0.3, size * 0.8, size * 8, 32, 1, true]} />
          <shaderMaterial
            {...jetsShader}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

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
