import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { EmergencyAlert } from '@/components/alerts/EmergencyAlert'

/**
 * Hook for fetching and subscribing to emergency alerts
 *
 * Features:
 * - Fetches active alerts on mount
 * - Real-time subscriptions via Supabase
 * - Automatic cleanup on unmount
 * - Graceful fallback when Supabase not configured
 */
export function useEmergencyAlerts() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch initial alerts
    fetchAlerts()

    // Subscribe to real-time updates
    const subscription = subscribeToAlerts()

    // Cleanup on unmount
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const fetchAlerts = async () => {
    if (!isSupabaseConfigured) {
      console.log('[Demo Mode] No emergency alerts (Supabase not configured)')
      setAlerts([])
      setIsLoading(false)
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('emergency_alerts')
        .select('*')
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching emergency alerts:', fetchError)
        setError('Failed to load emergency alerts')
      } else {
        setAlerts(data || [])
      }
    } catch (err) {
      console.error('Error fetching emergency alerts:', err)
      setError('Failed to load emergency alerts')
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToAlerts = () => {
    if (!isSupabaseConfigured) {
      return null
    }

    const channel = supabase
      .channel('emergency_alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_alerts',
          filter: 'is_active=eq.true',
        },
        (payload) => {
          console.log('Emergency alert change:', payload)

          if (payload.eventType === 'INSERT') {
            // New alert created
            const newAlert = payload.new as EmergencyAlert
            setAlerts((prev) => [newAlert, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            // Alert updated
            const updatedAlert = payload.new as EmergencyAlert
            setAlerts((prev) =>
              prev.map((alert) =>
                alert.id === updatedAlert.id ? updatedAlert : alert
              )
            )
          } else if (payload.eventType === 'DELETE') {
            // Alert deleted
            const deletedAlert = payload.old as EmergencyAlert
            setAlerts((prev) =>
              prev.filter((alert) => alert.id !== deletedAlert.id)
            )
          }
        }
      )
      .subscribe()

    return channel
  }

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  return {
    alerts,
    isLoading,
    error,
    dismissAlert,
    refetch: fetchAlerts,
  }
}

/**
 * Create a mock emergency alert for testing
 */
export function createMockAlert(
  severity: 'critical' | 'high' | 'medium' | 'low' = 'high'
): EmergencyAlert {
  const messages = {
    critical: {
      title: 'CRITICAL: Platform Maintenance Required',
      message: 'The platform will be temporarily unavailable for critical maintenance in 10 minutes. All active sessions will be saved automatically.\n\nEstimated downtime: 30 minutes\nScheduled: ' + new Date(Date.now() + 600000).toLocaleTimeString(),
    },
    high: {
      title: 'Important Security Update Available',
      message: 'A security vulnerability has been identified and patched. Please refresh your browser to receive the latest updates.\n\nThis update addresses potential data exposure risks and is strongly recommended for all users.',
    },
    medium: {
      title: 'New Proposal Voting Period Ending Soon',
      message: 'The voting period for several critical AGI safety proposals will end in 24 hours. Make sure your voice is heard on these important decisions:\n\n• Constitutional AI Framework\n• Global Compute Sharing Protocol\n• Interpretability Standards',
    },
    low: {
      title: 'Community Milestone Achieved!',
      message: 'The Breakthrough Platform has reached 10,000 active Builders! Thank you for being part of this historic collaboration.\n\nTogether, we are shaping the future of AGI safety and alignment.',
    },
  }

  return {
    id: `mock-${Date.now()}`,
    title: messages[severity].title,
    message: messages[severity].message,
    severity,
    action_url: severity === 'critical' ? '/status' : undefined,
    action_text: severity === 'critical' ? 'View Status Page' : undefined,
    created_at: new Date().toISOString(),
    expires_at: severity === 'critical' ? new Date(Date.now() + 600000).toISOString() : undefined,
    is_active: true,
  }
}
