'use client'

import { useEffect, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import * as THREE from 'three'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ValueDimension {
  id: string
  name: string
  value_dimension: string
  global_average: number
  by_region: Record<string, number>
  sample_size: number
}

export default function ValuesMapPage() {
  const [dimensions, setDimensions] = useState<ValueDimension[]>([])
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')
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
          <p className="text-white/60">Live visualization of what humanity actually values</p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded-lg transition ${
                viewMode === '3d' ? 'bg-cyan-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              3D View
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-4 py-2 rounded-lg transition ${
                viewMode === '2d' ? 'bg-cyan-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              2D View
            </button>
          </div>
        </div>
      </div>

      {/* Visualization */}
      {viewMode === '3d' ? (
        <Values3DMap
          dimensions={dimensions}
          selectedDimension={selectedDimension}
          onSelectDimension={setSelectedDimension}
        />
      ) : (
        <Values2DMap dimensions={dimensions} />
      )}

      {/* Stats Panel */}
      <div className="fixed bottom-4 right-4 bg-gray-900 border border-cyan-500/30 rounded-xl p-4 max-w-sm">
        <h3 className="font-bold mb-3">Live Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Total Responses:</span>
            <span className="text-cyan-400 font-mono">
              {dimensions.reduce((sum, d) => sum + (d.sample_size || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Value Dimensions:</span>
            <span className="text-cyan-400 font-mono">{dimensions.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Last Updated:</span>
            <span className="text-cyan-400 font-mono">Live</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Values3DMap({ dimensions, selectedDimension, onSelectDimension }: any) {
  return (
    <div className="h-[calc(100vh-200px)]">
      <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
        <Suspense fallback={null}>
          <OrbitControls enableDamping dampingFactor={0.05} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          {/* Value Dimensions as 3D Spheres */}
          {dimensions.map((dim: ValueDimension, i: number) => {
            const angle = (i / dimensions.length) * Math.PI * 2
            const radius = 20
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            const y = ((dim.global_average || 0) * 10)

            return (
              <group key={dim.value_dimension} position={[x, y, z]}>
                <mesh
                  onClick={() => onSelectDimension(dim.value_dimension)}
                  onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
                  onPointerOut={() => document.body.style.cursor = 'default'}
                >
                  <sphereGeometry args={[Math.max(Math.sqrt(dim.sample_size || 1) / 50, 0.5), 32, 32]} />
                  <meshStandardMaterial
                    color={selectedDimension === dim.value_dimension ? '#00bcd4' : '#4caf50'}
                    emissive={selectedDimension === dim.value_dimension ? '#00bcd4' : '#000000'}
                    emissiveIntensity={0.5}
                  />
                </mesh>

                <Text
                  position={[0, 2, 0]}
                  fontSize={0.8}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  {dim.name}
                </Text>

                <Text
                  position={[0, -2, 0]}
                  fontSize={0.6}
                  color="#00bcd4"
                  anchorX="center"
                  anchorY="middle"
                >
                  {(dim.global_average || 0).toFixed(2)}
                </Text>
              </group>
            )
          })}
        </Suspense>
      </Canvas>
    </div>
  )
}

function Values2DMap({ dimensions }: { dimensions: ValueDimension[] }) {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid md:grid-cols-2 gap-6">
        {dimensions.map(dim => (
          <ValueDimensionCard key={dim.value_dimension} dimension={dim} />
        ))}
      </div>
    </div>
  )
}

function ValueDimensionCard({ dimension }: { dimension: ValueDimension }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition"
    >
      <h3 className="font-bold text-lg mb-4">{dimension.name}</h3>

      {/* Global Average Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/60">Global Average</span>
          <span className="text-cyan-400 font-mono">
            {(dimension.global_average || 0).toFixed(2)}
          </span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${(((dimension.global_average || 0) + 1) / 2) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
      </div>

      {/* Regional Breakdown */}
      {dimension.by_region && Object.keys(dimension.by_region).length > 0 && (
        <div>
          <h4 className="text-sm font-bold mb-3 text-white/60">By Region</h4>
          <div className="space-y-2">
            {Object.entries(dimension.by_region).map(([region, value]) => (
              <div key={region} className="flex justify-between items-center text-sm">
                <span className="text-white/80">{region}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{ width: `${(((value as number) + 1) / 2) * 100}%` }}
                    />
                  </div>
                  <span className="text-cyan-400 font-mono w-12 text-right">
                    {(value as number).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Size */}
      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
        Based on {(dimension.sample_size || 0).toLocaleString()} responses
      </div>
    </motion.div>
  )
}
