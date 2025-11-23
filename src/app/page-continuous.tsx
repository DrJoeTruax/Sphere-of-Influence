'use client'

import { Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { JourneyProvider, useJourney } from '@/contexts/JourneyContext'
import { detectUserLanguage, translate, LANGUAGES } from '@/utils/languages'

// Dynamic imports for 3D components
const NeuralNetwork = dynamic(() => import('@/components/3d/NeuralNetwork'), { ssr: false })
const WormholeAccretionDisk = dynamic(() => import('@/components/3d/WormholeAccretionDisk'), { ssr: false })
const SimpleEarth = dynamic(() => import('@/components/3d/SimpleEarth'), { ssr: false })
const ContinuousCamera = dynamic(() => import('@/components/3d/ContinuousCamera'), { ssr: false })

// UI Overlay Component
function JourneyUI() {
  const { state, startJourney, progress } = useJourney()
  const [lang, setLang] = useState('en')
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  useEffect(() => {
    const detectedLang = detectUserLanguage()
    setLang(detectedLang)
  }, [])

  return (
    <>
      {/* Language Selector Button - only on landing */}
      {state === 'LANDING' && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-lg hover:border-blue-500/50 transition-all"
        >
          🌍 {LANGUAGES.find(l => l.code === lang)?.nativeName || 'English'}
        </motion.button>
      )}

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

      {/* Landing Page Content */}
      {state === 'LANDING' && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl"
          >
            {translate('heroTitle', lang)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl md:text-3xl mb-4 max-w-3xl font-light"
          >
            {translate('heroSubtitle', lang)}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-gray-400 mb-12 max-w-xl text-lg"
          >
            {translate('heroDescription', lang)}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            onClick={startJourney}
            className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-xl font-semibold transition-all duration-300 overflow-hidden shadow-2xl hover:shadow-blue-500/50"
          >
            <span className="relative z-10">{translate('enterPlatform', lang)}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-gray-600 rounded-full p-1">
              <div className="w-1.5 h-3 bg-blue-500 rounded-full mx-auto animate-pulse" />
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* Traversal Content - displayed during wormhole ride */}
      {state === 'TRAVERSING' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <div className="max-w-2xl mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              TRAVERSING SPACETIME
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-xl text-gray-300 mb-8"
            >
              You are entering a collaborative space where thousands of voices shape the future of AGI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mb-4"
            >
              <div className="text-6xl font-bold text-blue-400">{Math.round(progress)}%</div>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Arrival Message */}
      {state === 'ARRIVED' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              You&apos;ve Arrived
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-2xl text-gray-300 mb-12"
            >
              Now map your values.
            </motion.p>

            <motion.a
              href="/enter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="inline-block px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-xl font-semibold transition-all duration-300 pointer-events-auto"
            >
              Continue to Platform
            </motion.a>
          </div>
        </motion.div>
      )}
    </>
  )
}

// Main 3D Scene
function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
      <Suspense fallback={null}>
        <ContinuousCamera />
        <NeuralNetwork position={[0, 0, -20]} size={10} nodeCount={150} />
        <WormholeAccretionDisk />
        <SimpleEarth />
        <ambientLight intensity={0.3} />
        <pointLight position={[20, 20, 20]} intensity={0.5} />
      </Suspense>
    </Canvas>
  )
}

// Main Page Component
export default function Home() {
  return (
    <JourneyProvider>
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Fixed 3D Scene Background */}
        <div className="fixed inset-0 z-0">
          <Scene3D />
        </div>

        {/* UI Overlays */}
        <JourneyUI />
      </main>
    </JourneyProvider>
  )
}
