export function formatPrice(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatCompact(n: number) {
  return n.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 2 })
}

export function formatMarketCap(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toFixed(0)}`
}

export function formatPercent(n: number, withSign = true) {
  const sign = withSign && n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export function formatVolume(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return `${n.toFixed(0)}`
}

export function formatRelativeTime(timestamp: number) {
  const diffMs = Date.now() - timestamp
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

export function formatDateShort(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
