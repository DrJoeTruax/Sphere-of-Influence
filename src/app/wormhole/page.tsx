"use client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useEffect, useRef, useState, useMemo, createContext, useContext } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useRouter } from "next/navigation";

// Create context for view mode
const ViewModeContext = createContext<{
  viewMode: "hub" | "system" | "traversing";
  setViewMode: (mode: "hub" | "system" | "traversing") => void;
  selectedSystem: number;
  setSelectedSystem: (system: number) => void;
  displayVisible: boolean;
  setDisplayVisible: (visible: boolean) => void;
  traversalProgress: number;
  setTraversalProgress: (progress: number) => void;
  sourceSystem: number;
  setSourceSystem: (system: number) => void;
  destinationSystem: number;
  setDestinationSystem: (system: number) => void;
}>({
  viewMode: "hub",
  setViewMode: () => {},
  selectedSystem: 0,
  setSelectedSystem: () => {},
  displayVisible: true,
  setDisplayVisible: () => {},
  traversalProgress: 0,
  setTraversalProgress: () => {},
  sourceSystem: 0,
  setSourceSystem: () => {},
  destinationSystem: 0,
  setDestinationSystem: () => {},
});

// Nebula shader material for volumetric clouds
const NebulaMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color("#1a0b2e"),
    color2: new THREE.Color("#6b1fb1"),
    color3: new THREE.Color("#ff6b35"),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vec3 pos = vPosition * 0.0008 + vec3(time * 0.015);
      float n = snoise(pos);
      float n2 = snoise(pos * 2.5 + vec3(100.0));
      float n3 = snoise(pos * 0.8);
      float n4 = snoise(pos * 4.0 + vec3(50.0));

      float cloud = (n + n2 * 0.6 + n3 * 0.8 + n4 * 0.3) / 2.7;
      cloud = smoothstep(0.15, 0.85, cloud);

      vec3 color = mix(color1, color2, cloud);
      color = mix(color, color3, smoothstep(0.5, 1.0, cloud));

      float edgeFade = smoothstep(0.0, 0.3, cloud) * smoothstep(1.0, 0.7, cloud);
      float alpha = cloud * 0.6 * (0.8 + edgeFade * 0.2);

      gl_FragColor = vec4(color, alpha);
    }
  `
);

// ENHANCED Wormhole shader material with better visuals
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
  // Fragment shader with improved effects
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

    // Better noise function
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
      // Radial coordinates
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float radius = length(vUv - 0.5) * 2.0;

      // Multiple spiral patterns
      float spiral1 = sin(angle * 12.0 + time * 3.0 - radius * 15.0) * 0.5 + 0.5;
      float spiral2 = sin(angle * 8.0 - time * 2.5 + radius * 10.0) * 0.5 + 0.5;
      float spiral3 = sin(angle * 16.0 + time * 4.0 - radius * 20.0) * 0.5 + 0.5;

      // Tunnel effect with pulsing
      float tunnel = 1.0 - smoothstep(0.0, 0.6, radius);
      float pulse = sin(time * 3.0) * 0.2 + 0.8;
      tunnel *= pulse;

      // Moving rings
      float rings = sin(vUv.y * 40.0 - time * 8.0) * 0.5 + 0.5;
      rings *= sin(vUv.x * 40.0 + time * 6.0) * 0.5 + 0.5;

      // Energy particles
      vec3 noiseCoord = vec3(vUv * 10.0, time * 0.5);
      float particles = noise(noiseCoord);
      particles = pow(particles, 3.0);

      // Lightning bolts
      float lightning = noise(vec3(vUv * 20.0, time * 2.0));
      lightning = smoothstep(0.85, 0.95, lightning);

      // Combine patterns
      float pattern = spiral1 * 0.4 + spiral2 * 0.3 + spiral3 * 0.3;
      pattern = pattern * tunnel * (0.7 + rings * 0.3);
      pattern += particles * 0.4 + lightning * 0.8;

      // Color mixing with three colors
      vec3 color = mix(color1, color2, pattern);
      color = mix(color, color3, smoothstep(0.4, 0.8, pattern));

      // Add bright highlights
      color += vec3(1.0) * lightning * 0.5;
      color += vec3(particles) * color1 * 0.3;

      // Edge glow
      float edge = smoothstep(0.5, 0.6, radius);
      float glow = (1.0 - edge) * tunnel;

      // Enhanced alpha with pulsing edges
      float alpha = tunnel * (0.7 + pattern * 0.3) * intensity;
      alpha += glow * 0.3;

      // Don't fade out center completely - keep walls visible from inside
      float centerFade = mix(0.4, 1.0, 1.0 - smoothstep(0.4, 0.65, radius));
      alpha *= centerFade;

      // Fresnel effect for rim lighting
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
      color += fresnel * color2 * 0.5;
      alpha += fresnel * 0.2;

      gl_FragColor = vec4(color, alpha);
    }
  `
);

