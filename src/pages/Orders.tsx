import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useStore } from '../store/useStore'
import { formatDateShort, formatPrice } from '../lib/format'

export default function Orders() {
  const orders = useStore((s) => s.orders)

  return (
    <div className="pb-16">
      <PageHeader title="Orders" subtitle="Every simulated order you've placed, most recent first." />
      <div className="px-4 sm:px-6 mt-2">
        {orders.length === 0 ? (
          <div className="glass-panel rounded-2xl py-16 text-center text-base-400">
            <p className="mb-3">You haven't placed any orders yet.</p>
            <Link to="/trading" className="text-accent hover:underline text-sm">
              Open the trading terminal
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-base-800 text-left text-xs uppercase tracking-wide text-base-400">
                    <th className="px-4 py-2.5 font-medium">Symbol</th>
                    <th className="px-4 py-2.5 font-medium">Side</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 font-medium text-right">Qty</th>
                    <th className="px-4 py-2.5 font-medium text-right">Fill Price</th>
                    <th className="px-4 py-2.5 font-medium text-right">Total</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-base-850 hover:bg-base-900/60">
                      <td className="px-4 py-3">
                        <Link to={`/stocks/${o.symbol}`} className="font-semibold text-sm text-base-50 hover:text-accent">
                          {o.symbol}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold uppercase ${o.side === 'buy' ? 'text-up' : 'text-down'}`}>{o.side}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-base-300 capitalize">{o.kind}</td>
                      <td className="px-4 py-3 text-right font-mono-num text-sm text-base-200">{o.qty}</td>
                      <td className="px-4 py-3 text-right font-mono-num text-sm text-base-200">{formatPrice(o.fillPrice)}</td>
                      <td className="px-4 py-3 text-right font-mono-num text-sm text-base-100">{formatPrice(o.fillPrice * o.qty)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-up-soft text-up px-2 py-0.5 rounded-full capitalize">{o.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-base-400">{formatDateShort(o.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
