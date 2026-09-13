import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Globe2,
  BarChart3,
  Layers,
  Star,
  Wallet,
  CandlestickChart,
  ListOrdered,
  ArrowLeftRight,
  FlaskConical,
  Newspaper,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { Logo } from '../Logo'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/markets', label: 'Markets', icon: Globe2 },
  { to: '/stocks', label: 'Stocks', icon: BarChart3 },
  { to: '/etfs', label: 'ETFs', icon: Layers },
  { to: '/watchlist', label: 'Watchlist', icon: Star },
  { to: '/trading', label: 'Trading', icon: CandlestickChart },
  { to: '/portfolio', label: 'Portfolio', icon: Wallet },
  { to: '/orders', label: 'Orders', icon: ListOrdered },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/research', label: 'Research', icon: FlaskConical },
  { to: '/news', label: 'News', icon: Newspaper },
  { to: '/ai-insights', label: 'AI Insights', icon: Sparkles },
  { to: '/profile', label: 'Profile', icon: User },
]

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-5">
        <Logo />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-base-800 text-base-50' : 'text-base-300 hover:bg-base-850 hover:text-base-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={2} className={isActive ? 'text-accent' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-5 border-t border-base-800">
        <div className="rounded-xl bg-base-900 border border-base-700 p-3.5">
          <p className="text-xs text-base-300 leading-relaxed">
            All data on Vertex is simulated for demonstration purposes. Not real market data or financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 shrink-0 h-screen sticky top-0 border-r border-base-800 bg-base-950">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-base-950 border-r border-base-800 animate-rise-in">
        <button onClick={onClose} className="absolute right-3 top-4 text-base-300 hover:text-base-100 p-1">
          <X size={20} />
        </button>
        <SidebarContent onNavigate={onClose} />
      </div>
    </div>
  )
}
