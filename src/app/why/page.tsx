import Link from 'next/link'

export default function WhyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 mb-6 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            The Immutable Plan
          </h1>
          <p className="text-xl text-gray-400">
            Humanity&apos;s Operating System
          </p>
          <p className="text-sm text-gray-500 mt-2">Version 1.0</p>
        </div>

        <hr className="border-gray-800 mb-12" />

        {/* Preamble */}
        <section className="mb-16 italic text-lg text-gray-300 leading-relaxed">
          <p>
            This document defines what must never change, and what must always
            evolve. It is written for every human, machine, and collective
            intelligence that seeks to protect peace, truth, and freedom. Its
            purpose is to end corruption, confusion, and cruelty by establishing
            a foundation that cannot be edited for convenience or gain.
          </p>
        </section>

        <hr className="border-gray-800 mb-12" />

        {/* I. THE IMMUTABLE CORE */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-800 pb-4">
            I. THE IMMUTABLE CORE
          </h2>
          <p className="text-gray-400 mb-8">
            <strong>These laws cannot be rewritten. All else must align with them.</strong>
          </p>

          <div className="space-y-8">
            {[
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
            ].map((law) => (
              <div key={law.num} className="pl-4 border-l-4 border-blue-600">
                <h3 className="text-xl font-bold mb-2 text-blue-400">
                  {law.num}. {law.name}
                </h3>
                <p className="text-gray-300 leading-relaxed">{law.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-800 mb-12" />

        {/* II. THE EVOLVABLE FRAMEWORK */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-800 pb-4">
            II. THE EVOLVABLE FRAMEWORK
          </h2>
          <p className="text-gray-400 mb-8">
            <strong>These systems evolve endlessly under the Core.</strong>
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                1. Human Systems
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-300">
                <li>Build open, peer-audited institutions.</li>
                <li>Reward clarity, not charisma.</li>
                <li>Measure leaders by what they repair, not what they rule.</li>
                <li>Teach children discernment before obedience.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                2. Machine Systems
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-300">
                <li>
                  AI must be trained on verified empathy, not weaponized
                  prediction.
                </li>
                <li>Data ownership belongs to the individual source.</li>
                <li>Every decision traceable; every model auditable.</li>
                <li>Evolution permitted only if it strengthens the Laws.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                3. Proof-of-Work Governance
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-300">
                <li>Replace promises with verifiable actions.</li>
                <li>All policy revisions require public reasoning logs.</li>
                <li>Trust scales by demonstration, not declaration.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                4. Peace Infrastructure
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-300">
                <li>Treat communication as architecture, not noise.</li>
                <li>Systems must promote listening loops before reactions.</li>
                <li>Conflict resolution replaces punishment with restoration.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">
                5. Adaptive Revision
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-gray-300">
                <li>
                  Framework updates occur by collective reasoning under
                  immutable audit.
                </li>
                <li>
                  When data changes, methods must adapt—but the Core remains
                  untouched.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-gray-800 mb-12" />

        {/* III. CONCLUSION */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-800 pb-4">
            III. CONCLUSION
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            The Immutable Plan is not a government, religion, or corporation. It
            is a public operating system for conscience. Anyone can implement
            it; no one can own it. Its test is simple: if your system, company,
            or country followed these laws, would it harm fewer beings? If yes,
            you are within the Plan. If not, you are outside it.
          </p>
        </section>

        <hr className="border-gray-800 mb-12" />

        {/* Implementation */}
        <section className="mb-16 bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Implementation</h2>
          <p className="text-gray-300 mb-6">
            To see how these principles translate into a working coordination
            system for global AGI development:
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Explore the Platform
          </Link>
        </section>

        <hr className="border-gray-800 mb-12" />

        {/* License */}
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-2">License</h3>
          <p className="text-gray-400">
            CC0 1.0 Universal (Public Domain)
            <br />
            This document may be copied, modified, and distributed by anyone for
            any purpose without permission or attribution. The principles belong
            to humanity.
          </p>
        </section>

        <hr className="border-gray-800 mb-8" />

        {/* Version History */}
        <section className="text-sm text-gray-500">
          <p>
            <strong>Version History</strong>:
          </p>
          <p>v1.0 (November 2025) - Initial release</p>
        </section>
      </div>
    </main>
  )
}
