'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface Hub {
  id: string
  slug: string
  name: string
  description: string | null
  language_codes: string[]
  position_3d: { x: number; y: number; z: number } | null
  active_contributors: number
  created_at: string
}

export function useHubs() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchHubs() {
      try {
        const { data, error } = await supabase
          .from('hubs')
          .select('*')
          .order('name')

        if (error) throw error
        setHubs(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchHubs()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('hubs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hubs' },
        (payload) => {
          console.log('Hub change:', payload)
          fetchHubs() // Refresh on any change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { hubs, loading, error }
}
