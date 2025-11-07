'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Proof } from '@/lib/api/proof-station'
import { endorseProof } from '@/lib/api/proof-station'

interface ProofDetailProps {
  proof: Proof
  onClose: () => void
}

export default function ProofDetail({ proof, onClose }: ProofDetailProps) {
  const [showEndorseForm, setShowEndorseForm] = useState(false)
  const [endorsement, setEndorsement] = useState({ comment: '', score: 5 })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEndorse = async () => {
    setIsSubmitting(true)
    try {
      await endorseProof({
        proof_id: proof.id,
        comment: endorsement.comment,
        credibility_score: endorsement.score
      })
      setShowEndorseForm(false)
      setEndorsement({ comment: '', score: 5 })
      // TODO: Refresh proof data
    } catch (error) {
      console.error('Failed to endorse:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 overflow-y-auto backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="min-h-screen p-4 flex items-start justify-center py-20">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-4xl w-full border-2 border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-500/20"
        >
          {/* Header with field color */}
          <div
            className="p-6 border-b border-gray-800"
            style={{
              background: `linear-gradient(135deg, ${proof.field_color}20 0%, transparent 100%)`
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold border"
                    style={{
                      backgroundColor: `${proof.field_color}30`,
                      borderColor: proof.field_color,
                      color: proof.field_color
                    }}
                  >
                    {proof.field_name || 'Unknown Field'}
                  </span>
                  {proof.verified_at && (
                    <span className="px-3 py-1 bg-green-900/30 border border-green-600 text-green-400 rounded-full text-xs font-semibold">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {proof.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>By {proof.author_name || proof.author_username || 'Anonymous'}</span>
                  <span>•</span>
                  <span>{new Date(proof.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-black/40 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-cyan-400">{proof.impact_score}</div>
                <div className="text-xs text-gray-400">Impact Score</div>
              </div>
              <div className="bg-black/40 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">{proof.endorsement_count}</div>
                <div className="text-xs text-gray-400">Endorsements</div>
              </div>
              <div className="bg-black/40 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{proof.view_count}</div>
                <div className="text-xs text-gray-400">Views</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {proof.description}
              </p>
            </div>

            {/* Proof Links */}
            {proof.proof_links.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Evidence Links</h3>
                <div className="space-y-2">
                  {proof.proof_links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      📎 {link}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Blockchain Verification */}
            {proof.hash && (
              <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border border-green-600/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="text-green-400">⛓️</span>
                  Blockchain Verification
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hash:</span>
                    <span className="text-cyan-400 font-mono text-xs">
                      {proof.hash.substring(0, 20)}...
                    </span>
                  </div>
                  {proof.polygon_timestamp && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Polygon Timestamp:</span>
                      <span className="text-cyan-400 text-xs">
                        {new Date(proof.polygon_timestamp).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-800 bg-black/40">
            <AnimatePresence>
              {!showEndorseForm ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowEndorseForm(true)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                >
                  ✍️ Endorse This Proof
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-4"
                >
                  <textarea
                    value={endorsement.comment}
                    onChange={(e) => setEndorsement({ ...endorsement, comment: e.target.value })}
                    placeholder="Share your endorsement..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors min-h-[100px] resize-y"
                  />

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Credibility Score (1-5)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={endorsement.score}
                      onChange={(e) => setEndorsement({ ...endorsement, score: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span className="text-cyan-400 font-bold">{endorsement.score}</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowEndorseForm(false)}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEndorse}
                      disabled={isSubmitting || !endorsement.comment}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Endorsement'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
