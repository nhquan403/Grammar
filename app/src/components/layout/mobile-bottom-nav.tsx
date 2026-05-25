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
      className="fixed bottom-0 left-0 right-0 flex justify-around px-2"
      style={{
        height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        alignItems: 'flex-start',
        paddingTop: 10,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(226,232,240,0.8)',
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
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 transition-colors
             ${isActive ? 'text-indigo-600' : 'text-slate-400'}`
          }
          style={{ minWidth: 40, minHeight: 44 }}
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {label === 'Study' && dueCount > 0 && (
                  <span
                    className="absolute flex items-center justify-center bg-red-500 text-white font-bold"
                    style={{
                      top: -6, right: -8,
                      minWidth: 16, height: 16,
                      borderRadius: 8,
                      fontSize: 10,
                      padding: '0 3px',
                    }}
                  >
                    {dueCount > 99 ? '99+' : dueCount}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, lineHeight: 1.2 }}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
