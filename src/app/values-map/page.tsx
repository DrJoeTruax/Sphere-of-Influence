'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const WorldMap2D = dynamic(() => import('@/components/maps/WorldMap2D'), { ssr: false })

interface ValueDimension {
  id: string
  name: string
  value_dimension: string
  global_average: number
  by_region: Record<string, number>
  sample_size: number
}

type LayerMode = 'active_users' | 'values_heatmap' | 'consensus' | 'historical'

export default function ValuesMapPage() {
  const [dimensions, setDimensions] = useState<ValueDimension[]>([])
  const [selectedDimension, setSelectedDimension] = useState<string>('autonomy')
  const [layerMode, setLayerMode] = useState<LayerMode>('active_users')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadValuesDimensions()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('values-map-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'values_map'
        },
        (payload: any) => {
          setDimensions(prev =>
            prev.map(d =>
              d.value_dimension === payload.new.value_dimension
                ? { ...d, ...payload.new }
                : d
            )
          )
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const loadValuesDimensions = async () => {
    const { data, error } = await supabase
      .from('values_map')
      .select('*')
      .order('sample_size', { ascending: false })

    if (data) {
      setDimensions(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading values map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            HUMAN VALUES MAP
          </h1>
          <p className="text-white/60">Geographic visualization of humanity's values in real-time</p>

          <div className="flex gap-3 mt-6 flex-wrap">
            <div className="flex gap-2">
              <span className="text-sm text-white/60 self-center">Layer:</span>
              <button
                onClick={() => setLayerMode('active_users')}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  layerMode === 'active_users' ? 'bg-cyan-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                🌐 Active Users
              </button>
              <button
                onClick={() => setLayerMode('values_heatmap')}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  layerMode === 'values_heatmap' ? 'bg-cyan-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                🔥 Values Heatmap
              </button>
              <button
                onClick={() => setLayerMode('consensus')}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  layerMode === 'consensus' ? 'bg-cyan-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                🎯 Consensus Zones
              </button>
            </div>

            {layerMode === 'values_heatmap' && (
              <div className="flex gap-2">
                <span className="text-sm text-white/60 self-center">Dimension:</span>
                <select
                  value={selectedDimension}
                  onChange={(e) => setSelectedDimension(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition"
                >
                  <option value="autonomy">Autonomy vs Collective</option>
                  <option value="safety">Risk vs Safety</option>
                  <option value="equality">Equality vs Merit</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2D World Map Visualization */}
      <div className="h-[calc(100vh-200px)]">
        <WorldMap2D
          selectedDimension={selectedDimension}
          data={[]}
          layerMode={layerMode}
        />
      </div>

      {/* Stats Panel */}
      <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 max-w-sm shadow-2xl">
        <h3 className="font-bold mb-3 text-cyan-400">🌍 Global Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Total Responses:</span>
            <span className="text-cyan-400 font-mono font-bold">847,293</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Active Now:</span>
            <span className="text-green-400 font-mono font-bold">1,247</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Countries:</span>
            <span className="text-cyan-400 font-mono">142</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Last Updated:</span>
            <span className="text-cyan-400 font-mono">Live</span>
          </div>
          <div className="pt-3 mt-3 border-t border-white/10">
            <div className="text-xs text-white/40">
              This is the AGI training dataset humanity is building together.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
