'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface EmergencyAlert {
  id: string
  title: string
  message: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  action_url?: string
  action_text?: string
  created_at: string
  expires_at?: string
  is_active: boolean
}

interface EmergencyAlertProps {
  alert: EmergencyAlert
  onDismiss?: () => void
  allowDismiss?: boolean
}

const SEVERITY_STYLES = {
  critical: {
    bg: 'bg-red-600',
    border: 'border-red-400',
    text: 'text-white',
    icon: '🚨',
    glow: 'shadow-lg shadow-red-500/50',
  },
  high: {
    bg: 'bg-orange-600',
    border: 'border-orange-400',
    text: 'text-white',
    icon: '⚠️',
    glow: 'shadow-lg shadow-orange-500/50',
  },
  medium: {
    bg: 'bg-yellow-600',
    border: 'border-yellow-400',
    text: 'text-black',
    icon: '⚡',
    glow: 'shadow-lg shadow-yellow-500/50',
  },
  low: {
    bg: 'bg-blue-600',
    border: 'border-blue-400',
    text: 'text-white',
    icon: 'ℹ️',
    glow: 'shadow-lg shadow-blue-500/50',
  },
}

export default function EmergencyAlert({
  alert,
  onDismiss,
  allowDismiss = true,
}: EmergencyAlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null)

  const styles = SEVERITY_STYLES[alert.severity]

  useEffect(() => {
    // Calculate time remaining if expires_at is set
    if (alert.expires_at) {
      const updateTimer = () => {
        const now = new Date().getTime()
        const expiresAt = new Date(alert.expires_at!).getTime()
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000))

        if (remaining === 0) {
          handleDismiss()
        } else {
          setSecondsRemaining(remaining)
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)

      return () => clearInterval(interval)
    }
  }, [alert.expires_at])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss?.()
    }, 300)
  }

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`max-w-2xl w-full ${styles.bg} ${styles.glow} border-2 ${styles.border} rounded-2xl p-8 ${styles.text}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">
                  {styles.icon}
                </div>
                <div>
                  <div className="text-sm uppercase font-bold tracking-wider opacity-80">
                    {alert.severity} Alert
                  </div>
                  <h1 className="text-3xl font-bold">
                    {alert.title}
                  </h1>
                </div>
              </div>
              {allowDismiss && (
                <button
                  onClick={handleDismiss}
                  className="text-3xl opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Dismiss alert"
                >
                  ×
                </button>
              )}
            </div>

            {/* Message */}
            <div className="mb-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {alert.message}
              </p>
            </div>

            {/* Timer */}
            {secondsRemaining !== null && (
              <div className="mb-6 text-center">
                <div className="inline-block bg-black/30 rounded-lg px-4 py-2">
                  <div className="text-sm opacity-80 mb-1">Auto-dismissing in</div>
                  <div className="text-2xl font-bold font-mono">
                    {formatTimeRemaining(secondsRemaining)}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              {alert.action_url && alert.action_text && (
                <a
                  href={alert.action_url}
                  className="flex-1 px-6 py-3 bg-white text-black font-bold text-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {alert.action_text}
                </a>
              )}
              {allowDismiss && (
                <button
                  onClick={handleDismiss}
                  className={`${alert.action_url ? 'px-6' : 'flex-1 px-6'} py-3 bg-black/30 hover:bg-black/50 font-semibold rounded-lg transition-colors`}
                >
                  {alert.action_url ? 'Dismiss' : 'I Understand'}
                </button>
              )}
            </div>

            {/* Timestamp */}
            <div className="mt-6 text-center text-sm opacity-70">
              Issued: {new Date(alert.created_at).toLocaleString()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
