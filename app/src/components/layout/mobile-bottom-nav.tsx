import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Search, BarChart2, PenLine } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { getDueCount } from '@/services/review-schedule-service'

const NAV_ITEMS = [
  { to: '/',       icon: Home,      label: 'Home'  },
  { to: '/study',  icon: BookOpen,  label: 'Study' },
  { to: '/quiz',   icon: PenLine,   label: 'Quiz'  },
  { to: '/browse', icon: Search,    label: 'Browse'},
  { to: '/stats',  icon: BarChart2, label: 'Stats' },
] as const

export function MobileBottomNav() {
  const dueCount = useLiveQuery(() => getDueCount(), [], 0) ?? 0

  return (
    <nav
      className="glass-light fixed bottom-0 left-0 right-0 flex justify-around"
      style={{
        height: 'calc(60px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingTop: 8,
        alignItems: 'flex-start',
        borderTop: '1px solid var(--color-border)',
        maxWidth: 448,
        margin: '0 auto',
        zIndex: 50,
        boxSizing: 'border-box',
      }}
    >
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={{ textDecoration: 'none', flex: 1 }}
        >
          {({ isActive }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                minHeight: 44,
                position: 'relative',
                transition: 'opacity 0.15s ease',
              }}
            >
              {/* Active pill indicator */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: -8,
                    width: 28,
                    height: 3,
                    borderRadius: '0 0 4px 4px',
                    background: 'var(--color-primary)',
                  }}
                />
              )}

              <div style={{ position: 'relative' }}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  color={isActive ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                />
                {label === 'Study' && dueCount > 0 && (
                  <span
                    className="badge-pulse"
                    style={{
                      position: 'absolute',
                      top: -5, right: -7,
                      minWidth: 16, height: 16,
                      borderRadius: 8,
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '0 3px',
                      background: '#ef4444',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                  >
                    {dueCount > 99 ? '99+' : dueCount}
                  </span>
                )}
              </div>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 400,
                  lineHeight: 1,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                  transition: 'color 0.15s ease, font-weight 0.15s ease',
                }}
              >
                {label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
