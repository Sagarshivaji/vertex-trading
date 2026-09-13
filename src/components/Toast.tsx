import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, X } from 'lucide-react'

interface ToastItem {
  id: number
  message: string
  variant: 'success' | 'error'
}

interface ToastContextValue {
  push: (message: string, variant?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback((message: string, variant: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }, 4500)
  }, [])

  const dismiss = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[min(360px,90vw)]">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className={`glass-panel rounded-xl px-4 py-3 shadow-2xl flex items-start gap-3 border-l-2 ${
                item.variant === 'success' ? 'border-up' : 'border-down'
              }`}
            >
              {item.variant === 'success' ? (
                <CheckCircle2 size={18} className="text-up shrink-0 mt-0.5" />
              ) : (
                <XCircle size={18} className="text-down shrink-0 mt-0.5" />
              )}
              <p className="text-sm text-base-100 flex-1 leading-snug">{item.message}</p>
              <button onClick={() => dismiss(item.id)} className="text-base-400 hover:text-base-100 shrink-0">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
