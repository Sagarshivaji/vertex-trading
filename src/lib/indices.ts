import { generateDailyHistory } from './history'

export interface IndexDef {
  symbol: string
  name: string
  basePrice: number
  driftPerYear: number
  volatility: number
}

const INDEX_DEFS: IndexDef[] = [
  { symbol: 'SPX', name: 'S&P 500', basePrice: 2900, driftPerYear: 0.12, volatility: 0.009 },
  { symbol: 'NDX', name: 'Nasdaq Composite', basePrice: 9200, driftPerYear: 0.17, volatility: 0.012 },
  { symbol: 'DJI', name: 'Dow Jones Industrial', basePrice: 24000, driftPerYear: 0.09, volatility: 0.008 },
  { symbol: 'RUT', name: 'Russell 2000', basePrice: 1450, driftPerYear: 0.07, volatility: 0.013 },
]

export interface MarketIndex {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
  history: ReturnType<typeof generateDailyHistory>
}

let _cache: MarketIndex[] | null = null

export function getIndices(): MarketIndex[] {
  if (_cache) return _cache
  _cache = INDEX_DEFS.map((def) => {
    const history = generateDailyHistory(def.symbol, def.basePrice, def.driftPerYear, def.volatility)
    const last = history[history.length - 1]
    const prev = history[history.length - 2]
    return {
      symbol: def.symbol,
      name: def.name,
      value: last.close,
      change: last.close - prev.close,
      changePercent: ((last.close - prev.close) / prev.close) * 100,
      history,
    }
  })
  return _cache
}
