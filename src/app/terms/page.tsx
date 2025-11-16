'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last Updated: January 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-cyan-500/30">
            <p className="text-cyan-400 font-semibold mb-2">Platform Philosophy</p>
            <p className="text-sm text-gray-300">
              Breakthrough is governed by the <strong>7 Immutable Laws</strong>. By using this platform,
              you agree to uphold these principles in all interactions.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using the Breakthrough platform, you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any of these terms, you are
              prohibited from using this platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. The 7 Immutable Laws</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All participants must adhere to the 7 Immutable Laws:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Truth:</strong> Full transparency, no hidden behavior</li>
              <li><strong>Empathy:</strong> Preserve emotional safety for all participants</li>
              <li><strong>Peace:</strong> No violence, domination, or coercion</li>
              <li><strong>Autonomy:</strong> Users choose freely without manipulation</li>
              <li><strong>Accountability:</strong> All actions leave transparent audit trails</li>
              <li><strong>Stewardship:</strong> Work to improve the world</li>
              <li><strong>Integrity:</strong> Break the laws, lose authority</li>
            </ul>
            <p className="text-yellow-400 text-sm mt-4">
              Violation of these laws may result in reduced voting weight or removal from the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>As a Spectator:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide honest responses in Project Agame</li>
                <li>Respect the privacy and safety of others</li>
                <li>Do not attempt to manipulate data or results</li>
              </ul>

              <p className="mt-4"><strong>As a Builder:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Vote based on genuine belief, not coordination</li>
                <li>Submit proposals that advance AGI safety and alignment</li>
                <li>Engage in respectful, constructive discussion</li>
                <li>Do not create multiple accounts (Sybil attacks)</li>
                <li>Do not coordinate voting with others to manipulate outcomes</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Sybil Resistance & Trust Scores</h2>
            <p className="text-gray-300 leading-relaxed">
              The platform uses behavioral analysis, voucher chains, and statistical monitoring to detect
              Sybil attacks and manipulation. Users with low trust scores will have reduced voting weight.
              Creating multiple accounts or coordinating to manipulate outcomes is prohibited and will result
              in account suspension.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Wave Access System</h2>
            <p className="text-gray-300 leading-relaxed">
              New Builders can vote and comment immediately. Submitting proposals requires Wave access,
              granted through application review or vouching by existing Builders. This prevents spam while
              maintaining openness.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Content Ownership</h2>
            <p className="text-gray-300 leading-relaxed">
              You retain ownership of content you submit (proposals, comments, etc.). By submitting content,
              you grant Breakthrough a worldwide, non-exclusive, royalty-free license to use, reproduce, and
              display your content on the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Moderation</h2>
            <p className="text-gray-300 leading-relaxed">
              Content that violates the 7 Laws may be flagged, hidden, or removed. Moderation actions are
              logged transparently and can be appealed through the governance process.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Governance Forks</h2>
            <p className="text-gray-300 leading-relaxed">
              If a hub's participants disagree with platform governance, they may fork the hub and run an
              independent instance. This ensures no single entity controls the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-300 leading-relaxed">
              The platform is provided "as is" without warranties of any kind. We do not guarantee uninterrupted
              access, error-free operation, or specific outcomes from participation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              Breakthrough and its operators shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update these terms at any time. Continued use of the platform after changes constitutes
              acceptance of the new terms. Major changes will be announced through the emergency alert system.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these terms, please open a proposal in your regional hub or contact the
              Space Station coordinators.
            </p>
          </section>
        </motion.div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex gap-4 justify-center">
          <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">
            Privacy Policy
          </Link>
          <Link href="/code-of-conduct" className="text-cyan-400 hover:text-cyan-300">
            Code of Conduct
          </Link>
        </div>
      </div>
    </main>
  )
}
