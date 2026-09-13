export type AssetClass = 'stock' | 'etf'

export interface Candle {
  time: number // unix seconds
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'

export interface AnalystSentiment {
  buy: number
  hold: number
  sell: number
  targetPrice: number
}

export interface Financials {
  year: string
  revenue: number
  netIncome: number
}

export interface Instrument {
  symbol: string
  name: string
  assetClass: AssetClass
  sector: string
  description: string
  shares: number // shares outstanding (millions), used to derive market cap
  eps: number
  dividendYield: number
  color: string
  history: Candle[] // full daily history, ~5y
  price: number
  prevClose: number
  change: number
  changePercent: number
  dayHigh: number
  dayLow: number
  open: number
  volume: number
  avgVolume: number
  high52: number
  low52: number
  marketCap: number
  pe: number | null
  sentiment: AnalystSentiment
  financials: Financials[]
}

export interface NewsItem {
  id: string
  symbol: string | null
  headline: string
  summary: string
  source: string
  timestamp: number
  tag: string
  image?: string
}

export type OrderSide = 'buy' | 'sell'
export type OrderKind = 'market' | 'limit'
export type OrderStatus = 'filled' | 'pending' | 'cancelled'

export interface Order {
  id: string
  symbol: string
  side: OrderSide
  kind: OrderKind
  qty: number
  limitPrice: number | null
  fillPrice: number
  status: OrderStatus
  timestamp: number
}

export interface Position {
  symbol: string
  qty: number
  avgCost: number
}

export interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'deposit' | 'dividend'
  symbol: string | null
  amount: number
  qty: number | null
  price: number | null
  timestamp: number
}
