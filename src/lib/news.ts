import { getAllInstruments } from './stocks'
import { seededRng } from './random'
import type { NewsItem } from '../types'

const SOURCES = ['MarketWire', 'Bloomberg', 'Reuters', 'The Ledger', 'Vertex Research', 'CNBC']

const BULLISH_TEMPLATES = [
  (n: string, s: string) => ({
    headline: `${n} shares climb after upbeat analyst commentary`,
    summary: `Sell-side desks flagged resilient demand trends and raised confidence in ${n}'s near-term guidance, citing strength across its ${s} end markets.`,
    tag: 'Analyst Note',
  }),
  (n: string, s: string) => ({
    headline: `${n} extends rally as sector rotation favors ${s}`,
    summary: `Investors rotated into ${s} names this week, with ${n} among the top beneficiaries amid improving risk appetite.`,
    tag: 'Markets',
  }),
  (n: string) => ({
    headline: `${n} beats expectations, guidance raised for the year`,
    summary: `Management pointed to disciplined cost control and accelerating product adoption as the key drivers behind the raised outlook.`,
    tag: 'Earnings',
  }),
  (n: string) => ({
    headline: `${n} announces expanded buyback program`,
    summary: `The board authorized an increase to the existing repurchase program, signaling confidence in the balance sheet and forward cash generation.`,
    tag: 'Capital Return',
  }),
]

const BEARISH_TEMPLATES = [
  (n: string, s: string) => ({
    headline: `${n} slides on ${s} demand concerns`,
    summary: `Shares came under pressure after channel checks pointed to softer near-term demand across parts of the ${s} sector.`,
    tag: 'Markets',
  }),
  (n: string) => ({
    headline: `${n} downgraded on valuation concerns`,
    summary: `Analysts trimmed price targets, arguing recent gains had outpaced the pace of fundamental improvement.`,
    tag: 'Analyst Note',
  }),
  (n: string) => ({
    headline: `${n} guidance disappoints, shares pull back`,
    summary: `Forward guidance came in below Street expectations, with management citing macro headwinds and cautious enterprise spending.`,
    tag: 'Earnings',
  }),
]

const NEUTRAL_TEMPLATES = [
  (n: string) => ({
    headline: `${n} to present at upcoming industry conference`,
    summary: `Management is scheduled to discuss strategy and product roadmap in a fireside chat next week.`,
    tag: 'Company News',
  }),
  (n: string, s: string) => ({
    headline: `What to watch in ${s} this quarter`,
    summary: `A look at the themes likely to shape ${n} and its peers heading into the next earnings cycle.`,
    tag: 'Research',
  }),
]

function buildNewsForInstrument(symbol: string, name: string, sector: string, changePercent: number, idx: number): NewsItem {
  const rng = seededRng(symbol, 'news', idx)
  const pool = changePercent > 1.2 ? BULLISH_TEMPLATES : changePercent < -1.2 ? BEARISH_TEMPLATES : NEUTRAL_TEMPLATES
  const template = pool[Math.floor(rng() * pool.length)]
  const { headline, summary, tag } = template(name, sector)
  const source = SOURCES[Math.floor(rng() * SOURCES.length)]
  const hoursAgo = Math.floor(rng() * 60) + idx * 3
  const image = idx % 3 === 0 ? '/images/news1.png' : idx % 3 === 1 ? '/images/news2.png' : undefined
  return {
    id: `${symbol}-news-${idx}`,
    symbol,
    headline,
    summary,
    source,
    tag,
    timestamp: Date.now() - hoursAgo * 3600 * 1000,
    image,
  }
}

let _cache: NewsItem[] | null = null

export function getAllNews(): NewsItem[] {
  if (_cache) return _cache
  const items: NewsItem[] = []
  for (const inst of getAllInstruments()) {
    const count = 2 + Math.floor(seededRng(inst.symbol, 'newscount')() * 2)
    for (let i = 0; i < count; i++) {
      items.push(buildNewsForInstrument(inst.symbol, inst.name, inst.sector, inst.changePercent, i))
    }
  }
  items.sort((a, b) => b.timestamp - a.timestamp)
  _cache = items
  return items
}

export function getNewsForSymbol(symbol: string): NewsItem[] {
  return getAllNews().filter((n) => n.symbol === symbol.toUpperCase())
}
