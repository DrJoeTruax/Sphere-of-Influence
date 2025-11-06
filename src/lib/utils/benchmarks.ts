/**
 * Performance Benchmarking Utilities
 * For testing platform performance against requirements
 */

export interface BenchmarkResult {
  name: string
  value: number
  unit: string
  target: number
  passed: boolean
  timestamp: number
}

export interface PerformanceReport {
  fps: BenchmarkResult | null
  fcp: BenchmarkResult | null
  lcp: BenchmarkResult | null
  fid: BenchmarkResult | null
  cls: BenchmarkResult | null
  memoryUsage: BenchmarkResult | null
  bundleSize: BenchmarkResult | null
}

/**
 * Measure Frames Per Second (FPS)
 */
export async function measureFPS(duration: number = 5000): Promise<BenchmarkResult> {
  return new Promise((resolve) => {
    let frameCount = 0
    const startTime = performance.now()

    function countFrame() {
      frameCount++
      const currentTime = performance.now()
      const elapsed = currentTime - startTime

      if (elapsed >= duration) {
        const fps = Math.round((frameCount / elapsed) * 1000)
        const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
        const target = isMobile ? 30 : 60

        resolve({
          name: 'FPS (Frames Per Second)',
          value: fps,
          unit: 'fps',
          target,
          passed: fps >= target,
          timestamp: Date.now(),
        })
      } else {
        requestAnimationFrame(countFrame)
      }
    }

    requestAnimationFrame(countFrame)
  })
}

/**
 * Measure First Contentful Paint (FCP)
 */
export async function measureFCP(): Promise<BenchmarkResult | null> {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null
  }

  return new Promise((resolve) => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            observer.disconnect()
            resolve({
              name: 'FCP (First Contentful Paint)',
              value: Math.round(entry.startTime),
              unit: 'ms',
              target: 1800,
              passed: entry.startTime < 1800,
              timestamp: Date.now(),
            })
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
 * Measure Largest Contentful Paint (LCP)
 */
export async function measureLCP(): Promise<BenchmarkResult | null> {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null
  }

  return new Promise((resolve) => {
    let lcpValue = 0

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        lcpValue = lastEntry.startTime
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })

      // Resolve after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          observer.disconnect()
          resolve({
            name: 'LCP (Largest Contentful Paint)',
            value: Math.round(lcpValue),
            unit: 'ms',
            target: 2500,
            passed: lcpValue < 2500,
            timestamp: Date.now(),
          })
        }, 1000)
      })
    } catch {
      resolve(null)
    }
  })
}

/**
 * Measure First Input Delay (FID)
 */
export async function measureFID(): Promise<BenchmarkResult | null> {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null
  }

  return new Promise((resolve) => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const firstInput = entries[0] as PerformanceEntry & { processingStart: number }
        const fid = firstInput.processingStart - firstInput.startTime

        observer.disconnect()
        resolve({
          name: 'FID (First Input Delay)',
          value: Math.round(fid),
          unit: 'ms',
          target: 100,
          passed: fid < 100,
          timestamp: Date.now(),
        })
      })

      observer.observe({ entryTypes: ['first-input'] })

      // Timeout after 30 seconds
      setTimeout(() => {
        observer.disconnect()
        resolve(null)
      }, 30000)
    } catch {
      resolve(null)
    }
  })
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export async function measureCLS(): Promise<BenchmarkResult | null> {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null
  }

  return new Promise((resolve) => {
    let clsValue = 0

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value: number }
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value
          }
        })
      })

      observer.observe({ entryTypes: ['layout-shift'] })

      // Resolve after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          observer.disconnect()
          resolve({
            name: 'CLS (Cumulative Layout Shift)',
            value: Math.round(clsValue * 1000) / 1000,
            unit: 'score',
            target: 0.1,
            passed: clsValue < 0.1,
            timestamp: Date.now(),
          })
        }, 5000)
      })
    } catch {
      resolve(null)
    }
  })
}

/**
 * Measure Memory Usage
 */
export async function measureMemory(): Promise<BenchmarkResult | null> {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null
  }

  const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory

  if (!memory) {
    return null
  }

  const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)

  return {
    name: 'Memory Usage',
    value: usedMB,
    unit: 'MB',
    target: 200,
    passed: usedMB < 200,
    timestamp: Date.now(),
  }
}

/**
 * Run all benchmarks and generate report
 */
export async function runFullBenchmark(): Promise<PerformanceReport> {
  console.log('🚀 Starting performance benchmark...')

  const [fps, fcp, lcp, fid, cls, memoryUsage] = await Promise.all([
    measureFPS(),
    measureFCP(),
    measureLCP(),
    measureFID(),
    measureCLS(),
    measureMemory(),
  ])

  const report: PerformanceReport = {
    fps,
    fcp,
    lcp,
    fid,
    cls,
    memoryUsage,
    bundleSize: null, // This would need to be measured during build
  }

  return report
}

/**
 * Display benchmark results in console
 */
export function displayBenchmarkResults(report: PerformanceReport): void {
  console.log('\n📊 Performance Benchmark Results\n')

  const results = [
    report.fps,
    report.fcp,
    report.lcp,
    report.fid,
    report.cls,
    report.memoryUsage,
  ]

  results.forEach((result) => {
    if (!result) return

    const status = result.passed ? '✅' : '❌'
    const comparison = result.passed ? 'PASS' : 'FAIL'

    console.log(
      `${status} ${result.name}: ${result.value}${result.unit} (target: <${result.target}${result.unit}) - ${comparison}`
    )
  })

  const totalTests = results.filter(r => r !== null).length
  const passedTests = results.filter(r => r?.passed).length

  console.log(`\n📈 Summary: ${passedTests}/${totalTests} tests passed`)

  if (passedTests === totalTests) {
    console.log('🎉 All performance targets met!')
  } else {
    console.log('⚠️ Some performance targets not met. See details above.')
  }
}

/**
 * Run benchmark automatically on page load (dev mode only)
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('load', async () => {
    // Wait 2 seconds after load for everything to stabilize
    setTimeout(async () => {
      const report = await runFullBenchmark()
      displayBenchmarkResults(report)
    }, 2000)
  })
}
