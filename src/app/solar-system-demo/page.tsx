'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// Dynamic import to avoid SSR issues
const EnhancedSolarSystem = dynamic(() => import('@/components/3d/EnhancedSolarSystem'), {
  ssr: false
})

export default function SolarSystemDemo() {
  const router = useRouter()
  const [showUI, setShowUI] = useState(false)
  const [selectedHub, setSelectedHub] = useState<string | null>(null)

  const handleCameraComplete = () => {
    setTimeout(() => setShowUI(true), 500)
  }

  const handleHubSelect = (hubId: string) => {
    console.log('Hub selected:', hubId)
    setSelectedHub(hubId)

    // Navigate to appropriate page
    if (hubId === 'nader-station') {
      router.push('/planets/nader')
    } else if (hubId === 'space-station') {
      // Navigate to space station
      console.log('Navigate to space station')
    } else {
      // Navigate to regional hub
      router.push(`/hub/${hubId}/role`)
    }
  }

  return (
    <main className="relative h-screen w-screen bg-black text-white overflow-hidden">
      {/* Info overlay */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-8 left-8 z-20 max-w-md"
          >
            <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 border border-gray-800">
              <h1 className="text-2xl font-bold mb-2">Enhanced Solar System</h1>
              <p className="text-gray-400 text-sm mb-4">
                Explore the solar system with regional hubs, satellites, and the Sphere of Influence ring.
              </p>

              <div className="space-y-2 text-xs text-gray-500">
                <p>🌍 Earth with regional grids and satellites</p>
                <p>🪐 All 8 planets with elliptical orbits</p>
                <p>⭕ Sphere of Influence ring at outer edge</p>
                <p>✨ Enhanced starfield background</p>
                <p>🎯 Click hub satellites to navigate</p>
              </div>

              {selectedHub && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-green-400">
                    Selected: {selectedHub}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls help */}
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
              <li>🎯 Click satellites to select hubs</li>
              <li>🌍 Wait for UI to appear after zoom</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <button
        onClick={() => router.push('/hub')}
        className="absolute top-8 right-8 z-20 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
      >
        ← Back to Hub
      </button>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ fov: 60 }}>
          <Suspense fallback={null}>
            <EnhancedSolarSystem
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
              <p className="text-xl">Approaching Solar System...</p>
              <p className="text-sm text-gray-400 mt-2">This may take a moment to load</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
