'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SpectatorPage() {
  const params = useParams()
  const hubId = params.hubId as string

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-2xl"
      >
        <div className="text-8xl mb-6">👁️</div>
        <h1 className="text-4xl font-bold mb-4">
          Welcome, Spectator!
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          You&apos;ve joined the {hubId} hub as a Spectator.
          <br />
          The Spectator experience is being built in Phase 5+.
        </p>

        <div className="space-y-4 mb-8 text-left bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Coming Soon:</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <div className="font-semibold">Project Agame</div>
                <div className="text-sm text-gray-400">
                  Play value-mapping games to help align AGI
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🖥️</span>
              <div>
                <div className="font-semibold">GPU Donation</div>
                <div className="text-sm text-gray-400">
                  Contribute unused compute to AGI research
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold">Live Dashboard</div>
                <div className="text-sm text-gray-400">
                  Watch proposals and votes in real-time
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <div className="font-semibold">Celebrations</div>
                <div className="text-sm text-gray-400">
                  Join hub-wide celebrations when consensus is reached
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href={`/hub/${hubId}/role`}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            ← Change Role
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Phase 4 Complete: Role Selection ✅</p>
          <p>Next: Phase 5 - Forum System (30 hours)</p>
        </div>
      </motion.div>
    </main>
  )
}
