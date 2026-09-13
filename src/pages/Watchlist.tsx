import { useState } from 'react'
import { Search, Star } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { InstrumentTable } from '../components/InstrumentTable'
import { useStore } from '../store/useStore'
import { getAllInstruments } from '../lib/stocks'

export default function Watchlist() {
  const watchlist = useStore((s) => s.watchlist)
  const toggleWatchlist = useStore((s) => s.toggleWatchlist)
  const [query, setQuery] = useState('')

  const instruments = getAllInstruments().filter((i) => watchlist.includes(i.symbol))
  const suggestions = query
    ? getAllInstruments()
        .filter((i) => !watchlist.includes(i.symbol) && (i.symbol.toLowerCase().includes(query.toLowerCase()) || i.name.toLowerCase().includes(query.toLowerCase())))
        .slice(0, 6)
    : []

  return (
    <div className="pb-16">
      <PageHeader title="Watchlist" subtitle="Track the instruments you care about most. Add or remove symbols any time." />

      <div className="px-4 sm:px-6 mt-2">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Add a symbol to your watchlist..."
            className="w-full bg-base-900 border border-base-700 rounded-lg pl-9 pr-3 py-2 text-sm text-base-50 placeholder:text-base-500 outline-none focus:border-accent-dim"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full glass-panel rounded-lg overflow-hidden shadow-xl">
              {suggestions.map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => {
                    toggleWatchlist(s.symbol)
                    setQuery('')
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-base-800 text-left"
                >
                  <span>
                    <span className="font-semibold text-base-50">{s.symbol}</span>{' '}
                    <span className="text-base-400">{s.name}</span>
                  </span>
                  <Star size={14} className="text-base-500" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-4">
        {instruments.length === 0 ? (
          <div className="glass-panel rounded-2xl py-16 text-center text-base-400">
            <Star size={28} className="mx-auto mb-3 text-base-600" />
            <p>Your watchlist is empty. Search above or star a stock from any list.</p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <InstrumentTable instruments={instruments} />
          </div>
        )}
      </div>
    </div>
  )
}
