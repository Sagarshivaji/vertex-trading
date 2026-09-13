import { Link } from 'react-router-dom'
import type { NewsItem } from '../types'
import { formatRelativeTime } from '../lib/format'

export function NewsList({ items, compact = false }: { items: NewsItem[]; compact?: boolean }) {
  if (items.length === 0) {
    return <p className="text-sm text-base-400 py-6 text-center">No news available.</p>
  }
  return (
    <div className="divide-y divide-base-850">
      {items.map((item) => (
        <div key={item.id} className={`py-3.5 flex gap-4 ${compact ? '' : 'sm:py-4'}`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-accent bg-accent-soft px-1.5 py-0.5 rounded">{item.tag}</span>
              {item.symbol && (
                <Link to={`/stocks/${item.symbol}`} className="text-xs font-semibold text-base-300 hover:text-base-100">
                  {item.symbol}
                </Link>
              )}
              <span className="text-xs text-base-500">· {item.source}</span>
              <span className="text-xs text-base-500 ml-auto shrink-0">{formatRelativeTime(item.timestamp)}</span>
            </div>
            <h3 className="text-sm font-semibold text-base-50 leading-snug mb-1">{item.headline}</h3>
            {!compact && <p className="text-sm text-base-400 leading-relaxed">{item.summary}</p>}
          </div>
          {item.image && (
            <div className="hidden sm:block shrink-0 w-24 h-16 sm:w-32 sm:h-20 rounded overflow-hidden">
              <img src={item.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
