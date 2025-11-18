'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { use } from 'react'

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

interface CollectiveMilestone {
  id: string
  name: string
  description: string
  goal_type: 'global' | 'regional' | 'weekly_theme'
  region?: string
  target_value: number
  current_value: number
  achieved: boolean
  reward_description: string
}

export default function ProjectAgame({ params }: { params: Promise<{ hubId: string }> }) {
  const { hubId } = use(params)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [streak, setStreak] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [todayAnswered, setTodayAnswered] = useState(0)
  const [dailyQuota] = useState(5)
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showDailyComplete, setShowDailyComplete] = useState(false)
  const [globalStats, setGlobalStats] = useState<QuestionStats | null>(null)
  const [userChoice, setUserChoice] = useState<'A' | 'B' | null>(null)
  const [startTime, setStartTime] = useState(Date.now())
  const [collectiveMilestones, setCollectiveMilestones] = useState<CollectiveMilestone[]>([])
  const [globalTotal, setGlobalTotal] = useState(847293)
  const [activeTodayCount, setActiveTodayCount] = useState(1247)

  useEffect(() => {
    loadNextQuestion()
    loadUserStats()
    loadCollectiveMilestones()
    loadTodayCount()
  }, [])

  const loadCollectiveMilestones = async () => {
    // Mock data for now - in production this would come from Supabase
    setCollectiveMilestones([
      {
        id: '1',
        name: '1 Million Questions',
        description: 'Humanity working together',
        goal_type: 'global',
        target_value: 1000000,
        current_value: 847293,
        achieved: false,
        reward_description: 'Unlock advanced AGI model'
      },
      {
        id: '2',
        name: 'North America 10K',
        description: 'Regional collaboration goal',
        goal_type: 'regional',
        region: 'North America',
        target_value: 10000,
        current_value: 8234,
        achieved: false,
        reward_description: 'Unlock regional consensus data'
      }
    ])
  }

  const loadTodayCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get today's responses count
      const today = new Date().toISOString().split('T')[0]
      const { count } = await supabase
        .from('agame_responses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today)

      setTodayAnswered(count || 0)

      // Check if daily quota is reached
      if (count && count >= dailyQuota) {
        setShowDailyComplete(true)
      }
    } catch (err) {
      console.error('Error loading today count:', err)
    }
  }

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.warn('User not authenticated for stats')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('agame_score')
        .eq('id', user.id)
        .single()

      if (error) {
        console.warn('Error loading user stats:', error)
        return
      }

      if (profile) {
        setTotalAnswered(profile.agame_score || 0)
      }
    } catch (err) {
      console.error('Exception loading user stats:', err)
    }
  }

  const loadNextQuestion = async () => {
    setLoading(true)
    setStartTime(Date.now())

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.warn('User not authenticated')
        setLoading(false)
        return
      }

      const difficultyLevel = Math.min(Math.floor(totalAnswered / 5) + 1, 10)

      const { data, error } = await supabase.rpc('get_next_agame_question', {
        p_user_id: user.id,
        difficulty_level: difficultyLevel
      })

      if (error) {
        console.error('Error loading question:', error)
      }

      if (data && data.length > 0) {
        setCurrentQuestion(data[0])
      }
    } finally {
      setLoading(false)
    }
  }

  const submitChoice = async (choice: 'A' | 'B') => {
    if (!currentQuestion || loading) return

    // Check daily quota
    if (todayAnswered >= dailyQuota) {
      setShowDailyComplete(true)
      return
    }

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
        user_region: hubId,
        certainty: 3
      })

    if (!error) {
      // Update counts
      const newTotalAnswered = totalAnswered + 1
      const newTodayAnswered = todayAnswered + 1

      setTotalAnswered(newTotalAnswered)
      setTodayAnswered(newTodayAnswered)
      setStreak(prev => prev + 1)

      // Update user stats in database
      await supabase
        .from('profiles')
        .update({
          agame_score: newTotalAnswered
        })
        .eq('id', user.id)

      // Get global stats for this question
      const { data: stats } = await supabase.rpc('get_question_stats', {
        p_question_id: currentQuestion.id
      })

      setGlobalStats(stats)
      setShowResult(true)

      // Update global total (mock increment)
      setGlobalTotal(prev => prev + 1)

      // Check if daily quota reached
      if (newTodayAnswered >= dailyQuota) {
        setTimeout(() => {
          setShowResult(false)
          setShowDailyComplete(true)
        }, 4000)
      } else {
        // After 4 seconds, load next question
        setTimeout(() => {
          setShowResult(false)
          setUserChoice(null)
          setQuestionNumber(prev => prev + 1)
          loadNextQuestion()
        }, 4000)
      }
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

  // Daily complete screen
  if (showDailyComplete) {
    return (
      <DailyCompleteScreen
        totalAnswered={totalAnswered}
        streak={streak}
        todayAnswered={todayAnswered}
        globalTotal={globalTotal}
        activeTodayCount={activeTodayCount}
        collectiveMilestones={collectiveMilestones}
        hubId={hubId}
      />
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
            <p className="text-white/60">Mapping Human Values Together</p>
          </div>
          <div className="text-right">
            <div className="text-lg text-white/80 mb-1">Today's Contribution</div>
            <div className="text-4xl font-bold text-cyan-400">{todayAnswered} / {dailyQuota}</div>
            <div className="text-sm text-white/60">questions today</div>
            {streak > 0 && (
              <div className="text-sm text-orange-400 mt-2">🔥 {streak}-day contribution streak</div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(todayAnswered / dailyQuota) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-sm text-white/60 mt-2 flex justify-between">
          <span>{todayAnswered} of {dailyQuota} today • {totalAnswered} all-time</span>
          {currentQuestion && (
            <span>Difficulty: {currentQuestion.difficulty}/10</span>
          )}
        </div>
      </div>

      {/* Collective Progress Card */}
      <div className="max-w-4xl mx-auto mb-8">
        <CollectiveProgressCard
          globalTotal={globalTotal}
          activeTodayCount={activeTodayCount}
          collectiveMilestones={collectiveMilestones}
        />
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
        <GlobalImpactWidget totalAnswered={totalAnswered} hubId={hubId} />
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

// Collective Progress Card
function CollectiveProgressCard({ globalTotal, activeTodayCount, collectiveMilestones }: {
  globalTotal: number
  activeTodayCount: number
  collectiveMilestones: CollectiveMilestone[]
}) {
  const globalMilestone = collectiveMilestones.find(m => m.goal_type === 'global')

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
      <h3 className="font-bold text-xl mb-4 text-cyan-400">🌍 HUMANITY'S PROGRESS</h3>

      {globalMilestone && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">{globalMilestone.name}</span>
            <span className="text-sm text-white/60">
              {((globalMilestone.current_value / globalMilestone.target_value) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(globalMilestone.current_value / globalMilestone.target_value) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cyan-400 font-mono font-bold">
              {globalMilestone.current_value.toLocaleString()} / {globalMilestone.target_value.toLocaleString()}
            </span>
            <span className="text-white/60">
              {(globalMilestone.target_value - globalMilestone.current_value).toLocaleString()} to go!
            </span>
          </div>
          <div className="mt-3 text-sm text-white/70">
            🎯 When we reach {globalMilestone.target_value.toLocaleString()}: <span className="text-green-400">{globalMilestone.reward_description}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">{activeTodayCount.toLocaleString()}</div>
          <div className="text-white/60">Active Today</div>
          <div className="text-xs text-white/40 mt-1">Working together right now</div>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-400">142</div>
          <div className="text-white/60">Countries</div>
          <div className="text-xs text-white/40 mt-1">Global participation</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 text-center text-xs text-white/50">
        Everyone's working together toward the same goal.
      </div>
    </div>
  )
}

// Daily Complete Screen
function DailyCompleteScreen({ totalAnswered, streak, todayAnswered, globalTotal, activeTodayCount, collectiveMilestones, hubId }: {
  totalAnswered: number
  streak: number
  todayAnswered: number
  globalTotal: number
  activeTodayCount: number
  collectiveMilestones: CollectiveMilestone[]
  hubId: string
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Celebration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="text-7xl mb-4">✨</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Daily Contribution Complete!
          </h1>
          <p className="text-xl text-white/70">You answered {todayAnswered} questions today</p>
          {streak > 0 && (
            <div className="text-2xl text-orange-400 mt-3">🔥 {streak}-day contribution streak</div>
          )}
        </motion.div>

        {/* Today's Collective Impact */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 mb-6"
        >
          <h3 className="font-bold text-lg mb-4 text-cyan-400">Today's Collective Impact</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <div className="font-semibold">You + {activeTodayCount.toLocaleString()} others answered today</div>
                <div className="text-white/60">Together we added {activeTodayCount * 5} data points</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold">Collective shift: Autonomy +0.02%</div>
                <div className="text-white/60">Your voice + {activeTodayCount} others = clearer signal</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <div className="font-semibold">Part of {globalTotal.toLocaleString()} total responses</div>
                <div className="text-white/60">Contributing to AGI alignment</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Your Value Profile */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-6"
        >
          <h3 className="font-bold text-lg mb-4 text-purple-400">Your Value Profile</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Autonomy</span>
                <span className="text-cyan-400">72%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: '72%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Safety</span>
                <span className="text-blue-400">43%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '43%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Equality</span>
                <span className="text-purple-400">68%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '68%' }} />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-sm">
            <div className="text-white/70">💡 Unique: Only 2.4% share your value combination</div>
            <div className="text-white/50 text-xs mt-2">This diversity helps map humanity's full spectrum</div>
          </div>
        </motion.div>

        {/* Come Back Tomorrow */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-6 text-center"
        >
          <div className="text-4xl mb-3">⏰</div>
          <h3 className="text-xl font-bold mb-2">Come back tomorrow!</h3>
          <p className="text-white/70 mb-4">Help us reach 1M responses</p>
          <div className="text-sm text-white/60">Next questions: 18h 23m</div>

          <div className="flex gap-3 mt-6 justify-center">
            <Link
              href="/values-map"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold transition"
            >
              View Values Map
            </Link>
            <Link
              href={`/hub/${hubId}/spectator`}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
            >
              Back to Hub
            </Link>
          </div>
        </motion.div>

        <div className="text-center text-sm text-white/40 mt-6">
          Not for you - for all of us. 🌍
        </div>
      </div>
    </div>
  )
}
