import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, Bell, Wallet } from 'lucide-react'
import { SearchModal } from '../SearchModal'
import { useStore } from '../../store/useStore'
import { formatPrice } from '../../lib/format'

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const cash = useStore((s) => s.cash)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-base-800 bg-base-950/85 backdrop-blur px-4 sm:px-6 h-16 shrink-0">
        <button onClick={onMenuClick} className="lg:hidden text-base-300 hover:text-base-100 p-1 -ml-1">
          <Menu size={22} />
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 flex-1 max-w-md text-sm text-base-400 bg-base-900 border border-base-700 rounded-lg px-3 py-2 hover:border-base-500 transition-colors"
        >
          <Search size={15} />
          <span className="flex-1 text-left">Search stocks, ETFs...</span>
          <kbd className="hidden sm:block text-[10px] border border-base-600 rounded px-1.5 py-0.5">⌘K</kbd>
        </button>

        <div className="flex-1" />

        <Link to="/portfolio" className="hidden sm:flex items-center gap-2 rounded-lg border border-base-700 bg-base-900 px-3 py-2 hover:border-accent-dim transition-colors">
          <Wallet size={15} className="text-accent" />
          <span className="font-mono-num text-sm font-medium text-base-100">{formatPrice(cash)}</span>
        </Link>

        <button className="text-base-300 hover:text-base-100 p-2 rounded-lg hover:bg-base-900 transition-colors">
          <Bell size={18} />
        </button>

        <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-blue flex items-center justify-center text-xs font-bold text-base-950 shrink-0">
          VX
        </Link>
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
