'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { submitWaveApplication } from '@/lib/utils/wave-system'

const ESSAY_QUESTIONS = [
  {
    id: 'motivation',
    question: 'Why do you want to become a Builder in the Breakthrough Platform?',
    placeholder: 'Share your motivation for contributing to global AGI coordination...',
    minWords: 50,
  },
  {
    id: 'contribution',
    question: 'What unique perspective or expertise can you bring to AGI safety discussions?',
    placeholder: 'Describe your background, experience, or unique viewpoint...',
    minWords: 50,
  },
  {
    id: 'commitment',
    question: 'How do you embody the 7 Immutable Laws (Truth, Empathy, Peace, Autonomy, Accountability, Stewardship, Integrity)?',
    placeholder: 'Provide specific examples of how these values guide your actions...',
    minWords: 100,
  },
]

export default function WaveApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const hubId = params.hubId as string

  const [answers, setAnswers] = useState({
    motivation: '',
    contribution: '',
    commitment: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const wordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const validateAnswers = (): boolean => {
    const newErrors: Record<string, string> = {}

    ESSAY_QUESTIONS.forEach(question => {
      const answer = answers[question.id as keyof typeof answers]
      const words = wordCount(answer)

      if (!answer || answer.trim().length === 0) {
        newErrors[question.id] = 'This question is required'
      } else if (words < question.minWords) {
        newErrors[question.id] = `Please write at least ${question.minWords} words (current: ${words})`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateAnswers()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In real implementation, this would get the actual user ID from auth
      const mockUserId = 'demo-user-' + Math.random().toString(36).substr(2, 9)

      await submitWaveApplication({
        userId: mockUserId,
        hubId,
        answers,
      })

      setSubmitSuccess(true)

      // Redirect to builder page after 3 seconds
      setTimeout(() => {
        router.push(`/hub/${hubId}/builder`)
      }, 3000)
    } catch (error) {
      console.error('Failed to submit application:', error)
      setErrors({ submit: 'Failed to submit application. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="text-8xl mb-6">✅</div>
          <h1 className="text-4xl font-bold mb-4">
            Application Submitted!
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Thank you for applying to become a Builder. Your application will be reviewed by the community.
          </p>
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-3">What happens next?</h2>
            <div className="space-y-3 text-left text-sm">
              <div>📋 Community members will review your application</div>
              <div>🗳️ Reviewers vote on granting Wave access</div>
              <div>📧 You&apos;ll be notified of the decision (coming soon)</div>
              <div>🔨 If approved, you can submit proposals and vote</div>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            Redirecting to forum...
          </p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-sm text-blue-400 mb-2">
            {hubId} Hub • Wave Application
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Apply for Builder Access
          </h1>
          <p className="text-gray-400 text-lg">
            The Wave System ensures quality contributions by requiring thoughtful applications.
            Answer the three questions below to apply for proposal submission rights.
          </p>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600 rounded-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-3">Why the Wave System?</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>Quality over Quantity:</strong> Thoughtful applications ensure meaningful contributions
            </p>
            <p>
              <strong>Community Review:</strong> Applications are reviewed by existing Builders
            </p>
            <p>
              <strong>Accountability:</strong> Your answers demonstrate alignment with the 7 Immutable Laws
            </p>
            <p>
              <strong>Accessibility:</strong> Everyone can apply—barriers are intentional but fair
            </p>
          </div>
        </motion.div>

        {/* Essay Questions */}
        <div className="space-y-8">
          {ESSAY_QUESTIONS.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="mb-4">
                <div className="text-sm text-blue-400 mb-2">
                  Question {index + 1} of {ESSAY_QUESTIONS.length}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {question.question}
                </h3>
                <p className="text-sm text-gray-400">
                  Minimum {question.minWords} words
                  {' • '}
                  Current: {wordCount(answers[question.id as keyof typeof answers])} words
                </p>
              </div>

              <textarea
                value={answers[question.id as keyof typeof answers]}
                onChange={(e) => {
                  setAnswers({ ...answers, [question.id]: e.target.value })
                  // Clear error when user starts typing
                  if (errors[question.id]) {
                    setErrors({ ...errors, [question.id]: '' })
                  }
                }}
                placeholder={question.placeholder}
                className="w-full bg-black border border-gray-700 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors min-h-[200px] resize-y"
              />

              {errors[question.id] && (
                <div className="mt-2 text-red-400 text-sm">
                  {errors[question.id]}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-red-900/30 border border-red-600 rounded-lg p-4 text-red-400"
          >
            {errors.submit}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex gap-4"
        >
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </motion.div>

        {/* Note */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Your application will be reviewed within 48 hours. All responses are stored on-chain for transparency.
        </p>
      </div>
    </main>
  )
}
