'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { use3DTilt } from '@/hooks/use3DTilt'

// Dynamic imports for 3D components
const UniverseBackground = dynamic(() => import('@/components/3d/UniverseBackground'), { ssr: false })
const HolographicEarth = dynamic(() => import('@/components/3d/HolographicEarth'), { ssr: false })
const AmbientParticles = dynamic(() => import('@/components/3d/AmbientParticles'), { ssr: false })

// Law Card Component with 3D tilt
function LawCard({ law, index }: { law: { name: string; desc: string }; index: number }) {
  const { tiltStyle, tiltHandlers } = use3DTilt({ maxTilt: 10, scale: 1.05 })
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div
        {...tiltHandlers}
        style={tiltStyle}
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer p-6 rounded-xl border border-gray-800/50 bg-black/40 backdrop-blur-xl hover:border-blue-500/50 transition-all duration-300 group"
      >
        {/* Glassmorphism glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          <h3 className="font-bold text-blue-400 mb-2 text-lg flex items-center justify-between">
            {law.name}
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              className="text-gray-500"
            >
              ▼
            </motion.span>
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {law.desc}
          </p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-700"
              >
                <p className="text-xs text-gray-500">
                  Click to learn more about how this law shapes our platform...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ambient glow particles */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -top-10 -right-10 group-hover:bg-blue-500/30 transition-colors duration-500" />
          <div className="absolute w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -bottom-10 -left-10 group-hover:bg-purple-500/30 transition-colors duration-500" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const earthRotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2])

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const laws = [
    { name: 'Truth', desc: 'Full transparency, no hidden behavior' },
    { name: 'Empathy', desc: 'Preserve emotional safety' },
    { name: 'Peace', desc: 'No violence or domination' },
    { name: 'Autonomy', desc: 'Users choose freely' },
    { name: 'Accountability', desc: 'Actions leave audit trails' },
    { name: 'Stewardship', desc: 'Improve the world' },
    { name: 'Integrity', desc: 'Break the laws, lose authority' },
  ]

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Fixed 3D Universe Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <UniverseBackground count={3000} nebulaEnabled={true} />
            <AmbientParticles count={150} />
          </Suspense>
        </Canvas>
      </div>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center z-10"
      >
        {/* 3D Holographic Earth */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-64 h-64 md:w-96 md:h-96 mb-8"
        >
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            <Suspense fallback={null}>
              <HolographicEarth />
              <ambientLight intensity={0.5} />
            </Suspense>
          </Canvas>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-6xl md:text-8xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Breakthrough
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-2xl md:text-3xl mb-4 max-w-3xl font-light"
        >
          A global coordination platform for AGI development
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-gray-400 mb-12 max-w-xl text-lg"
        >
          Join 7 billion people in building artificial general intelligence
          that respects human autonomy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex gap-4 mb-16"
        >
          <Link
            href="/enter"
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Enter the Platform</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            href="/why"
            className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-xl border border-gray-700 hover:border-gray-600 rounded-lg text-lg font-semibold transition-all duration-300"
          >
            Why This Matters
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full p-1">
            <div className="w-1.5 h-3 bg-blue-500 rounded-full mx-auto animate-pulse" />
          </div>
        </motion.div>
      </motion.section>

      {/* The 7 Immutable Laws - With Neural Network Background */}
      <section className="relative py-32 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Built on{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              7 Immutable Laws
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laws.map((law, index) => (
              <LawCard key={law.name} law={law} index={index} />
            ))}
          </div>
        </div>

        {/* Background constellation lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: -1 }}>
          <motion.line
            x1="10%" y1="10%" x2="90%" y2="90%"
            stroke="url(#gradient1)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            viewport={{ once: true }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </section>

      {/* Platform Stats Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-16 text-center"
          >
            A Platform Built for Scale
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { end: 13, suffix: '', label: 'Regional Hubs', sublabel: '12 regions + Space Station', color: 'blue' },
              { end: 96.4, suffix: '%', label: 'Autonomy Score', sublabel: '14-Point Autonomy Test', color: 'purple' },
              { end: 10, suffix: 'K+', label: 'Concurrent Users', sublabel: 'Designed for scale', color: 'green' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700 transition-colors duration-300"
              >
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  duration={2000}
                  className={`text-5xl font-bold text-${stat.color}-400 mb-2`}
                />
                <div className="text-gray-300 font-semibold">{stat.label}</div>
                <div className="text-sm text-gray-500 mt-2">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-16 text-center"
          >
            How It Works
          </motion.h2>

          <div className="space-y-12">
            {[
              {
                num: 1,
                title: 'Choose Your Regional Hub',
                desc: 'Select from 12 regional hubs based on your location and language, or join the global Space Station.',
                color: 'blue'
              },
              {
                num: 2,
                title: 'Choose Your Role',
                desc: 'Spectator: Observe, play AGI games, map human values. Builder: Vote on proposals, contribute to 58 problem categories, submit ideas.',
                color: 'purple'
              },
              {
                num: 3,
                title: 'Coordinate & Build',
                desc: 'Participate in transparent, autonomous governance. When proposals reach consensus, the entire hub celebrates together.',
                color: 'green'
              }
            ].map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 group"
              >
                <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br from-${step.color}-600 to-${step.color}-400 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 bg-black/50 backdrop-blur-xl border-t border-gray-900 text-center text-gray-500 z-10">
        <p className="mb-4 text-lg">
          Built with integrity. Powered by the 7 Immutable Laws.
        </p>
        <div className="flex justify-center gap-8 text-sm">
          <Link href="/why" className="hover:text-gray-300 transition-colors">
            Philosophy
          </Link>
          <Link href="/docs" className="hover:text-gray-300 transition-colors">
            Documentation
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </main>
  )
}
