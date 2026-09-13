import { useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { NewsList } from '../components/NewsList'
import { getAllNews } from '../lib/news'

export default function News() {
  const all = getAllNews()
  const [tag, setTag] = useState('All')
  const tags = useMemo(() => ['All', ...Array.from(new Set(all.map((n) => n.tag)))], [all])
  const filtered = tag === 'All' ? all : all.filter((n) => n.tag === tag)

  return (
    <div className="pb-16">
      <PageHeader title="News" subtitle="Market-moving headlines across every simulated instrument." />
      <div className="px-4 sm:px-6 mt-2 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              tag === t ? 'border-accent-dim bg-accent-soft text-accent' : 'border-base-700 text-base-400 hover:border-base-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="px-4 sm:px-6 mt-4">
        <div className="glass-panel rounded-2xl px-4">
          <NewsList items={filtered.slice(0, 40)} />
        </div>
      </div>
    </div>
  )
}
