'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CodeOfConductPage() {
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
          <h1 className="text-4xl font-bold mb-4">Code of Conduct</h1>
          <p className="text-gray-400">Built on the 7 Immutable Laws</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg p-6 mb-8 border border-cyan-500/30">
            <p className="text-xl font-semibold mb-4 text-cyan-400">Our Foundation</p>
            <p className="text-gray-300">
              This Code of Conduct is not arbitrary—it derives directly from the <strong>7 Immutable Laws</strong>
              that govern the platform. These laws cannot be changed; they form the ethical bedrock of our community.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              The 7 Immutable Laws
            </h2>

            <div className="space-y-6">
              {[
                {
                  name: '1. Law of Truth',
                  principle: 'Full transparency, no hidden behavior',
                  requirements: [
                    'Be honest in all proposals and discussions',
                    'Disclose conflicts of interest',
                    'Do not manipulate data or conceal information',
                    'Support open source and transparency',
                    'Challenge misinformation respectfully'
                  ]
                },
                {
                  name: '2. Law of Empathy',
                  principle: 'Preserve emotional safety',
                  requirements: [
                    'Treat all participants with respect',
                    'Consider diverse perspectives and lived experiences',
                    'Avoid personal attacks or harassment',
                    'Assume good faith in disagreements',
                    'Create space for vulnerable voices'
                  ]
                },
                {
                  name: '3. Law of Peace',
                  principle: 'No violence or domination',
                  requirements: [
                    'Never incite violence or harm',
                    'Do not threaten, intimidate, or coerce others',
                    'Resolve conflicts through dialogue',
                    'Oppose systems of oppression',
                    'Build consensus, not dominance'
                  ]
                },
                {
                  name: '4. Law of Autonomy',
                  principle: 'Users choose freely',
                  requirements: [
                    'Respect others\' right to choose their hub and role',
                    'Do not manipulate or deceive users',
                    'Allow disagreement without punishment',
                    'Support informed decision-making',
                    'Enable easy exit and forking'
                  ]
                },
                {
                  name: '5. Law of Accountability',
                  principle: 'Actions leave audit trails',
                  requirements: [
                    'Stand by your proposals and votes',
                    'Accept responsibility for mistakes',
                    'Provide reasons for decisions',
                    'Support transparent moderation',
                    'Participate in good faith'
                  ]
                },
                {
                  name: '6. Law of Stewardship',
                  principle: 'Improve the world',
                  requirements: [
                    'Contribute to AGI safety and alignment',
                    'Consider long-term consequences',
                    'Prioritize humanity\'s wellbeing',
                    'Protect the environment',
                    'Leave the platform better than you found it'
                  ]
                },
                {
                  name: '7. Law of Integrity',
                  principle: 'Break the laws, lose authority',
                  requirements: [
                    'Uphold all seven laws consistently',
                    'Report violations (with empathy)',
                    'Accept consequences for violations',
                    'Support fair enforcement',
                    'Earn authority through ethical behavior'
                  ]
                }
              ].map((law, idx) => (
                <div key={idx} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-bold mb-2 text-cyan-400">{law.name}</h3>
                  <p className="text-gray-400 italic mb-4">{law.principle}</p>
                  <p className="text-sm text-gray-300 font-semibold mb-2">You must:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-gray-300">
                    {law.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Unacceptable Behavior</h2>
            <p className="text-gray-300 mb-4">
              The following behaviors violate one or more of the 7 Laws and will result in consequences:
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong>Harassment:</strong> Personal attacks, threats, stalking, doxxing (violates Empathy, Peace)</li>
                <li><strong>Discrimination:</strong> Bias based on race, gender, religion, etc. (violates Empathy, Peace, Stewardship)</li>
                <li><strong>Manipulation:</strong> Sybil attacks, coordinated voting, brigading (violates Truth, Autonomy, Integrity)</li>
                <li><strong>Spam:</strong> Flooding proposals, bot behavior, advertising (violates Stewardship, Accountability)</li>
                <li><strong>Misinformation:</strong> Deliberately spreading false information (violates Truth, Stewardship)</li>
                <li><strong>Bad Faith:</strong> Trolling, derailing discussions, wasting time (violates Empathy, Accountability, Stewardship)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Enforcement</h2>
            <p className="text-gray-300 mb-4">
              Violations are addressed through a transparent, graduated process:
            </p>
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="font-semibold mb-2">1. Warning</p>
                <p className="text-sm text-gray-400">First-time minor violations receive a private warning with explanation</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="font-semibold mb-2">2. Reduced Trust Score</p>
                <p className="text-sm text-gray-400">Repeated violations lower your trust score, reducing voting weight</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="font-semibold mb-2">3. Temporary Suspension</p>
                <p className="text-sm text-gray-400">Serious violations result in temporary loss of Builder privileges</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="font-semibold mb-2">4. Permanent Ban</p>
                <p className="text-sm text-gray-400">Extreme violations (violence, severe harassment) result in permanent removal</p>
              </div>
            </div>
            <p className="text-yellow-400 text-sm mt-4">
              All enforcement actions are logged publicly (with privacy protections) and can be appealed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Reporting Violations</h2>
            <p className="text-gray-300 mb-4">
              If you witness behavior that violates the Code of Conduct:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-300">
              <li>Use the "Flag" button on proposals/comments</li>
              <li>Provide specific details about the violation</li>
              <li>Indicate which law(s) were broken</li>
              <li>Submit evidence if available</li>
            </ol>
            <p className="text-sm text-gray-400 mt-4">
              Reports are reviewed by hub moderators. Frivolous or malicious reports may themselves constitute violations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Appeals</h2>
            <p className="text-gray-300">
              If you believe an enforcement action was unjust:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-300 mt-4">
              <li>Submit an appeal proposal in your hub</li>
              <li>Explain why the action violated the 7 Laws</li>
              <li>The community votes on the appeal (requires 70% to overturn)</li>
              <li>Serious cases can escalate to the Space Station</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Community Responsibility</h2>
            <p className="text-gray-300 leading-relaxed">
              Everyone shares responsibility for upholding these standards. We encourage:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 mt-4">
              <li>Modeling respectful behavior</li>
              <li>Gently correcting minor violations</li>
              <li>Supporting newcomers in understanding the Laws</li>
              <li>Celebrating those who embody the Laws</li>
              <li>Continuously improving our governance</li>
            </ul>
          </section>

          <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-lg p-6 border border-cyan-500/30">
            <p className="text-lg font-semibold mb-2">Remember</p>
            <p className="text-gray-300">
              These are not arbitrary rules imposed from above. The 7 Immutable Laws emerged from deep
              philosophical reasoning about how to build AGI that truly serves humanity. By participating,
              you help prove that humans can coordinate at scale with autonomy, transparency, and integrity.
            </p>
          </div>
        </motion.div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex gap-4 justify-center">
          <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  )
}
