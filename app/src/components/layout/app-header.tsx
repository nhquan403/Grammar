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
    <header
      className="glass-light sticky top-0 z-10 flex items-center justify-between px-4"
      style={{
        height: 56,
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center gap-1">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost"
            style={{ width: 40, height: 40, marginLeft: -6 }}
            aria-label="Go back"
          >
            <ArrowLeft size={21} />
          </button>
        )}
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1.2 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 12, color: 'var(--color-muted-foreground)', lineHeight: 1, marginTop: 1 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  )
}
