'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { isSupabaseConfigured } from '@/lib/supabase/client'

type Role = 'spectator' | 'builder'

interface RoleOption {
  id: Role
  name: string
  tagline: string
  description: string
  features: string[]
  icon: string
  gradient: string
  nextStep: string
}

const ROLES: RoleOption[] = [
  {
    id: 'spectator',
    name: 'Spectator',
    tagline: 'Observe & Contribute',
    description: 'Watch humanity coordinate AGI development. Play value-mapping games, donate compute, and learn.',
    features: [
      '🎮 Play Project Agame (map human values)',
      '🖥️ Donate GPU compute to AGI research',
      '📊 View all proposals and discussions',
      '📚 Access educational resources',
      '🎉 Celebrate consensus wins',
      '🔄 Switch to Builder anytime',
    ],
    icon: '👁️',
    gradient: 'from-green-600 to-emerald-600',
    nextStep: 'Enter as Spectator',
  },
  {
    id: 'builder',
    name: 'Builder',
    tagline: 'Vote & Build',
    description: 'Active participant in AGI governance. Vote on proposals, contribute to 58 problem categories, and submit breakthrough ideas.',
    features: [
      '🗳️ Vote on AGI development proposals',
      '💡 Submit breakthrough ideas (with Wave access)',
      '💬 Comment on proposals and discuss',
      '📈 Contribute to 58 problem categories',
      '🏆 Build reputation through contributions',
      '🎯 Participate in consensus-building',
    ],
    icon: '🔨',
    gradient: 'from-blue-600 to-purple-600',
    nextStep: 'Enter as Builder',
  },
]

export default function RoleSelectionPage() {
  const router = useRouter()
  const params = useParams()
  const hubId = params.hubId as string

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPreview, setShowPreview] = useState<Role | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
  }

  const handlePreview = (role: Role) => {
    setShowPreview(role)
  }

  const handleConfirm = async () => {
    if (!selectedRole) return

    setIsConfirming(true)

    // Save role selection to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('breakthrough_selected_role', selectedRole)
    }

    // TODO: Save to Supabase when auth is implemented
    // For now, just navigate to next step
    setTimeout(() => {
      if (selectedRole === 'spectator') {
        router.push(`/hub/${hubId}/spectator`)
      } else {
        router.push(`/hub/${hubId}/builder`)
      }
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Role
          </h1>
          <p className="text-gray-400 text-lg">
            How would you like to participate in global AGI coordination?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            You can switch roles anytime
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {ROLES.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div
                className={`relative bg-gray-900 rounded-2xl p-8 border-2 transition-all cursor-pointer ${
                  selectedRole === role.id
                    ? 'border-blue-500 ring-4 ring-blue-500/30'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                {/* Selected indicator */}
                {selectedRole === role.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl"
                  >
                    ✓
                  </motion.div>
                )}

                {/* Icon */}
                <div className="text-6xl mb-4">{role.icon}</div>

                {/* Title */}
                <h2 className="text-3xl font-bold mb-2">{role.name}</h2>
                <p className="text-blue-400 text-sm mb-4">{role.tagline}</p>

                {/* Description */}
                <p className="text-gray-400 mb-6">{role.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {role.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePreview(role.id)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleRoleSelect(role.id)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedRole === role.id
                        ? `bg-gradient-to-r ${role.gradient} text-white`
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    Select
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Confirm Button */}
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center"
            >
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xl font-bold rounded-lg shadow-lg shadow-blue-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirming ? 'Confirming...' : ROLES.find(r => r.id === selectedRole)?.nextStep}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                By continuing, you agree to participate respectfully
                <br />
                in accordance with the 7 Immutable Laws
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/hub')}
            className="text-gray-500 hover:text-gray-300 text-sm"
          >
            ← Back to Hub Selection
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-800"
            >
              {(() => {
                const role = ROLES.find(r => r.id === showPreview)
                if (!role) return null

                return (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-6xl">{role.icon}</div>
                      <div>
                        <h2 className="text-3xl font-bold">{role.name} Preview</h2>
                        <p className="text-blue-400">{role.tagline}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {role.id === 'spectator' ? (
                        <>
                          <div>
                            <h3 className="text-xl font-bold mb-2">What Spectators Do</h3>
                            <p className="text-gray-400">
                              Spectators observe the coordination process and contribute in non-voting ways.
                              You&apos;ll see all proposals, discussions, and votes as they happen in real-time.
                            </p>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">Project Agame</h3>
                            <p className="text-gray-400">
                              Play interactive games that help map human values and preferences.
                              Your gameplay contributes to AGI alignment research.
                            </p>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">GPU Donation</h3>
                            <p className="text-gray-400">
                              Donate unused GPU compute to AGI safety research projects.
                              Track your contribution impact in real-time.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h3 className="text-xl font-bold mb-2">What Builders Do</h3>
                            <p className="text-gray-400">
                              Builders are active participants in AGI governance. You vote on proposals,
                              contribute to research, and help coordinate global development.
                            </p>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">Wave Access System</h3>
                            <p className="text-gray-400">
                              To prevent spam, new Builders can vote and comment immediately, but
                              must apply for Wave access to submit proposals. This maintains quality
                              while staying open.
                            </p>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">3D Forum Experience</h3>
                            <p className="text-gray-400">
                              Proposals appear as holographic panels in 3D space. Vote, comment,
                              and watch consensus emerge in real-time.
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => setShowPreview(null)}
                      className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                    >
                      Got it!
                    </button>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning if Supabase not configured */}
      {!isSupabaseConfigured && (
        <div className="fixed bottom-4 left-4 bg-yellow-900/50 border border-yellow-600 text-yellow-200 rounded-lg p-4 text-sm max-w-md">
          <strong>Development Mode:</strong> Supabase not configured.
          Role selection will be saved locally only.
        </div>
      )}
    </main>
  )
}