function EnhancedStarfield({ count = 3000, radius = 5000 }) {
  const closeStarsRef = useRef<THREE.Points>(null);

  const [closeStars, farStars, heroStars] = useMemo(() => {
    const close = new Float32Array(count * 3);
    const closeColors = new Float32Array(count * 3);

    const far = new Float32Array(count * 2 * 3);

    const hero = new Float32Array(50 * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const r = radius * 0.6 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      close[i] = r * Math.sin(phi) * Math.cos(theta);
      close[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      close[i + 2] = r * Math.cos(phi);

      const temp = Math.random();
      closeColors[i] = 0.6 + temp * 0.4;
      closeColors[i + 1] = 0.7 + temp * 0.3;
      closeColors[i + 2] = 0.9 + temp * 0.1;
    }

    for (let i = 0; i < count * 2 * 3; i += 3) {
      const r = radius * (0.8 + Math.random() * 0.2);
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      far[i] = r * Math.sin(phi) * Math.cos(theta);
      far[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      far[i + 2] = r * Math.cos(phi);
    }

    for (let i = 0; i < 50 * 3; i += 3) {
      const r = radius * 0.7 * Math.random();
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      hero[i] = r * Math.sin(phi) * Math.cos(theta);
      hero[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      hero[i + 2] = r * Math.cos(phi);
    }

    return [
      { positions: close, colors: closeColors },
      { positions: far },
      { positions: hero }
    ];
  }, [count, radius]);

  return (
    <>
      <points ref={closeStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={closeStars.positions.length / 3}
            array={closeStars.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={closeStars.colors.length / 3}
            array={closeStars.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={farStars.positions.length / 3}
            array={farStars.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          color="#7a9dcc"
          sizeAttenuation
          transparent
          opacity={0.4}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={heroStars.positions.length / 3}
            array={heroStars.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={6}
          color="#ffffff"
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>
    </>
  );
}

function NebulaCloud({ position, scale, colors }: {
  position: [number, number, number];
  scale: number;
  colors: [string, string, string];
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial & { uniforms: { time: { value: number } } };
      material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1000, 64, 64]} />
      <primitive
        object={new NebulaMaterial()}
        attach="material"
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms-color1-value={new THREE.Color(colors[0])}
        uniforms-color2-value={new THREE.Color(colors[1])}
        uniforms-color3-value={new THREE.Color(colors[2])}
      />
    </mesh>
  );
}

// EPIC wormhole tunnel with twists, turns, and immersive interior view
function EpicWormholeTunnel() {
  const tunnelRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial & { uniforms: { time: { value: number }; intensity: { value: number } } } | null>(null);

  const tubeGeometry = useMemo(() => {
    // Create an EPIC twisting, turning path through space!
    const points: THREE.Vector3[] = [];
    const segments = 50;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const z = -t * 600; // Total distance

      // Spiral with varying radius and multiple frequencies
      const spiralRadius = 30 + Math.sin(t * Math.PI * 4) * 20;
      const spiralAngle = t * Math.PI * 8; // Multiple rotations

      // Add some serpentine motion
      const serpentine = Math.sin(t * Math.PI * 6) * 15;

      // Combine movements for complex path
      const x = Math.cos(spiralAngle) * spiralRadius + serpentine;
      const y = Math.sin(spiralAngle) * spiralRadius + Math.cos(t * Math.PI * 5) * 10;

      points.push(new THREE.Vector3(x, y, z));
    }

    const path = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    // Larger radius (12) so it's comfortable to travel through from inside
    return new THREE.TubeGeometry(path, 200, 12.0, 32, false);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.intensity.value = 2.5 + Math.sin(state.clock.elapsedTime * 5) * 0.5;
    }
  });

  return (
    <mesh ref={tunnelRef} geometry={tubeGeometry}>
      <primitive
        ref={materialRef}
        object={new WormholeMaterial()}
        attach="material"
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms-intensity-value={2.5}
      />
    </mesh>
  );
}

// Energy rings that mark progress through the wormhole
function EnergyRings() {
  const ringsRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    const ringPositions: THREE.Vector3[] = [];
    const segments = 50;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const z = -t * 600;

      const spiralRadius = 30 + Math.sin(t * Math.PI * 4) * 20;
      const spiralAngle = t * Math.PI * 8;
      const serpentine = Math.sin(t * Math.PI * 6) * 15;

      const x = Math.cos(spiralAngle) * spiralRadius + serpentine;
      const y = Math.sin(spiralAngle) * spiralRadius + Math.cos(t * Math.PI * 5) * 10;

      // Place rings every 5 segments
      if (i % 5 === 0) {
        ringPositions.push(new THREE.Vector3(x, y, z));
      }
    }

    return ringPositions;
  }, []);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.2;
        ring.scale.setScalar(scale);
      });
    }
  });

  return (
    <group ref={ringsRef}>
      {rings.map((pos, i) => (
        <mesh key={i} position={pos}>
          <torusGeometry args={[13, 0.5, 16, 32]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Speed lines/particles rushing past the camera
function SpeedLines() {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute around the tunnel
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 8;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = -Math.random() * 600; // Distributed along path

      velocities[i] = 2 + Math.random() * 3;
    }

    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;

        // Move particles backward (camera moves forward, so relative motion)
        positions[i3 + 2] += particles.velocities[i];

        // Reset particles that go behind camera
        if (positions[i3 + 2] > 50) {
          positions[i3 + 2] = -600;

          const angle = Math.random() * Math.PI * 2;
          const radius = 5 + Math.random() * 8;
          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = Math.sin(angle) * radius;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#ffffff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// EPIC Camera controller that flies THROUGH the wormhole
function WormholeTraversalCamera({ onComplete }: { onComplete: () => void }) {
  const { camera } = useThree();
  const { setTraversalProgress } = useContext(ViewModeContext);
  const hasStarted = useRef(false);
  const pathRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const rollOffsetRef = useRef(0);

  // Create the same path that the tunnel uses
  useEffect(() => {
    if (!pathRef.current) {
      const points: THREE.Vector3[] = [];
      const segments = 50;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const z = -t * 600;

        const spiralRadius = 30 + Math.sin(t * Math.PI * 4) * 20;
        const spiralAngle = t * Math.PI * 8;
        const serpentine = Math.sin(t * Math.PI * 6) * 15;

        const x = Math.cos(spiralAngle) * spiralRadius + serpentine;
        const y = Math.sin(spiralAngle) * spiralRadius + Math.cos(t * Math.PI * 5) * 10;

        points.push(new THREE.Vector3(x, y, z));
      }

      pathRef.current = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    }
  }, []);

  useEffect(() => {
    // Start traversal animation
    if (!hasStarted.current && pathRef.current) {
      hasStarted.current = true;

      // Set initial position at the start of the path
      const startPos = pathRef.current.getPoint(0);
      camera.position.copy(startPos);

      // Widen FOV for speed effect
      gsap.to(camera, {
        fov: 95,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.updateProjectionMatrix();
        }
      });

      // Animate progress from 0 to 1 over 8 seconds
      gsap.to({ progress: 0 }, {
        progress: 1,
        duration: 8,
        ease: "power1.inOut",
        onUpdate: function() {
          const progress = this.targets()[0].progress;
          setTraversalProgress(progress);
        },
        onComplete: () => {
          // Return to normal FOV before arriving
          gsap.to(camera, {
            fov: 70,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
              camera.updateProjectionMatrix();
            },
            onComplete: () => {
              onComplete();
            }
          });
        }
      });
    }
  }, [camera, onComplete, setTraversalProgress]);

  useFrame((state) => {
    if (!pathRef.current || !hasStarted.current) return;

    // Calculate progress based on elapsed time (8 seconds total)
    const elapsed = state.clock.elapsedTime;
    const progress = Math.min(elapsed / 8, 1);

    // Get position along the path
    const currentPos = pathRef.current.getPoint(progress);
    camera.position.copy(currentPos);

    // Look ahead along the path
    const lookAheadProgress = Math.min(progress + 0.05, 1);
    const lookAtPos = pathRef.current.getPoint(lookAheadProgress);
    camera.lookAt(lookAtPos);

    // Add barrel roll effect for dramatic flair
    // More intense rolls during the middle of the journey
    const rollIntensity = Math.sin(progress * Math.PI); // Peak in middle
    rollOffsetRef.current += rollIntensity * 0.03;

    // Apply roll rotation
    camera.rotation.z = Math.sin(rollOffsetRef.current) * 0.3 + Math.sin(progress * Math.PI * 3) * 0.15;

    // Add subtle camera shake for intensity
    if (progress > 0.3 && progress < 0.9) {
      const shake = (Math.random() - 0.5) * 0.05;
      camera.position.x += shake;
      camera.position.y += shake;
    }
  });

  return null;
}

function WormholeScene() {
  const router = useRouter();
  const { viewMode } = useContext(ViewModeContext); // Removed setViewMode since we start in traversing mode

  const handleTraversalComplete = () => {
    // Navigate to Earth (hub page)
    setTimeout(() => {
      router.push('/hub');
    }, 500);
  };

  return (
    <>
      <EnhancedStarfield />

      {/* Distant nebula clouds for atmosphere */}
      <NebulaCloud position={[0, 800, -3500]} scale={2.5} colors={["#1a0b2e", "#6b1fb1", "#ff6b35"]} />
      <NebulaCloud position={[2500, 600, -2500]} scale={2} colors={["#2d1b3d", "#8b4a8f", "#ff6b9d"]} />
      <NebulaCloud position={[-2500, 400, -2000]} scale={2.2} colors={["#0d1b2a", "#3d4965", "#8fa8d3"]} />

      {/* The EPIC twisting wormhole tunnel */}
      <EpicWormholeTunnel />

      {/* Energy rings marking progress */}
      <EnergyRings />

      {/* Speed lines rushing past */}
      <SpeedLines />

      {/* Camera flies through the wormhole */}
      {viewMode === "traversing" && (
        <WormholeTraversalCamera onComplete={handleTraversalComplete} />
      )}

      {/* Lighting for the scene */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#00d4ff" />
      <pointLight position={[0, 0, -300]} intensity={2} color="#ff00ff" />

      {/* Fog for depth */}
      <fog attach="fog" args={["#000000", 100, 800]} />
    </>
  );
}

export default function WormholePage() {
  const [viewMode, setViewMode] = useState<"hub" | "system" | "traversing">("traversing"); // Start in traversing mode immediately
  const [selectedSystem, setSelectedSystem] = useState(0);
  const [displayVisible, setDisplayVisible] = useState(true);
  const [traversalProgress, setTraversalProgress] = useState(0);
  const [sourceSystem, setSourceSystem] = useState(0);
  const [destinationSystem, setDestinationSystem] = useState(0);

  return (
    <div className="h-screen w-full" style={{ backgroundColor: "#000000" }}>
      {/* Initial loading message */}
      {traversalProgress === 0 && viewMode === "traversing" && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          color: '#00ffff',
          fontFamily: "'Orbitron', monospace",
          fontSize: '28px',
          fontWeight: 'bold',
          textShadow: '0 0 30px #00ffff, 0 0 60px #00ffff',
          textAlign: 'center',
        }}>
          <div style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
            ⚡ INITIALIZING WORMHOLE ⚡
          </div>
        </div>
      )}

      {/* Traversal UI Overlay with dynamic messages */}
      {viewMode === "traversing" && traversalProgress > 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          color: '#00ffff',
          fontFamily: "'Orbitron', monospace",
          fontSize: '36px',
          fontWeight: 'bold',
          textShadow: '0 0 30px #00ffff, 0 0 60px #00ffff',
          textAlign: 'center',
        }}>
          <div style={{
            marginBottom: '20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            {traversalProgress < 0.3 && 'ENTERING WORMHOLE'}
            {traversalProgress >= 0.3 && traversalProgress < 0.7 && 'TRAVERSING SPACETIME'}
            {traversalProgress >= 0.7 && 'APPROACHING EARTH'}
          </div>
          <div style={{
            fontSize: '24px',
            color: '#ff00ff',
            textShadow: '0 0 20px #ff00ff'
          }}>
            {Math.round(traversalProgress * 100)}% COMPLETE
          </div>

          {/* Speed indicator */}
          <div style={{
            marginTop: '30px',
            fontSize: '16px',
            color: '#ffaa00',
            textShadow: '0 0 15px #ffaa00',
            opacity: 0.8
          }}>
            {traversalProgress < 0.5 && '⚡ ACCELERATING'}
            {traversalProgress >= 0.5 && traversalProgress < 0.9 && '🌀 MAXIMUM VELOCITY'}
            {traversalProgress >= 0.9 && '🛬 DECELERATING'}
          </div>
        </div>
      )}

      <Canvas
        camera={{ fov: 70, near: 0.1, far: 10000 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <ViewModeContext.Provider value={{
          viewMode,
          setViewMode,
          selectedSystem,
          setSelectedSystem,
          displayVisible,
          setDisplayVisible,
          traversalProgress,
          setTraversalProgress,
          sourceSystem,
          setSourceSystem,
          destinationSystem,
          setDestinationSystem
        }}>
          <color attach="background" args={["#000000"]} />

          <WormholeScene />

          <EffectComposer>
            <Bloom
              intensity={2.0}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              offset={[0.01, 0.01]}
              blendFunction={BlendFunction.NORMAL}
            />
            <Vignette
              offset={0.1}
              darkness={0.9}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </ViewModeContext.Provider>
      </Canvas>
    </div>
  );
}
