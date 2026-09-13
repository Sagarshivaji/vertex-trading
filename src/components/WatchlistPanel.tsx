import { Star, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { getInstrument } from '../lib/stocks'
import { ChangeBadge, PriceCell } from './PriceChange'

export function WatchlistPanel({ selectedSymbol, onSelect }: { selectedSymbol?: string; onSelect?: (symbol: string) => void }) {
  const watchlist = useStore((s) => s.watchlist)
  const toggleWatchlist = useStore((s) => s.toggleWatchlist)

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-800">
        <h3 className="text-sm font-semibold text-base-100 flex items-center gap-1.5">
          <Star size={14} className="text-amber fill-amber" /> Watchlist
        </h3>
        <span className="text-xs text-base-500">{watchlist.length}</span>
      </div>
      <div className="divide-y divide-base-850 max-h-[420px] overflow-y-auto">
        {watchlist.length === 0 && (
          <p className="text-sm text-base-400 text-center py-8 px-4">
            No symbols yet. Use search or the star icon on any stock to add one.
          </p>
        )}
        {watchlist.map((symbol) => {
          const inst = getInstrument(symbol)
          if (!inst) return null
          const active = symbol === selectedSymbol
          return (
            <div
              key={symbol}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(symbol)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect?.(symbol)
              }}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left group transition-colors ${
                active ? 'bg-base-800' : 'hover:bg-base-900/70'
              } ${onSelect ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-base-50">{inst.symbol}</p>
                <p className="text-xs text-base-400 truncate max-w-[110px]">{inst.name}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <PriceCell price={inst.price} change={inst.change} />
                  <div className="mt-0.5">
                    <ChangeBadge change={inst.change} changePercent={inst.changePercent} size="sm" />
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWatchlist(symbol)
                  }}
                  className="opacity-0 group-hover:opacity-100 text-base-500 hover:text-down transition-opacity p-1"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
