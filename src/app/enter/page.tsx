'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { detectUserLanguage, translate, LANGUAGES } from '@/utils/languages'

// Dynamic imports for 3D components
const BlackHole = dynamic(() => import('@/components/3d/BlackHole'), { ssr: false })
const HolographicEarth = dynamic(() => import('@/components/3d/HolographicEarth'), { ssr: false })
const BlackHoleDive = dynamic(() => import('@/components/3d/BlackHoleDive'), { ssr: false })

type EntryState = 'loading' | 'opening' | 'entering' | 'diving'

export default function EnterPage() {
  const router = useRouter()
  const [state, setState] = useState<EntryState>('loading')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [showExplainer, setShowExplainer] = useState(false)
  const [mounted, setMounted] = useState(false)

  const coreMessages = [
    'This is not a game.',
    'This is a human collaboration experiment.',
    'The largest ever.',
    'This is HOPE.'
  ]

  useEffect(() => {
    setMounted(true)
    const detectedLang = detectUserLanguage()
    setSelectedLanguage(detectedLang)
    setTimeout(() => setState('opening'), 1500)
  }, [])

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code)
    if (typeof window !== 'undefined') {
      localStorage.setItem('breakthrough_language', code)
    }
  }

  const handleEnter = () => {
    setState('entering')
    setTimeout(() => {
      setState('diving')
    }, 1500)
  }

  const handleDiveComplete = () => {
    router.push('/wormhole')
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white/60">Initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Fixed 3D Black Hole Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
          <Suspense fallback={null}>
            <BlackHole position={[0, 0, -20]} size={5} />
            <ambientLight intensity={0.3} />
            <pointLight position={[20, 20, 20]} intensity={0.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Opening Screen */}
      <AnimatePresence>
        {state === 'opening' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-10 p-4"
          >
            <div className="max-w-4xl w-full text-center">
              {/* Core Messages */}
              <div className="mb-12 space-y-6">
                {coreMessages.map((line, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      delay: index * 0.8,
                    }}
                    className={`${
                      index === coreMessages.length - 1
                        ? 'text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent'
                        : 'text-2xl md:text-3xl text-gray-300'
                    }`}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* Language Selection */}
              {mounted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 3.5 }}
                  className="mb-8"
                >
                  <div className="backdrop-blur-xl bg-black/40 rounded-2xl p-8 border border-cyan-500/30">
                    <p className="text-sm text-gray-400 mb-4">Select your language:</p>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {LANGUAGES.slice(0, 12).map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageSelect(lang.code)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-xl ${
                            selectedLanguage === lang.code
                              ? 'bg-cyan-600/80 text-white ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/50'
                              : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50'
                          }`}
                        >
                          {lang.nativeName}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Enter Button */}
              <AnimatePresence>
                {selectedLanguage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <button
                      onClick={handleEnter}
                      className="group relative px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xl font-bold rounded-lg shadow-lg shadow-cyan-500/50 transition-all transform hover:scale-105 overflow-hidden"
                    >
                      <span className="relative z-10">ENTER</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    {/* Strategic Links */}
                    <div className="flex items-center justify-center gap-6 text-sm">
                      <button
                        onClick={() => setShowExplainer(true)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 backdrop-blur-xl bg-black/40 px-4 py-2 rounded-lg border border-gray-800/50 hover:border-cyan-500/50 transition-all"
                      >
                        <span>❓</span>
                        <span>What is this?</span>
                      </button>
                      <Link
                        href="/why"
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-2 backdrop-blur-xl bg-black/40 px-4 py-2 rounded-lg border border-gray-800/50 hover:border-purple-500/50 transition-all"
                      >
                        <span>🌍</span>
                        <span>Why this matters</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explainer Modal */}
      <AnimatePresence>
        {showExplainer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            onClick={() => setShowExplainer(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-cyan-500/30 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                What is Breakthrough?
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Breakthrough is a global coordination platform for AGI
                  (Artificial General Intelligence) development.
                </p>
                <p>
                  We bring together 7 billion people to build AGI that
                  respects human autonomy, built on the{' '}
                  <strong className="text-cyan-400">7 Immutable Laws</strong>:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Truth - Full transparency</li>
                  <li>Empathy - Emotional safety</li>
                  <li>Peace - No violence or domination</li>
                  <li>Autonomy - Free choice</li>
                  <li>Accountability - Audit trails</li>
                  <li>Stewardship - Improve the world</li>
                  <li>Integrity - Authority through ethics</li>
                </ul>
                <p className="text-sm text-gray-400">
                  You&apos;ll select a regional hub, choose your role
                  (Spectator or Builder), and help coordinate AGI development
                  through transparent, autonomous governance.
                </p>
              </div>
              <button
                onClick={() => setShowExplainer(false)}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg w-full font-semibold transition-all"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entering Transition */}
      <AnimatePresence>
        {state === 'entering' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 mb-8">
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <Suspense fallback={null}>
                  <HolographicEarth />
                  <ambientLight intensity={0.5} />
                </Suspense>
              </Canvas>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Initiating Wormhole Transit
              </div>
              <div className="text-gray-400">Destination: Earth...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Black Hole Dive Sequence */}
      <AnimatePresence>
        {state === 'diving' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
              <Suspense fallback={null}>
                <BlackHole position={[0, 0, -20]} size={5} />
                <BlackHoleDive
                  blackHolePosition={[0, 0, -20]}
                  onComplete={handleDiveComplete}
                />
                <ambientLight intensity={0.3} />
                <pointLight position={[20, 20, 20]} intensity={0.5} />
              </Suspense>
            </Canvas>

            {/* Dive UI Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="text-4xl md:text-6xl font-bold mb-4"
                style={{
                  color: '#00ffff',
                  textShadow: '0 0 30px #00ffff, 0 0 60px #00ffff',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              >
                ENTERING SINGULARITY
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-xl text-purple-400"
                style={{
                  textShadow: '0 0 20px #ff00ff'
                }}
              >
                Crossing Event Horizon...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
