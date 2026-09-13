import type { ReactNode } from 'react'

export function StatCard({
  label,
  value,
  delta,
  icon,
  positive,
}: {
  label: string
  value: string
  delta?: string
  icon?: ReactNode
  positive?: boolean
}) {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wide text-base-400">{label}</span>
        {icon && <span className="text-base-500">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold font-mono-num text-base-50">{value}</span>
        {delta && (
          <span className={`text-sm font-mono-num font-medium mb-0.5 ${positive === false ? 'text-down' : positive ? 'text-up' : 'text-base-400'}`}>
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}
