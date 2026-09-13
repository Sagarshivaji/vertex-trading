import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
      <p className="text-6xl font-bold font-mono-num text-base-700 mb-3">404</p>
      <p className="text-base-400 mb-5">This page doesn't exist in the simulated market.</p>
      <Link to="/" className="text-accent hover:underline text-sm font-medium">
        Back to Dashboard
      </Link>
    </div>
  )
}
