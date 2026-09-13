import { INSTRUMENT_DEFS } from './stockDefs'
import { generateDailyHistory, high52Low52 } from './history'
import { seededRng } from './random'
import type { AnalystSentiment, Financials, Instrument } from '../types'

function buildInstrument(def: (typeof INSTRUMENT_DEFS)[number]): Instrument {
  const history = generateDailyHistory(def.symbol, def.basePrice, def.driftPerYear, def.volatility)
  const last = history[history.length - 1]
  const prev = history[history.length - 2]
  const rng = seededRng(def.symbol, 'meta')

  const price = last.close
  const prevClose = prev.close
  const change = price - prevClose
  const changePercent = (change / prevClose) * 100
  const { high52, low52 } = high52Low52(history)

  const recentVolumes = history.slice(-30).map((c) => c.volume)
  const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length

  const marketCap = price * def.shares * 1_000_000
  const pe = def.eps > 0 ? price / def.eps : null

  const buy = Math.round(8 + rng() * 18)
  const hold = Math.round(3 + rng() * 10)
  const sell = Math.round(rng() * 5)
  const targetSkew = def.driftPerYear > 0.15 ? 0.18 : def.driftPerYear > 0 ? 0.08 : -0.04
  const sentiment: AnalystSentiment = {
    buy,
    hold,
    sell,
    targetPrice: price * (1 + targetSkew + (rng() - 0.5) * 0.06),
  }

  const financials: Financials[] = []
  const years = ['2021', '2022', '2023', '2024', '2025']
  let revenue = def.shares * def.eps * (6 + rng() * 4) * (def.eps > 0 ? 1 : 4)
  if (revenue <= 0) revenue = def.shares * 3
  for (let i = 0; i < years.length; i++) {
    const growth = 1 + def.driftPerYear * 0.6 + (rng() - 0.4) * 0.1
    revenue = revenue * growth
    const margin = 0.08 + rng() * 0.22
    financials.push({
      year: years[i],
      revenue: Math.max(revenue, 0),
      netIncome: Math.max(revenue * margin, revenue * -0.05),
    })
  }

  return {
    symbol: def.symbol,
    name: def.name,
    assetClass: def.assetClass,
    sector: def.sector,
    description: def.description,
    shares: def.shares,
    eps: def.eps,
    dividendYield: def.dividendYield,
    color: def.color,
    history,
    price,
    prevClose,
    change,
    changePercent,
    dayHigh: last.high,
    dayLow: last.low,
    open: last.open,
    volume: last.volume,
    avgVolume,
    high52,
    low52,
    marketCap,
    pe,
    sentiment,
    financials,
  }
}

let _cache: Map<string, Instrument> | null = null

export function getAllInstruments(): Instrument[] {
  if (!_cache) {
    _cache = new Map()
    for (const def of INSTRUMENT_DEFS) {
      _cache.set(def.symbol, buildInstrument(def))
    }
  }
  return Array.from(_cache.values())
}

export function getInstrument(symbol: string): Instrument | undefined {
  getAllInstruments()
  return _cache!.get(symbol.toUpperCase())
}

export function getStocks(): Instrument[] {
  return getAllInstruments().filter((i) => i.assetClass === 'stock')
}

export function getETFs(): Instrument[] {
  return getAllInstruments().filter((i) => i.assetClass === 'etf')
}

export function getTopMovers(count = 5) {
  const all = getAllInstruments()
  const gainers = [...all].sort((a, b) => b.changePercent - a.changePercent).slice(0, count)
  const losers = [...all].sort((a, b) => a.changePercent - b.changePercent).slice(0, count)
  const mostActive = [...all].sort((a, b) => b.volume - a.volume).slice(0, count)
  return { gainers, losers, mostActive }
}

export function getSectorPerformance() {
  const all = getAllInstruments()
  const bySector = new Map<string, number[]>()
  for (const inst of all) {
    const arr = bySector.get(inst.sector) ?? []
    arr.push(inst.changePercent)
    bySector.set(inst.sector, arr)
  }
  return Array.from(bySector.entries())
    .map(([sector, values]) => ({
      sector,
      changePercent: values.reduce((a, b) => a + b, 0) / values.length,
    }))
    .sort((a, b) => b.changePercent - a.changePercent)
}
