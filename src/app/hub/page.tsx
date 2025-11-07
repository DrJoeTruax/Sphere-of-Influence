'use client'

import { useState, Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import EarthScene from '@/components/3d/EarthScene'
import SpectatorLayer from '@/components/ui/SpectatorLayer'
import { useHubs } from '@/lib/hooks/useHubs'

export default function HubSelectionPage() {
  const router = useRouter()
  const { hubs, loading: hubsLoading } = useHubs()
  const [showUI, setShowUI] = useState(false)
  const [selectedHub, setSelectedHub] = useState<string | null>(null)
  const [cycleIndex, setCycleIndex] = useState(0)

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

  const handleClearHub = () => {
    setSelectedHub(null)
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCycleIndex(prev => (prev + 1) % 12)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCycleIndex(prev => (prev - 1 + 12) % 12)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <main className="relative h-screen w-screen bg-black text-white overflow-hidden">
      {/* SpectatorLayer UI Overlay */}
      <SpectatorLayer
        selectedHub={selectedHub}
        onClearHub={handleClearHub}
        onSelectHub={handleHubSelect}
        showUI={showUI}
        cycleIndex={cycleIndex}
        setCycleIndex={setCycleIndex}
      />

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ fov: 60, near: 0.1, far: 5000 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <EarthScene
              onCameraAnimationComplete={handleCameraComplete}
              showEarthDetails={showUI}
              onHubSelect={handleHubSelect}
              cycleIndex={cycleIndex}
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

      {/* Instructions */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute top-20 right-8 z-20 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800 max-w-xs"
          >
            <h3 className="font-bold mb-2 text-sm">Controls</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>🖱️ Click + drag to rotate Earth</li>
              <li>🔍 Scroll to zoom in/out</li>
              <li>⬅️➡️ Arrow keys to cycle regions</li>
              <li>🎯 Click satellites to view hub details</li>
              <li>🌍 Earth spins with regional hubs</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
