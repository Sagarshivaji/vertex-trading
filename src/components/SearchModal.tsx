import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, CornerDownLeft } from 'lucide-react'
import { getAllInstruments } from '../lib/stocks'
import { ChangeBadge } from './PriceChange'
import { formatPrice } from '../lib/format'

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    const all = getAllInstruments()
    if (!query.trim()) return all.slice(0, 8)
    const q = query.toLowerCase()
    return all.filter((i) => i.symbol.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)).slice(0, 8)
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => setActiveIndex(0), [query])

  const select = (symbol: string) => {
    navigate(`/stocks/${symbol}`)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (results[activeIndex]) select(results[activeIndex].symbol)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl glass-panel rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b border-base-700">
              <Search size={18} className="text-base-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search stocks, ETFs..."
                className="w-full bg-transparent py-4 text-base text-base-50 placeholder:text-base-400 outline-none"
              />
              <kbd className="hidden sm:block text-[10px] text-base-400 border border-base-600 rounded px-1.5 py-0.5">ESC</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {results.length === 0 && <p className="px-4 py-6 text-sm text-base-400 text-center">No instruments found.</p>}
              {results.map((inst, idx) => (
                <button
                  key={inst.symbol}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => select(inst.symbol)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                    idx === activeIndex ? 'bg-base-800' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold font-mono-num shrink-0"
                      style={{ backgroundColor: `${inst.color}22`, color: inst.color }}
                    >
                      {inst.symbol.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-base-50">{inst.symbol}</span>
                        <span className="text-[10px] uppercase tracking-wide text-base-400 border border-base-700 rounded px-1">{inst.assetClass}</span>
                      </div>
                      <p className="text-xs text-base-400 truncate">{inst.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono-num text-sm text-base-100">{formatPrice(inst.price)}</span>
                    <ChangeBadge change={inst.change} changePercent={inst.changePercent} size="sm" />
                    {idx === activeIndex && <CornerDownLeft size={14} className="text-base-500 hidden sm:block" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
