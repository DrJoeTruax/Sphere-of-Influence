'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Proposal } from '@/components/3d/Forum3D'
import { useCelebrations } from '@/lib/hooks/useCelebrations'
import ConsensusReached from '@/components/celebrations/ConsensusReached'

interface ProposalDetailProps {
  proposal: Proposal
  onClose: () => void
  onVote: (proposalId: string, voteType: 'for' | 'against' | 'abstain') => void
  userVote?: 'for' | 'against' | 'abstain' | null
}

export default function ProposalDetail({
  proposal,
  onClose,
  onVote,
  userVote,
}: ProposalDetailProps) {
  const [showVoteConfirm, setShowVoteConfirm] = useState<'for' | 'against' | 'abstain' | null>(null)
  const { showCelebration, celebrationData, dismissCelebration, checkAndCelebrate } = useCelebrations()

  const totalVotes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain
  const consensusPercentage = totalVotes > 0
    ? Math.round((proposal.votes_for / totalVotes) * 100)
    : 0

  const handleVote = (voteType: 'for' | 'against' | 'abstain') => {
    if (userVote) {
      // Already voted, show message
      return
    }
    setShowVoteConfirm(voteType)
  }

  const confirmVote = () => {
    if (showVoteConfirm) {
      // Store previous vote counts
      const previousVotesFor = proposal.votes_for
      const previousVotesAgainst = proposal.votes_against
      const previousVotesAbstain = proposal.votes_abstain

      // Cast the vote
      onVote(proposal.id, showVoteConfirm)

      // Calculate new vote counts (optimistic update)
      const newVotesFor = showVoteConfirm === 'for' ? previousVotesFor + 1 : previousVotesFor
      const newVotesAgainst = showVoteConfirm === 'against' ? previousVotesAgainst + 1 : previousVotesAgainst
      const newVotesAbstain = showVoteConfirm === 'abstain' ? previousVotesAbstain + 1 : previousVotesAbstain

      // Check if this vote caused consensus to be reached
      checkAndCelebrate({
        proposalTitle: proposal.title,
        category: proposal.category,
        votesFor: newVotesFor,
        votesAgainst: newVotesAgainst,
        votesAbstain: newVotesAbstain,
        previousVotesFor,
        previousVotesAgainst,
        previousVotesAbstain,
      })

      setShowVoteConfirm(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen p-4 flex items-start justify-center py-20">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 rounded-2xl max-w-4xl w-full border border-gray-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-blue-400 uppercase mb-2">
                  {proposal.category}
                </div>
                <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
                <div className="text-gray-400 text-sm">
                  Proposed by <span className="text-blue-400">{proposal.author}</span>
                  {' • '}
                  {new Date(proposal.created_at).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                proposal.status === 'active' ? 'bg-blue-900 text-blue-200' :
                proposal.status === 'passed' ? 'bg-green-900 text-green-200' :
                proposal.status === 'rejected' ? 'bg-red-900 text-red-200' :
                'bg-gray-800 text-gray-400'
              }`}>
                {proposal.status}
              </span>
              {proposal.voting_ends_at && (
                <span className="text-sm text-gray-400">
                  Voting ends: {new Date(proposal.voting_ends_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold mb-4">Proposal Details</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">
                {proposal.content || 'No detailed content provided.'}
              </p>
            </div>
          </div>

          {/* Voting Section */}
          <div className="p-6 bg-gray-800/50">
            <h2 className="text-xl font-bold mb-4">Cast Your Vote</h2>

            {/* Vote counts */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{proposal.votes_for}</div>
                <div className="text-sm text-gray-400">For</div>
              </div>
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{proposal.votes_against}</div>
                <div className="text-sm text-gray-400">Against</div>
              </div>
              <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-gray-400">{proposal.votes_abstain}</div>
                <div className="text-sm text-gray-400">Abstain</div>
              </div>
            </div>

            {/* Consensus bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Consensus Progress</span>
                <span>{consensusPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all"
                  style={{ width: `${consensusPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {totalVotes} total votes • 75% needed for consensus
              </div>
            </div>

            {/* Voting buttons */}
            {userVote ? (
              <div className="text-center p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                <div className="text-lg font-semibold text-blue-400 mb-2">
                  You voted: {userVote === 'for' ? '👍 For' : userVote === 'against' ? '👎 Against' : '⚪ Abstain'}
                </div>
                <div className="text-sm text-gray-400">
                  Thank you for participating! Votes are final and cannot be changed.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleVote('for')}
                  className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-1">👍</div>
                  <div>Vote For</div>
                </button>
                <button
                  onClick={() => handleVote('against')}
                  className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-1">👎</div>
                  <div>Vote Against</div>
                </button>
                <button
                  onClick={() => handleVote('abstain')}
                  className="px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-1">⚪</div>
                  <div>Abstain</div>
                </button>
              </div>
            )}
          </div>

          {/* Comments section placeholder */}
          <div className="p-6 border-t border-gray-800">
            <h2 className="text-xl font-bold mb-4">Discussion</h2>
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">💬</div>
              <div>Comment system coming soon</div>
              <div className="text-sm mt-2">Phase 5 expansion</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Vote confirmation modal */}
      <AnimatePresence>
        {showVoteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowVoteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-800"
            >
              <h3 className="text-2xl font-bold mb-4">Confirm Your Vote</h3>
              <p className="text-gray-400 mb-6">
                You are about to vote{' '}
                <strong className={
                  showVoteConfirm === 'for' ? 'text-green-400' :
                  showVoteConfirm === 'against' ? 'text-red-400' :
                  'text-gray-300'
                }>
                  {showVoteConfirm === 'for' ? 'FOR' : showVoteConfirm === 'against' ? 'AGAINST' : 'ABSTAIN'}
                </strong>
                {' '}on this proposal.
              </p>
              <p className="text-sm text-yellow-500 mb-6">
                ⚠️ Votes are final and cannot be changed. This ensures accountability.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVoteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmVote}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    showVoteConfirm === 'for' ? 'bg-green-600 hover:bg-green-700' :
                    showVoteConfirm === 'against' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  Confirm Vote
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consensus Celebration */}
      <ConsensusReached
        show={showCelebration}
        data={celebrationData}
        onComplete={dismissCelebration}
      />
    </motion.div>
  )
}
