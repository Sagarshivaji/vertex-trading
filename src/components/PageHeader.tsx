import type { ReactNode } from 'react'

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 px-4 sm:px-6 pt-6 pb-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-base-50">{title}</h1>
        {subtitle && <p className="text-sm text-base-400 mt-1 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
