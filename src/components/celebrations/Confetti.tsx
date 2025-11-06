'use client'

import { useEffect, useRef } from 'react'

interface ConfettiProps {
  active: boolean
  duration?: number
  particleCount?: number
  colors?: string[]
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  shape: 'square' | 'circle' | 'triangle'
}

export default function Confetti({
  active,
  duration = 5000,
  particleCount = 150,
  colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'],
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas.width))
    startTimeRef.current = Date.now()

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      const elapsed = Date.now() - (startTimeRef.current || 0)
      if (elapsed > duration) {
        // Cleanup
        window.removeEventListener('resize', resize)
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.3 // Gravity
        particle.rotation += particle.rotationSpeed

        // Draw particle
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.fillStyle = particle.color

        if (particle.shape === 'square') {
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        } else if (particle.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (particle.shape === 'triangle') {
          ctx.beginPath()
          ctx.moveTo(0, -particle.size / 2)
          ctx.lineTo(-particle.size / 2, particle.size / 2)
          ctx.lineTo(particle.size / 2, particle.size / 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()

        // Remove particles that are off-screen
        if (particle.y > canvas.height + 50) {
          particle.y = -50
          particle.x = Math.random() * canvas.width
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [active, duration, particleCount])

  const createParticle = (canvasWidth: number): Particle => {
    const shapes: Array<'square' | 'circle' | 'triangle'> = ['square', 'circle', 'triangle']

    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * -500 - 50, // Start above screen
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }
  }

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[90]"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
