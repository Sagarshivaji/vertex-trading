import { getAllInstruments, getInstrument, getSectorPerformance, getTopMovers } from './stocks'
import { getNewsForSymbol } from './news'
import { sliceForTimeframe } from './history'
import type { Instrument } from '../types'

function fmtPct(n: number) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}
function fmtPrice(n: number) {
  return `$${n.toFixed(2)}`
}

export function findSymbolInText(text: string): string | null {
  const upper = text.toUpperCase()
  const all = getAllInstruments()
  for (const inst of all) {
    const re = new RegExp(`\\b${inst.symbol}\\b`)
    if (re.test(upper)) return inst.symbol
  }
  const lower = text.toLowerCase()
  for (const inst of all) {
    const shortName = inst.name.split(' ')[0].toLowerCase().replace(/[.,]/g, '')
    if (shortName.length > 2 && lower.includes(shortName)) return inst.symbol
  }
  return null
}

function weeklyTrendPhrase(inst: Instrument) {
  const week = sliceForTimeframe(inst.history, '1W')
  if (week.length < 2) return 'little history to compare against'
  const weekChange = ((week[week.length - 1].close - week[0].open) / week[0].open) * 100
  if (weekChange > 3) return `extending a strong weekly advance of ${fmtPct(weekChange)}`
  if (weekChange > 0.5) return `building on a modest weekly gain of ${fmtPct(weekChange)}`
  if (weekChange < -3) return `deepening a weekly decline of ${fmtPct(weekChange)}`
  if (weekChange < -0.5) return `adding to a mild weekly pullback of ${fmtPct(weekChange)}`
  return 'trading roughly flat over the past week'
}

function sentimentPhrase(inst: Instrument) {
  const { buy, hold, sell, targetPrice } = inst.sentiment
  const total = buy + hold + sell
  const buyPct = Math.round((buy / total) * 100)
  const upside = ((targetPrice - inst.price) / inst.price) * 100
  const direction = upside >= 0 ? 'upside' : 'downside'
  return `Analyst sentiment skews ${buyPct >= 60 ? 'bullish' : buyPct >= 40 ? 'mixed' : 'cautious'} (${buy} buy / ${hold} hold / ${sell} sell), with an average price target of ${fmtPrice(targetPrice)} implying ${Math.abs(upside).toFixed(1)}% ${direction} from current levels.`
}

export function generateStockInsight(symbolOrText: string): string {
  const symbol = findSymbolInText(symbolOrText) ?? symbolOrText.toUpperCase()
  const inst = getInstrument(symbol)
  if (!inst) {
    return generateMarketInsight(symbolOrText)
  }

  const direction = inst.change >= 0 ? 'moved higher' : 'moved lower'
  const magnitude = Math.abs(inst.changePercent) > 3 ? 'a sharp' : Math.abs(inst.changePercent) > 1 ? 'a notable' : 'a modest'
  const news = getNewsForSymbol(inst.symbol)[0]

  const parts: string[] = []
  parts.push(
    `${inst.symbol} ${direction} today, closing at ${fmtPrice(inst.price)} (${fmtPct(inst.changePercent)}), ${magnitude} move on volume of ${(inst.volume / 1_000_000).toFixed(1)}M shares versus its average of ${(inst.avgVolume / 1_000_000).toFixed(1)}M.`,
  )
  parts.push(`The stock is ${weeklyTrendPhrase(inst)}, and sits ${(((inst.price - inst.low52) / (inst.high52 - inst.low52)) * 100).toFixed(0)}% of the way through its 52-week range of ${fmtPrice(inst.low52)}–${fmtPrice(inst.high52)}.`)
  if (news) {
    parts.push(`Recent coverage: "${news.headline}" (${news.source}) — ${news.summary}`)
  }
  parts.push(sentimentPhrase(inst))
  parts.push('This summary is generated from simulated market data for demonstration purposes and is not investment advice.')
  return parts.join(' ')
}

export function generateMarketInsight(_question: string): string {
  const { gainers, losers } = getTopMovers(3)
  const sectors = getSectorPerformance()
  const topSector = sectors[0]
  const bottomSector = sectors[sectors.length - 1]

  const parts: string[] = []
  parts.push(
    `Across the simulated market, ${gainers[0].symbol} leads gainers at ${fmtPct(gainers[0].changePercent)}, while ${losers[0].symbol} lags at ${fmtPct(losers[0].changePercent)}.`,
  )
  parts.push(
    `${topSector.sector} is the strongest-performing sector today (${fmtPct(topSector.changePercent)} average), while ${bottomSector.sector} brings up the rear (${fmtPct(bottomSector.changePercent)} average).`,
  )
  parts.push(`Other notable movers: ${gainers.slice(1).map((g) => `${g.symbol} ${fmtPct(g.changePercent)}`).join(', ')} on the upside, and ${losers.slice(1).map((l) => `${l.symbol} ${fmtPct(l.changePercent)}`).join(', ')} on the downside.`)
  parts.push('Ask me about a specific ticker (e.g. "Why did AAPL move today?") for a more detailed breakdown. This is simulated data, not investment advice.')
  return parts.join(' ')
}

export function answerQuestion(question: string, contextSymbol?: string): string {
  const q = question.trim()
  if (!q) return "Ask me about a stock — try \"Why did AAPL move today?\" or \"How's the market doing?\""

  const mentioned = findSymbolInText(q)
  const symbol = mentioned ?? contextSymbol

  const lower = q.toLowerCase()
  const isMarketWide = /market|overall|sector|today/.test(lower) && !mentioned

  if (symbol && !isMarketWide) {
    return generateStockInsight(symbol)
  }
  return generateMarketInsight(q)
}

export const SUGGESTED_PROMPTS = [
  'Why did AAPL move today?',
  "How's the market doing today?",
  'What do analysts think about NVDA?',
  'Give me a summary of TSLA',
]
