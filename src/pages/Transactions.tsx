import { ArrowDownLeft, ArrowUpRight, Landmark, TrendingUp } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useStore } from '../store/useStore'
import { formatDateShort, formatPrice } from '../lib/format'

const ICONS = {
  buy: ArrowUpRight,
  sell: ArrowDownLeft,
  deposit: Landmark,
  dividend: TrendingUp,
}

export default function Transactions() {
  const transactions = useStore((s) => s.transactions)

  return (
    <div className="pb-16">
      <PageHeader title="Transactions" subtitle="A ledger of cash movements from trades, deposits and dividends." />
      <div className="px-4 sm:px-6 mt-2">
        <div className="glass-panel rounded-2xl divide-y divide-base-850">
          {transactions.map((tx) => {
            const Icon = ICONS[tx.type]
            const positive = tx.amount >= 0
            return (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${positive ? 'bg-up-soft text-up' : 'bg-down-soft text-down'}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-base-100 capitalize">
                    {tx.type} {tx.symbol && `· ${tx.symbol}`}
                  </p>
                  <p className="text-xs text-base-400">
                    {tx.qty && tx.price ? `${tx.qty} shares @ ${formatPrice(tx.price)} · ` : ''}
                    {formatDateShort(tx.timestamp)}
                  </p>
                </div>
                <span className={`font-mono-num text-sm font-semibold shrink-0 ${positive ? 'text-up' : 'text-down'}`}>
                  {positive ? '+' : ''}
                  {formatPrice(tx.amount)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
