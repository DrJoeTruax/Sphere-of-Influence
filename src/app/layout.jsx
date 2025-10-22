import '../globals.css'

export const metadata = {
  title: 'Kinddit',
  description: 'Community-driven empathy platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col'>
        <header className='flex justify-between items-center p-4 bg-black/20 backdrop-blur'>
          <h1 className='text-2xl font-bold tracking-tight'>Kinddit</h1>
          <nav className='space-x-6 text-sm'>
            <a href='#' className='hover:text-purple-300'>Galaxies</a>
            <a href='#' className='hover:text-purple-300'>Communities</a>
            <a href='#' className='hover:text-purple-300'>About</a>
          </nav>
        </header>
        <main className='flex-1 flex justify-center items-center p-8'>{children}</main>
        <footer className='text-center text-xs opacity-60 py-3 border-t border-white/10'>
          © {new Date().getFullYear()} Kinddit. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
