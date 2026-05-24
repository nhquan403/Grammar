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
  const mastered = breakdown?.mastered ?? 0
  const learning = breakdown?.learning ?? 0
  const newCount = breakdown?.new ?? 0
  const unstudied = Math.max(0, total - mastered - learning - newCount)

  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0

  return (
    <div style={{ background: 'white', borderRadius: 20, padding: 20, border: '1px solid #f1f5f9' }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
        Mastery Overview
      </h3>

      {/* Progress bar */}
      <div style={{
        height: 12, borderRadius: 8, background: '#f1f5f9',
        display: 'flex', overflow: 'hidden', marginBottom: 16,
      }}>
        {mastered > 0 && (
          <div style={{ width: `${pct(mastered)}%`, background: '#10b981', transition: 'width 0.6s ease' }} />
        )}
        {learning > 0 && (
          <div style={{ width: `${pct(learning)}%`, background: '#6366f1', transition: 'width 0.6s ease' }} />
        )}
        {newCount > 0 && (
          <div style={{ width: `${pct(newCount)}%`, background: '#cbd5e1', transition: 'width 0.6s ease' }} />
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { label: 'Mastered', count: mastered, color: '#10b981', bg: '#ecfdf5', emoji: '⭐' },
          { label: 'Learning', count: learning, color: '#6366f1', bg: '#eef2ff', emoji: '📖' },
          { label: 'New', count: newCount + unstudied, color: '#94a3b8', bg: '#f8fafc', emoji: '🌱' },
        ].map(({ label, count, color, bg, emoji }) => (
          <div key={label} style={{
            background: bg, borderRadius: 12, padding: '10px 8px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 20 }}>{emoji}</p>
            <p style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1.2, marginTop: 2 }}>{count}</p>
            <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div style={{
        marginTop: 14, padding: '10px 14px',
        background: '#f8fafc', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>Overall progress</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#10b981' }}>
          {pct(mastered)}%
        </span>
      </div>
    </div>
  )
}
