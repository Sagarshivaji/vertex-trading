import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts'
import type { Candle } from '../types'

export function Sparkline({ data, positive, height = 40, width = 120 }: { data: Candle[]; positive: boolean; height?: number; width?: number }) {
  const color = positive ? '#2fd480' : '#ff5c72'
  const points = data.map((c, i) => ({ i, v: c.close }))

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`spark-${positive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${positive ? 'up' : 'down'})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
