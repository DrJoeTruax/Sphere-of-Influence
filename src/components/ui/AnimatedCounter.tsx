'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  className?: string
}

export default function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  className = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return

    hasAnimated.current = true
    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (easeOutCubic)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(startValue + (end - startValue) * easeOut)

      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <div ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </div>
  )
}
