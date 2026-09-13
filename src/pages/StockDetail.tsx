import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Star, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { getInstrument, getAllInstruments } from '../lib/stocks'
import { generateIntraday, sliceForTimeframe } from '../lib/history'
import { getNewsForSymbol } from '../lib/news'
import { StockChart } from '../components/StockChart'
import { ChangeBadge } from '../components/PriceChange'
import { OrderTicket } from '../components/OrderTicket'
import { NewsList } from '../components/NewsList'
import { useStore } from '../store/useStore'
import { formatMarketCap, formatPrice, formatVolume } from '../lib/format'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { Timeframe } from '../types'

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

export default function StockDetail() {
  const { symbol = '' } = useParams()
  const inst = getInstrument(symbol)
  const [timeframe, setTimeframe] = useState<Timeframe>('1D')
  const watchlist = useStore((s) => s.watchlist)
  const toggleWatchlist = useStore((s) => s.toggleWatchlist)

  const chartData = useMemo(() => {
    if (!inst) return []
    if (timeframe === '1D') return generateIntraday(inst.symbol, inst.prevClose, inst.price)
    return sliceForTimeframe(inst.history, timeframe)
  }, [inst, timeframe])

  const related = useMemo(() => {
    if (!inst) return []
    return getAllInstruments()
      .filter((i) => i.sector === inst.sector && i.symbol !== inst.symbol)
      .slice(0, 4)
  }, [inst])

  if (!symbol) return <Navigate to="/stocks" replace />
  if (!inst) {
    return (
      <div className="px-6 py-20 text-center text-base-400">
        <p className="mb-4">We couldn't find "{symbol}" in the simulated market.</p>
        <Link to="/stocks" className="text-accent hover:underline">
          Back to Stocks
        </Link>
      </div>
    )
  }

  const watched = watchlist.includes(inst.symbol)
  const news = getNewsForSymbol(inst.symbol)
  const { buy, hold, sell, targetPrice } = inst.sentiment
  const totalAnalysts = buy + hold + sell
  const upside = ((targetPrice - inst.price) / inst.price) * 100
  const rangePct = ((inst.price - inst.low52) / (inst.high52 - inst.low52)) * 100

  return (
    <div className="pb-16">
      <div className="px-4 sm:px-6 pt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold font-mono-num shrink-0"
            style={{ backgroundColor: `${inst.color}22`, color: inst.color }}
          >
            {inst.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-base-50">{inst.symbol}</h1>
              <span className="text-xs uppercase tracking-wide text-base-400 border border-base-700 rounded px-1.5 py-0.5">{inst.assetClass}</span>
              <span className="text-xs text-base-400 border border-base-700 rounded px-1.5 py-0.5">{inst.sector}</span>
            </div>
            <p className="text-sm text-base-400">{inst.name}</p>
          </div>
        </div>
        <button
          onClick={() => toggleWatchlist(inst.symbol)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            watched ? 'border-amber bg-amber/10 text-amber' : 'border-base-700 text-base-300 hover:border-base-500'
          }`}
        >
          <Star size={15} className={watched ? 'fill-amber' : ''} />
          {watched ? 'On Watchlist' : 'Add to Watchlist'}
        </button>
      </div>

      <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5 items-start">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <p className="text-3xl sm:text-4xl font-bold font-mono-num text-base-50">{formatPrice(inst.price)}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <ChangeBadge change={inst.change} changePercent={inst.changePercent} />
                <span className="text-xs text-base-500">Today</span>
              </div>
            </div>
            <div className="flex gap-1 bg-base-900 rounded-lg p-1">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    timeframe === tf ? 'bg-base-700 text-base-50' : 'text-base-400 hover:text-base-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <StockChart data={chartData} positive={inst.changePercent >= 0} height={320} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-base-800">
            <Stat label="Open" value={formatPrice(inst.open)} />
            <Stat label="Day Range" value={`${formatPrice(inst.dayLow)} – ${formatPrice(inst.dayHigh)}`} />
            <Stat label="Volume" value={formatVolume(inst.volume)} />
            <Stat label="Avg Volume" value={formatVolume(inst.avgVolume)} />
            <Stat label="Market Cap" value={formatMarketCap(inst.marketCap)} />
            <Stat label="P/E Ratio" value={inst.pe ? inst.pe.toFixed(1) : '—'} />
            <Stat label="EPS" value={inst.eps ? `$${inst.eps.toFixed(2)}` : '—'} />
            <Stat label="Dividend Yield" value={inst.dividendYield ? `${inst.dividendYield.toFixed(2)}%` : '—'} />
          </div>

          <div className="mt-5 pt-5 border-t border-base-800">
            <div className="flex items-center justify-between text-xs text-base-400 mb-1.5">
              <span>52-Week Low {formatPrice(inst.low52)}</span>
              <span>52-Week High {formatPrice(inst.high52)}</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-base-800">
              <div className="absolute h-1.5 rounded-full bg-gradient-to-r from-down via-amber to-up" style={{ width: '100%' }} />
              <div
                className="absolute -top-1 w-3.5 h-3.5 rounded-full bg-base-50 border-2 border-base-950 shadow"
                style={{ left: `calc(${Math.min(100, Math.max(0, rangePct))}% - 7px)` }}
              />
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-20">
          <OrderTicket symbol={inst.symbol} />
        </div>
      </div>

      <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-base-100 mb-3">About {inst.name}</h3>
            <p className="text-sm text-base-300 leading-relaxed">{inst.description}</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-base-100 mb-4">Financials (Revenue vs. Net Income)</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inst.financials} margin={{ left: -10 }}>
                  <XAxis dataKey="year" tick={{ fill: '#8994a3', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8994a3', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMarketCap(v)} width={64} />
                  <Tooltip
                    contentStyle={{ background: '#121924', border: '1px solid #1a2330', borderRadius: 8, fontSize: 12 }}
                    formatter={(value) => formatMarketCap(Number(value))}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#4f8cff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="netIncome" name="Net Income" fill="#3ddc84" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-base-100 mb-2">News</h3>
            <NewsList items={news} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-base-100 mb-4">Analyst Sentiment</h3>
            <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
              <div className="bg-up" style={{ width: `${(buy / totalAnalysts) * 100}%` }} />
              <div className="bg-base-500" style={{ width: `${(hold / totalAnalysts) * 100}%` }} />
              <div className="bg-down" style={{ width: `${(sell / totalAnalysts) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-base-400 mb-4">
              <span className="text-up">{buy} Buy</span>
              <span>{hold} Hold</span>
              <span className="text-down">{sell} Sell</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-base-800">
              <span className="text-sm text-base-400">Avg. price target</span>
              <span className="font-mono-num font-semibold text-base-50">{formatPrice(targetPrice)}</span>
            </div>
            <div className={`flex items-center gap-1 justify-end text-xs mt-1 ${upside >= 0 ? 'text-up' : 'text-down'}`}>
              {upside >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(upside).toFixed(1)}% {upside >= 0 ? 'upside' : 'downside'}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-base-100 mb-3">Related in {inst.sector}</h3>
            <div className="flex flex-col gap-2">
              {related.map((r) => (
                <Link
                  key={r.symbol}
                  to={`/stocks/${r.symbol}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-base-900/70 transition-colors"
                >
                  <span className="text-sm font-medium text-base-100">{r.symbol}</span>
                  <ChangeBadge change={r.change} changePercent={r.changePercent} size="sm" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-base-400 mb-1">{label}</p>
      <p className="text-sm font-semibold font-mono-num text-base-100">{value}</p>
    </div>
  )
}
