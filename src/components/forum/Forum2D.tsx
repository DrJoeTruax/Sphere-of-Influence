'use client'

import { motion } from 'framer-motion'
import type { Proposal } from '@/components/3d/Forum3D'
import { calculateConsensusPercentage, getConsensusStatus } from '@/lib/hooks/useCelebrations'

interface Forum2DProps {
  proposals: Proposal[]
  onProposalClick: (proposal: Proposal) => void
  userVotes: Record<string, 'for' | 'against' | 'abstain'>
}

export default function Forum2D({ proposals, onProposalClick, userVotes }: Forum2DProps) {
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-4 pb-24">
        {proposals.map((proposal, index) => {
          const totalVotes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain
          const consensusPercentage = calculateConsensusPercentage(
            proposal.votes_for,
            proposal.votes_against,
            proposal.votes_abstain
          )
          const consensusStatus = getConsensusStatus(consensusPercentage)
          const userVote = userVotes[proposal.id]

          return (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onProposalClick(proposal)}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 hover:bg-gray-800/70 hover:border-gray-600 transition-all cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`View proposal: ${proposal.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onProposalClick(proposal)
                }
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs font-semibold rounded">
                      {proposal.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        proposal.status === 'active'
                          ? 'bg-green-900/50 text-green-300'
                          : proposal.status === 'passed'
                          ? 'bg-emerald-900/50 text-emerald-300'
                          : proposal.status === 'rejected'
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {proposal.status.toUpperCase()}
                    </span>
                    {userVote && (
                      <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs font-semibold rounded">
                        You voted: {userVote.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {proposal.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    by {proposal.author}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {proposal.votes_for}
                  </div>
                  <div className="text-xs text-gray-400">For</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {proposal.votes_against}
                  </div>
                  <div className="text-xs text-gray-400">Against</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">
                    {proposal.votes_abstain}
                  </div>
                  <div className="text-xs text-gray-400">Abstain</div>
                </div>
              </div>

              {/* Consensus Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Consensus</span>
                  <span className={`font-bold ${consensusStatus.color}`}>
                    {consensusStatus.emoji} {consensusPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${consensusPercentage}%` }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                    className={`h-full ${
                      consensusPercentage >= 75
                        ? 'bg-green-500'
                        : consensusPercentage >= 60
                        ? 'bg-blue-500'
                        : consensusPercentage >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-xs text-gray-500">
                <span>{totalVotes} total votes</span>
                {proposal.voting_ends_at && (
                  <span>
                    Ends: {new Date(proposal.voting_ends_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}

        {proposals.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <div className="text-6xl mb-4">📋</div>
            <div className="text-xl">No proposals yet</div>
            <div className="text-sm mt-2">Be the first to submit a proposal!</div>
          </div>
        )}
      </div>
    </div>
  )
}
