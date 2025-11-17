'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface SpectatorLayerProps {
  selectedHub: string | null
  onClearHub: () => void
  onSelectHub: (hubName: string) => void
  onConfirmSelection: () => void
  showUI: boolean
  cycleIndex: number
  setCycleIndex: React.Dispatch<React.SetStateAction<number>>
}

// Regional hubs data with colors matching Earth regions
const regionalHubs = [
  { name: 'North America', initialViews: 2347839, color: '#4CAF50' },
  { name: 'Latin America', initialViews: 1823456, color: '#FFC107' },
  { name: 'Western Europe', initialViews: 3891234, color: '#2196F3' },
  { name: 'Eastern Europe', initialViews: 1456789, color: '#9C27B0' },
  { name: 'Middle East', initialViews: 892345, color: '#FF5722' },
  { name: 'Africa', initialViews: 1234567, color: '#795548' },
  { name: 'India', initialViews: 12456789, color: '#FF9800' },
  { name: 'China', initialViews: 9876543, color: '#F44336' },
  { name: 'Southeast Asia', initialViews: 2345678, color: '#00BCD4' },
  { name: 'East Asia', initialViews: 3456789, color: '#E91E63' },
  { name: 'Oceania', initialViews: 567890, color: '#009688' },
]

// Convert hub display name to URL slug
function hubNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function getViewCount(hubName: string): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(`hub_${hubName}_views`)
  if (stored) return parseInt(stored)
  const hub = regionalHubs.find((h) => h.name === hubName)
  return hub?.initialViews || 100000
}

function incrementViewCount(hubName: string): number {
  if (typeof window === 'undefined') return 0
  const current = getViewCount(hubName)
  const newCount = current + Math.floor(Math.random() * 10) + 1
  localStorage.setItem(`hub_${hubName}_views`, newCount.toString())
  return newCount
}

function getGlobalStats() {
  const total = regionalHubs.reduce((acc, hub) => acc + getViewCount(hub.name), 0)
  return {
    totalWitnesses: total,
    liveNow: Math.floor(total * 0.018 + (Math.random() * 1000)), // ~1.8% active
    hopeIndex: 84,
  }
}

