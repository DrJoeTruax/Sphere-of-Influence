import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Breakthrough
        </h1>
        <p className="text-xl md:text-2xl mb-4 max-w-2xl">
          A global coordination platform for AGI development
        </p>
        <p className="text-gray-400 mb-12 max-w-xl">
          Join 7 billion people in building artificial general intelligence
          that respects human autonomy.
        </p>

        <div className="flex gap-4 mb-16">
          <Link
            href="/enter"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-colors"
          >
            Enter the Platform
          </Link>
          <Link
            href="/why"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-lg font-semibold transition-colors"
          >
            Why This Matters
          </Link>
        </div>

        {/* The 7 Immutable Laws */}
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Built on 7 Immutable Laws</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[
              { name: 'Truth', desc: 'Full transparency, no hidden behavior' },
              { name: 'Empathy', desc: 'Preserve emotional safety' },
              { name: 'Peace', desc: 'No violence or domination' },
              { name: 'Autonomy', desc: 'Users choose freely' },
              { name: 'Accountability', desc: 'Actions leave audit trails' },
              { name: 'Stewardship', desc: 'Improve the world' },
              { name: 'Integrity', desc: 'Break the laws, lose authority' },
            ].map((law) => (
              <div
                key={law.name}
                className="p-4 bg-gray-900 rounded-lg border border-gray-800"
              >
                <h3 className="font-bold text-blue-400 mb-2">{law.name}</h3>
                <p className="text-sm text-gray-400">{law.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            A Platform Built for Scale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">13</div>
              <div className="text-gray-400">Regional Hubs</div>
              <div className="text-sm text-gray-500 mt-1">
                12 regions + Space Station
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                96.4%
              </div>
              <div className="text-gray-400">Autonomy Score</div>
              <div className="text-sm text-gray-500 mt-1">
                14-Point Autonomy Test
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">
                10K+
              </div>
              <div className="text-gray-400">Concurrent Users</div>
              <div className="text-sm text-gray-500 mt-1">
                Designed for scale
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Choose Your Regional Hub
                </h3>
                <p className="text-gray-400">
                  Select from 12 regional hubs based on your location and
                  language, or join the global Space Station.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Choose Your Role
                </h3>
                <p className="text-gray-400">
                  <strong>Spectator</strong>: Observe, play AGI games, map
                  human values.
                  <br />
                  <strong>Builder</strong>: Vote on proposals, contribute to 58
                  problem categories, submit ideas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Coordinate & Build
                </h3>
                <p className="text-gray-400">
                  Participate in transparent, autonomous governance. When
                  proposals reach consensus, the entire hub celebrates together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-gray-900 text-center text-gray-500">
        <p className="mb-4">
          Built with integrity. Powered by the 7 Immutable Laws.
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/why" className="hover:text-gray-300">
            Philosophy
          </Link>
          <Link href="/docs" className="hover:text-gray-300">
            Documentation
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  )
}
