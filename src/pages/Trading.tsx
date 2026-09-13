import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { getInstrument } from '../lib/stocks'
import { generateIntraday, sliceForTimeframe } from '../lib/history'
import { WatchlistPanel } from '../components/WatchlistPanel'
import { StockChart } from '../components/StockChart'
import { OrderTicket } from '../components/OrderTicket'
import { ChangeBadge } from '../components/PriceChange'
import { formatMarketCap, formatPrice, formatVolume } from '../lib/format'
import type { Timeframe } from '../types'

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

export default function Trading() {
  const { symbol: routeSymbol } = useParams()
  const navigate = useNavigate()
  const symbol = (routeSymbol ?? 'AAPL').toUpperCase()
  const inst = getInstrument(symbol)
  const [timeframe, setTimeframe] = useState<Timeframe>('1D')

  const chartData = useMemo(() => {
    if (!inst) return []
    if (timeframe === '1D') return generateIntraday(inst.symbol, inst.prevClose, inst.price)
    return sliceForTimeframe(inst.history, timeframe)
  }, [inst, timeframe])

  if (!inst) {
    return <div className="p-6 text-base-400">Unknown symbol.</div>
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-base-50">Trading Terminal</h1>
          <p className="text-sm text-base-400">Select a symbol from your watchlist to trade instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4 items-start">
        <WatchlistPanel selectedSymbol={inst.symbol} onSelect={(s) => navigate(`/trading/${s}`)} />

        <div className="glass-panel rounded-2xl p-4 sm:p-5 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-base-50">{inst.symbol}</h2>
                <Link to={`/stocks/${inst.symbol}`} className="text-base-500 hover:text-accent">
                  <ExternalLink size={14} />
                </Link>
              </div>
              <p className="text-xs text-base-400 mb-2">{inst.name}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono-num text-base-50">{formatPrice(inst.price)}</span>
                <ChangeBadge change={inst.change} changePercent={inst.changePercent} />
              </div>
            </div>
            <div className="flex gap-1 bg-base-900 rounded-lg p-1">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    timeframe === tf ? 'bg-base-700 text-base-50' : 'text-base-400 hover:text-base-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <StockChart data={chartData} positive={inst.changePercent >= 0} height={380} />

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-5 pt-4 border-t border-base-800 text-center sm:text-left">
            <MiniStat label="Open" value={formatPrice(inst.open)} />
            <MiniStat label="High" value={formatPrice(inst.dayHigh)} />
            <MiniStat label="Low" value={formatPrice(inst.dayLow)} />
            <MiniStat label="Volume" value={formatVolume(inst.volume)} />
            <MiniStat label="Mkt Cap" value={formatMarketCap(inst.marketCap)} />
            <MiniStat label="P/E" value={inst.pe ? inst.pe.toFixed(1) : '—'} />
          </div>
        </div>

        <OrderTicket symbol={inst.symbol} />
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-base-500 mb-0.5">{label}</p>
      <p className="text-sm font-mono-num font-medium text-base-100">{value}</p>
    </div>
  )
}
