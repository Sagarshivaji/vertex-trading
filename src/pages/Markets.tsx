import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { InstrumentTable } from '../components/InstrumentTable'
import { StockChart } from '../components/StockChart'
import { ChangeBadge } from '../components/PriceChange'
import { getIndices } from '../lib/indices'
import { getSectorPerformance, getTopMovers } from '../lib/stocks'
import { sliceForTimeframe } from '../lib/history'

const TABS = ['Gainers', 'Losers', 'Most Active'] as const

export default function Markets() {
  const indices = getIndices()
  const [activeIndex, setActiveIndex] = useState(indices[0].symbol)
  const [tab, setTab] = useState<(typeof TABS)[number]>('Gainers')
  const movers = getTopMovers(8)
  const sectors = getSectorPerformance()
  const selected = indices.find((i) => i.symbol === activeIndex)!

  const tableData = tab === 'Gainers' ? movers.gainers : tab === 'Losers' ? movers.losers : movers.mostActive

  return (
    <div className="pb-16">
      <PageHeader title="Markets" subtitle="Index performance, sector rotation and today's biggest movers across the simulated market." />

      <div className="px-4 sm:px-6 mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {indices.map((idx) => (
              <button
                key={idx.symbol}
                onClick={() => setActiveIndex(idx.symbol)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  idx.symbol === activeIndex ? 'border-accent-dim bg-accent-soft text-accent' : 'border-base-700 text-base-300 hover:border-base-500'
                }`}
              >
                {idx.name}
              </button>
            ))}
          </div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-3xl font-bold font-mono-num text-base-50">{selected.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              <div className="mt-1">
                <ChangeBadge change={selected.change} changePercent={selected.changePercent} />
              </div>
            </div>
          </div>
          <StockChart data={sliceForTimeframe(selected.history, '1Y')} positive={selected.changePercent >= 0} height={280} showVolume={false} />
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-base-100 mb-4">Sector Performance</h3>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectors} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="sector"
                  type="category"
                  width={140}
                  tick={{ fill: '#8994a3', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{ background: '#121924', border: '1px solid #1a2330', borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Avg change']}
                />
                <Bar dataKey="changePercent" radius={[0, 4, 4, 0]}>
                  {sectors.map((s, i) => (
                    <Cell key={i} fill={s.changePercent >= 0 ? '#2fd480' : '#ff5c72'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-6">
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center gap-1 px-4 pt-3 border-b border-base-800">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t ? 'border-accent text-base-50' : 'border-transparent text-base-400 hover:text-base-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <InstrumentTable instruments={tableData} />
        </div>
      </div>
    </div>
  )
}
