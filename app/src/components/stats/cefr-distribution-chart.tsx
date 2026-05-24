import type { CefrLevel } from '@/types/vocab-types'

type CefrDist = Record<CefrLevel, { total: number; mastered: number }>

interface Props {
  distribution: CefrDist | undefined
}

const CEFR_META: Array<{ level: CefrLevel; color: string; bg: string }> = [
  { level: 'A1', color: '#16a34a', bg: '#dcfce7' },
  { level: 'A2', color: '#059669', bg: '#d1fae5' },
  { level: 'B1', color: '#2563eb', bg: '#dbeafe' },
  { level: 'B2', color: '#4f46e5', bg: '#e0e7ff' },
  { level: 'C1', color: '#7c3aed', bg: '#f3e8ff' },
  { level: 'C2', color: '#be185d', bg: '#fce7f3' },
]

export function CefrDistributionChart({ distribution }: Props) {
  if (!distribution) return null

  const maxTotal = Math.max(...CEFR_META.map(m => distribution[m.level]?.total ?? 0), 1)

  return (
    <div style={{ background: 'white', borderRadius: 20, padding: 20, border: '1px solid #f1f5f9' }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
        CEFR Level Progress
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CEFR_META.map(({ level, color, bg }) => {
          const { total, mastered } = distribution[level] ?? { total: 0, mastered: 0 }
          const masteredPct = total > 0 ? (mastered / total) * 100 : 0
          const barWidth = total > 0 ? (total / maxTotal) * 100 : 0

          return (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Level badge */}
              <div style={{
                width: 36, height: 22, borderRadius: 6, flexShrink: 0,
                background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color }}>{level}</span>
              </div>

              {/* Bar track */}
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{
                  height: 22, borderRadius: 6, background: '#f8fafc',
                  overflow: 'hidden', position: 'relative',
                }}>
                  {/* Total bar (lighter shade) */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${barWidth}%`,
                    background: bg,
                    transition: 'width 0.6s ease',
                  }} />
                  {/* Mastered fill */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${(masteredPct / 100) * barWidth}%`,
                    background: color,
                    transition: 'width 0.6s ease',
                    borderRadius: 6,
                  }} />
                </div>
              </div>

              {/* Count */}
              <div style={{ textAlign: 'right', minWidth: 44 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>
                  {mastered}
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>/{total}</span>
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 14, textAlign: 'center' }}>
        Colored fill = mastered · Light fill = total
      </p>
    </div>
  )
}
