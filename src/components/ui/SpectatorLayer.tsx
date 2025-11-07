'use client'

import { useEffect, useState } from 'react'

interface SpectatorLayerProps {
  selectedHub: string | null
  onClearHub: () => void
  onSelectHub: (hubName: string) => void
  showUI: boolean
  cycleIndex: number
  setCycleIndex: React.Dispatch<React.SetStateAction<number>>
}

// Regional hubs data
const regionalHubs = [
  { name: 'North America', initialViews: 2347839 },
  { name: 'Latin America', initialViews: 1823456 },
  { name: 'Western Europe', initialViews: 3891234 },
  { name: 'Eastern Europe', initialViews: 1456789 },
  { name: 'Middle East', initialViews: 892345 },
  { name: 'Africa', initialViews: 1234567 },
  { name: 'India', initialViews: 12456789 },
  { name: 'China', initialViews: 9876543 },
  { name: 'Southeast Asia', initialViews: 2345678 },
  { name: 'East Asia', initialViews: 3456789 },
  { name: 'Oceania', initialViews: 567890 },
]

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
  showUI,
  cycleIndex,
  setCycleIndex
}: SpectatorLayerProps) {
  const [stats, setStats] = useState(getGlobalStats())
  const [witnesses, setWitnesses] = useState<string[]>([])
  const [hopeLevel, setHopeLevel] = useState(3)

  useEffect(() => {
    let lastStatsUpdate = Date.now()
    let lastWitnessUpdate = Date.now()
    let rafId: number

    const names = ['Maria', 'Ahmed', 'Lin', 'Sarah', 'Raj', 'Anna', 'Carlos', 'Yuki', 'Hassan', 'Elena']
    const countries = ['🇧🇷', '🇪🇬', '🇸🇬', '🇨🇦', '🇮🇳', '🇷🇺', '🇲🇽', '🇯🇵', '🇸🇦', '🇪🇸']

    const animate = () => {
      const now = Date.now()
      if (now - lastStatsUpdate >= 3000) {
        setStats(getGlobalStats())
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
  }, [])

  const handleNextHub = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCycleIndex(prev => (prev + 1) % regionalHubs.length)
  }

  const handlePrevHub = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCycleIndex(prev => (prev - 1 + regionalHubs.length) % regionalHubs.length)
  }

  // Ensure cycleIndex is within bounds
  const safeIndex = Math.min(cycleIndex, regionalHubs.length - 1)
  const currentCycledHub = regionalHubs[safeIndex]

  const formatNumber = (num: number) => num.toLocaleString('en-US')

  return (
    <>
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

      {/* --- Personal Impact (Bottom Left) --- */}
      <div className="fixed bottom-4 left-4 bg-black/70 backdrop-blur-sm border border-gray-800 rounded-lg p-4 z-40 w-64 hidden md:block">
        <div className="text-sm font-bold text-blue-400 mb-3 uppercase tracking-wider">YOUR CONTRIBUTION</div>
        <div className="space-y-2 text-xs">
          <div className="text-gray-300">
            👁️ You are witness #{formatNumber(stats.totalWitnesses)}
          </div>
          <div className="text-gray-300">
            🔗 Share to boost
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Your hope level:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setHopeLevel(level)}
                  className={`text-lg transition-opacity ${level <= hopeLevel ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
                  aria-label={`Set hope level to ${level}`}
                >
                  {level === 1 ? '😞' : level === 2 ? '😐' : level === 3 ? '🙂' : level === 4 ? '😊' : '🤩'}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs font-bold uppercase tracking-wider transition-colors">
            🔔 Get notified
          </button>
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
                  // Navigate to hub in the future
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
                className="w-full mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold uppercase tracking-wider transition-colors"
              >
                ENTER HUB
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
    </>
  )
}
