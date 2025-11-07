'use client'

import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getAllProofs, logStationVisit, type Proof } from '@/lib/api/proof-station'
import ProofDetail from '@/components/proof-station/ProofDetail'
import LoadingSpinner from '@/components/LoadingSpinner'

// Dynamic import for 3D components
const StationAtrium = dynamic(() => import('@/components/3d/StationAtrium'), {
  ssr: false,
  loading: () => <LoadingSpinner fullScreen message="Loading Proof Station One..." />
})

export default function ProofStationPage() {
  const router = useRouter()
  const [proofs, setProofs] = useState<Proof[]>([])
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProofs()
    logStationVisit()
  }, [])

  const loadProofs = async () => {
    setIsLoading(true)
    const data = await getAllProofs()
    setProofs(data)
    setIsLoading(false)
  }

  if (showWelcome) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-3xl relative z-10"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-9xl mb-8"
          >
            🛰️
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            PROOF STATION ONE
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-cyan-300 mb-2"
          >
            THE NADER INSTITUTE
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-400 mb-8 italic"
          >
            &ldquo;Orbiting Earth. Anchored in Proof.&rdquo;
          </motion.p>

          {/* Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-600/30 rounded-2xl p-8 mb-8"
          >
            <p className="text-gray-300 mb-6 leading-relaxed">
              Welcome to humanity&apos;s orbital archive of verified knowledge.
              This satellite station houses the <strong className="text-cyan-400">N.A.Dr. (Non-Academic Doctor)</strong> philosophy—
              proof-based recognition of mastery outside traditional academia.
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/40 rounded-lg p-4 border border-cyan-600/20">
                <div className="text-3xl mb-2">🏛️</div>
                <div className="font-semibold text-cyan-400 mb-1">Atrium of Proof</div>
                <div className="text-gray-400">Glass pillars containing verified works</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-blue-600/20">
                <div className="text-3xl mb-2">⛓️</div>
                <div className="font-semibold text-blue-400 mb-1">Blockchain Verified</div>
                <div className="text-gray-400">Polygon timestamps ensure immutability</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-purple-600/20">
                <div className="text-3xl mb-2">🌍</div>
                <div className="font-semibold text-purple-400 mb-1">Transparent Floor</div>
                <div className="text-gray-400">View Earth rotating below</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-green-600/20">
                <div className="text-3xl mb-2">✨</div>
                <div className="font-semibold text-green-400 mb-1">Truth Reactor</div>
                <div className="text-gray-400">Central verification chamber</div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-8 mb-8 text-sm"
          >
            <div>
              <div className="text-3xl font-bold text-cyan-400">{isLoading ? '...' : proofs.length}</div>
              <div className="text-gray-400">Verified Proofs</div>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div>
              <div className="text-3xl font-bold text-blue-400">
                {isLoading ? '...' : proofs.reduce((sum, p) => sum + p.endorsement_count, 0)}
              </div>
              <div className="text-gray-400">Total Endorsements</div>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div>
              <div className="text-3xl font-bold text-purple-400">8</div>
              <div className="text-gray-400">Fields of Study</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 justify-center"
          >
            <button
              onClick={() => setShowWelcome(false)}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-500/50 transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading Station...' : 'Enter Station'}
            </button>
            <button
              onClick={() => router.push('/hub')}
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all"
            >
              ← Back to Solar System
            </button>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-sm text-gray-500"
          >
            Integrated with the Breakthrough Platform | Orbiting at 400km altitude
          </motion.p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="relative h-screen w-screen bg-black text-white overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 5, 15], fov: 60 }}
          shadows
        >
          <Suspense fallback={null}>
            <StationAtrium
              proofs={proofs}
              selectedProof={selectedProof}
              onProofClick={setSelectedProof}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Header UI */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">🛰️</span>
              Proof Station One
            </h1>
            <p className="text-sm text-gray-400">The Nader Institute • {proofs.length} Verified Proofs</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/hub')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              Exit Station
            </button>
            <button
              onClick={() => setShowWelcome(true)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              Info
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-cyan-600/30 rounded-lg px-6 py-3 z-10">
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <div>🖱️ <strong>Drag</strong> to rotate</div>
          <div>🔍 <strong>Scroll</strong> to zoom</div>
          <div>🎯 <strong>Click pillar</strong> to view proof</div>
        </div>
      </div>

      {/* Proof Detail Modal */}
      <AnimatePresence>
        {selectedProof && (
          <ProofDetail
            proof={selectedProof}
            onClose={() => setSelectedProof(null)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
