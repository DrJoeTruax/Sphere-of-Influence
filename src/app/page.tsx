'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import EarthScene from '@/components/3d/EarthScene'
import { detectUserLanguage, translate, LANGUAGES } from '@/utils/languages'

type JourneyPhase = 'LANDING' | 'ENTERING' | 'TRAVERSING' | 'HOPE' | 'APPROACHING' | 'ARRIVED'

// Main Glowing Sphere (Neural Network representation)
function GlowingSphere({ phase }: { phase: JourneyPhase }) {
  const groupRef = useRef<THREE.Group>(null)
  const expansionStart = useRef<number | null>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (!groupRef.current) return

    // Gentle rotation during landing
    if (phase === 'LANDING') {
      groupRef.current.rotation.y += 0.0008
      groupRef.current.rotation.x += 0.0003
    }

    // Expand during entering phase
    if (phase === 'ENTERING') {
      if (expansionStart.current === null) {
        expansionStart.current = time
      }

      const elapsed = time - expansionStart.current
      const expansionProgress = Math.min(elapsed / 2, 1) // 2 second expansion
      const eased = 1 - Math.pow(1 - expansionProgress, 3)

      // Expand from normal size to 3x size
      const scale = 1 + eased * 2
      groupRef.current.scale.setScalar(scale)

      // Increase rotation speed
      groupRef.current.rotation.y += 0.002 * (1 + eased * 2)
      groupRef.current.rotation.x += 0.001 * (1 + eased * 2)
    }
  })

  if (phase !== 'LANDING' && phase !== 'ENTERING') return null

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main white/cyan glowing sphere */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          emissive="#66ccff"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Outer cyan glow */}
      <mesh>
        <sphereGeometry args={[60, 32, 32]} />
        <meshBasicMaterial
          color="#66ccff"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Inner blue sphere */}
      <mesh>
        <sphereGeometry args={[35, 32, 32]} />
        <meshPhongMaterial
          color="#1a5c9f"
          emissive="#0d3a6d"
          shininess={50}
        />
      </mesh>

      {/* Grid overlay */}
      <mesh>
        <sphereGeometry args={[35, 16, 16]} />
        <meshBasicMaterial
          color="#66ccff"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

// Wormhole with particles (mid-distance)
function WormholeWithParticles({ phase }: { phase: JourneyPhase }) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Generate wormhole particles
  const { positions, colors } = React.useMemo(() => {
    const particleCount = 5000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radiusVariation = Math.random()
      const diskRadiusInner = 5
      const diskRadiusOuter = 25
      const particleRadius = diskRadiusInner + (diskRadiusOuter - diskRadiusInner) * radiusVariation
      const zOffset = (Math.random() - 0.5) * 25
      const depthOffset = Math.random() * 150

      positions[i * 3] = Math.cos(angle) * particleRadius
      positions[i * 3 + 1] = zOffset
      positions[i * 3 + 2] = Math.sin(angle) * particleRadius - depthOffset

      // Heat coloring
      const heatFactor = 1 - radiusVariation * 0.6
      let hue
      if (heatFactor > 0.7) hue = 0.08
      else if (heatFactor > 0.4) hue = 0.05
      else hue = 0

      const col = new THREE.Color().setHSL(hue, 1, Math.min(1, heatFactor * 1.5))
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    return { positions, colors }
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.01
    }
  })

  return (
    <group ref={groupRef} position={[-120, 30, -200]}>
      {/* Wormhole particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={5000}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={5000}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          vertexColors
          transparent
          opacity={0.85}
        />
      </points>

      {/* Photon sphere (blue glow) */}
      <mesh>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial
          color="#6699ff"
          transparent
          opacity={0.5}
          emissive="#3366ff"
        />
      </mesh>

      {/* Event horizon (black center) */}
      <mesh>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  )
}

// Connection tunnel (curved cyan line)
function ConnectionTunnel() {
  const tunnelPoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-60, 15, -100),
    new THREE.Vector3(-120, 30, -200), // Wormhole
    new THREE.Vector3(-200, 60, -300),
    new THREE.Vector3(-350, 100, -400), // Solar system
  ]

  const curve = React.useMemo(() => new THREE.CatmullRomCurve3(tunnelPoints), [])
  const points = React.useMemo(() => curve.getPoints(150), [curve])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#66ccff"
        transparent
        opacity={0.6}
      />
    </line>
  )
}

// Background stars
function BackgroundStars() {
  const positions = React.useMemo(() => {
    const pos = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000 * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 2000
      pos[i + 1] = (Math.random() - 0.5) * 2000
      pos[i + 2] = (Math.random() - 0.5) * 2000
    }
    return pos
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={1.5} />
    </points>
  )
}

