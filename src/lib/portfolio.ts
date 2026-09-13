import { getInstrument } from './stocks'
import type { Position } from '../types'

export interface EnrichedPosition extends Position {
  price: number
  marketValue: number
  costBasis: number
  gain: number
  gainPercent: number
  dayChange: number
  dayChangePercent: number
  color: string
  name: string
}

export function enrichPositions(positions: Position[]): EnrichedPosition[] {
  return positions
    .map((p) => {
      const inst = getInstrument(p.symbol)
      if (!inst) return null
      const marketValue = inst.price * p.qty
      const costBasis = p.avgCost * p.qty
      const gain = marketValue - costBasis
      const dayChange = inst.change * p.qty
      return {
        ...p,
        price: inst.price,
        marketValue,
        costBasis,
        gain,
        gainPercent: (gain / costBasis) * 100,
        dayChange,
        dayChangePercent: inst.changePercent,
        color: inst.color,
        name: inst.name,
      }
    })
    .filter((p): p is EnrichedPosition => p !== null)
}

export function portfolioSummary(positions: Position[], cash: number) {
  const enriched = enrichPositions(positions)
  const holdingsValue = enriched.reduce((sum, p) => sum + p.marketValue, 0)
  const totalValue = holdingsValue + cash
  const totalCost = enriched.reduce((sum, p) => sum + p.costBasis, 0)
  const totalGain = enriched.reduce((sum, p) => sum + p.gain, 0)
  const dayChange = enriched.reduce((sum, p) => sum + p.dayChange, 0)
  const prevTotalValue = totalValue - dayChange
  return {
    enriched,
    holdingsValue,
    totalValue,
    totalCost,
    totalGain,
    totalGainPercent: totalCost > 0 ? (totalGain / totalCost) * 100 : 0,
    dayChange,
    dayChangePercent: prevTotalValue > 0 ? (dayChange / prevTotalValue) * 100 : 0,
  }
}
