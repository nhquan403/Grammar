interface MasteryBreakdown {
  new: number
  learning: number
  mastered: number
}

interface Props {
  breakdown: MasteryBreakdown | undefined
  total: number
}

export function MasteryProgressBar({ breakdown, total }: Props) {
  const mastered  = breakdown?.mastered ?? 0
  const learning  = breakdown?.learning ?? 0
  const newCount  = breakdown?.new ?? 0
  const unstudied = Math.max(0, total - mastered - learning - newCount)
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0

  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 14 }}>
        Tổng quan thuần thục
      </p>

      {/* Segmented progress bar */}
      <div style={{
        height: 10, borderRadius: 8,
        background: 'var(--color-surface-raised)',
        display: 'flex', overflow: 'hidden', marginBottom: 16, gap: 2,
      }}>
        {mastered > 0 && (
          <div style={{ width: `${pct(mastered)}%`, background: '#22c55e', transition: 'width 0.6s ease', borderRadius: 8 }} />
        )}
        {learning > 0 && (
          <div style={{ width: `${pct(learning)}%`, background: 'var(--color-primary)', transition: 'width 0.6s ease', borderRadius: 8 }} />
        )}
        {(newCount + unstudied) > 0 && (
          <div style={{ width: `${pct(newCount + unstudied)}%`, background: 'var(--color-border)', transition: 'width 0.6s ease', borderRadius: 8 }} />
        )}
      </div>

      {/* Legend grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { label: 'Thuần thục', count: mastered,          color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Đang học',   count: learning,          color: 'var(--color-primary)', bg: 'rgba(99,102,241,0.1)' },
          { label: 'Mới',        count: newCount + unstudied, color: 'var(--color-muted-foreground)', bg: 'var(--color-surface-raised)' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} style={{
            background: bg, borderRadius: 12, padding: '10px 8px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1.1, margin: 0 }}>{count}</p>
            <p style={{ fontSize: 10, color: 'var(--color-muted-foreground)', margin: '3px 0 0' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Overall % */}
      <div style={{
        marginTop: 12, padding: '10px 14px',
        background: 'var(--color-surface-raised)',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 13, color: 'var(--color-muted-foreground)' }}>Tiến độ tổng</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#22c55e' }}>{pct(mastered)}%</span>
      </div>
    </div>
  )
}
