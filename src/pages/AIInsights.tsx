import { useEffect, useRef, useState } from 'react'
import { Sparkles, Send, Bot, User } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { answerQuestion, findSymbolInText, SUGGESTED_PROMPTS } from '../lib/aiAssistant'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AIInsights() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi, I'm the Vertex AI research assistant. Ask me about a ticker, a sector, or how the market is doing today — I'll answer using the simulated dataset behind this demo.",
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [contextSymbol, setContextSymbol] = useState<string | undefined>(undefined)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    const mentioned = findSymbolInText(trimmed)
    if (mentioned) setContextSymbol(mentioned)

    setTimeout(() => {
      const reply = answerQuestion(trimmed, contextSymbol)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: reply }])
      setThinking(false)
    }, 550 + Math.random() * 500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <PageHeader title="AI Insights" subtitle="A research assistant grounded in this demo's simulated market data." />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-accent-soft text-accent' : 'bg-blue-soft text-blue'}`}>
              {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div
              className={`max-w-[min(560px,80%)] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'assistant' ? 'glass-panel text-base-200' : 'bg-blue text-base-950 font-medium'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-accent-soft text-accent">
              <Bot size={16} />
            </div>
            <div className="glass-panel rounded-2xl px-4 py-3 text-sm text-base-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-base-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-base-400 animate-pulse [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-base-400 animate-pulse [animation-delay:0.3s]" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 sm:px-6 pb-2 flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="text-xs text-base-300 border border-base-700 rounded-full px-3 py-1.5 hover:border-accent-dim hover:text-accent transition-colors flex items-center gap-1"
          >
            <Sparkles size={11} /> {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="px-4 sm:px-6 py-4 border-t border-base-800 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a stock, sector, or the market..."
          className="flex-1 bg-base-900 border border-base-700 rounded-xl px-4 py-3 text-sm text-base-50 placeholder:text-base-500 outline-none focus:border-accent-dim"
        />
        <button
          type="submit"
          disabled={!input.trim() || thinking}
          className="w-11 h-11 rounded-xl bg-accent text-base-950 flex items-center justify-center disabled:opacity-40 hover:bg-accent/90 transition-colors shrink-0"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  )
}