// Landing Page UI
function LandingUI({ onMapValues }: { onMapValues: () => void }) {
  const [lang, setLang] = useState('en')
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [isPulling, setIsPulling] = useState(false)

  useEffect(() => {
    const detectedLang = detectUserLanguage()
    setLang(detectedLang)
  }, [])

  const handleButtonClick = () => {
    setIsPulling(true)
    // Wait for animation to complete before starting journey
    setTimeout(() => {
      onMapValues()
    }, 1500)
  }

  return (
    <>
      {/* Language Selector */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-500/20 backdrop-blur-xl border border-blue-500/50 rounded text-blue-300 hover:bg-blue-500/30 transition-all"
      >
        🌍 {LANGUAGES.find(l => l.code === lang)?.nativeName || 'English'}
      </motion.button>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguageSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setShowLanguageSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-4xl w-full border border-gray-800/50 max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Select Your Language
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setLang(language.code)
                      localStorage.setItem('breakthrough_language', language.code)
                      setShowLanguageSelector(false)
                    }}
                    className={`p-4 rounded-lg text-left transition-all ${
                      lang === language.code
                        ? 'bg-blue-600/80 border-2 border-blue-400'
                        : 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60'
                    }`}
                  >
                    <div className="font-semibold">{language.nativeName}</div>
                    <div className="text-xs text-gray-400 mt-1">{language.name}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isPulling ? 0 : 1,
            y: isPulling ? -100 : 0,
            scale: isPulling ? 0.1 : 1
          }}
          transition={{ duration: isPulling ? 1 : 0.8, delay: isPulling ? 0 : 0.3 }}
          className="text-5xl md:text-6xl font-light tracking-wide mb-5 drop-shadow-[0_0_30px_rgba(102,153,255,0.5)]"
        >
          {translate('heroTitle', lang)}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isPulling ? 0 : 1,
            y: isPulling ? -80 : 0,
            scale: isPulling ? 0.1 : 1
          }}
          transition={{ duration: isPulling ? 1 : 0.8, delay: isPulling ? 0.1 : 0.5 }}
          className="text-2xl md:text-3xl font-light tracking-wide mb-5 text-gray-300"
        >
          {translate('heroSubtitle', lang)}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isPulling ? 0 : 1,
            y: isPulling ? -60 : 0,
            scale: isPulling ? 0.1 : 1
          }}
          transition={{ duration: isPulling ? 1 : 0.8, delay: isPulling ? 0.2 : 0.7 }}
          className="text-base md:text-lg leading-relaxed text-gray-400 mb-10 max-w-xl"
        >
          {translate('heroDescription', lang)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isPulling ? 0 : 1,
            scale: isPulling ? 0.1 : 1,
            y: isPulling ? -40 : 0
          }}
          transition={{ duration: isPulling ? 1 : 0.6, delay: isPulling ? 0.3 : 0.9 }}
          className="flex gap-5 pointer-events-auto"
        >
          <button
            onClick={handleButtonClick}
            disabled={isPulling}
            className="px-10 py-3.5 text-sm font-semibold tracking-wider uppercase bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded shadow-[0_0_20px_rgba(0,102,255,0.4)] hover:shadow-[0_0_30px_rgba(0,102,255,0.7)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translate('enterPlatform', lang)}
          </button>
          <button className="px-10 py-3.5 text-sm font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-300 border border-blue-500/50 rounded backdrop-blur-xl hover:bg-blue-500/20 hover:border-blue-500/80 transition-all">
            Why This Matters
          </button>
        </motion.div>
      </div>
    </>
  )
}

