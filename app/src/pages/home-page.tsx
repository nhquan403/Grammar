import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { BookOpen, Flame, Trophy, Clock } from 'lucide-react'
import { AppHeader } from '@/components/layout/app-header'
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle'
import { Button } from '@/components/ui/button'
import { db } from '@/db/vocab-database'
import { getDueCount } from '@/services/review-schedule-service'
import { useDarkMode } from '@/hooks/use-dark-mode'

export function HomePage() {
  const navigate = useNavigate()
  const { isDark, toggle } = useDarkMode()
  const dueCount = useLiveQuery(() => getDueCount(), [], 0) ?? 0
  const progress = useLiveQuery(() => db.userProgress.get('singleton'))
  const totalFamilies = useLiveQuery(() => db.wordFamilies.count(), [], 0) ?? 0

  const masteryPercent =
    totalFamilies > 0
      ? Math.round(((progress?.masteredCount ?? 0) / totalFamilies) * 100)
      : 0

  return (
    <div className="flex flex-col min-h-full">
      <AppHeader
        title="Vocab Family"
        subtitle="Học từ vựng theo họ từ"
        rightAction={<DarkModeToggle isDark={isDark} onToggle={toggle} />}
      />

      <div className="flex-1 p-4 space-y-4">
        {/* Daily CTA Card */}
        <div
          className="rounded-2xl p-5 text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} strokeWidth={2} />
            <span style={{ fontSize: 13, opacity: 0.9, fontWeight: 500 }}>Ôn tập hôm nay</span>
          </div>
          <p style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }} className="mb-1">
            {dueCount}
          </p>
          <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 16 }}>
            word families đang chờ ôn tập
          </p>
          <Button
            onClick={() => navigate('/study')}
            disabled={dueCount === 0}
            className="w-full h-12 text-indigo-700 font-semibold rounded-xl"
            style={{
              background: 'white',
              color: '#4338ca',
              fontSize: 15,
              opacity: dueCount === 0 ? 0.7 : 1
            }}
          >
            {dueCount > 0 ? 'Bắt đầu ôn tập →' : '✓ Hoàn thành hôm nay!'}
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Flame size={20} style={{ color: '#f97316' }} />}
            label="Streak"
            value={`${progress?.currentStreak ?? 0}d`}
          />
          <StatCard
            icon={<Trophy size={20} style={{ color: '#eab308' }} />}
            label="Thuần thục"
            value={String(progress?.masteredCount ?? 0)}
          />
          <StatCard
            icon={<BookOpen size={20} style={{ color: '#6366f1' }} />}
            label="Tiến độ"
            value={`${masteryPercent}%`}
          />
        </div>

        {/* Tip card */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'white',
            border: '1px solid #e2e8f0'
          }}
        >
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
            💡 Mẹo học từ vựng
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
            Học từ theo <strong style={{ color: '#475569' }}>word family</strong> giúp bạn nhớ thêm
            30–40% từ vựng! Khi biết gốc từ, bạn có thể đoán nghĩa các dạng khác.
          </p>
        </div>

        {/* Total words info */}
        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '4px 0' }}>
          {totalFamilies} word families • dữ liệu lưu trên thiết bị này
        </p>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div
      className="rounded-2xl p-3 flex flex-col items-center gap-1"
      style={{ background: 'white', border: '1px solid #e2e8f0' }}
    >
      {icon}
      <span style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
        {value}
      </span>
      <span style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', lineHeight: 1.2 }}>
        {label}
      </span>
    </div>
  )
}
