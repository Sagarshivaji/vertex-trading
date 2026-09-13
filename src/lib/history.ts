import { seededRng } from './random'
import type { Candle, Timeframe } from '../types'

const DAY_SECONDS = 86400

/**
 * Generates a deterministic ~5y daily OHLCV history for a symbol using a
 * seeded random walk with drift, so every reload of the app shows the same
 * "market". `basePrice` is the price the walk starts at ~5 years ago, and
 * `driftPerYear` / `volatility` shape the trend and noise.
 */
export function generateDailyHistory(
  symbol: string,
  basePrice: number,
  driftPerYear: number,
  volatility: number,
  years = 5,
): Candle[] {
  const rng = seededRng(symbol, 'history-v2')
  const days = Math.round(years * 252)
  const dailyDrift = driftPerYear / 252
  const candles: Candle[] = []
  let price = basePrice

  const now = new Date()
  now.setUTCHours(0, 0, 0, 0)
  const nowSeconds = Math.floor(now.getTime() / 1000)
  // walk back to find the start date, skipping weekends
  const startTime = nowSeconds - days * DAY_SECONDS * (7 / 5)

  let t = startTime
  for (let i = 0; i < days; i++) {
    // advance to next weekday
    let day = new Date(t * 1000).getUTCDay()
    while (day === 0 || day === 6) {
      t += DAY_SECONDS
      day = new Date(t * 1000).getUTCDay()
    }

    const shock = (rng() - 0.5) * 2 * volatility
    const meanRevert = (basePrice * Math.exp(dailyDrift * i) - price) * 0.01
    const open = price
    price = Math.max(0.5, price * (1 + dailyDrift + shock) + meanRevert)
    const high = Math.max(open, price) * (1 + rng() * volatility * 0.6)
    const low = Math.min(open, price) * (1 - rng() * volatility * 0.6)
    const volume = Math.round(1_000_000 + rng() * 20_000_000)

    candles.push({ time: t, open, high, low, close: price, volume })
    t += DAY_SECONDS
  }

  return candles
}

/** Synthesizes an intraday 1D series (5-minute bars) around the last close. */
export function generateIntraday(symbol: string, prevClose: number, currentClose: number): Candle[] {
  const rng = seededRng(symbol, 'intraday', new Date().toDateString())
  const bars = 78 // ~6.5h session in 5-min bars
  const now = new Date()
  now.setUTCHours(13, 30, 0, 0) // 9:30 ET session open approximation in UTC
  const startTime = Math.floor(now.getTime() / 1000)
  const candles: Candle[] = []
  let price = prevClose
  let smoothNoise = 0
  const totalMove = currentClose - prevClose

  for (let i = 0; i < bars; i++) {
    const progress = (i + 1) / bars
    const target = prevClose + totalMove * progress
    const rawShock = (rng() - 0.5) * Math.abs(prevClose) * 0.0011
    smoothNoise = smoothNoise * 0.86 + rawShock
    const open = price
    price = target + smoothNoise
    const high = Math.max(open, price) + rng() * Math.abs(prevClose) * 0.00025
    const low = Math.min(open, price) - rng() * Math.abs(prevClose) * 0.00025
    const volume = Math.round(20_000 + rng() * 400_000)
    candles.push({ time: startTime + i * 300, open, high, low, close: price, volume })
  }
  candles[candles.length - 1].close = currentClose
  return candles
}

export function sliceForTimeframe(history: Candle[], timeframe: Timeframe): Candle[] {
  const n = history.length
  switch (timeframe) {
    case '1W':
      return history.slice(Math.max(0, n - 5))
    case '1M':
      return history.slice(Math.max(0, n - 21))
    case '3M':
      return history.slice(Math.max(0, n - 63))
    case '1Y':
      return history.slice(Math.max(0, n - 252))
    case '5Y':
      return history.filter((_, i) => i % 5 === 0)
    default:
      return history
  }
}

export function high52Low52(history: Candle[]) {
  const window = history.slice(Math.max(0, history.length - 252))
  const high = Math.max(...window.map((c) => c.high))
  const low = Math.min(...window.map((c) => c.low))
  return { high52: high, low52: low }
}
