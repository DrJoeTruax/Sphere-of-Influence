'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'link'

interface Question {
  id: string
  category: string
  difficulty: number
  question_text: string
  option_a_text: string
  option_b_text: string
}

interface QuestionStats {
  total_responses: number
  option_a_percentage: number
  option_b_percentage: number
  by_region: Array<{
    name: string
    option_a_percentage: number
    option_b_percentage: number
  }>
}

export default function ProjectAgame({ params }: { params: { hubId: string } }) {
  const supabase = createClientComponentClient()
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [streak, setStreak] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [globalStats, setGlobalStats] = useState<QuestionStats | null>(null)
  const [userChoice, setUserChoice] = useState<'A' | 'B' | null>(null)
  const [startTime, setStartTime] = useState(Date.now())

  useEffect(() => {
    loadNextQuestion()
    loadUserStats()
  }, [])

  const loadUserStats = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('agame_score')
      .eq('id', user.id)
      .single()

    if (profile) {
      setTotalAnswered(profile.agame_score || 0)
    }
  }

  const loadNextQuestion = async () => {
    setLoading(true)
    setStartTime(Date.now())

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const difficultyLevel = Math.min(Math.floor(totalAnswered / 5) + 1, 10)

    const { data, error } = await supabase.rpc('get_next_agame_question', {
      p_user_id: user.id,
      difficulty_level: difficultyLevel
    })

    if (data && data.length > 0) {
      setCurrentQuestion(data[0])
    }

    setLoading(false)
  }

  const submitChoice = async (choice: 'A' | 'B') => {
    if (!currentQuestion || loading) return

    const responseTime = Date.now() - startTime
    setLoading(true)
    setUserChoice(choice)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Record response
    const { error } = await supabase
      .from('agame_responses')
      .insert({
        user_id: user.id,
        question_id: currentQuestion.id,
        choice,
        response_time_ms: responseTime,
        user_region: params.hubId,
        certainty: 3
      })

    if (!error) {
      // Update user stats
      await supabase
        .from('profiles')
        .update({
          agame_score: totalAnswered + 1
        })
        .eq('id', user.id)

      // Get global stats for this question
      const { data: stats } = await supabase.rpc('get_question_stats', {
        p_question_id: currentQuestion.id
      })

      setGlobalStats(stats)
      setShowResult(true)
      setTotalAnswered(prev => prev + 1)
      setStreak(prev => prev + 1)

      // After 4 seconds, load next question
      setTimeout(() => {
        setShowResult(false)
        setUserChoice(null)
        setQuestionNumber(prev => prev + 1)
        loadNextQuestion()
      }, 4000)
    }

    setLoading(false)
  }

  const handleSkip = async () => {
    setQuestionNumber(prev => prev + 1)
    loadNextQuestion()
  }

  if (loading && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading next question...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      {/* Header Stats */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              PROJECT AGAME
            </h1>
            <p className="text-white/60">Mapping Human Values, One Choice at a Time</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cyan-400">{totalAnswered}</div>
            <div className="text-sm text-white/60">Questions Answered</div>
            {streak > 0 && (
              <div className="text-sm text-orange-400 mt-2">🔥 {streak} streak</div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber % 10) * 10}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-sm text-white/60 mt-2 flex justify-between">
          <span>Question {questionNumber}</span>
          {currentQuestion && (
            <span>Difficulty: {currentQuestion.difficulty}/10</span>
          )}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {!showResult && currentQuestion ? (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 md:p-8 mb-6">
              <div className="text-sm text-cyan-400 mb-4 uppercase font-semibold">
                {currentQuestion.category}
              </div>
              <p className="text-xl md:text-2xl mb-8 leading-relaxed">
                {currentQuestion.question_text}
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Option A */}
                <motion.button
                  onClick={() => submitChoice('A')}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-2 border-blue-500/50 rounded-xl text-left hover:border-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-3xl font-bold mb-3 text-blue-400">A</div>
                  <p className="text-lg">{currentQuestion.option_a_text}</p>
                </motion.button>

                {/* Option B */}
                <motion.button
                  onClick={() => submitChoice('B')}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-2 border-purple-500/50 rounded-xl text-left hover:border-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-3xl font-bold mb-3 text-purple-400">B</div>
                  <p className="text-lg">{currentQuestion.option_b_text}</p>
                </motion.button>
              </div>

              {/* Skip Button */}
              <div className="text-center mt-6">
                <button
                  onClick={handleSkip}
                  className="text-white/40 hover:text-white/60 text-sm transition"
                >
                  Skip this question →
                </button>
              </div>
            </div>
          </motion.div>
        ) : showResult && globalStats ? (
          <ResultsScreen
            question={currentQuestion}
            userChoice={userChoice}
            globalStats={globalStats}
          />
        ) : null}
      </AnimatePresence>

      {/* Global Impact Stats */}
      <div className="max-w-4xl mx-auto mt-8">
        <GlobalImpactWidget totalAnswered={totalAnswered} hubId={params.hubId} />
      </div>
    </div>
  )
}

