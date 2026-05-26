import type { CefrLevel } from '@/types/vocab-types'

type CefrDist = Record<CefrLevel, { total: number; mastered: number }>

interface Props {
  distribution: CefrDist | undefined
}

const CEFR_META: Array<{ level: CefrLevel; color: string; cssClass: string }> = [
  { level: 'A1', color: '#16a34a', cssClass: 'cefr-A1' },
  { level: 'A2', color: '#059669', cssClass: 'cefr-A2' },
  { level: 'B1', color: '#2563eb', cssClass: 'cefr-B1' },
  { level: 'B2', color: '#4f46e5', cssClass: 'cefr-B2' },
  { level: 'C1', color: '#7c3aed', cssClass: 'cefr-C1' },
  { level: 'C2', color: '#be185d', cssClass: 'cefr-C2' },
]

export function CefrDistributionChart({ distribution }: Props) {
  if (!distribution) return null

  const maxTotal = Math.max(...CEFR_META.map(m => distribution[m.level]?.total ?? 0), 1)

  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 16 }}>
        Phân bố CEFR
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {CEFR_META.map(({ level, color, cssClass }) => {
          const { total, mastered } = distribution[level] ?? { total: 0, mastered: 0 }
          const masteredPct = total > 0 ? (mastered / total) * 100 : 0
          const barWidth    = total > 0 ? (total / maxTotal) * 100 : 0

          return (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* CEFR badge */}
              <span className={`badge ${cssClass}`} style={{ fontSize: 10, padding: '3px 7px', width: 34, justifyContent: 'center' }}>
                {level}
              </span>

              {/* Bar track */}
              <div style={{
                flex: 1, height: 20, borderRadius: 6,
                background: 'var(--color-surface-raised)',
                overflow: 'hidden', position: 'relative',
              }}>
                {/* Total (light) */}
                <div style={{
                  position: 'absolute', inset: 0,
                  width: `${barWidth}%`,
                  background: `${color}22`,
                  transition: 'width 0.6s ease',
                }} />
                {/* Mastered (solid) */}
                <div style={{
                  position: 'absolute', inset: 0,
                  width: `${(masteredPct / 100) * barWidth}%`,
                  background: color,
                  transition: 'width 0.6s ease',
                  borderRadius: 6,
                }} />
              </div>

              {/* Count */}
              <div style={{ textAlign: 'right', minWidth: 44, flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{mastered}</span>
                <span style={{ fontSize: 12, color: 'var(--color-muted-foreground)' }}>/{total}</span>
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 11, color: 'var(--color-muted-foreground)', marginTop: 12, textAlign: 'center', opacity: 0.7 }}>
        Đậm = thuần thục · Nhạt = tổng số
      </p>
    </div>
  )
}
