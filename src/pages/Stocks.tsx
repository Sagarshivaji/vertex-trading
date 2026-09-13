import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { InstrumentTable } from '../components/InstrumentTable'
import { getStocks } from '../lib/stocks'

export default function Stocks() {
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('All')
  const stocks = getStocks()
  const sectors = useMemo(() => ['All', ...Array.from(new Set(stocks.map((s) => s.sector))).sort()], [stocks])

  const filtered = useMemo(() => {
    return stocks.filter((s) => {
      const matchesQuery = !query || s.symbol.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase())
      const matchesSector = sector === 'All' || s.sector === sector
      return matchesQuery && matchesSector
    })
  }, [stocks, query, sector])

  return (
    <div className="pb-16">
      <PageHeader title="Stocks" subtitle={`Screen ${stocks.length} simulated equities by sector, price and performance.`} />

      <div className="px-4 sm:px-6 mt-2 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by symbol or name..."
            className="w-full bg-base-900 border border-base-700 rounded-lg pl-9 pr-3 py-2 text-sm text-base-50 placeholder:text-base-500 outline-none focus:border-accent-dim"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                sector === s ? 'border-accent-dim bg-accent-soft text-accent' : 'border-base-700 text-base-400 hover:border-base-500'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-4">
        <div className="glass-panel rounded-2xl overflow-hidden">
          <InstrumentTable instruments={filtered} />
        </div>
      </div>
    </div>
  )
}
