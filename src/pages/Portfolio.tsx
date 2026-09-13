import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { ChangeBadge, PriceCell } from '../components/PriceChange'
import { useStore } from '../store/useStore'
import { portfolioSummary } from '../lib/portfolio'
import { formatMarketCap, formatPrice } from '../lib/format'
import { Wallet, TrendingUp, PieChart as PieIcon, RotateCcw } from 'lucide-react'

export default function Portfolio() {
  const cash = useStore((s) => s.cash)
  const positions = useStore((s) => s.positions)
  const resetAccount = useStore((s) => s.resetAccount)
  const summary = portfolioSummary(positions, cash)

  const allocation = [
    ...summary.enriched.map((p) => ({ name: p.symbol, value: p.marketValue, color: p.color })),
    { name: 'Cash', value: cash, color: '#8994a3' },
  ]

  return (
    <div className="pb-16">
      <PageHeader
        title="Portfolio"
        subtitle="Your simulated holdings, allocation and performance."
        actions={
          <button
            onClick={() => confirm('Reset your simulated portfolio back to $100,000 cash? This cannot be undone.') && resetAccount()}
            className="inline-flex items-center gap-1.5 text-sm text-base-400 border border-base-700 rounded-lg px-3 py-2 hover:border-base-500 hover:text-base-200 transition-colors"
          >
            <RotateCcw size={14} /> Reset simulation
          </button>
        }
      />

      <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <StatCard label="Total Value" value={formatPrice(summary.totalValue)} icon={<Wallet size={16} />} />
        <StatCard
          label="Today's Change"
          value={formatPrice(summary.dayChange)}
          delta={`${summary.dayChangePercent >= 0 ? '+' : ''}${summary.dayChangePercent.toFixed(2)}%`}
          positive={summary.dayChange >= 0}
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Total Return"
          value={formatPrice(summary.totalGain)}
          delta={`${summary.totalGainPercent >= 0 ? '+' : ''}${summary.totalGainPercent.toFixed(2)}%`}
          positive={summary.totalGain >= 0}
          icon={<PieIcon size={16} />}
        />
      </div>

      <div className="px-4 sm:px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-base-800">
            <h3 className="text-sm font-semibold text-base-100">Holdings</h3>
          </div>
          {summary.enriched.length === 0 ? (
            <div className="py-16 text-center text-base-400 px-6">
              <p className="mb-3">You don't own any positions yet.</p>
              <Link to="/trading" className="text-accent hover:underline text-sm">
                Place your first trade
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-base-800 text-left text-xs uppercase tracking-wide text-base-400">
                    <th className="px-4 py-2.5 font-medium">Symbol</th>
                    <th className="px-4 py-2.5 font-medium text-right">Shares</th>
                    <th className="px-4 py-2.5 font-medium text-right">Avg Cost</th>
                    <th className="px-4 py-2.5 font-medium text-right">Price</th>
                    <th className="px-4 py-2.5 font-medium text-right">Market Value</th>
                    <th className="px-4 py-2.5 font-medium text-right">Gain/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.enriched.map((p) => (
                    <tr key={p.symbol} className="border-b border-base-850 hover:bg-base-900/60">
                      <td className="px-4 py-3">
                        <Link to={`/stocks/${p.symbol}`} className="font-semibold text-sm text-base-50 hover:text-accent">
                          {p.symbol}
                        </Link>
                        <p className="text-xs text-base-400">{p.name}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-sm text-base-200">{p.qty}</td>
                      <td className="px-4 py-3 text-right font-mono-num text-sm text-base-300">{formatPrice(p.avgCost)}</td>
                      <td className="px-4 py-3 text-right">
                        <PriceCell price={p.price} change={p.dayChange} />
                      </td>
                      <td className="px-4 py-3 text-right font-mono-num text-sm text-base-100">{formatPrice(p.marketValue)}</td>
                      <td className="px-4 py-3 text-right">
                        <ChangeBadge change={p.gain} changePercent={p.gainPercent} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-base-100 mb-2">Allocation</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {allocation.map((a, i) => (
                    <Cell key={i} fill={a.color} stroke="#05070a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#121924', border: '1px solid #1a2330', borderRadius: 8, fontSize: 12 }}
                  formatter={(value, name) => [formatMarketCap(Number(value)), name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center">
            {allocation.map((a) => (
              <div key={a.name} className="flex items-center gap-1.5 text-xs text-base-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                {a.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
