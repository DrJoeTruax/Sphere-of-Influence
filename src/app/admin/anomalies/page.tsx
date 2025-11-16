'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

interface ValueAnomaly {
  id: string
  dimension: string
  region: string | null
  suspicion_level: 'low' | 'medium' | 'high'
  reason: 'rapid_shift' | 'unnatural_consensus' | 'coordinated_timing' | 'statistical_outlier'
  affected_sample_size: number
  historical_baseline: number | null
  current_value: number | null
  sigma_deviation: number | null
  created_at: string
  resolved: boolean
  resolution_notes: string | null
}

interface AnswerPattern {
  user_id: string
  pattern_type: 'too_consistent' | 'too_fast' | 'contradictory' | 'bot_like'
  confidence: number
  detected_at: string
  details: any
}

interface TrustScore {
  user_id: string
  behavioral_score: number
  network_score: number
  consistency_score: number
  time_weighted_score: number
  combined_trust: number
  last_updated: string
}

export default function AnomalyDashboard() {
  const [anomalies, setAnomalies] = useState<ValueAnomaly[]>([])
  const [patterns, setPatterns] = useState<AnswerPattern[]>([])
  const [trustScores, setTrustScores] = useState<TrustScore[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'anomalies' | 'patterns' | 'trust'>('anomalies')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    fetchData()

    // Subscribe to real-time updates
    const anomalySubscription = supabase
      .channel('anomaly_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'value_anomaly_alerts' },
        () => fetchData()
      )
      .subscribe()

    const patternSubscription = supabase
      .channel('pattern_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'answer_patterns' },
        () => fetchData()
      )
      .subscribe()

    return () => {
      anomalySubscription.unsubscribe()
      patternSubscription.unsubscribe()
    }
  }, [])

  async function fetchData() {
    try {
      const [anomaliesRes, patternsRes, trustRes] = await Promise.all([
        supabase
          .from('value_anomaly_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('answer_patterns')
          .select('*')
          .order('detected_at', { ascending: false })
          .limit(50),
        supabase
          .from('trust_scores')
          .select('*')
          .order('combined_trust', { ascending: true })
          .limit(20)
      ])

      if (anomaliesRes.data) setAnomalies(anomaliesRes.data)
      if (patternsRes.data) setPatterns(patternsRes.data)
      if (trustRes.data) setTrustScores(trustRes.data)
    } catch (error) {
      console.error('Error fetching anomaly data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSuspicionColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/30'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/30'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30'
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Anomaly Dashboard</h1>
          <p className="text-gray-400">Supabase not configured. Set up your environment variables.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading anomaly data...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Anomaly Detection Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time monitoring of suspicious patterns, value manipulation, and trust scores
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Public transparency - all anomalies are visible to everyone
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'anomalies', label: 'Value Anomalies', count: anomalies.length },
            { id: 'patterns', label: 'Suspicious Patterns', count: patterns.length },
            { id: 'trust', label: 'Low Trust Scores', count: trustScores.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Value Anomalies Tab */}
          {activeTab === 'anomalies' && (
            <div className="space-y-4">
              {anomalies.length === 0 ? (
                <div className="bg-gray-900 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No anomalies detected. System is healthy! ✓</p>
                </div>
              ) : (
                anomalies.map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{anomaly.dimension}</h3>
                        {anomaly.region && (
                          <p className="text-sm text-gray-400">Region: {anomaly.region}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSuspicionColor(anomaly.suspicion_level)}`}>
                        {anomaly.suspicion_level.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Reason</p>
                        <p className="text-sm font-semibold capitalize">{anomaly.reason.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Sample Size</p>
                        <p className="text-sm font-semibold">{anomaly.affected_sample_size}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Baseline</p>
                        <p className="text-sm font-semibold">{anomaly.historical_baseline?.toFixed(3) ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current</p>
                        <p className="text-sm font-semibold">{anomaly.current_value?.toFixed(3) ?? 'N/A'}</p>
                      </div>
                    </div>

                    {anomaly.sigma_deviation && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">Sigma Deviation</p>
                        <p className="text-lg font-bold text-yellow-500">{anomaly.sigma_deviation.toFixed(2)}σ</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Detected: {new Date(anomaly.created_at).toLocaleString()}</span>
                      <span className={anomaly.resolved ? 'text-green-500' : 'text-yellow-500'}>
                        {anomaly.resolved ? '✓ Resolved' : '⚠ Active'}
                      </span>
                    </div>

                    {anomaly.resolution_notes && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-sm text-gray-400">Resolution: {anomaly.resolution_notes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Suspicious Patterns Tab */}
          {activeTab === 'patterns' && (
            <div className="space-y-4">
              {patterns.length === 0 ? (
                <div className="bg-gray-900 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No suspicious patterns detected.</p>
                </div>
              ) : (
                patterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold capitalize">{pattern.pattern_type.replace('_', ' ')}</h3>
                        <p className="text-sm text-gray-400">User ID: {pattern.user_id.substring(0, 8)}...</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        Confidence: {(pattern.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Detected: {new Date(pattern.detected_at).toLocaleString()}
                    </div>

                    {pattern.details && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-xs text-gray-500 mb-2">Details:</p>
                        <pre className="text-xs bg-black/50 p-3 rounded overflow-x-auto">
                          {JSON.stringify(pattern.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Trust Scores Tab */}
          {activeTab === 'trust' && (
            <div className="space-y-4">
              {trustScores.length === 0 ? (
                <div className="bg-gray-900 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No trust scores available yet.</p>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">User ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Behavioral</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Network</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Consistency</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Time-Weighted</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Combined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {trustScores.map((score) => (
                        <tr key={score.user_id} className="hover:bg-gray-800/50">
                          <td className="px-4 py-3 text-sm">{score.user_id.substring(0, 8)}...</td>
                          <td className="px-4 py-3 text-sm">{score.behavioral_score.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">{score.network_score.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">{score.consistency_score.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">{score.time_weighted_score.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-bold">
                            <span className={score.combined_trust < 0.3 ? 'text-red-500' : score.combined_trust < 0.6 ? 'text-yellow-500' : 'text-green-500'}>
                              {score.combined_trust.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <h3 className="font-bold mb-3">How Anomaly Detection Works</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <strong className="text-white">Value Anomalies:</strong> Statistical outliers detected when regional values shift more than 3 standard deviations from historical baseline.
            </p>
            <p>
              <strong className="text-white">Suspicious Patterns:</strong> Behavioral analysis identifies bot-like behavior, unrealistic response times, or contradictory answers.
            </p>
            <p>
              <strong className="text-white">Trust Scores:</strong> Composite score combining behavioral, network (voucher chain), consistency, and time-weighted factors. Lower scores receive reduced voting weight.
            </p>
            <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">
              This dashboard is public and transparent. Only Builders can take action on anomalies.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
