import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { Instrument } from '../types'
import { ChangeBadge, PriceCell } from './PriceChange'
import { Sparkline } from './Sparkline'
import { formatMarketCap, formatVolume } from '../lib/format'
import { sliceForTimeframe } from '../lib/history'
import { useStore } from '../store/useStore'

type SortKey = 'symbol' | 'price' | 'changePercent' | 'marketCap' | 'volume'

export function InstrumentTable({ instruments, showMarketCap = true }: { instruments: Instrument[]; showMarketCap?: boolean }) {
  const [sortKey, setSortKey] = useState<SortKey>('marketCap')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const navigate = useNavigate()
  const watchlist = useStore((s) => s.watchlist)
  const toggleWatchlist = useStore((s) => s.toggleWatchlist)

  const sorted = useMemo(() => {
    const copy = [...instruments]
    copy.sort((a, b) => {
      let av: number | string = a[sortKey]
      let bv: number | string = b[sortKey]
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [instruments, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const Header = ({ label, sortableKey, className = '' }: { label: string; sortableKey?: SortKey; className?: string }) => (
    <th
      className={`text-xs font-medium uppercase tracking-wide text-base-400 px-3 py-2.5 select-none ${sortableKey ? 'cursor-pointer hover:text-base-200' : ''} ${className}`}
      onClick={sortableKey ? () => handleSort(sortableKey) : undefined}
    >
      {label}
      {sortableKey === sortKey && <span className="ml-1">{sortDir === 'asc' ? '▲' : '▼'}</span>}
    </th>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[720px]">
        <thead>
          <tr className="border-b border-base-800 text-left">
            <th className="w-9" />
            <Header label="Symbol" sortableKey="symbol" />
            <Header label="Price" sortableKey="price" className="text-right" />
            <Header label="Change" sortableKey="changePercent" className="text-right" />
            <th className="text-xs font-medium uppercase tracking-wide text-base-400 px-3 py-2.5 text-right">1M</th>
            {showMarketCap && <Header label="Mkt Cap" sortableKey="marketCap" className="text-right" />}
            <Header label="Volume" sortableKey="volume" className="text-right" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((inst) => {
            const watched = watchlist.includes(inst.symbol)
            const monthData = sliceForTimeframe(inst.history, '1M')
            return (
              <tr
                key={inst.symbol}
                onClick={() => navigate(`/stocks/${inst.symbol}`)}
                className="border-b border-base-850 hover:bg-base-900/70 cursor-pointer transition-colors group"
              >
                <td className="px-3 py-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWatchlist(inst.symbol)
                    }}
                    className="p-1 -m-1"
                  >
                    <Star size={15} className={watched ? 'fill-amber text-amber' : 'text-base-600 group-hover:text-base-400'} />
                  </button>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono-num shrink-0"
                      style={{ backgroundColor: `${inst.color}22`, color: inst.color }}
                    >
                      {inst.symbol.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-base-50">{inst.symbol}</p>
                      <p className="text-xs text-base-400 truncate max-w-[160px]">{inst.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <PriceCell price={inst.price} change={inst.change} />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <ChangeBadge change={inst.change} changePercent={inst.changePercent} size="sm" />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end">
                    <Sparkline data={monthData} positive={inst.changePercent >= 0} width={90} height={32} />
                  </div>
                </td>
                {showMarketCap && (
                  <td className="px-3 py-2.5 text-right font-mono-num text-sm text-base-300">{formatMarketCap(inst.marketCap)}</td>
                )}
                <td className="px-3 py-2.5 text-right font-mono-num text-sm text-base-300">{formatVolume(inst.volume)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
