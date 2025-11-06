/**
 * Performance utilities for the Breakthrough Platform
 */

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Request idle callback wrapper with fallback
 */
export function requestIdleCallbackPolyfill(
  callback: () => void,
  options?: { timeout?: number }
): number {
  if (typeof window === 'undefined') return 0

  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options)
  }

  // Fallback to setTimeout
  return setTimeout(callback, options?.timeout || 1) as unknown as number
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallbackPolyfill(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id)
  } else {
    clearTimeout(id)
  }
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  options?: IntersectionObserverInit
): () => void {
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without intersection observer
    img.src = src
    return () => {}
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src
        observer.disconnect()
      }
    })
  }, options)

  observer.observe(img)

  return () => observer.disconnect()
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()

  mark(name: string): void {
    this.marks.set(name, performance.now())
  }

  measure(name: string, startMark: string): number {
    const start = this.marks.get(startMark)
    if (!start) {
      console.warn(`No mark found for: ${startMark}`)
      return 0
    }

    const duration = performance.now() - start
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return duration
  }

  clear(name?: string): void {
    if (name) {
      this.marks.delete(name)
    } else {
      this.marks.clear()
    }
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get device pixel ratio
 */
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1
  return window.devicePixelRatio || 1
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Check if connection is slow (3G or slower)
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false
  }

  const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection
  if (!connection || !connection.effectiveType) return false

  return ['slow-2g', '2g', '3g'].includes(connection.effectiveType)
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, type: 'font' | 'image' | 'script' | 'style'): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  link.as = type

  if (type === 'font') {
    link.setAttribute('crossorigin', 'anonymous')
  }

  document.head.appendChild(link)
}

/**
 * Measure First Contentful Paint
 */
export function measureFCP(): Promise<number | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      resolve(null)
      return
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            observer.disconnect()
            resolve(entry.startTime)
            return
          }
        }
      })

      observer.observe({ entryTypes: ['paint'] })

      // Timeout after 10 seconds
      setTimeout(() => {
        observer.disconnect()
        resolve(null)
      }, 10000)
    } catch {
      resolve(null)
    }
  })
}

/**
 * Optimize 3D rendering based on device capabilities
 */
export function get3DQualitySettings(): {
  shadowsEnabled: boolean
  antialias: boolean
  pixelRatio: number
  maxParticles: number
} {
  const isMobile = isMobileDevice()
  const pixelRatio = Math.min(getDevicePixelRatio(), 2) // Cap at 2x
  const isSlowConn = isSlowConnection()

  return {
    shadowsEnabled: !isMobile && !isSlowConn,
    antialias: !isMobile,
    pixelRatio: isMobile ? 1 : pixelRatio,
    maxParticles: isMobile ? 50 : isSlowConn ? 100 : 200,
  }
}
