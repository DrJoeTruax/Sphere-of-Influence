'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last Updated: January 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-cyan-500/30">
            <p className="text-cyan-400 font-semibold mb-2">Law of Truth</p>
            <p className="text-sm text-gray-300">
              This privacy policy embodies our commitment to <strong>full transparency</strong>.
              We collect minimal data and are explicit about how it's used.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Account Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
              <li>Email address (for authentication)</li>
              <li>Username and display name (optional)</li>
              <li>Avatar URL (optional)</li>
              <li>Selected language and timezone</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Activity Data</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
              <li>Proposals submitted, votes cast, comments posted</li>
              <li>Project Agame responses (anonymized for research)</li>
              <li>Hub membership and role selection</li>
              <li>Timestamps of actions (for audit trails)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Technical Data</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
              <li>IP address (hashed, for Sybil detection)</li>
              <li>User agent (browser/device type)</li>
              <li>Response times (for behavioral analysis)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Optional Contributions</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>GPU donation data (hardware specs, compute time)</li>
              <li>Demographic information (age group, region) for research</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <p className="font-semibold mb-2">Platform Operation</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Authenticate users and manage accounts</li>
                  <li>Display your contributions (proposals, votes, comments)</li>
                  <li>Calculate reputation scores and trust scores</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">Safety & Security</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Detect Sybil attacks (multiple fake accounts)</li>
                  <li>Identify suspicious voting patterns</li>
                  <li>Monitor for coordinated manipulation</li>
                  <li>Maintain platform integrity</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">Research</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Map global human values (Project Agame data)</li>
                  <li>Study governance effectiveness</li>
                  <li>Improve AGI alignment research</li>
                  <li>Publish aggregate, anonymized findings</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Data Sharing</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We do <strong>not</strong> sell your data. We share data only as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Public Data:</strong> Proposals, votes, and comments are publicly visible by design (Law of Truth)</li>
              <li><strong>Aggregate Research:</strong> Anonymized statistics shared with AGI safety researchers</li>
              <li><strong>Service Providers:</strong> Supabase (database), hosting providers (infrastructure)</li>
              <li><strong>Legal Requirements:</strong> If required by law or to prevent harm</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Your Rights</h2>
            <div className="space-y-3 text-gray-300">
              <p><strong>Access:</strong> View all data we have about you</p>
              <p><strong>Correction:</strong> Update your profile information anytime</p>
              <p><strong>Deletion:</strong> Request account deletion (proposals remain for audit trail, but authorship is anonymized)</p>
              <p><strong>Export:</strong> Download your data in JSON format</p>
              <p><strong>Opt-Out:</strong> Withdraw from research data aggregation</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We use industry-standard security practices:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 mt-4">
              <li>Encrypted connections (HTTPS/TLS)</li>
              <li>Hashed passwords (never stored in plain text)</li>
              <li>Regular security audits</li>
              <li>Access controls and audit logging</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Cookies & Tracking</h2>
            <p className="text-gray-300 leading-relaxed">
              We use essential cookies for authentication and session management. We do <strong>not</strong> use
              third-party tracking cookies or analytics services that violate privacy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              The platform is intended for users 13 and older. We do not knowingly collect data from children
              under 13. If you believe a child has created an account, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. International Users</h2>
            <p className="text-gray-300 leading-relaxed">
              The platform is global and accessible from any region. Data is stored in compliance with GDPR
              (Europe), CCPA (California), and other privacy regulations. Regional hubs allow localized governance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We will notify users of significant privacy policy changes through the emergency alert system.
              Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              For privacy questions or to exercise your rights, submit a proposal in your hub or contact:
              <br />
              <span className="text-cyan-400">privacy@breakthrough.example.com</span>
            </p>
          </section>
        </motion.div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex gap-4 justify-center">
          <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
            Terms of Service
          </Link>
          <Link href="/code-of-conduct" className="text-cyan-400 hover:text-cyan-300">
            Code of Conduct
          </Link>
        </div>
      </div>
    </main>
  )
}
