import { AppHeader } from '@/components/layout/app-header'
import { StreakDisplay } from '@/components/stats/streak-display'
import { MasteryProgressBar } from '@/components/stats/mastery-progress-bar'
import { CefrDistributionChart } from '@/components/stats/cefr-distribution-chart'
import { useUserStats } from '@/hooks/use-user-stats'

export function StatsPage() {
  const { progress, totalFamilies, masteryBreakdown, cefrDistribution } = useUserStats()

  const mastered = masteryBreakdown?.mastered ?? 0
  const totalStudied = progress?.totalFamiliesStudied ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppHeader
        title="Statistics"
        subtitle={`${mastered} of ${totalFamilies} mastered`}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Streak card */}
        <StreakDisplay progress={progress} />

        {/* Quick stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { emoji: '📚', value: totalFamilies, label: 'Total words' },
            { emoji: '🎯', value: totalStudied, label: 'Studied' },
            { emoji: '✅', value: mastered, label: 'Mastered' },
          ].map(({ emoji, value, label }) => (
            <div key={label} style={{
              background: 'white', borderRadius: 16, padding: '14px 10px',
              border: '1px solid #f1f5f9', textAlign: 'center',
            }}>
              <p style={{ fontSize: 22 }}>{emoji}</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginTop: 4 }}>{value}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Mastery breakdown */}
        <MasteryProgressBar breakdown={masteryBreakdown} total={totalFamilies} />

        {/* CEFR distribution */}
        <CefrDistributionChart distribution={cefrDistribution} />

        {/* Review stats */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 20, border: '1px solid #f1f5f9',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
            Review Activity
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Total reviews done', value: progress?.totalReviewsDone ?? 0, emoji: '🔄' },
              { label: 'Longest streak', value: `${progress?.longestStreak ?? 0}d`, emoji: '🏆' },
            ].map(({ label, value, emoji }) => (
              <div key={label} style={{
                background: '#f8fafc', borderRadius: 14, padding: 14,
              }}>
                <p style={{ fontSize: 20 }}>{emoji}</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{value}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational footer */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: 20, padding: 20, textAlign: 'center',
        }}>
          <p style={{ fontSize: 28 }}>💪</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'white', marginTop: 8 }}>
            {mastered >= 50
              ? "You're almost there! Keep going!"
              : mastered >= 20
              ? "Great progress! Don't stop now!"
              : mastered > 0
              ? "You're building momentum!"
              : 'Start learning today!'}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            Consistency is the key to mastery
          </p>
        </div>

        {/* Bottom spacing for nav */}
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}