function ResultsScreen({ question, userChoice, globalStats }: {
  question: Question | null
  userChoice: 'A' | 'B' | null
  globalStats: QuestionStats
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 md:p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">How Humanity Chose</h3>

        {/* Global Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className={`p-6 rounded-xl border-2 ${
            userChoice === 'A' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
          }`}>
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {globalStats.option_a_percentage || 0}%
            </div>
            <p className="text-white/80">Chose Option A</p>
            {userChoice === 'A' && (
              <div className="text-sm text-blue-400 mt-2">← You chose this</div>
            )}
          </div>

          <div className={`p-6 rounded-xl border-2 ${
            userChoice === 'B' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10'
          }`}>
            <div className="text-4xl font-bold text-purple-400 mb-2">
              {globalStats.option_b_percentage || 0}%
            </div>
            <p className="text-white/80">Chose Option B</p>
            {userChoice === 'B' && (
              <div className="text-sm text-purple-400 mt-2">← You chose this</div>
            )}
          </div>
        </div>

        {/* Regional Breakdown */}
        {globalStats.by_region && globalStats.by_region.length > 0 && (
          <div className="bg-black/30 rounded-lg p-4">
            <h4 className="font-bold mb-3 text-sm text-white/60">Regional Differences</h4>
            <div className="space-y-2 text-sm">
              {globalStats.by_region.map((region) => (
                <div key={region.name} className="flex justify-between">
                  <span>{region.name}:</span>
                  <span className="text-cyan-400">
                    {region.option_a_percentage}% A / {region.option_b_percentage}% B
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-white/60 text-sm mt-6">
          Next question in 4 seconds...
        </p>
      </div>
    </motion.div>
  )
}

function GlobalImpactWidget({ totalAnswered, hubId }: { totalAnswered: number; hubId: string }) {
  const [globalTotal, setGlobalTotal] = useState(0)
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadGlobalStats()
  }, [totalAnswered])

  const loadGlobalStats = async () => {
    const { count } = await supabase
      .from('agame_responses')
      .select('*', { count: 'exact', head: true })

    setGlobalTotal(count || 0)
  }

  return (
    <div className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6">
      <h4 className="font-bold mb-4 text-center">Your Contribution to Human Understanding</h4>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-cyan-400">{totalAnswered}</div>
          <div className="text-xs text-white/60">Your Answers</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">
            {globalTotal.toLocaleString()}
          </div>
          <div className="text-xs text-white/60">Global Answers</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-400">58</div>
          <div className="text-xs text-white/60">Value Dimensions</div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <Link
          href="/values-map"
          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center justify-center gap-2 transition"
        >
          View Live Human Values Map →
        </Link>
      </div>
    </div>
  )
}
