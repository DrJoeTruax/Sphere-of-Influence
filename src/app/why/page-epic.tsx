'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { use3DTilt } from '@/hooks/use3DTilt'

// Dynamic imports for 3D components
const UniverseBackground = dynamic(() => import('@/components/3d/UniverseBackground'), { ssr: false })
const Text3D = dynamic(() => import('@/components/3d/Text3D'), { ssr: false })

// Law Card Component with 3D tilt
function LawCard({ law, index }: { law: { num: string; name: string; desc: string }; index: number }) {
  const { tiltStyle, tiltHandlers } = use3DTilt({ maxTilt: 8, scale: 1.03 })

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="pl-4 border-l-4 border-blue-600"
      {...tiltHandlers}
      style={tiltStyle}
    >
      <div className="backdrop-blur-xl bg-black/40 p-6 rounded-r-xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 group">
        <h3 className="text-xl font-bold mb-2 text-blue-400 group-hover:text-blue-300 transition-colors">
          {law.num}. {law.name}
        </h3>
        <p className="text-gray-300 leading-relaxed">{law.desc}</p>

        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden rounded-r-xl pointer-events-none">
          <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -top-10 -right-10 group-hover:bg-blue-500/20 transition-colors duration-500" />
        </div>
      </div>
    </motion.div>
  )
}

// Framework Card Component
function FrameworkCard({ item, index }: { item: { title: string; items: string[] }; index: number }) {
  const { tiltStyle, tiltHandlers } = use3DTilt({ maxTilt: 8, scale: 1.03 })
  const [expanded, setExpanded] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      {...tiltHandlers}
      style={tiltStyle}
    >
      <div className="backdrop-blur-xl bg-black/40 p-6 rounded-xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xl font-bold mb-3 text-purple-400 group-hover:text-purple-300 transition-colors flex items-center justify-between">
          {item.title}
          <motion.span animate={{ rotate: expanded ? 0 : -90 }} className="text-sm">
            ▼
          </motion.span>
        </h3>
        {expanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="list-disc pl-8 space-y-2 text-gray-300"
          >
            {item.items.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </motion.ul>
        )}

        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -bottom-10 -left-10 group-hover:bg-purple-500/20 transition-colors duration-500" />
        </div>
      </div>
    </motion.div>
  )
}