// Camera controller for complete journey
function CameraController({ phase, onPhaseComplete }: { phase: JourneyPhase; onPhaseComplete: (newPhase: JourneyPhase) => void }) {
  const { camera } = useThree()
  const startTime = useRef(Date.now())

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000

    switch (phase) {
      case 'LANDING':
        // Static position showing glowing sphere foreground + distant solar system
        camera.position.set(0, 0, 100)
        camera.lookAt(0, 0, 0)
        break

      case 'ENTERING':
        // Move toward glowing sphere (2 seconds)
        const t1 = Math.min(elapsed / 2, 1)
        const eased1 = 1 - Math.pow(1 - t1, 3)
        camera.position.z = 100 - eased1 * 20 // Move from 100 to 80
        camera.lookAt(0, 0, 0)

        if (elapsed > 2) {
          startTime.current = Date.now()
          onPhaseComplete('TRAVERSING')
        }
        break

      case 'TRAVERSING':
        // Fly through tunnel toward wormhole (5 seconds)
        const t2 = Math.min(elapsed / 5, 1)
        const eased2 = 1 - Math.pow(1 - t2, 3)
        // Move from (0, 0, 80) toward wormhole at (-120, 30, -200)
        camera.position.x = -120 * eased2
        camera.position.y = 30 * eased2
        camera.position.z = 80 - 280 * eased2 // Move to -200
        camera.lookAt(-120, 30, -200)

        if (elapsed > 2.5 && elapsed < 3.5) {
          // Show HOPE overlay mid-journey
          onPhaseComplete('HOPE')
        } else if (elapsed > 5) {
          startTime.current = Date.now()
          onPhaseComplete('APPROACHING')
        }
        break

      case 'HOPE':
        // Continue traversing while showing HOPE overlay
        const t3 = Math.min(elapsed / 5, 1)
        const eased3 = 1 - Math.pow(1 - t3, 3)
        camera.position.x = -120 * eased3
        camera.position.y = 30 * eased3
        camera.position.z = 80 - 280 * eased3
        camera.lookAt(-120, 30, -200)

        if (elapsed > 5) {
          startTime.current = Date.now()
          onPhaseComplete('APPROACHING')
        }
        break

      case 'APPROACHING':
        // Enter wormhole and approach solar system (6 seconds)
        const t4 = Math.min(elapsed / 6, 1)
        const eased4 = 1 - Math.pow(1 - t4, 3)
        // Move from wormhole (-120, 30, -200) to near solar system (-350, 100, -420)
        camera.position.x = -120 + (-230) * eased4
        camera.position.y = 30 + 70 * eased4
        camera.position.z = -200 + (-220) * eased4
        camera.lookAt(-350, 100, -400)

        if (elapsed > 6) {
          startTime.current = Date.now()
          onPhaseComplete('ARRIVED')
        }
        break

      case 'ARRIVED':
        // Orbit around Earth in solar system
        const orbitTime = Date.now() / 8000
        const radius = 800 // Large orbit around solar system group
        camera.position.x = -350 + Math.sin(orbitTime) * radius
        camera.position.z = -400 + Math.cos(orbitTime) * radius
        camera.position.y = 100 + Math.sin(orbitTime * 0.5) * 200
        camera.lookAt(-350, 100, -400)
        break
    }
  })

  return null
}

// HOPE Overlay during traversal
function HopeOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold mb-4"
        >
          This is not a game.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl md:text-7xl font-bold"
        >
          This is HOPE.
        </motion.p>
      </div>
    </motion.div>
  )
}

export default function BreakthroughLanding() {
  const router = useRouter()
  const [phase, setPhase] = useState<JourneyPhase>('LANDING')

  const handleMapValues = () => {
    setPhase('ENTERING')
  }

  const handlePhaseComplete = (newPhase: JourneyPhase) => {
    setPhase(newPhase)

    // Navigate to hub selection when arrived
    if (newPhase === 'ARRIVED') {
      setTimeout(() => {
        router.push('/hub')
      }, 3000)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ fov: 75, near: 0.1, far: 10000 }}>
          <Suspense fallback={null}>
            <CameraController phase={phase} onPhaseComplete={handlePhaseComplete} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[50, 50, 100]} intensity={2} color="#6699ff" />

            {/* Background stars */}
            <BackgroundStars />

            {/* Main glowing sphere (foreground) - visible during landing and entering */}
            {(phase === 'LANDING' || phase === 'ENTERING') && (
              <GlowingSphere phase={phase} />
            )}

            {/* Wormhole (mid-distance) - always visible */}
            <WormholeWithParticles phase={phase} />

            {/* Connection tunnel - always visible */}
            <ConnectionTunnel />

            {/* Solar System (tiny, far background) - always there */}
            <group position={[-350, 100, -400]} scale={0.05}>
              <EarthScene
                onCameraAnimationComplete={() => {}}
                showEarthDetails={phase === 'ARRIVED'}
                onHubSelect={(hubId) => router.push(`/hub/${hubId}/role`)}
                cycleIndex={0}
                autoZoom={phase === 'ARRIVED'}
                sceneState={phase === 'ARRIVED' ? 'HUB_SELECTION' : 'LANDING'}
              />
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      {phase === 'LANDING' && <LandingUI onMapValues={handleMapValues} />}

      <AnimatePresence>
        {phase === 'HOPE' && <HopeOverlay />}
      </AnimatePresence>
    </main>
  )
}
