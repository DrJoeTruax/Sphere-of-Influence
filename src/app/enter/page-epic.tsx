'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamic imports for 3D components
const UniverseBackground = dynamic(() => import('@/components/3d/UniverseBackground'), { ssr: false })
const Text3D = dynamic(() => import('@/components/3d/Text3D'), { ssr: false })
const HolographicEarth = dynamic(() => import('@/components/3d/HolographicEarth'), { ssr: false })

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
]

type EntryState = 'loading' | 'opening' | 'entering'

export default function EnterPageEpic() {
  const [state, setState] = useState<EntryState>('loading')
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [showExplainer, setShowExplainer] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)

  const coreMessages = [
    'This is not a game.',
    'This is a human collaboration experiment.',
    'The largest ever.',
    'This is HOPE.'
  ]

  useEffect(() => {
    // Show opening after brief load
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
      window.location.href = '/hub'
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Fixed 3D Universe Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <UniverseBackground count={3000} nebulaEnabled={true} />
          </Suspense>
        </Canvas>
      </div>

      {/* 3D Text Messages Layer */}
      <AnimatePresence>
        {state === 'opening' && (
          <div className="fixed inset-0 z-5 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <Suspense fallback={null}>
                {coreMessages.map((message, index) => (
                  <motion.group
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index <= messageIndex ? 1 : 0 }}
                  >
                    <Text3D
                      position={[0, 1.5 - index * 0.8, 0]}
                      fontSize={index === 3 ? 0.6 : 0.25}
                      color={index === 3 ? '#A78BFA' : '#D1D5DB'}
                      glowColor={index === 3 ? '#8B5CF6' : '#3B82F6'}
                      rotation={[-0.2, 0, 0]}
                      animate={index === 3}
                    >
                      {message}
                    </Text3D>
                  </motion.group>
                ))}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
              </Suspense>
            </Canvas>
          </div>
        )}
      </AnimatePresence>

      {/* UI Layer */}
      <AnimatePresence>
        {state === 'opening' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-10"
          >
            <div className="max-w-4xl w-full px-8 text-center">
              {/* Spacer for 3D text */}
              <div className="h-64 mb-8" />

              {/* Animated message sequence */}
              <div className="invisible">
                {coreMessages.map((msg, idx) => {
                  setTimeout(() => setMessageIndex(idx), 1000 + idx * 1000)
                  return <div key={idx} />
                })}
              </div>

              {/* Language Selection - appears after messages */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 5 }}
                className="mb-8"
              >
                <div className="backdrop-blur-xl bg-black/40 rounded-2xl p-8 border border-gray-800/50">
                  <p className="text-sm text-gray-400 mb-4">Select your language:</p>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-xl ${
                          selectedLanguage === lang.code
                            ? 'bg-blue-600/80 text-white ring-2 ring-blue-400 shadow-lg shadow-blue-500/50'
                            : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50'
                        }`}
                      >
                        {lang.nativeName}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

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
                      className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xl font-bold rounded-lg shadow-lg shadow-blue-500/50 transition-all transform hover:scale-105 overflow-hidden"
                    >
                      <span className="relative z-10">ENTER</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    {/* Strategic Links */}
                    <div className="flex items-center justify-center gap-6 text-sm">
                      <button
                        onClick={() => setShowExplainer(true)}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2 backdrop-blur-xl bg-black/40 px-4 py-2 rounded-lg border border-gray-800/50 hover:border-blue-500/50 transition-all"
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
              className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-gray-800/50 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
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
                  <strong className="text-blue-400">7 Immutable Laws</strong>:
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
                className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg w-full font-semibold"
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
            className="fixed inset-0 flex items-center justify-center z-50 bg-black"
          >
            <div className="w-64 h-64">
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <Suspense fallback={null}>
                  <HolographicEarth />
                  <ambientLight intensity={0.5} />
                </Suspense>
              </Canvas>
            </div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute text-center"
            >
              <div className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Entering Breakthrough
              </div>
              <div className="text-gray-400">Preparing your experience...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Toggle */}
      <button
        className="fixed bottom-4 right-4 z-30 p-3 bg-gray-900/80 backdrop-blur-xl hover:bg-gray-800 rounded-full border border-gray-700 transition-colors"
        title="Audio controls (future)"
      >
        🔇
      </button>
    </main>
  )
}
