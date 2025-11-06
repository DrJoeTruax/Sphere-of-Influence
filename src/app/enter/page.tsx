import Link from 'next/link'

export default function EnterPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-6">Coming Soon</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The 3D experience is being built in Phase 2.
          <br />
          You&apos;ll enter through a starfield, select your hub,
          <br />
          and begin coordinating AGI development.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          ← Back to Home
        </Link>

        <div className="mt-12 text-sm text-gray-500">
          <p>Phase 2 includes:</p>
          <ul className="mt-4 space-y-2">
            <li>✨ Starfield loading animation</li>
            <li>🌍 3D solar system navigation</li>
            <li>🎯 Hub selection interface</li>
            <li>🎭 Role selection (Spectator/Builder)</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
