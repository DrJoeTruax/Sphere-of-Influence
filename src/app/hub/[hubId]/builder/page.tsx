'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { Proposal } from '@/components/3d/Forum3D'
import ProposalDetail from '@/components/forum/ProposalDetail'

// Dynamic import for 3D Forum
const Forum3D = dynamic(() => import('@/components/3d/Forum3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white text-xl">Loading 3D Forum...</div>
    </div>
  ),
})

// Mock proposals for demonstration
const MOCK_PROPOSALS: Proposal[] = [
  {
    id: '1',
    title: 'Implement Constitutional AI Safety Framework',
    author: 'Dr. Sarah Chen',
    category: 'Safety',
    status: 'active',
    votes_for: 234,
    votes_against: 12,
    votes_abstain: 8,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    voting_ends_at: new Date(Date.now() + 86400000 * 5).toISOString(),
    content: 'Proposal to adopt a comprehensive Constitutional AI framework that embeds safety constraints directly into AGI training processes. This approach ensures alignment by design rather than post-hoc correction.\n\nKey components:\n- Multi-stakeholder input on constitutional principles\n- Transparent training objectives\n- Regular safety audits\n- Community oversight mechanisms',
  },
  {
    id: '2',
    title: 'Global AGI Compute Resource Sharing Protocol',
    author: 'Alex Kumar',
    category: 'Compute',
    status: 'active',
    votes_for: 189,
    votes_against: 45,
    votes_abstain: 23,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    voting_ends_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    content: 'Establish a decentralized protocol for sharing GPU compute resources across research institutions, democratizing access to AGI development infrastructure.\n\nBenefits:\n- Reduces computational inequality\n- Accelerates safety research\n- Creates incentive alignment\n- Transparent resource allocation',
  },
  {
    id: '3',
    title: 'Interpretability Benchmark Standards',
    author: 'Maria Rodriguez',
    category: 'Interpretability',
    status: 'active',
    votes_for: 312,
    votes_against: 8,
    votes_abstain: 15,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    voting_ends_at: new Date(Date.now() + 86400000 * 6).toISOString(),
    content: 'Create standardized benchmarks for measuring AGI interpretability, ensuring all systems meet minimum transparency requirements before deployment.',
  },
  {
    id: '4',
    title: 'Emergency AGI Development Pause Mechanism',
    author: 'Prof. James Wilson',
    category: 'Governance',
    status: 'active',
    votes_for: 445,
    votes_against: 123,
    votes_abstain: 67,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    voting_ends_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    content: 'Implement a global coordination mechanism that can trigger a temporary pause in AGI development if critical safety concerns are identified.',
  },
  {
    id: '5',
    title: 'Open Source AGI Safety Toolkit',
    author: 'Community Collective',
    category: 'Alignment',
    status: 'passed',
    votes_for: 892,
    votes_against: 34,
    votes_abstain: 21,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    voting_ends_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    content: 'Develop and maintain an open-source toolkit of AGI safety techniques, making cutting-edge safety research accessible to all developers.',
  },
]

export default function BuilderPage() {
  const params = useParams()
  const hubId = params.hubId as string
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [userVotes, setUserVotes] = useState<Record<string, 'for' | 'against' | 'abstain'>>({})
  const [showWelcome, setShowWelcome] = useState(true)
  const [view, setView] = useState<'3d' | '2d'>('3d')

  const handleProposalClick = (proposal: Proposal) => {
    setSelectedProposal(proposal)
  }

  const handleVote = (proposalId: string, voteType: 'for' | 'against' | 'abstain') => {
    // In real implementation, this would save to Supabase
    setUserVotes(prev => ({ ...prev, [proposalId]: voteType }))

    // Simulate vote count update
    setSelectedProposal(prev => {
      if (!prev || prev.id !== proposalId) return prev

      return {
        ...prev,
        votes_for: voteType === 'for' ? prev.votes_for + 1 : prev.votes_for,
        votes_against: voteType === 'against' ? prev.votes_against + 1 : prev.votes_against,
        votes_abstain: voteType === 'abstain' ? prev.votes_abstain + 1 : prev.votes_abstain,
      }
    })
  }

  if (showWelcome) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="text-8xl mb-6">🔨</div>
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the 3D Forum!
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            You&apos;re about to enter the Builder forum for <strong className="text-blue-400">{hubId}</strong>.
            <br />
            Proposals appear as holographic panels in 3D space.
          </p>

          <div className="bg-gray-900 rounded-lg p-6 mb-8 text-left border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Quick Guide:</h2>
            <div className="space-y-3 text-sm">
              <div>🖱️ <strong>Click + drag</strong> to rotate the view</div>
              <div>🔍 <strong>Scroll</strong> to zoom in/out</div>
              <div>🎯 <strong>Click a panel</strong> to view proposal details</div>
              <div>🗳️ <strong>Vote</strong> on proposals (votes are final)</div>
              <div>💬 <strong>Discuss</strong> in comments (coming soon)</div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mb-8">
            <div className="text-sm text-blue-200">
              <strong>Demo Mode:</strong> These are mock proposals. Real proposals will come from Supabase when authentication is implemented.
            </div>
          </div>

          <button
            onClick={() => setShowWelcome(false)}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-bold text-lg shadow-lg shadow-blue-500/50 transition-all transform hover:scale-105"
          >
            Enter 3D Forum
          </button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="relative h-screen w-screen bg-black text-white overflow-hidden">
      {/* 3D Forum View */}
      {view === '3d' && (
        <div className="absolute inset-0">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white text-xl">Loading forum...</div>
            </div>
          }>
            <Forum3D
              proposals={MOCK_PROPOSALS}
              onProposalClick={handleProposalClick}
              selectedProposalId={selectedProposal?.id}
            />
          </Suspense>
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{hubId} Builder Forum</h1>
            <p className="text-sm text-gray-400">{MOCK_PROPOSALS.length} active proposals</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView(view === '3d' ? '2d' : '3d')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              {view === '3d' ? '2D View' : '3D View'}
            </button>
            <button
              onClick={() => setShowWelcome(true)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              Guide
            </button>
          </div>
        </div>
      </div>

      {/* Proposal Detail Modal */}
      <AnimatePresence>
        {selectedProposal && (
          <ProposalDetail
            proposal={selectedProposal}
            onClose={() => setSelectedProposal(null)}
            onVote={handleVote}
            userVote={userVotes[selectedProposal.id]}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
