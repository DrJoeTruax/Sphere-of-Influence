'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface RegionData {
  name: string
  lat: number
  lon: number
  sampleSize: number
  autonomy: number
  safety: number
  equality: number
  activeNow: number
}

interface WorldMap2DProps {
  selectedDimension: string
  data: RegionData[]
  layerMode: 'active_users' | 'values_heatmap' | 'consensus' | 'historical'
}

export default function WorldMap2D({ selectedDimension, data, layerMode }: WorldMap2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Major regional hubs with coordinates
  const regions: RegionData[] = [
    { name: 'North America', lat: 40, lon: -100, sampleSize: 247382, autonomy: 0.68, safety: 0.54, equality: 0.61, activeNow: 423 },
    { name: 'South America', lat: -15, lon: -60, sampleSize: 89234, autonomy: 0.55, safety: 0.62, equality: 0.71, activeNow: 156 },
    { name: 'Europe', lat: 50, lon: 10, sampleSize: 312456, autonomy: 0.61, safety: 0.68, equality: 0.64, activeNow: 687 },
    { name: 'Africa', lat: 0, lon: 20, sampleSize: 124567, autonomy: 0.58, safety: 0.51, equality: 0.69, activeNow: 234 },
    { name: 'Middle East', lat: 30, lon: 50, sampleSize: 98234, autonomy: 0.49, safety: 0.72, equality: 0.52, activeNow: 178 },
    { name: 'Russia', lat: 60, lon: 100, sampleSize: 145678, autonomy: 0.52, safety: 0.65, equality: 0.55, activeNow: 289 },
    { name: 'India', lat: 20, lon: 78, sampleSize: 456789, autonomy: 0.59, safety: 0.57, equality: 0.66, activeNow: 892 },
    { name: 'China', lat: 35, lon: 105, sampleSize: 678901, autonomy: 0.47, safety: 0.79, equality: 0.58, activeNow: 1247 },
    { name: 'Southeast Asia', lat: 5, lon: 115, sampleSize: 234567, autonomy: 0.62, safety: 0.61, equality: 0.63, activeNow: 534 },
    { name: 'Japan/Korea', lat: 37, lon: 135, sampleSize: 198765, autonomy: 0.64, safety: 0.73, equality: 0.59, activeNow: 412 },
    { name: 'Oceania', lat: -25, lon: 135, sampleSize: 78901, autonomy: 0.71, safety: 0.67, equality: 0.62, activeNow: 167 },
    { name: 'Space Station', lat: 0, lon: 0, sampleSize: 5432, autonomy: 0.85, safety: 0.45, equality: 0.74, activeNow: 12 }
  ]

  // Mercator projection
  const project = useCallback((lat: number, lon: number, width: number, height: number) => {
    const x = (lon + 180) * (width / 360)
    const latRad = (lat * Math.PI) / 180
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
    const y = height / 2 - (width * mercN) / (2 * Math.PI)
    return { x, y }
  }, [])

  // Draw simplified continents
  const drawContinents = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)'
    ctx.lineWidth = 1

    // Simplified continent outlines (rectangles for performance)
    const continents = [
      // North America
      { minLat: 15, maxLat: 70, minLon: -170, maxLon: -50 },
      // South America
      { minLat: -55, maxLat: 15, minLon: -80, maxLon: -35 },
      // Europe
      { minLat: 35, maxLat: 70, minLon: -10, maxLon: 40 },
      // Africa
      { minLat: -35, maxLat: 35, minLon: -20, maxLon: 50 },
      // Asia
      { minLat: -10, maxLat: 70, minLon: 40, maxLon: 150 },
      // Oceania
      { minLat: -45, maxLat: -10, minLon: 110, maxLon: 180 }
    ]

    continents.forEach(continent => {
      const topLeft = project(continent.maxLat, continent.minLon, width, height)
      const bottomRight = project(continent.minLat, continent.maxLon, width, height)

      ctx.strokeRect(
        topLeft.x,
        topLeft.y,
        bottomRight.x - topLeft.x,
        bottomRight.y - topLeft.y
      )
    })
  }, [project])

  // Draw grid lines (latitude/longitude)
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 0.5

    // Latitude lines every 30 degrees
    for (let lat = -60; lat <= 60; lat += 30) {
      const start = project(lat, -180, width, height)
      const end = project(lat, 180, width, height)
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }

    // Longitude lines every 30 degrees
    for (let lon = -180; lon <= 180; lon += 30) {
      const start = project(-80, lon, width, height)
      const end = project(80, lon, width, height)
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }
  }, [project])

  // Render based on layer mode
  const renderLayer = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    regions.forEach(region => {
      const pos = project(region.lat, region.lon, width, height)

      if (layerMode === 'active_users') {
        // Glowing dots for active users
        const size = Math.log(region.activeNow + 1) * 3
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 2)
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)')
        gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.4)')
        gradient.addColorStop(1, 'rgba(0, 150, 255, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, size * 2, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = '#00ffff'
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
        ctx.fill()

      } else if (layerMode === 'values_heatmap') {
        // Heat map based on selected dimension
        const value = region[selectedDimension as keyof RegionData] as number || 0
        const size = Math.sqrt(region.sampleSize) / 20

        // Color based on value (0-1 scale)
        const hue = value * 240 // Blue (240) to Red (0)
        const color = `hsla(${hue}, 80%, 60%, 0.7)`

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 2)
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.3)`)
        gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, size * 2, 0, Math.PI * 2)
        ctx.fill()

      } else if (layerMode === 'consensus') {
        // Consensus visualization
        const variance = Math.abs(region.autonomy - 0.5) + Math.abs(region.safety - 0.5) + Math.abs(region.equality - 0.5)
        const consensus = 1 - (variance / 1.5) // Higher = more consensus

        const size = Math.sqrt(region.sampleSize) / 25

        // Green = high consensus, Orange/Red = low consensus
        const color = consensus > 0.7 ? '#00ff00' : consensus > 0.4 ? '#ffaa00' : '#ff4400'

        ctx.fillStyle = color
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Region labels
      ctx.fillStyle = '#ffffff'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(region.name, pos.x, pos.y - 25)

      // Sample size
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '8px monospace'
      ctx.fillText(region.sampleSize.toLocaleString(), pos.x, pos.y + 30)
    })
  }, [layerMode, selectedDimension, regions, project])

  // Main render function
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)

    // Draw ocean gradient
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, height)
    oceanGradient.addColorStop(0, '#001a2e')
    oceanGradient.addColorStop(0.5, '#002040')
    oceanGradient.addColorStop(1, '#001428')
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    drawGrid(ctx, width, height)

    // Draw continents
    drawContinents(ctx, width, height)

    // Draw data layer
    renderLayer(ctx, width, height)

  }, [layerMode, selectedDimension, drawGrid, drawContinents, renderLayer])

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={1920}
        height={900}
        className="w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />

      {/* Hover info */}
      {hoveredRegion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-gray-900/90 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-xl"
        >
          <h3 className="font-bold text-cyan-400 mb-2">{hoveredRegion.name}</h3>
          <div className="space-y-1 text-sm">
            <div>Sample: {hoveredRegion.sampleSize.toLocaleString()}</div>
            <div>Active Now: {hoveredRegion.activeNow}</div>
            <div className="border-t border-white/10 pt-2 mt-2">
              <div>Autonomy: {(hoveredRegion.autonomy * 100).toFixed(1)}%</div>
              <div>Safety: {(hoveredRegion.safety * 100).toFixed(1)}%</div>
              <div>Equality: {(hoveredRegion.equality * 100).toFixed(1)}%</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
