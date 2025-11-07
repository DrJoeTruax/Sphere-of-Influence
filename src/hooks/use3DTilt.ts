'use client'

import { useState, useRef, MouseEvent } from 'react'

interface TiltConfig {
  maxTilt?: number
  perspective?: number
  scale?: number
  speed?: number
}

export function use3DTilt(config: TiltConfig = {}) {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400
  } = config

  const [tiltStyle, setTiltStyle] = useState({})
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const element = e.currentTarget
    const rect = element.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
      transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
    })
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setTiltStyle({
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
        transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
      })
    }, 50)
  }

  return {
    tiltStyle,
    tiltHandlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave
    }
  }
}
