import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ToastProvider } from './components/Toast'
import Dashboard from './pages/Dashboard'
import Markets from './pages/Markets'
import Stocks from './pages/Stocks'
import ETFs from './pages/ETFs'
import Watchlist from './pages/Watchlist'
import Portfolio from './pages/Portfolio'
import StockDetail from './pages/StockDetail'
import Trading from './pages/Trading'
import Orders from './pages/Orders'
import Transactions from './pages/Transactions'
import Research from './pages/Research'
import News from './pages/News'
import AIInsights from './pages/AIInsights'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/etfs" element={<ETFs />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/stocks/:symbol" element={<StockDetail />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/trading/:symbol" element={<Trading />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/research" element={<Research />} />
          <Route path="/news" element={<News />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
