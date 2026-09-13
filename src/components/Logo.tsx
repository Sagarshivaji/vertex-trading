import { Link } from 'react-router-dom'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <svg width="26" height="26" viewBox="0 0 32 32" className="shrink-0">
        <rect width="32" height="32" rx="8" className="fill-base-900" />
        <path
          d="M7 8 L16 24 L25 8"
          stroke="#3ddc84"
          strokeWidth="3.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:scale-105 origin-center"
        />
      </svg>
      <span className="text-lg font-bold tracking-tight text-base-50">Vertex</span>
    </Link>
  )
}
