import type { UserProgress } from '@/types/vocab-types'

interface Props {
  progress: UserProgress | undefined
}

export function StreakDisplay({ progress }: Props) {
  const streak = progress?.currentStreak ?? 0
  const longestStreak = progress?.longestStreak ?? 0

  const hasStreak = streak > 0

  return (
    <div
      style={{
        background: hasStreak ? 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' : 'var(--color-card)',
        border: hasStreak ? 'none' : '1px solid var(--color-border)',
        borderRadius: 20,
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: hasStreak ? '0 4px 20px rgba(249,115,22,0.35)' : 'var(--shadow-card)',
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: 44, lineHeight: 1, filter: hasStreak ? 'none' : 'grayscale(1) opacity(0.35)' }}>
        🔥
      </div>

      {/* Main info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontSize: 36, fontWeight: 800, lineHeight: 1,
            color: hasStreak ? 'white' : 'var(--color-foreground)',
          }}>
            {streak}
          </span>
          <span style={{
            fontSize: 14, fontWeight: 500,
            color: hasStreak ? 'rgba(255,255,255,0.8)' : 'var(--color-muted-foreground)',
          }}>
            {streak === 1 ? 'ngày' : 'ngày'}
          </span>
        </div>
        <p style={{
          fontSize: 12, marginTop: 3,
          color: hasStreak ? 'rgba(255,255,255,0.8)' : 'var(--color-muted-foreground)',
        }}>
          {hasStreak ? 'Streak hiện tại — tiếp tục nào!' : 'Bắt đầu streak hôm nay!'}
        </p>
      </div>

      {/* Best streak */}
      <div
        style={{
          background: hasStreak ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-raised)',
          borderRadius: 12,
          padding: '8px 12px',
          textAlign: 'center',
        }}
      >
        <p style={{
          fontSize: 18, fontWeight: 800, lineHeight: 1, margin: 0,
          color: hasStreak ? 'white' : 'var(--color-foreground)',
        }}>
          {longestStreak}
        </p>
        <p style={{
          fontSize: 10, margin: '3px 0 0',
          color: hasStreak ? 'rgba(255,255,255,0.7)' : 'var(--color-muted-foreground)',
          whiteSpace: 'nowrap',
        }}>
          Best
        </p>
      </div>
    </div>
  )
}
