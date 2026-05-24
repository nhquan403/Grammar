import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AppHeaderProps {
  title: string
  subtitle?: string
  rightAction?: React.ReactNode
  showBack?: boolean
}

export function AppHeader({ title, subtitle, rightAction, showBack }: AppHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-4"
      style={{
        background: 'rgba(248,250,252,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226,232,240,0.8)'
      }}>
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center -ml-1 rounded-xl text-slate-500"
            style={{ minWidth: 40, minHeight: 40 }}
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <div>
          <h1 className="text-lg font-bold leading-tight"
            style={{ color: 'var(--color-foreground)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs leading-none mt-0.5"
              style={{ color: 'var(--color-muted-foreground)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  )
}