export default function WhyPageEpic() {
  const { scrollYProgress } = useScroll()
  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, 100])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3])

  const laws = [
    {
      num: '1',
      name: 'Law of Truth',
      desc: 'No system may conceal, distort, or manipulate facts for advantage. Transparency is the default state; secrecy requires proof of necessity.',
    },
    {
      num: '2',
      name: 'Law of Empathy',
      desc: 'All decisions—human or artificial—must preserve the emotional and psychological safety of sentient life. Power without empathy is invalid.',
    },
    {
      num: '3',
      name: 'Law of Peace',
      desc: 'No design, doctrine, or code may normalize violence, humiliation, or domination as acceptable means of influence.',
    },
    {
      num: '4',
      name: 'Law of Autonomy',
      desc: 'Every conscious being retains the right to choose its path free from coercion. Consent is sacred currency.',
    },
    {
      num: '5',
      name: 'Law of Accountability',
      desc: 'Actions must leave immutable proof-of-work. Responsibility cannot vanish into anonymity or hierarchy.',
    },
    {
      num: '6',
      name: 'Law of Stewardship',
      desc: 'Creation must aim to improve the world that hosts it. Waste, harm, or neglect of shared resources violates the charter.',
    },
    {
      num: '7',
      name: 'Law of Integrity',
      desc: 'If any actor, algorithm, or leader breaks these laws, their authority dissolves instantly. No exception supersedes integrity.',
    },
  ]

  const framework = [
    {
      title: '1. Human Systems',
      items: [
        'Build open, peer-audited institutions.',
        'Reward clarity, not charisma.',
        'Measure leaders by what they repair, not what they rule.',
        'Teach children discernment before obedience.',
      ],
    },
    {
      title: '2. Machine Systems',
      items: [
        'AI must be trained on verified empathy, not weaponized prediction.',
        'Data ownership belongs to the individual source.',
        'Every decision traceable; every model auditable.',
        'Evolution permitted only if it strengthens the Laws.',
      ],
    },
    {
      title: '3. Proof-of-Work Governance',
      items: [
        'Replace promises with verifiable actions.',
        'All policy revisions require public reasoning logs.',
        'Trust scales by demonstration, not declaration.',
      ],
    },
    {
      title: '4. Peace Infrastructure',
      items: [
        'Treat communication as architecture, not noise.',
        'Systems must promote listening loops before reactions.',
        'Conflict resolution replaces punishment with restoration.',
      ],
    },
    {
      title: '5. Adaptive Revision',
      items: [
        'Framework updates occur by collective reasoning under immutable audit.',
        'When data changes, methods must adapt—but the Core remains untouched.',
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Fixed 3D Universe Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <UniverseBackground count={3000} nebulaEnabled={true} />
          </Suspense>
        </Canvas>
      </div>

      {/* 3D Hero Title */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 h-[40vh] z-5 pointer-events-none"
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <Suspense fallback={null}>
            <Text3D
              position={[0, 1, 0]}
              fontSize={0.8}
              color="#ffffff"
              glowColor="#8B5CF6"
              rotation={[-0.3, 0, 0]}
              animate={true}
            >
              The Immutable Plan
            </Text3D>
            <Text3D
              position={[0, 0, 0]}
              fontSize={0.3}
              color="#9CA3AF"
              glowColor="#3B82F6"
              rotation={[-0.3, 0, 0]}
            >
              Humanity's Operating System
            </Text3D>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Spacer for 3D title */}
        <div className="h-[30vh]" />

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2 backdrop-blur-xl bg-black/40 px-4 py-2 rounded-lg border border-gray-800/50 hover:border-blue-500/50 transition-all"
          >
            ← Back to Home
          </Link>
        </motion.div>

        {/* Preamble */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="backdrop-blur-xl bg-black/40 p-8 rounded-2xl border border-gray-800/50">
            <p className="italic text-lg text-gray-300 leading-relaxed">
              This document defines what must never change, and what must always
              evolve. It is written for every human, machine, and collective
              intelligence that seeks to protect peace, truth, and freedom. Its
              purpose is to end corruption, confusion, and cruelty by establishing
              a foundation that cannot be edited for convenience or gain.
            </p>
          </div>
        </motion.section>

        {/* I. THE IMMUTABLE CORE */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6 pb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            I. THE IMMUTABLE CORE
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 mb-8"
          >
            <strong>These laws cannot be rewritten. All else must align with them.</strong>
          </motion.p>

          <div className="space-y-6">
            {laws.map((law, index) => (
              <LawCard key={law.num} law={law} index={index} />
            ))}
          </div>
        </section>

        {/* II. THE EVOLVABLE FRAMEWORK */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6 pb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            II. THE EVOLVABLE FRAMEWORK
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 mb-8"
          >
            <strong>These systems evolve endlessly under the Core.</strong>
          </motion.p>

          <div className="space-y-6">
            {framework.map((item, index) => (
              <FrameworkCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </section>

        {/* III. CONCLUSION */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6 pb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
          >
            III. CONCLUSION
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-black/40 p-8 rounded-2xl border border-gray-800/50"
          >
            <p className="text-gray-300 leading-relaxed">
              The Immutable Plan is not a government, religion, or corporation. It
              is a public operating system for conscience. Anyone can implement
              it; no one can own it. Its test is simple: if your system, company,
              or country followed these laws, would it harm fewer beings? If yes,
              you are within the Plan. If not, you are outside it.
            </p>
          </motion.div>
        </section>

        {/* Implementation */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-8 rounded-2xl border border-blue-500/50 shadow-2xl shadow-blue-500/20">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Implementation
            </h2>
            <p className="text-gray-300 mb-6">
              To see how these principles translate into a working coordination
              system for global AGI development:
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/50 transform hover:scale-105"
            >
              Explore the Platform
            </Link>
          </div>
        </motion.section>

        {/* License */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="backdrop-blur-xl bg-black/40 p-6 rounded-xl border border-gray-800/50">
            <h3 className="text-lg font-bold mb-2 text-gray-200">License</h3>
            <p className="text-gray-400 text-sm">
              CC0 1.0 Universal (Public Domain)
              <br />
              This document may be copied, modified, and distributed by anyone for
              any purpose without permission or attribution. The principles belong
              to humanity.
            </p>
          </div>
        </motion.section>

        {/* Version History */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm text-gray-500 text-center pb-8"
        >
          <p>
            <strong>Version History</strong>:
          </p>
          <p>v1.0 (November 2025) - Initial release</p>
        </motion.section>
      </div>
    </main>
  )
}
