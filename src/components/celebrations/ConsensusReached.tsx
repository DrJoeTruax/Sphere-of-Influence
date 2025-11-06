'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Confetti from './Confetti'

export interface CelebrationData {
  proposalTitle: string
  consensusPercentage: number
  totalVotes: number
  category: string
}

interface ConsensusReachedProps {
  show: boolean
  data: CelebrationData | null
  onComplete?: () => void
}

export default function ConsensusReached({
  show,
  data,
  onComplete,
}: ConsensusReachedProps) {
  if (!data) return null

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Confetti */}
          <Confetti active={show} duration={5000} particleCount={200} />

          {/* Celebration Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onComplete}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotateY: 0,
                transition: {
                  type: 'spring',
                  damping: 15,
                  stiffness: 100,
                },
              }}
              exit={{
                scale: 0.5,
                opacity: 0,
                rotateY: 180,
                transition: { duration: 0.3 },
              }}
              className="max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Card */}
              <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 border-4 border-green-300 shadow-2xl shadow-green-500/50">
                {/* Icon and Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      transition: {
                        type: 'spring',
                        delay: 0.2,
                        damping: 10,
                        stiffness: 100,
                      },
                    }}
                    className="text-9xl mb-4"
                  >
                    🎉
                  </motion.div>

                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: { delay: 0.4 },
                    }}
                    className="text-5xl font-bold text-white mb-2"
                  >
                    Consensus Reached!
                  </motion.h1>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: { delay: 0.5 },
                    }}
                    className="text-green-100 text-lg"
                  >
                    The community has spoken
                  </motion.div>
                </div>

                {/* Proposal Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.6 },
                  }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30"
                >
                  <div className="text-sm text-green-100 uppercase tracking-wider mb-2">
                    {data.category}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {data.proposalTitle}
                  </h2>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-4xl font-bold text-white">
                        {data.consensusPercentage}%
                      </div>
                      <div className="text-sm text-green-100">
                        Consensus
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <div className="text-4xl font-bold text-white">
                        {data.totalVotes}
                      </div>
                      <div className="text-sm text-green-100">
                        Total Votes
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Impact Message */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.7 },
                  }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 text-center border border-white/20"
                >
                  <p className="text-white text-lg">
                    This breakthrough will help shape the future of responsible AGI development.
                    Thank you for your contribution to global coordination!
                  </p>
                </motion.div>

                {/* Action Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.8 },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  className="w-full px-8 py-4 bg-white text-green-700 font-bold text-lg rounded-xl hover:bg-green-50 transition-colors shadow-lg"
                >
                  Continue
                </motion.button>

                {/* Share Prompt */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.9 },
                  }}
                  className="mt-4 text-center"
                >
                  <div className="text-green-100 text-sm mb-2">
                    Share this achievement
                  </div>
                  <div className="flex justify-center gap-3">
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-2xl">
                      🐦
                    </button>
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-2xl">
                      📱
                    </button>
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-2xl">
                      📧
                    </button>
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-2xl">
                      🔗
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Close hint */}
              <div className="text-center mt-4 text-gray-400 text-sm">
                Click anywhere to continue
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