export default function SpectatorLayer({
  selectedHub,
  onClearHub,
  onSelectHub,
  onConfirmSelection,
  showUI,
  cycleIndex,
  setCycleIndex
}: SpectatorLayerProps) {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ totalWitnesses: 0, liveNow: 0, hopeIndex: 84 })
  const [witnesses, setWitnesses] = useState<string[]>([])
  const [hopeLevel, setHopeLevel] = useState(3)
  const [hubViews, setHubViews] = useState<Record<string, number>>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize stats on client only
  useEffect(() => {
    setMounted(true)
    setStats(getGlobalStats())

    // Initialize hub views
    const views: Record<string, number> = {}
    regionalHubs.forEach(hub => {
      views[hub.name] = getViewCount(hub.name)
    })
    setHubViews(views)

    // Check initial fullscreen state
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (!mounted) return

    let lastStatsUpdate = Date.now()
    let lastWitnessUpdate = Date.now()
    let rafId: number

    const names = ['Maria', 'Ahmed', 'Lin', 'Sarah', 'Raj', 'Anna', 'Carlos', 'Yuki', 'Hassan', 'Elena']
    const countries = ['🇧🇷', '🇪🇬', '🇸🇬', '🇨🇦', '🇮🇳', '🇷🇺', '🇲🇽', '🇯🇵', '🇸🇦', '🇪🇸']

    const animate = () => {
      const now = Date.now()
      if (now - lastStatsUpdate >= 3000) {
        setStats(getGlobalStats())

        // Update hub views
        const views: Record<string, number> = {}
        regionalHubs.forEach(hub => {
          views[hub.name] = getViewCount(hub.name)
        })
        setHubViews(views)

        lastStatsUpdate = now
      }
      if (now - lastWitnessUpdate >= 2000) {
        const newWitness = `${names[Math.floor(Math.random() * names.length)]} • ${countries[Math.floor(Math.random() * countries.length)]}`
        setWitnesses((prev) => [newWitness, ...prev.slice(0, 9)])
        lastWitnessUpdate = now
      }
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [mounted])

  const handleNextHub = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCycleIndex(prev => (prev + 1) % regionalHubs.length)
  }

  const handlePrevHub = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCycleIndex(prev => (prev - 1 + regionalHubs.length) % regionalHubs.length)
  }

  const handleFullscreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen()
        }
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err)
    }
  }

  // Ensure cycleIndex is within bounds
  const safeIndex = Math.min(cycleIndex, regionalHubs.length - 1)
  const currentCycledHub = regionalHubs[safeIndex]

  const formatNumber = (num: number) => num.toLocaleString('en-US')

  return (
    <div ref={containerRef} className="w-full h-full">
      {/* --- Top Right Navigation Menu --- */}
      <div className="fixed top-20 right-4 flex gap-2 z-40">
        {/* Human Values Map Button */}
        <Link
          href="/values-map"
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg text-white text-sm font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
          title="View Human Values Map"
        >
          <span>🗺️</span>
          <span className="hidden sm:inline">Values Map</span>
        </Link>

        {/* Project Agame Button */}
        <Link
          href="/hub/north-america/spectator/agame"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white text-sm font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
          title="Play Project Agame"
        >
          <span>🎮</span>
          <span className="hidden sm:inline">Project Agame</span>
        </Link>

        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreenToggle}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg text-white text-sm font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <span>{isFullscreen ? '⊘' : '⛶'}</span>
          <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Full Screen'}</span>
        </button>
      </div>

      {/* --- Global Stats Bar (Top) --- */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-b border-gray-800 z-40 px-4 py-2" role="banner">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-x-4 gap-y-1 text-xs md:text-sm">
          <div className="flex items-center gap-2" aria-live="polite">
            <span className="text-gray-400">🌎 GLOBAL WITNESSES:</span>
            <span className="text-green-400 font-bold" aria-label={`${formatNumber(stats.totalWitnesses)} global witnesses`}>
              {formatNumber(stats.totalWitnesses)}
            </span>
          </div>
          <div className="flex items-center gap-2" aria-live="polite">
            <span className="text-gray-400">🔴 LIVE NOW:</span>
            <span className="text-red-400 font-bold" aria-label={`${formatNumber(stats.liveNow)} viewers live now`}>
              {formatNumber(stats.liveNow)}
            </span>
          </div>
          <div className="flex items-center gap-2" aria-live="polite">
            <span className="text-gray-400">💫 HOPE INDEX:</span>
            <span className="text-blue-400 font-bold" aria-label={`Hope index at ${stats.hopeIndex} percent`}>
              {stats.hopeIndex}% Hopeful
            </span>
          </div>
        </div>
      </div>

      {/* --- Witness Wall (Bottom Right) --- */}
      <div className="fixed bottom-4 right-4 bg-black/70 backdrop-blur-sm border border-gray-800 rounded-lg p-3 z-40 w-48 max-h-64 overflow-hidden hidden md:block">
        <div className="text-xs text-gray-400 mb-2 font-mono uppercase tracking-wider">══ HUMANS HERE NOW ══</div>
        <div className="space-y-1 text-xs">
          {witnesses.map((witness, i) => (
            <div key={i} className="text-gray-300 opacity-0 animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
              {witness}
            </div>
          ))}
        </div>
      </div>

      {/* --- Master Regional Hub List (Bottom Left) --- */}
      <div className="fixed bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 z-40 w-80 max-h-[70vh] overflow-y-auto hidden md:block">
        <div className="text-sm font-bold text-blue-400 mb-3 uppercase tracking-wider text-center border-b border-gray-700 pb-2">
          11 REGIONAL HUBS + SPACE STATION
        </div>
        <div className="space-y-1 text-xs font-mono">
          {regionalHubs.map((hub, index) => {
            const views = hubViews[hub.name] || 0
            const emoji = index < 2 ? '🌎' : index < 6 ? '🌍' : '🌏'
            const isSelected = cycleIndex === index
            return (
              <button
                key={hub.name}
                onClick={() => {
                  setCycleIndex(index)
                  onSelectHub(hub.name)
                }}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  isSelected ? 'bg-blue-900/50 border' : 'hover:bg-gray-800'
                }`}
                style={isSelected ? { borderColor: hub.color } : {}}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex-shrink-0">{emoji}</span>
                  <span className="flex-1 truncate" style={{ color: hub.color }}>{hub.name}</span>
                  <span className="text-green-400">{formatNumber(views)}</span>
                  <span style={{ color: hub.color }}>◉</span>
                  <span className="text-gray-400 text-[10px]">EN</span>
                </div>
              </button>
            )
          })}
          {/* Space Station */}
          <button
            onClick={() => onSelectHub('space-station')}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 transition-colors border-t border-gray-700 mt-2 pt-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex-shrink-0">🛰️</span>
              <span className="flex-1 truncate">Space Station</span>
              <span className="text-green-400">{formatNumber(stats.totalWitnesses)}</span>
              <span className="text-gray-500">◉</span>
              <span className="text-gray-400 text-[10px]">ALL</span>
            </div>
          </button>
        </div>
        <div className="text-center text-gray-500 text-[10px] mt-3 pt-2 border-t border-gray-700">
          Click any hub to select • Arrow keys to cycle
        </div>
      </div>

      {/* --- Share Widget (Bottom Center) --- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm border border-gray-800 rounded-lg p-3 z-40">
        <div className="text-xs text-center mb-2 text-gray-400 uppercase tracking-wider">🌟 AMPLIFY THIS MOMENT</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors">📋</button>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white transition-colors">𝕏</button>
          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white transition-colors">💬</button>
          <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white transition-colors">📧</button>
        </div>
      </div>

      {/* --- Hub Selector (cycler) & Selected Hub Info (popup) --- */}
      {showUI && (
        <>
          {/* --- Selected Hub Info (The Popup) --- */}
          {selectedHub && (
            <div className="fixed top-20 left-10 bg-black/80 backdrop-blur-md border-2 border-gray-700 rounded-xl p-6 z-40 w-[450px] max-w-[90vw] opacity-0 animate-fadeIn">
              <button
                onClick={onClearHub}
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Close hub details"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold text-white mb-4">{selectedHub}</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div>👁️ {formatNumber(getViewCount(selectedHub))} total witnesses</div>
                <div>🟢 {formatNumber(Math.floor(getViewCount(selectedHub) * 0.018))} viewing now</div>
                <div>✨ {formatNumber(Math.floor(getViewCount(selectedHub) * 0.02))} active contributors</div>
                <div>🚀 {Math.floor(Math.random() * 20) + 5} breakthroughs in progress</div>
              </div>
              <button
                onClick={() => {
                  incrementViewCount(selectedHub)
                  // Convert display name to slug and navigate
                  const hubSlug = hubNameToSlug(selectedHub)
                  // Store the selected hub before confirming
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('breakthrough_selected_hub', hubSlug)
                  }
                  onConfirmSelection()
                }}
                className="w-full mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold uppercase tracking-wider transition-colors"
              >
                ENTER HUB
              </button>
            </div>
          )}

          {/* --- Hub Selector (The Cycler) --- */}
          {!selectedHub && (
            <div className="fixed top-20 left-10 bg-black/80 backdrop-blur-md border-2 border-gray-700 rounded-xl p-6 z-40 w-[450px] max-w-[90vw] opacity-0 animate-fadeIn">
              <h3 className="text-xl font-bold text-white mb-4 text-center">{currentCycledHub.name}</h3>

              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handlePrevHub}
                  className="px-4 py-2 text-2xl text-gray-400 hover:text-white transition-colors"
                  aria-label="Previous hub"
                >
                  &larr;
                </button>
                <div className="text-sm text-gray-400">
                  {cycleIndex + 1} / {regionalHubs.length}
                </div>
                <button
                  onClick={handleNextHub}
                  className="px-4 py-2 text-2xl text-gray-400 hover:text-white transition-colors"
                  aria-label="Next hub"
                >
                  &rarr;
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-300">
                <div>👁️ {formatNumber(getViewCount(currentCycledHub.name))} total witnesses</div>
                <div>🟢 {formatNumber(Math.floor(getViewCount(currentCycledHub.name) * 0.018))} viewing now</div>
              </div>

              <button
                onClick={() => {
                  onSelectHub(currentCycledHub.name)
                  incrementViewCount(currentCycledHub.name)
                }}
                className="w-full mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white font-bold uppercase tracking-wider transition-colors"
              >
                SELECT HUB
              </button>
            </div>
          )}
        </>
      )}

      {/* --- Cost Notice --- */}
      <div className="fixed bottom-2 left-2 text-gray-600 text-[10px] z-50 hidden md:block">
        Built with: $12 domain + $52 in AI subscriptions. Total: $64. Not venture capital. Just coordination.
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
