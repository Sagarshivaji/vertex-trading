import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { getAllInstruments } from '../lib/stocks'
import { ChangeBadge } from '../components/PriceChange'
import { formatPrice } from '../lib/format'

export default function Research() {
  const all = getAllInstruments()

  const withUpside = all.map((i) => ({
    ...i,
    upside: ((i.sentiment.targetPrice - i.price) / i.price) * 100,
  }))

  const topPicks = [...withUpside].sort((a, b) => b.upside - a.upside).slice(0, 6)
  const cautious = [...withUpside].sort((a, b) => a.upside - b.upside).slice(0, 4)

  return (
    <div className="pb-16">
      <PageHeader title="Research" subtitle="Analyst sentiment, price targets and coverage across the simulated universe." />

      <div className="px-4 sm:px-6 mt-2">
        <h2 className="text-sm font-semibold text-base-200 mb-3">Top Analyst Picks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPicks.map((inst) => (
            <Link key={inst.symbol} to={`/stocks/${inst.symbol}`} className="glass-panel rounded-2xl p-4 hover:border-accent-dim transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono-num" style={{ backgroundColor: `${inst.color}22`, color: inst.color }}>
                    {inst.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-50">{inst.symbol}</p>
                    <p className="text-xs text-base-400">{inst.sector}</p>
                  </div>
                </div>
                <ChangeBadge change={inst.change} changePercent={inst.changePercent} size="sm" />
              </div>
              <div className="flex items-end justify-between mt-3">
                <div>
                  <p className="text-xs text-base-400">Price target</p>
                  <p className="font-mono-num font-semibold text-base-50">{formatPrice(inst.sentiment.targetPrice)}</p>
                </div>
                <div className="flex items-center gap-1 text-up text-sm font-medium">
                  <ArrowUpRight size={14} />
                  {inst.upside.toFixed(1)}%
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-8">
        <h2 className="text-sm font-semibold text-base-200 mb-3">Under Watch</h2>
        <div className="glass-panel rounded-2xl divide-y divide-base-850">
          {cautious.map((inst) => (
            <Link key={inst.symbol} to={`/stocks/${inst.symbol}`} className="flex items-center justify-between px-4 py-3 hover:bg-base-900/60 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-base-50">{inst.symbol}</span>
                <span className="text-xs text-base-400">{inst.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-base-400">{inst.sentiment.sell} analysts bearish</span>
                <div className={`flex items-center gap-1 text-sm font-medium ${inst.upside >= 0 ? 'text-up' : 'text-down'}`}>
                  {inst.upside >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {Math.abs(inst.upside).toFixed(1)}%
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
