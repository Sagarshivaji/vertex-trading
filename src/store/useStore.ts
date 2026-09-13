import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getInstrument } from '../lib/stocks'
import type { Order, OrderKind, OrderSide, Position, Transaction } from '../types'

const STARTING_CASH = 100_000

const STARTER_HOLDINGS: { symbol: string; qty: number; costFactor: number; daysAgo: number }[] = [
  { symbol: 'AAPL', qty: 18, costFactor: 0.91, daysAgo: 62 },
  { symbol: 'NVDA', qty: 12, costFactor: 0.72, daysAgo: 45 },
  { symbol: 'MSFT', qty: 8, costFactor: 0.94, daysAgo: 30 },
  { symbol: 'TSLA', qty: 10, costFactor: 1.08, daysAgo: 18 },
]

function buildStarterAccount() {
  const positions: Position[] = []
  const orders: Order[] = []
  const transactions: Transaction[] = [
    { id: genId(), type: 'deposit', symbol: null, amount: STARTING_CASH, qty: null, price: null, timestamp: Date.now() - 86400_000 * 90 },
  ]
  let cash = STARTING_CASH

  for (const holding of STARTER_HOLDINGS) {
    const inst = getInstrument(holding.symbol)
    if (!inst) continue
    const avgCost = inst.price * holding.costFactor
    const total = avgCost * holding.qty
    const timestamp = Date.now() - 86400_000 * holding.daysAgo
    cash -= total
    positions.push({ symbol: holding.symbol, qty: holding.qty, avgCost })
    orders.push({
      id: genId(),
      symbol: holding.symbol,
      side: 'buy',
      kind: 'market',
      qty: holding.qty,
      limitPrice: null,
      fillPrice: avgCost,
      status: 'filled',
      timestamp,
    })
    transactions.push({ id: genId(), type: 'buy', symbol: holding.symbol, amount: -total, qty: holding.qty, price: avgCost, timestamp })
  }

  orders.sort((a, b) => b.timestamp - a.timestamp)
  transactions.sort((a, b) => b.timestamp - a.timestamp)
  return { cash, positions, orders, transactions }
}

interface StoreState {
  watchlist: string[]
  cash: number
  positions: Position[]
  orders: Order[]
  transactions: Transaction[]
  toggleWatchlist: (symbol: string) => void
  isWatched: (symbol: string) => boolean
  placeOrder: (params: { symbol: string; side: OrderSide; kind: OrderKind; qty: number; limitPrice: number | null }) => { ok: boolean; message: string; order?: Order }
  resetAccount: () => void
}

function genId() {
  return Math.random().toString(36).slice(2, 10)
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      watchlist: ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN'],
      ...buildStarterAccount(),

      toggleWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.includes(symbol)
            ? state.watchlist.filter((s) => s !== symbol)
            : [...state.watchlist, symbol],
        })),

      isWatched: (symbol) => get().watchlist.includes(symbol),

      placeOrder: ({ symbol, side, kind, qty, limitPrice }) => {
        const inst = getInstrument(symbol)
        if (!inst) return { ok: false, message: 'Unknown instrument.' }
        if (qty <= 0) return { ok: false, message: 'Quantity must be greater than zero.' }

        const fillPrice = kind === 'limit' && limitPrice ? limitPrice : inst.price
        const total = fillPrice * qty

        if (side === 'buy' && total > get().cash) {
          return { ok: false, message: `Insufficient buying power. Estimated cost ${total.toFixed(2)} exceeds available cash ${get().cash.toFixed(2)}.` }
        }

        const state = get()
        if (side === 'sell') {
          const pos = state.positions.find((p) => p.symbol === symbol)
          if (!pos || pos.qty < qty) {
            return { ok: false, message: `You only hold ${pos?.qty ?? 0} shares of ${symbol}.` }
          }
        }

        const order: Order = {
          id: genId(),
          symbol,
          side,
          kind,
          qty,
          limitPrice,
          fillPrice,
          status: 'filled',
          timestamp: Date.now(),
        }

        set((s) => {
          let positions = [...s.positions]
          const idx = positions.findIndex((p) => p.symbol === symbol)
          if (side === 'buy') {
            if (idx >= 0) {
              const existing = positions[idx]
              const newQty = existing.qty + qty
              const newAvgCost = (existing.avgCost * existing.qty + fillPrice * qty) / newQty
              positions[idx] = { ...existing, qty: newQty, avgCost: newAvgCost }
            } else {
              positions.push({ symbol, qty, avgCost: fillPrice })
            }
          } else {
            if (idx >= 0) {
              const existing = positions[idx]
              const newQty = existing.qty - qty
              positions = newQty <= 0 ? positions.filter((p) => p.symbol !== symbol) : positions.map((p, i) => (i === idx ? { ...p, qty: newQty } : p))
            }
          }

          const cashDelta = side === 'buy' ? -total : total
          const tx: Transaction = {
            id: genId(),
            type: side,
            symbol,
            amount: cashDelta,
            qty,
            price: fillPrice,
            timestamp: Date.now(),
          }

          return {
            cash: s.cash + cashDelta,
            positions,
            orders: [order, ...s.orders],
            transactions: [tx, ...s.transactions],
          }
        })

        return { ok: true, message: `${side === 'buy' ? 'Bought' : 'Sold'} ${qty} share${qty === 1 ? '' : 's'} of ${symbol} at ${fillPrice.toFixed(2)}.`, order }
      },

      resetAccount: () => set(buildStarterAccount()),
    }),
    { name: 'vertex-trading-store' },
  ),
)
