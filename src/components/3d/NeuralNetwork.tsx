'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NeuralNetworkProps {
  position?: [number, number, number]
  size?: number
  nodeCount?: number
}

export default function NeuralNetwork({
  position = [0, 0, -20],
  size = 10,
  nodeCount = 150
}: NeuralNetworkProps) {
  const nodesRef = useRef<THREE.Points>(null)
  const connectionsRef = useRef<THREE.LineSegments>(null)
  const pulseRef = useRef<THREE.Points>(null)

  // Generate random node positions in 3D space
  const { nodePositions, connections, nodeData } = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3)
    const scales = new Float32Array(nodeCount)
    const phases = new Float32Array(nodeCount)
    const connectionPairs: number[] = []
    const nodePos: THREE.Vector3[] = []

    // Create nodes in a spherical distribution
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = size * (0.5 + Math.random() * 0.5)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi) - 20

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      nodePos.push(new THREE.Vector3(x, y, z))

      // Random scale and animation phase for each node
      scales[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random() * Math.PI * 2
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodeCount; i++) {
      const pos1 = nodePos[i]

      // Connect to 3-7 nearby nodes
      const connectionCount = 3 + Math.floor(Math.random() * 5)
      const distances: { index: number; distance: number }[] = []

      for (let j = 0; j < nodeCount; j++) {
        if (i !== j) {
          const distance = pos1.distanceTo(nodePos[j])
          distances.push({ index: j, distance })
        }
      }

      // Sort by distance and connect to nearest
      distances.sort((a, b) => a.distance - b.distance)
      for (let k = 0; k < Math.min(connectionCount, distances.length); k++) {
        const j = distances[k].index
        // Only add connection if it doesn't already exist
        const exists = connectionPairs.some((_, idx) =>
          idx % 2 === 0 &&
          ((connectionPairs[idx] === i && connectionPairs[idx + 1] === j) ||
           (connectionPairs[idx] === j && connectionPairs[idx + 1] === i))
        )
        if (!exists) {
          connectionPairs.push(i, j)
        }
      }
    }

    return {
      nodePositions: positions,
      nodeData: { scales, phases },
      connections: connectionPairs
    }
  }, [nodeCount, size])

  // Create connection line geometry
  const connectionGeometry = useMemo(() => {
    const positions = new Float32Array(connections.length * 3)

    for (let i = 0; i < connections.length; i++) {
      const nodeIndex = connections[i]
      positions[i * 3] = nodePositions[nodeIndex * 3]
      positions[i * 3 + 1] = nodePositions[nodeIndex * 3 + 1]
      positions[i * 3 + 2] = nodePositions[nodeIndex * 3 + 2]
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    return geometry
  }, [nodePositions, connections])

  // Shader for pulsing nodes
  const nodeShader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x00d4ff) }, // Cyan
        color2: { value: new THREE.Color(0xff00ff) }, // Magenta
        color3: { value: new THREE.Color(0xffaa00) }, // Orange
      },
      vertexShader: `
        uniform float time;
        attribute float scale;
        attribute float phase;
        varying vec3 vColor;

        void main() {
          // Pulsing animation
          float pulse = sin(time * 2.0 + phase) * 0.5 + 0.5;
          float finalScale = scale * (0.8 + pulse * 0.4);

          // Color variation based on position and phase
          float colorMix = sin(phase + time * 0.5) * 0.5 + 0.5;
          vec3 col1 = vec3(0.0, 0.83, 1.0); // Cyan
          vec3 col2 = vec3(1.0, 0.0, 1.0); // Magenta
          vec3 col3 = vec3(1.0, 0.67, 0.0); // Orange

          vColor = mix(mix(col1, col2, colorMix), col3, pulse * 0.3);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = finalScale * 50.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          // Circular point shape with glow
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);

          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);

          vec3 finalColor = vColor * (0.5 + glow * 0.5);
          gl_FragColor = vec4(finalColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }),
    []
  )

  // Connection line material
  const connectionMaterial = useMemo(
    () => new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      opacity: 0.15,
      transparent: true,
      blending: THREE.AdditiveBlending
    }),
    []
  )

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime

    // Update node shader time
    if (nodesRef.current) {
      const material = nodesRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value = time
    }

    // Gently rotate the entire network
    if (nodesRef.current && connectionsRef.current) {
      const rotation = time * 0.05
      nodesRef.current.rotation.y = rotation
      connectionsRef.current.rotation.y = rotation
      nodesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
      connectionsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
    }

    // Pulse connections opacity
    if (connectionsRef.current) {
      const material = connectionsRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.1 + Math.sin(time * 0.5) * 0.05
    }
  })

  return (
    <group position={position}>
      {/* Neural network nodes */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodeCount}
            array={nodePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-scale"
            count={nodeCount}
            array={nodeData.scales}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-phase"
            count={nodeCount}
            array={nodeData.phases}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          attach="material"
          {...nodeShader}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={connectionsRef}>
        <primitive object={connectionGeometry} attach="geometry" />
        <primitive object={connectionMaterial} attach="material" />
      </lineSegments>

      {/* Ambient glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[size * 0.8, 32, 32]} />
        <meshBasicMaterial
          color={0x00d4ff}
          opacity={0.03}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
