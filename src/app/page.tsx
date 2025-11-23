'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import EarthScene, { type SceneState } from '@/components/3d/EarthScene'
import { detectUserLanguage, translate, LANGUAGES } from '@/utils/languages'

type JourneyPhase = 'LANDING' | 'WORMHOLE_SPAWN' | 'TEXT_PULL' | 'TRAVERSING' | 'HOPE_OVERLAY' | 'APPROACHING' | 'ARRIVED'

// Foreground Landing Page Elements
function ForegroundLandingPage({ phase, onButtonClick }: { phase: JourneyPhase; onButtonClick: () => void }) {
  const [lang, setLang] = useState('en')
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const textRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    // Auto-detect keyboard/system language
    const detectedLang = detectUserLanguage()
    setLang(detectedLang)
  }, [])

  // Text pull effect when wormhole spawns
  useEffect(() => {
    if (phase === 'TEXT_PULL') {
      textRefs.current.forEach((el, index) => {
        if (el) {
          // Animate each text element toward center
          setTimeout(() => {
            el.style.transform = 'translate(-50%, -50%) scale(0.1)'
            el.style.opacity = '0'
          }, index * 100)
        }
      })
    }
  }, [phase])

  if (phase !== 'LANDING' && phase !== 'WORMHOLE_SPAWN' && phase !== 'TEXT_PULL') {
    return null
  }

  return (
    <>
      {/* Language Selector */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowLanguageSelector(!showLanguageSelector)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-lg hover:border-blue-500/50 transition-all"
      >
        🌍 {LANGUAGES.find(l => l.code === lang)?.nativeName || 'English'}
      </motion.button>

      {/* Language Selector Modal */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
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
                    <div className="text-xs text-gray-500">{language.region}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Landing Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center z-10"
      >
        <motion.h1
          ref={(el) => { textRefs.current[0] = el }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl transition-all duration-1000 ease-out"
        >
          {translate('heroTitle', lang)}
        </motion.h1>

        <motion.p
          ref={(el) => { textRefs.current[1] = el }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-2xl md:text-3xl mb-4 max-w-3xl font-light transition-all duration-1000 ease-out"
        >
          {translate('heroSubtitle', lang)}
        </motion.p>

        <motion.p
          ref={(el) => { textRefs.current[2] = el }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-gray-400 mb-12 max-w-xl text-lg transition-all duration-1000 ease-out"
        >
          {translate('heroDescription', lang)}
        </motion.p>

        <motion.button
          ref={(el) => { textRefs.current[3] = el as any }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          onClick={onButtonClick}
          disabled={phase !== 'LANDING'}
          className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-xl font-semibold transition-all duration-300 overflow-hidden shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10">{translate('enterPlatform', lang)}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </motion.section>
    </>
  )
}

// Wormhole Traversal Overlay
function TraversalOverlay({ phase }: { phase: JourneyPhase }) {
  if (phase !== 'HOPE_OVERLAY') return null

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

// Massive Glowing Wormhole/Sphere for Landing Page
function ForegroundGlowingSphere({ phase }: { phase: JourneyPhase }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (meshRef.current) {
      // Gentle pulsing
      const scale = 1 + Math.sin(time * 0.5) * 0.05
      meshRef.current.scale.setScalar(scale * 20) // Make it MASSIVE
    }

    if (glowRef.current) {
      const glowScale = 1 + Math.sin(time * 0.3) * 0.1
      glowRef.current.scale.setScalar(glowScale * 25)
    }

    // Expand and fade when wormhole spawns
    if (phase === 'WORMHOLE_SPAWN' || phase === 'TEXT_PULL') {
      if (meshRef.current) {
        const expandScale = meshRef.current.scale.x * 1.05
        meshRef.current.scale.setScalar(Math.min(expandScale, 50))
      }
    }
  })

  if (phase !== 'LANDING' && phase !== 'WORMHOLE_SPAWN' && phase !== 'TEXT_PULL') {
    return null
  }

  return (
    <group position={[0, -50, 200]}>
      {/* Main glowing sphere - positioned lower and closer so it doesn't block solar system */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ff00ff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Additional pink glow layer */}
      <mesh scale={30}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ff1493"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// Camera Controller for Complete Journey
function JourneyCameraController({ phase, onPhaseComplete }: { phase: JourneyPhase; onPhaseComplete: (newPhase: JourneyPhase) => void }) {
  const { camera } = useThree()
  const startTime = useRef(Date.now())

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000

    switch (phase) {
      case 'LANDING':
        // Static position showing foreground + DISTANT solar system
        camera.position.set(0, 200, 500)
        camera.lookAt(0, 0, -20000) // Look toward distant solar system
        break

      case 'WORMHOLE_SPAWN':
        // Hold for 1 second while wormhole appears
        if (elapsed > 1) {
          startTime.current = Date.now()
          onPhaseComplete('TEXT_PULL')
        }
        break

      case 'TEXT_PULL':
        // Hold for 2 seconds while text gets sucked in
        if (elapsed > 2) {
          startTime.current = Date.now()
          onPhaseComplete('TRAVERSING')
        }
        break

      case 'TRAVERSING':
        // Fly TOWARD the solar system and wormhole (8 seconds)
        const t1 = Math.min(elapsed / 8, 1)
        const eased1 = 1 - Math.pow(1 - t1, 3)

        // Move from foreground (500) all the way to wormhole entrance (-19500)
        camera.position.z = 500 - eased1 * 20000 // From 500 to -19500
        camera.position.y = 200 - eased1 * 190 // Lower down to 10
        camera.lookAt(0, 0, -20000)

        if (t1 >= 0.3 && t1 < 0.5) {
          // Show hope overlay mid-journey
          onPhaseComplete('HOPE_OVERLAY')
        } else if (elapsed > 8) {
          startTime.current = Date.now()
          onPhaseComplete('APPROACHING')
        }
        break

      case 'HOPE_OVERLAY':
        // Continue traversing while showing overlay
        const t2 = Math.min(elapsed / 8, 1)
        const eased2 = 1 - Math.pow(1 - t2, 3)
        camera.position.z = 500 - eased2 * 20000
        camera.position.y = 200 - eased2 * 190
        camera.lookAt(0, 0, -20000)

        if (elapsed > 8) {
          startTime.current = Date.now()
          onPhaseComplete('APPROACHING')
        }
        break

      case 'APPROACHING':
        // Enter the wormhole and emerge at Earth (5 seconds)
        const t3 = Math.min(elapsed / 5, 1)
        const eased3 = 1 - Math.pow(1 - t3, 3)

        // Enter wormhole tunnel, then emerge at Earth
        if (t3 < 0.5) {
          // First half: Enter wormhole (spiraling in)
          const spiralT = t3 * 2
          const spiralAngle = spiralT * Math.PI * 4
          const spiralRadius = 100 * (1 - spiralT)
          camera.position.x = Math.cos(spiralAngle) * spiralRadius
          camera.position.y = 10 + Math.sin(spiralAngle) * spiralRadius * 0.5
          camera.position.z = -19500 - spiralT * 500
          camera.lookAt(0, 0, -20000)
        } else {
          // Second half: Emerge at Earth orbit
          const emergeT = (t3 - 0.5) * 2
          camera.position.z = -20000 + emergeT * 19995 // Emerge to z: -5
          camera.position.y = 10
          camera.position.x = 0
          camera.lookAt(0, 0, 0)
        }

        if (elapsed > 5) {
          onPhaseComplete('ARRIVED')
        }
        break

      case 'ARRIVED':
        // Orbit Earth
        const orbitTime = Date.now() / 10000
        const radius = 15
        camera.position.x = Math.sin(orbitTime) * radius
        camera.position.z = Math.cos(orbitTime) * radius - 5
        camera.position.y = 5
        camera.lookAt(0, 0, 0)
        break
    }
  })

  return null
}

export default function BreakthroughLandingPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<JourneyPhase>('LANDING')

  const handleButtonClick = () => {
    setPhase('WORMHOLE_SPAWN')
  }

  const handlePhaseComplete = (newPhase: JourneyPhase) => {
    setPhase(newPhase)
  }

  const handleHubSelect = (hubId: string) => {
    router.push(`/hub/${hubId}/role`)
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Single Continuous R3F Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ fov: 60, near: 0.1, far: 50000 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            {/* Journey Camera Controller */}
            <JourneyCameraController phase={phase} onPhaseComplete={handlePhaseComplete} />

            {/* Foreground Glowing Sphere (Landing Page) */}
            <ForegroundGlowingSphere phase={phase} />

            {/* Solar System (WAYYYY FAR in background, 12x scale) */}
            <group position={[0, 0, -20000]} scale={12}>
              <EarthScene
                onCameraAnimationComplete={() => {}}
                showEarthDetails={phase === 'ARRIVED'}
                onHubSelect={handleHubSelect}
                cycleIndex={0}
                autoZoom={false}
                sceneState="HUB_SELECTION"
              />
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      <ForegroundLandingPage phase={phase} onButtonClick={handleButtonClick} />
      <TraversalOverlay phase={phase} />
    </main>
  )
}
