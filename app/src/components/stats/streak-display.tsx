import type { UserProgress } from '@/types/vocab-types'

interface Props {
  progress: UserProgress | undefined
}

export function StreakDisplay({ progress }: Props) {
  const streak = progress?.currentStreak ?? 0
  const totalReviews = progress?.totalReviewsDone ?? 0
  const longestStreak = progress?.longestStreak ?? 0

  return (
    <div style={{
      background: streak > 0
        ? 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)'
        : '#f8fafc',
      borderRadius: 20,
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      {/* Flame icon */}
      <div style={{
        fontSize: 48,
        lineHeight: 1,
        filter: streak > 0 ? 'none' : 'grayscale(1) opacity(0.4)',
      }}>
        🔥
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 36,
          fontWeight: 800,
          color: streak > 0 ? 'white' : '#0f172a',
          lineHeight: 1,
        }}>
          {streak}
          <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 6, opacity: 0.8 }}>
            {streak === 1 ? 'day' : 'days'}
          </span>
        </p>
        <p style={{
          fontSize: 13,
          color: streak > 0 ? 'rgba(255,255,255,0.85)' : '#94a3b8',
          marginTop: 4,
        }}>
          {streak > 0 ? 'Current streak — keep it up!' : 'Start a streak today!'}
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{
          background: streak > 0 ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
          borderRadius: 12,
          padding: '8px 12px',
        }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: streak > 0 ? 'white' : '#0f172a' }}>
            {longestStreak}
          </p>
          <p style={{ fontSize: 10, color: streak > 0 ? 'rgba(255,255,255,0.75)' : '#94a3b8', whiteSpace: 'nowrap' }}>
            Best streak
          </p>
        </div>
        <p style={{ fontSize: 11, color: streak > 0 ? 'rgba(255,255,255,0.75)' : '#94a3b8', marginTop: 6 }}>
          {totalReviews} total reviews
        </p>
      </div>
    </div>
  )
}
