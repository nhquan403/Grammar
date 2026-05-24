import { Moon, Sun } from 'lucide-react'

interface Props {
  isDark: boolean
  onToggle: () => void
}

export function DarkModeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        minWidth: 40, minHeight: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#64748b', borderRadius: 12,
        transition: 'background 0.15s',
      }}
      onPointerDown={e => (e.currentTarget.style.background = '#f1f5f9')}
      onPointerUp={e => (e.currentTarget.style.background = 'none')}
      onPointerLeave={e => (e.currentTarget.style.background = 'none')}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
