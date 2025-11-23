'use client'

import { Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import EarthScene, { type SceneState } from '@/components/3d/EarthScene'
import { detectUserLanguage, translate, LANGUAGES } from '@/utils/languages'

export default function UnifiedLandingPage() {
  const router = useRouter()
  const [sceneState, setSceneState] = useState<SceneState>('LANDING')
  const [lang, setLang] = useState('en')
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [cycleIndex, setCycleIndex] = useState(0)
  const [showUI, setShowUI] = useState(false)

  useEffect(() => {
    const detectedLang = detectUserLanguage()
    setLang(detectedLang)
  }, [])

  const handleStartJourney = () => {
    setSceneState('ENTERING')
  }

  const handleEnterComplete = () => {
    // After "enter" sequence, transition to hub selection
    setSceneState('HUB_SELECTION')
  }

  const handleCameraComplete = () => {
    // When camera reaches hub selection position, show hub UI
    setTimeout(() => setShowUI(true), 500)
  }

  const handleHubSelect = (hubId: string) => {
    // Navigate to hub role selection
    router.push(`/hub/${hubId}/role`)
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Scene - Always the EarthScene */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ fov: 60, near: 0.1, far: 5000 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <EarthScene
              onCameraAnimationComplete={handleCameraComplete}
              showEarthDetails={sceneState === 'HUB_SELECTION' && showUI}
              onHubSelect={handleHubSelect}
              cycleIndex={cycleIndex}
              autoZoom={sceneState !== 'LANDING'}
              sceneState={sceneState}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* LANDING STATE UI */}
      {sceneState === 'LANDING' && (
        <>
          {/* Language Selector Button */}
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
              onClick={handleStartJourney}
              className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-xl font-semibold transition-all duration-300 overflow-hidden shadow-2xl hover:shadow-blue-500/50"
            >
              <span className="relative z-10">{translate('enterPlatform', lang)}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.section>
        </>
      )}

      {/* ENTERING STATE UI */}
      {sceneState === 'ENTERING' && (
        <EnterOverlay onComplete={handleEnterComplete} />
      )}

      {/* HUB_SELECTION STATE UI */}
      {sceneState === 'HUB_SELECTION' && showUI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-20 right-8 z-20 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800 max-w-xs"
        >
          <h3 className="font-bold mb-2 text-sm">Select Your Regional Hub</h3>
          <p className="text-xs text-gray-400">
            Click on Earth to explore regions, or use arrow keys to cycle through hubs.
          </p>
        </motion.div>
      )}
    </main>
  )
}

// Enter page content as overlay
function EnterOverlay({ onComplete }: { onComplete: () => void }) {
  const [messageIndex, setMessageIndex] = useState(0)

  const coreMessages = [
    'This is not a game.',
    'This is a human collaboration experiment.',
    'The largest ever.',
    'This is HOPE.'
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messageIndex < coreMessages.length - 1) {
        setMessageIndex(messageIndex + 1)
      } else {
        // After all messages shown, transition to hub selection
        setTimeout(() => onComplete(), 2000)
      }
    }, 1200)

    return () => clearTimeout(timer)
  }, [messageIndex, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
    >
      <div className="max-w-2xl mx-auto px-4 text-center">
        {coreMessages.map((message, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: index <= messageIndex ? 1 : 0, y: index <= messageIndex ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{
              opacity: index === coreMessages.length - 1 && index === messageIndex ? 1 : index < messageIndex ? 0.3 : 0
            }}
          >
            {message}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}
