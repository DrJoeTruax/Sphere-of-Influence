import { useState, useCallback } from 'react'
import type { CelebrationData } from '@/components/celebrations/ConsensusReached'

/**
 * Hook for managing celebration state and triggering celebrations
 *
 * Features:
 * - Tracks celebration state (active/inactive)
 * - Stores celebration data (proposal info, stats)
 * - checkForConsensus() helper to detect consensus threshold
 * - triggerCelebration() to manually trigger celebrations
 * - Auto-dismisses after user interaction
 */
export function useCelebrations() {
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null)

  /**
   * Check if a proposal has reached consensus threshold
   * Default threshold: 75% of votes are "for"
   */
  const checkForConsensus = useCallback(
    (votesFor: number, votesAgainst: number, votesAbstain: number, threshold: number = 75): boolean => {
      const totalVotes = votesFor + votesAgainst + votesAbstain

      // Need at least some votes to declare consensus
      if (totalVotes < 10) return false

      const consensusPercentage = (votesFor / totalVotes) * 100
      return consensusPercentage >= threshold
    },
    []
  )

  /**
   * Trigger a celebration with proposal data
   */
  const triggerCelebration = useCallback(
    (data: CelebrationData) => {
      setCelebrationData(data)
      setShowCelebration(true)
    },
    []
  )

  /**
   * Dismiss the celebration
   */
  const dismissCelebration = useCallback(() => {
    setShowCelebration(false)
    // Clear data after animation completes
    setTimeout(() => {
      setCelebrationData(null)
    }, 500)
  }, [])

  /**
   * Check if voting just caused consensus to be reached
   * Call this after a vote is cast to see if celebration should trigger
   */
  const checkAndCelebrate = useCallback(
    (params: {
      proposalTitle: string
      category: string
      votesFor: number
      votesAgainst: number
      votesAbstain: number
      previousVotesFor: number
      previousVotesAgainst: number
      previousVotesAbstain: number
      threshold?: number
    }): boolean => {
      const {
        proposalTitle,
        category,
        votesFor,
        votesAgainst,
        votesAbstain,
        previousVotesFor,
        previousVotesAgainst,
        previousVotesAbstain,
        threshold = 75,
      } = params

      // Check if consensus was NOT reached before this vote
      const wasConsensus = checkForConsensus(
        previousVotesFor,
        previousVotesAgainst,
        previousVotesAbstain,
        threshold
      )

      // Check if consensus IS reached now
      const isConsensus = checkForConsensus(votesFor, votesAgainst, votesAbstain, threshold)

      // Trigger celebration only if consensus was just reached
      if (!wasConsensus && isConsensus) {
        const totalVotes = votesFor + votesAgainst + votesAbstain
        const consensusPercentage = Math.round((votesFor / totalVotes) * 100)

        triggerCelebration({
          proposalTitle,
          category,
          consensusPercentage,
          totalVotes,
        })

        return true
      }

      return false
    },
    [checkForConsensus, triggerCelebration]
  )

  return {
    showCelebration,
    celebrationData,
    triggerCelebration,
    dismissCelebration,
    checkForConsensus,
    checkAndCelebrate,
  }
}

/**
 * Calculate consensus percentage for display
 */
export function calculateConsensusPercentage(
  votesFor: number,
  votesAgainst: number,
  votesAbstain: number
): number {
  const totalVotes = votesFor + votesAgainst + votesAbstain
  if (totalVotes === 0) return 0
  return Math.round((votesFor / totalVotes) * 100)
}

/**
 * Get consensus status label
 */
export function getConsensusStatus(consensusPercentage: number): {
  label: string
  color: string
  emoji: string
} {
  if (consensusPercentage >= 90) {
    return {
      label: 'Strong Consensus',
      color: 'text-green-500',
      emoji: '🎉',
    }
  } else if (consensusPercentage >= 75) {
    return {
      label: 'Consensus Reached',
      color: 'text-green-400',
      emoji: '✅',
    }
  } else if (consensusPercentage >= 60) {
    return {
      label: 'Majority Support',
      color: 'text-blue-400',
      emoji: '👍',
    }
  } else if (consensusPercentage >= 50) {
    return {
      label: 'Slight Majority',
      color: 'text-yellow-400',
      emoji: '⚖️',
    }
  } else {
    return {
      label: 'No Consensus',
      color: 'text-gray-400',
      emoji: '❓',
    }
  }
}
