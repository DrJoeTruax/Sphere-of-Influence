'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

interface OpeningScreenProps {
  onLanguageSelect: (lang: string) => void
  onEnter: () => void
}

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
]

const CORE_MESSAGE = [
  'This is not a game.',
  'This is a human collaboration experiment.',
  'The largest ever.',
  'This is HOPE.',
]

export default function OpeningScreen({
  onLanguageSelect,
  onEnter,
}: OpeningScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [showExplainer, setShowExplainer] = useState(false)

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code)
    onLanguageSelect(code)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="max-w-4xl w-full px-8 text-center">
        {/* Core Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="mb-12 space-y-4"
        >
          {CORE_MESSAGE.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 1 + index * 0.8,
              }}
              className={`${
                index === CORE_MESSAGE.length - 1
                  ? 'text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'
                  : 'text-2xl md:text-3xl text-gray-300'
              }`}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 4 }}
          className="mb-8"
        >
          <p className="text-sm text-gray-400 mb-4">Select your language:</p>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-w-3xl mx-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedLanguage === lang.code
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Enter Button */}
        <AnimatePresence>
          {selectedLanguage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <button
                onClick={onEnter}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xl font-bold rounded-lg shadow-lg shadow-blue-500/50 transition-all transform hover:scale-105"
              >
                ENTER
              </button>

              {/* Strategic Links */}
              <div className="flex items-center justify-center gap-6 text-sm">
                <button
                  onClick={() => setShowExplainer(true)}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>❓</span>
                  <span>What is this?</span>
                </button>
                <Link
                  href="/why"
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <span>🌍</span>
                  <span>Why this matters</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explainer Modal */}
        <AnimatePresence>
          {showExplainer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
              onClick={() => setShowExplainer(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full border border-gray-800"
              >
                <h2 className="text-2xl font-bold mb-4">
                  What is Breakthrough?
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Breakthrough is a global coordination platform for AGI
                    (Artificial General Intelligence) development.
                  </p>
                  <p>
                    We bring together 7 billion people to build AGI that
                    respects human autonomy, built on the{' '}
                    <strong className="text-blue-400">7 Immutable Laws</strong>:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Truth - Full transparency</li>
                    <li>Empathy - Emotional safety</li>
                    <li>Peace - No violence or domination</li>
                    <li>Autonomy - Free choice</li>
                    <li>Accountability - Audit trails</li>
                    <li>Stewardship - Improve the world</li>
                    <li>Integrity - Authority through ethics</li>
                  </ul>
                  <p className="text-sm text-gray-400">
                    You&apos;ll select a regional hub, choose your role
                    (Spectator or Builder), and help coordinate AGI development
                    through transparent, autonomous governance.
                  </p>
                </div>
                <button
                  onClick={() => setShowExplainer(false)}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg w-full"
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
