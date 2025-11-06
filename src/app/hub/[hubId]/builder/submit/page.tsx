'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { hasWaveAccess, hasPendingApplication } from '@/lib/utils/wave-system'

export default function SubmitProposalPage() {
  const params = useParams()
  const router = useRouter()
  const hubId = params.hubId as string

  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [hasPending, setHasPending] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    category: 'safety',
    content: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: 'safety', label: 'Safety', color: 'blue' },
    { value: 'alignment', label: 'Alignment', color: 'purple' },
    { value: 'governance', label: 'Governance', color: 'green' },
    { value: 'compute', label: 'Compute', color: 'orange' },
    { value: 'interpretability', label: 'Interpretability', color: 'pink' },
    { value: 'research', label: 'Research', color: 'cyan' },
  ]

  useEffect(() => {
    checkWaveAccess()
  }, [])

  const checkWaveAccess = async () => {
    setIsCheckingAccess(true)
    // In real implementation, get actual user ID from auth
    const mockUserId = 'demo-user-123'

    const [access, pending] = await Promise.all([
      hasWaveAccess(mockUserId, hubId),
      hasPendingApplication(mockUserId, hubId),
    ])

    setHasAccess(access)
    setHasPending(pending)
    setIsCheckingAccess(false)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Proposal content is required'
    } else if (formData.content.length < 100) {
      newErrors.content = 'Proposal must be at least 100 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In real implementation, submit to Supabase
      console.log('Submitting proposal:', formData)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirect to forum
      router.push(`/hub/${hubId}/builder`)
    } catch (error) {
      console.error('Failed to submit proposal:', error)
      setErrors({ submit: 'Failed to submit proposal. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isCheckingAccess) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Checking Wave access...</div>
      </main>
    )
  }

  // No Wave access - show gate
  if (hasAccess === false) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="text-8xl mb-6">🌊</div>
          <h1 className="text-4xl font-bold mb-4">
            Wave Access Required
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            To submit proposals, you need Wave access. This ensures quality contributions
            and prevents spam.
          </p>

          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-600 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">What is the Wave System?</h2>
            <div className="space-y-3 text-left text-sm text-gray-300">
              <p>
                <strong className="text-blue-400">Quality Control:</strong> Applications ensure
                thoughtful contributions aligned with the 7 Immutable Laws
              </p>
              <p>
                <strong className="text-blue-400">Community Review:</strong> Existing Builders
                review applications collectively
              </p>
              <p>
                <strong className="text-blue-400">Fair Access:</strong> Everyone can apply—barriers
                are intentional but accessible
              </p>
              <p>
                <strong className="text-blue-400">Anti-Spam:</strong> Prevents low-quality
                proposals and maintains signal-to-noise ratio
              </p>
            </div>
          </div>

          {hasPending ? (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 mb-6">
              <div className="text-2xl mb-2">⏳</div>
              <div className="text-lg font-semibold text-yellow-400 mb-2">
                Application Pending Review
              </div>
              <div className="text-sm text-gray-400">
                Your Wave application is being reviewed by the community. You&apos;ll be notified
                when a decision is made (typically within 48 hours).
              </div>
            </div>
          ) : (
            <button
              onClick={() => router.push(`/hub/${hubId}/builder/wave/apply`)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-bold text-lg shadow-lg shadow-blue-500/50 transition-all transform hover:scale-105"
            >
              Apply for Wave Access
            </button>
          )}

          <div className="mt-8">
            <button
              onClick={() => router.push(`/hub/${hubId}/builder`)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Forum
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  // Has Wave access - show proposal form
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-blue-400 mb-2">
                {hubId} Hub • Submit Proposal
              </div>
              <h1 className="text-4xl font-bold">
                Create a Breakthrough Proposal
              </h1>
            </div>
            <div className="bg-green-900/30 border border-green-600 rounded-lg px-4 py-2">
              <div className="text-sm text-green-400 font-semibold">
                🌊 Wave Access Granted
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            Propose ideas that advance AGI safety, alignment, and responsible development.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <label className="block mb-2">
              <span className="text-lg font-bold">Proposal Title</span>
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                if (errors.title) setErrors({ ...errors, title: '' })
              }}
              placeholder="e.g., Implement Constitutional AI Safety Framework"
              className="w-full bg-black border border-gray-700 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              maxLength={200}
            />
            <div className="flex justify-between mt-2">
              <div>
                {errors.title && <span className="text-red-400 text-sm">{errors.title}</span>}
              </div>
              <div className="text-sm text-gray-500">{formData.title.length}/200</div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <label className="block mb-4">
              <span className="text-lg font-bold">Category</span>
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    formData.category === cat.value
                      ? 'bg-blue-600 text-white border-2 border-blue-400'
                      : 'bg-gray-800 text-gray-400 border-2 border-transparent hover:bg-gray-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <label className="block mb-2">
              <span className="text-lg font-bold">Proposal Details</span>
              <span className="text-red-400 ml-1">*</span>
            </label>
            <p className="text-sm text-gray-400 mb-4">
              Provide a detailed description of your proposal, including objectives, implementation
              plan, and expected impact.
            </p>
            <textarea
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value })
                if (errors.content) setErrors({ ...errors, content: '' })
              }}
              placeholder="Describe your proposal in detail..."
              className="w-full bg-black border border-gray-700 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors min-h-[300px] resize-y"
            />
            <div className="flex justify-between mt-2">
              <div>
                {errors.content && <span className="text-red-400 text-sm">{errors.content}</span>}
              </div>
              <div className="text-sm text-gray-500">
                {formData.content.length} characters (min 100)
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
            <h3 className="font-bold mb-3">📋 Submission Guidelines</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Align with the 7 Immutable Laws (Truth, Empathy, Peace, Autonomy, Accountability, Stewardship, Integrity)</li>
              <li>✓ Be specific and actionable</li>
              <li>✓ Consider implementation feasibility</li>
              <li>✓ Address potential risks and mitigation strategies</li>
              <li>✓ Respect diverse perspectives and encourage discussion</li>
            </ul>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 text-red-400">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/hub/${hubId}/builder`)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
