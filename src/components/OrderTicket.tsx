import { useState } from 'react'
import { getInstrument } from '../lib/stocks'
import { useStore } from '../store/useStore'
import { useToast } from './Toast'
import { formatPrice } from '../lib/format'
import type { OrderKind, OrderSide } from '../types'

export function OrderTicket({ symbol }: { symbol: string }) {
  const inst = getInstrument(symbol)
  const [side, setSide] = useState<OrderSide>('buy')
  const [kind, setKind] = useState<OrderKind>('market')
  const [qty, setQty] = useState('10')
  const [limitPrice, setLimitPrice] = useState(inst ? inst.price.toFixed(2) : '0')

  const placeOrder = useStore((s) => s.placeOrder)
  const cash = useStore((s) => s.cash)
  const positions = useStore((s) => s.positions)
  const { push } = useToast()

  const position = positions.find((p) => p.symbol === symbol)
  const qtyNum = Number(qty) || 0
  const limitNum = Number(limitPrice) || 0
  const execPrice = kind === 'market' ? inst?.price ?? 0 : limitNum
  const estimatedTotal = execPrice * qtyNum

  const maxBuyQty = inst ? Math.floor(cash / inst.price) : 0

  const canSubmit = qtyNum > 0 && (side === 'sell' ? (position?.qty ?? 0) >= qtyNum : estimatedTotal <= cash)

  if (!inst) return null

  const handleSubmit = () => {
    const result = placeOrder({ symbol, side, kind, qty: qtyNum, limitPrice: kind === 'limit' ? limitNum : null })
    push(result.message, result.ok ? 'success' : 'error')
    if (result.ok) setQty('10')
  }

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-1 bg-base-900 rounded-lg p-1">
        {(['buy', 'sell'] as OrderSide[]).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={`py-2 rounded-md text-sm font-semibold capitalize transition-colors ${
              side === s ? (s === 'buy' ? 'bg-up-soft text-up' : 'bg-down-soft text-down') : 'text-base-400 hover:text-base-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-base-400">
          {side === 'sell' ? 'Shares owned' : 'Buying power'}
        </span>
        <span className="font-mono-num text-base-100 font-medium">
          {side === 'sell' ? `${position?.qty ?? 0} sh` : formatPrice(cash)}
        </span>
      </div>

      <div className="flex gap-2">
        {(['market', 'limit'] as OrderKind[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize border transition-colors ${
              kind === k ? 'border-accent-dim bg-accent-soft text-accent' : 'border-base-700 text-base-400 hover:border-base-500'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs text-base-400 mb-1 block">Quantity</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full bg-base-900 border border-base-700 rounded-lg px-3 py-2 text-sm font-mono-num text-base-50 outline-none focus:border-accent-dim"
          />
          {side === 'buy' && (
            <button onClick={() => setQty(String(maxBuyQty))} className="text-xs text-accent whitespace-nowrap hover:underline">
              Max
            </button>
          )}
        </div>
      </div>

      {kind === 'limit' && (
        <div>
          <label className="text-xs text-base-400 mb-1 block">Limit price</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="w-full bg-base-900 border border-base-700 rounded-lg px-3 py-2 text-sm font-mono-num text-base-50 outline-none focus:border-accent-dim"
          />
        </div>
      )}

      <div className="border-t border-base-800 pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-base-400">Est. price</span>
          <span className="font-mono-num text-base-200">{formatPrice(execPrice)}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span className="text-base-300">Est. total</span>
          <span className="font-mono-num text-base-50">{formatPrice(estimatedTotal)}</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
          canSubmit
            ? side === 'buy'
              ? 'bg-accent text-base-950 hover:bg-accent/90'
              : 'bg-down text-base-950 hover:bg-down/90'
            : 'bg-base-800 text-base-500 cursor-not-allowed'
        }`}
      >
        {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
      </button>
      <p className="text-[11px] text-base-500 text-center -mt-2">Simulated order — no real funds are used.</p>
    </div>
  )
}
