'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import OpeningScreen from '@/components/landing/OpeningScreen'

// Dynamically import Starfield to avoid SSR issues with Three.js
const Starfield = dynamic(() => import('@/components/3d/Starfield'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading experience...</div>
    </div>
  ),
})

type EntryState = 'loading' | 'opening' | 'entering' | 'complete'

export default function EnterPage() {
  const [state, setState] = useState<EntryState>('loading')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [showAudio, setShowAudio] = useState(false)

  useEffect(() => {
    // Optional: Add ambient space sound
    // This is a hook for future audio implementation
    if (showAudio) {
      // Audio setup would go here
    }
  }, [showAudio])

  const handleStarfieldLoad = () => {
    // Wait a bit after starfield loads to show opening screen
    setTimeout(() => {
      setState('opening')
    }, 1000)
  }

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang)
    // Store language preference for later use
    if (typeof window !== 'undefined') {
      localStorage.setItem('breakthrough_language', lang)
    }
  }

  const handleEnter = () => {
    setState('entering')
    // Transition to hub selection (Phase 3)
    setTimeout(() => {
      setState('complete')
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Starfield Background */}
      <Starfield count={5000} onLoadComplete={handleStarfieldLoad} />

      {/* Opening Screen */}
      <AnimatePresence>
        {state === 'opening' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <OpeningScreen
              onLanguageSelect={handleLanguageSelect}
              onEnter={handleEnter}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entering Transition */}
      <AnimatePresence>
        {state === 'entering' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-20 bg-black"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Entering Breakthrough
              </div>
              <div className="text-gray-400">Preparing your experience...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete State - Hub Selection (Phase 3) */}
      <AnimatePresence>
        {state === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 flex items-center justify-center z-20"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">
                Hub Selection Coming Soon
              </h1>
              <p className="text-gray-400 mb-8 max-w-md">
                In Phase 3, you&apos;ll navigate a 3D solar system,
                <br />
                zoom to Earth, and select one of 12 regional hubs.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Selected language: {selectedLanguage}</p>
                <p>This will be used throughout your experience.</p>
              </div>
              <button
                onClick={() => setState('opening')}
                className="mt-6 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                ← Back to Opening
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Toggle (Optional Enhancement) */}
      <button
        onClick={() => setShowAudio(!showAudio)}
        className="fixed bottom-4 right-4 z-30 p-3 bg-gray-900/80 hover:bg-gray-800 rounded-full border border-gray-700 transition-colors"
        title={showAudio ? 'Mute audio' : 'Enable audio'}
      >
        {showAudio ? '🔊' : '🔇'}
      </button>
    </main>
  )
}
