import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Wallet, TrendingUp, PiggyBank } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { WatchlistPanel } from '../components/WatchlistPanel'
import { InstrumentTable } from '../components/InstrumentTable'
import { NewsList } from '../components/NewsList'
import { Sparkline } from '../components/Sparkline'
import { ChangeBadge } from '../components/PriceChange'
import { getIndices } from '../lib/indices'
import { getTopMovers } from '../lib/stocks'
import { getAllNews } from '../lib/news'
import { useStore } from '../store/useStore'
import { portfolioSummary } from '../lib/portfolio'
import { formatPrice } from '../lib/format'
import { sliceForTimeframe } from '../lib/history'

export default function Dashboard() {
  const indices = getIndices()
  const { gainers } = getTopMovers(5)
  const news = getAllNews().slice(0, 5)
  const cash = useStore((s) => s.cash)
  const positions = useStore((s) => s.positions)
  const summary = portfolioSummary(positions, cash)

  return (
    <div className="pb-16">
      <PageHeader
        title="Welcome back"
        subtitle="Here's how the market and your simulated portfolio are looking today."
        actions={
          <Link to="/trading" className="inline-flex items-center gap-1.5 bg-accent text-base-950 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors">
            Open Trading Terminal <ArrowRight size={15} />
          </Link>
        }
      />

      <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <StatCard
          label="Portfolio Value"
          value={formatPrice(summary.totalValue)}
          delta={`${summary.dayChange >= 0 ? '+' : ''}${formatPrice(summary.dayChange)} today`}
          positive={summary.dayChange >= 0}
          icon={<Wallet size={16} />}
        />
        <StatCard
          label="Total Gain / Loss"
          value={formatPrice(summary.totalGain)}
          delta={`${summary.totalGainPercent >= 0 ? '+' : ''}${summary.totalGainPercent.toFixed(2)}%`}
          positive={summary.totalGain >= 0}
          icon={<TrendingUp size={16} />}
        />
        <StatCard label="Available Cash" value={formatPrice(cash)} icon={<PiggyBank size={16} />} />
      </div>

      <div className="px-4 sm:px-6 mt-6">
        <h2 className="text-sm font-semibold text-base-200 mb-3">Markets</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {indices.map((idx, i) => (
            <motion.div
              key={idx.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-base-400">{idx.name}</p>
                <ChangeBadge change={idx.change} changePercent={idx.changePercent} size="sm" />
              </div>
              <p className="text-lg font-bold font-mono-num text-base-50 mb-1">{idx.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              <Sparkline data={sliceForTimeframe(idx.history, '1M')} positive={idx.changePercent >= 0} width={140} height={30} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-800">
            <h3 className="text-sm font-semibold text-base-100">Top Gainers</h3>
            <Link to="/stocks" className="text-xs text-accent hover:underline">
              View all stocks
            </Link>
          </div>
          <InstrumentTable instruments={gainers} showMarketCap={false} />
        </div>
        <WatchlistPanel />
      </div>

      <div className="px-4 sm:px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-base-100">Latest News</h3>
            <Link to="/news" className="text-xs text-accent hover:underline">
              View all news
            </Link>
          </div>
          <NewsList items={news} compact />
        </div>
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between bg-grid">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent mb-2">AI Insights</p>
            <p className="text-base font-semibold text-base-50 leading-snug mb-2">Ask Vertex AI why a stock moved, or how the market is doing today.</p>
            <p className="text-sm text-base-400">Generated from live simulated market data — not investment advice.</p>
          </div>
          <Link to="/ai-insights" className="mt-4 inline-flex items-center justify-center gap-1.5 border border-accent-dim text-accent text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent-soft transition-colors">
            Open AI Assistant <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
