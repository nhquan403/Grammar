import { Flame, Trophy, BookOpen, RefreshCw, Target, CheckCircle } from 'lucide-react'
import { AppHeader } from '@/components/layout/app-header'
import { StreakDisplay } from '@/components/stats/streak-display'
import { MasteryProgressBar } from '@/components/stats/mastery-progress-bar'
import { CefrDistributionChart } from '@/components/stats/cefr-distribution-chart'
import { useUserStats } from '@/hooks/use-user-stats'

export function StatsPage() {
  const { progress, totalFamilies, masteryBreakdown, cefrDistribution } = useUserStats()

  const mastered     = masteryBreakdown?.mastered ?? 0
  const totalStudied = progress?.totalFamiliesStudied ?? 0
  const totalReviews = progress?.totalReviewsDone ?? 0
  const longestStreak = progress?.longestStreak ?? 0

  const motivationalText =
    mastered >= 50 ? 'Gần đến đích rồi! Tiếp tục nào!' :
    mastered >= 20 ? 'Tiến bộ tốt! Đừng dừng lại!' :
    mastered > 0   ? 'Bạn đang xây dựng đà tốt!' :
                     'Bắt đầu học ngay hôm nay!'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppHeader
        title="Thống kê"
        subtitle={`${mastered}/${totalFamilies} thuần thục`}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Streak card */}
        <StreakDisplay progress={progress} />

        {/* Quick stats 3-col */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          <StatMini icon={<BookOpen size={16} strokeWidth={2} />} value={totalFamilies} label="Tổng từ" color="var(--color-primary)" />
          <StatMini icon={<Target size={16} strokeWidth={2} />}   value={totalStudied}  label="Đã học"  color="#8b5cf6" />
          <StatMini icon={<CheckCircle size={16} strokeWidth={2} />} value={mastered}   label="Thuần thục" color="#22c55e" />
        </div>

        {/* Mastery breakdown */}
        <MasteryProgressBar breakdown={masteryBreakdown} total={totalFamilies} />

        {/* CEFR distribution */}
        <CefrDistributionChart distribution={cefrDistribution} />

        {/* Review activity 2-col */}
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 14 }}>
            Hoạt động ôn tập
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ActivityCard
              icon={<RefreshCw size={18} strokeWidth={2} style={{ color: 'var(--color-primary)' }} />}
              value={totalReviews}
              label="Tổng lượt ôn"
            />
            <ActivityCard
              icon={<Flame size={18} strokeWidth={2} style={{ color: '#f97316' }} />}
              value={`${longestStreak}d`}
              label="Streak dài nhất"
            />
          </div>
        </div>

        {/* Motivational footer */}
        <div
          className="gradient-brand"
          style={{ borderRadius: 20, padding: '20px', textAlign: 'center' }}
        >
          <Trophy size={28} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.9)', margin: '0 auto 10px' }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>
            {motivationalText}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            Kiên trì là chìa khóa của sự thành thạo
          </p>
        </div>

        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}

function StatMini({ icon, value, label, color }: {
  icon: React.ReactNode
  value: number
  label: string
  color: string
}) {
  return (
    <div className="stat-mini">
      <span style={{ color }}>{icon}</span>
      <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-foreground)', lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: 11, color: 'var(--color-muted-foreground)', textAlign: 'center' }}>
        {label}
      </span>
    </div>
  )
}

function ActivityCard({ icon, value, label }: {
  icon: React.ReactNode
  value: number | string
  label: string
}) {
  return (
    <div style={{
      background: 'var(--color-surface-raised)',
      borderRadius: 14, padding: 14,
    }}>
      <div style={{ marginBottom: 6 }}>{icon}</div>
      <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-foreground)', margin: '0 0 2px', lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: 'var(--color-muted-foreground)', margin: 0 }}>{label}</p>
    </div>
  )
}
