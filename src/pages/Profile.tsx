import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { useStore } from '../store/useStore'
import { portfolioSummary } from '../lib/portfolio'
import { formatPrice } from '../lib/format'
import { Shield, Bell, CreditCard, LogOut } from 'lucide-react'

export default function Profile() {
  const cash = useStore((s) => s.cash)
  const positions = useStore((s) => s.positions)
  const orders = useStore((s) => s.orders)
  const summary = portfolioSummary(positions, cash)

  return (
    <div className="pb-16">
      <PageHeader title="Profile" subtitle="Account details for your simulated Vertex trading account." />

      <div className="px-4 sm:px-6 mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-blue flex items-center justify-center text-xl font-bold text-base-950 shrink-0">
              VX
            </div>
            <div>
              <p className="text-lg font-bold text-base-50">Demo Trader</p>
              <p className="text-sm text-base-400">demo.trader@vertex.app</p>
              <span className="inline-block mt-1 text-[11px] uppercase tracking-wide text-accent bg-accent-soft px-2 py-0.5 rounded-full">Simulation Account</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl divide-y divide-base-850">
            {[
              { icon: Shield, label: 'Security & login', desc: 'Password, two-factor authentication' },
              { icon: Bell, label: 'Notifications', desc: 'Price alerts, order fills, news digests' },
              { icon: CreditCard, label: 'Funding', desc: 'Manage simulated deposits and withdrawals' },
            ].map(({ icon: Icon, label, desc }) => (
              <button key={label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-base-900/60 transition-colors text-left">
                <div className="w-9 h-9 rounded-lg bg-base-900 border border-base-700 flex items-center justify-center text-base-300 shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-base-100">{label}</p>
                  <p className="text-xs text-base-400">{desc}</p>
                </div>
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-down-soft transition-colors text-left">
              <div className="w-9 h-9 rounded-lg bg-base-900 border border-base-700 flex items-center justify-center text-down shrink-0">
                <LogOut size={16} />
              </div>
              <p className="text-sm font-medium text-down">Sign out</p>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <StatCard label="Account Value" value={formatPrice(summary.totalValue)} />
          <StatCard label="Lifetime Orders" value={String(orders.length)} />
          <div className="glass-panel rounded-2xl p-4">
            <p className="text-xs text-base-400 leading-relaxed">
              Vertex is a portfolio demo. All balances, orders and market data are simulated locally in your browser and reset only if you choose to reset the
              simulation from the Portfolio page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
