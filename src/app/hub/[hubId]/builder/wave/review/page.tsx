'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getAllApplications,
  getApplicationStats,
  reviewApplication,
  type WaveApplication,
} from '@/lib/utils/wave-system'

export default function WaveReviewPage() {
  const params = useParams()
  const router = useRouter()
  const hubId = params.hubId as string

  const [applications, setApplications] = useState<WaveApplication[]>([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [selectedApp, setSelectedApp] = useState<WaveApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    loadData()
  }, [hubId])

  const loadData = async () => {
    setIsLoading(true)
    const [appsData, statsData] = await Promise.all([
      getAllApplications(hubId),
      getApplicationStats(hubId),
    ])
    setApplications(appsData)
    setStats(statsData)
    setIsLoading(false)
  }

  const handleReview = async (applicationId: string, decision: 'approved' | 'rejected') => {
    // In real implementation, get actual user ID from auth
    const mockReviewerId = 'demo-reviewer-' + Math.random().toString(36).substr(2, 9)

    const success = await reviewApplication({
      applicationId,
      reviewerId: mockReviewerId,
      decision,
    })

    if (success) {
      // Reload data
      await loadData()
      setSelectedApp(null)
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading applications...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-400 mb-2">
                {hubId} Hub • Wave Review
              </div>
              <h1 className="text-4xl font-bold mb-2">
                Review Applications
              </h1>
              <p className="text-gray-400">
                Review Wave applications to grant Builder access
              </p>
            </div>
            <button
              onClick={() => router.push(`/hub/${hubId}/builder`)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Back to Forum
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Applications</div>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-gray-400">Pending Review</div>
          </div>
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-400">{stats.approved}</div>
            <div className="text-sm text-gray-400">Approved</div>
          </div>
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-sm text-gray-400">Rejected</div>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6"
        >
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-2">📋</div>
            <div>No {filter !== 'all' ? filter : ''} applications found</div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {filteredApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Application ID: {app.id}
                    </div>
                    <div className="text-lg font-semibold mb-2">
                      User ID: {app.user_id.substring(0, 20)}...
                    </div>
                    <div className="text-sm text-gray-400">
                      Submitted: {new Date(app.created_at).toLocaleDateString()} at{' '}
                      {new Date(app.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        app.status === 'pending'
                          ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                          : app.status === 'approved'
                          ? 'bg-green-900/30 text-green-400 border border-green-700'
                          : 'bg-red-900/30 text-red-400 border border-red-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
            onClick={() => setSelectedApp(null)}
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
                      <h1 className="text-3xl font-bold mb-2">Wave Application</h1>
                      <div className="text-gray-400 text-sm">
                        User ID: {selectedApp.user_id}
                        {' • '}
                        Submitted: {new Date(selectedApp.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="text-gray-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedApp.status === 'pending'
                        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                        : selectedApp.status === 'approved'
                        ? 'bg-green-900/30 text-green-400 border border-green-700'
                        : 'bg-red-900/30 text-red-400 border border-red-700'
                    }`}
                  >
                    {selectedApp.status}
                  </span>
                </div>

                {/* Questions and Answers */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-blue-400">
                      Question 1: Motivation
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Why do you want to become a Builder in the Breakthrough Platform?
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">
                      {selectedApp.motivation_answer}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-2 text-blue-400">
                      Question 2: Contribution
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      What unique perspective or expertise can you bring to AGI safety discussions?
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">
                      {selectedApp.contribution_answer}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-2 text-blue-400">
                      Question 3: Commitment to 7 Laws
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      How do you embody the 7 Immutable Laws (Truth, Empathy, Peace, Autonomy,
                      Accountability, Stewardship, Integrity)?
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">
                      {selectedApp.commitment_answer}
                    </div>
                  </div>
                </div>

                {/* Review Actions */}
                {selectedApp.status === 'pending' && (
                  <div className="p-6 border-t border-gray-800 bg-gray-800/50">
                    <h3 className="text-lg font-bold mb-4">Review Decision</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleReview(selectedApp.id, 'rejected')}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => handleReview(selectedApp.id, 'approved')}
                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        ✅ Approve & Grant Access
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-4 text-center">
                      Approving grants Wave 1 access, allowing the user to submit proposals
                    </p>
                  </div>
                )}

                {/* Already Reviewed */}
                {selectedApp.status !== 'pending' && (
                  <div className="p-6 border-t border-gray-800 bg-gray-800/50">
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {selectedApp.status === 'approved' ? '✅' : '❌'}
                      </div>
                      <div className="text-lg font-semibold mb-2">
                        Application {selectedApp.status === 'approved' ? 'Approved' : 'Rejected'}
                      </div>
                      {selectedApp.reviewed_by && (
                        <div className="text-sm text-gray-400">
                          Reviewed by: {selectedApp.reviewed_by}
                          {selectedApp.reviewed_at &&
                            ` on ${new Date(selectedApp.reviewed_at).toLocaleDateString()}`}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
