import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { formatPercent, formatPrice } from '../lib/format'

export function ChangeBadge({ change, changePercent, size = 'md' }: { change: number; changePercent: number; size?: 'sm' | 'md' | 'lg' }) {
  const isUp = change > 0
  const isFlat = change === 0
  const color = isFlat ? 'text-base-300' : isUp ? 'text-up' : 'text-down'
  const bg = isFlat ? 'bg-base-800' : isUp ? 'bg-up-soft' : 'bg-down-soft'
  const Icon = isFlat ? Minus : isUp ? ArrowUpRight : ArrowDownRight
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
  const pad = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-1'

  return (
    <span className={`inline-flex items-center gap-1 rounded-md font-mono-num font-medium ${color} ${bg} ${textSize} ${pad}`}>
      <Icon size={size === 'sm' ? 11 : 13} />
      {formatPercent(changePercent)}
    </span>
  )
}

export function PriceCell({ price, change }: { price: number; change: number }) {
  const isUp = change > 0
  const isFlat = change === 0
  const color = isFlat ? 'text-base-100' : isUp ? 'text-up' : 'text-down'
  return <span className={`font-mono-num font-semibold ${color}`}>{formatPrice(price)}</span>
}
