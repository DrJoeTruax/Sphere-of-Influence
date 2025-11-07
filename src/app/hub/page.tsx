'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import SolarSystem from '@/components/3d/SolarSystem'
import { useHubs } from '@/lib/hooks/useHubs'

export default function HubSelectionPage() {
  const router = useRouter()
  const { hubs, loading: hubsLoading } = useHubs()
  const [showUI, setShowUI] = useState(false)
  const [selectedHub, setSelectedHub] = useState<string | null>(null)

  // Show UI after camera animation completes
  const handleCameraComplete = () => {
    setTimeout(() => setShowUI(true), 500)
  }

  const handleHubSelect = (hubId: string) => {
    // Special case: Nader Station navigates directly to proof station
    if (hubId === 'nader-station') {
      router.push('/planets/nader')
      return
    }
    setSelectedHub(hubId)
  }

  const handleConfirmSelection = () => {
    if (selectedHub) {
      // Save hub selection
      if (typeof window !== 'undefined') {
        localStorage.setItem('breakthrough_selected_hub', selectedHub)
      }
      // Navigate to role selection
      setTimeout(() => {
        router.push(`/hub/${selectedHub}/role`)
      }, 300)
    }
  }

  return (
    <main className="relative h-screen w-screen bg-black text-white overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas>
          <Suspense fallback={null}>
            <SolarSystem
              onCameraAnimationComplete={handleCameraComplete}
              showEarthDetails={showUI}
              onHubSelect={handleHubSelect}
              autoZoom={true}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {!showUI && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-xl">Approaching Earth...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hub Selection UI */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-8 left-8 z-20 max-w-md"
          >
            <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 border border-gray-800">
              <h1 className="text-2xl font-bold mb-2">Select Your Hub</h1>
              <p className="text-gray-400 text-sm mb-4">
                Choose a regional hub or the Space Station.
                <br />
                Click a glowing marker on Earth.
              </p>

              {/* Hub list */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {hubsLoading ? (
                  <div className="text-gray-500 text-sm">Loading hubs...</div>
                ) : (
                  hubs.map((hub) => (
                    <button
                      key={hub.id}
                      onClick={() => handleHubSelect(hub.slug)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedHub === hub.slug
                          ? 'bg-blue-600 ring-2 ring-blue-400'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      <div className="font-semibold">{hub.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {hub.active_contributors > 0 ? (
                          <span>
                            👁 {hub.active_contributors} active
                          </span>
                        ) : (
                          <span>New hub</span>
                        )}
                        {' • '}
                        {hub.language_codes.join(', ').toUpperCase()}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Confirm button */}
              {selectedHub && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleConfirmSelection}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all"
                >
                  Enter {hubs.find(h => h.slug === selectedHub)?.name}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 right-8 z-20 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800 max-w-xs"
          >
            <h3 className="font-bold mb-2 text-sm">Controls</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>🖱️ Click + drag to rotate view</li>
              <li>🔍 Scroll to zoom in/out</li>
              <li>🎯 Click blue markers to select hub</li>
              <li>🛸 Purple station = Global hub</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
