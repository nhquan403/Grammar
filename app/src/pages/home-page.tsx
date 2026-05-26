import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { BookOpen, Flame, Trophy, Clock, ChevronRight, Zap } from 'lucide-react'
import { AppHeader } from '@/components/layout/app-header'
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle'
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

  const allDone = dueCount === 0

  return (
    <div className="flex flex-col min-h-full page-enter">
      <AppHeader
        title="Vocab Family"
        subtitle="Học từ vựng theo họ từ"
        rightAction={<DarkModeToggle isDark={isDark} onToggle={toggle} />}
      />

      <div style={{ flex: 1, padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Daily CTA ── */}
        <div
          className="gradient-brand"
          style={{
            borderRadius: 24,
            padding: '20px 20px 18px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circle */}
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', bottom: -20, right: 40,
            width: 70, height: 70, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Clock size={13} strokeWidth={2.5} style={{ opacity: 0.85 }} />
              <span style={{ fontSize: 12, opacity: 0.85, fontWeight: 600, letterSpacing: '0.02em' }}>
                Ôn tập hôm nay
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>
                {allDone ? '✓' : dueCount}
              </span>
              {!allDone && (
                <span style={{ fontSize: 15, opacity: 0.75, fontWeight: 500 }}>
                  word families
                </span>
              )}
            </div>

            <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 16 }}>
              {allDone ? 'Bạn đã hoàn thành hết hôm nay! 🎉' : 'đang chờ ôn tập'}
            </p>

            <button
              onClick={() => navigate('/study')}
              disabled={allDone}
              style={{
                width: '100%',
                height: 46,
                background: allDone ? 'rgba(255,255,255,0.25)' : 'white',
                color: allDone ? 'rgba(255,255,255,0.9)' : '#4338ca',
                border: 'none',
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 700,
                cursor: allDone ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: allDone ? 'none' : '0 2px 12px rgba(0,0,0,0.15)',
              }}
            >
              {allDone ? 'Hoàn thành hôm nay! 🏆' : (
                <>
                  <Zap size={16} strokeWidth={2.5} />
                  Bắt đầu ôn tập
                  <ChevronRight size={15} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <StatCard
            icon={<Flame size={18} strokeWidth={2} style={{ color: '#f97316' }} />}
            label="Streak"
            value={`${progress?.currentStreak ?? 0}`}
            unit="ngày"
            accent="#f97316"
          />
          <StatCard
            icon={<Trophy size={18} strokeWidth={2} style={{ color: '#eab308' }} />}
            label="Thuần thục"
            value={String(progress?.masteredCount ?? 0)}
            unit="từ"
            accent="#eab308"
          />
          <StatCard
            icon={<BookOpen size={18} strokeWidth={2} style={{ color: 'var(--color-primary)' }} />}
            label="Tiến độ"
            value={`${masteryPercent}`}
            unit="%"
            accent="var(--color-primary)"
          />
        </div>

        {/* ── Quick actions ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <QuickAction
            emoji="🔍"
            label="Duyệt từ vựng"
            sub={`${totalFamilies} families`}
            onClick={() => navigate('/browse')}
          />
          <QuickAction
            emoji="✏️"
            label="Luyện tập Quiz"
            sub="Kiểm tra kiến thức"
            onClick={() => navigate('/quiz')}
          />
        </div>

        {/* ── Tip card ── */}
        <div
          className="card"
          style={{ padding: '14px 16px' }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-muted-foreground)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>💡</span> Mẹo học từ vựng
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-muted-foreground)', lineHeight: 1.65 }}>
            Học theo <strong style={{ color: 'var(--color-foreground)' }}>word family</strong> giúp nhớ thêm{' '}
            <strong style={{ color: 'var(--color-primary)' }}>30–40%</strong> từ vựng! Khi biết gốc từ, bạn có thể đoán nghĩa các dạng khác.
          </p>
        </div>

        {/* ── Footer info ── */}
        <p style={{ fontSize: 11, color: 'var(--color-muted-foreground)', textAlign: 'center', opacity: 0.7 }}>
          {totalFamilies} word families · lưu trên thiết bị
        </p>
      </div>
    </div>
  )
}

function StatCard({
  icon, label, value, unit, accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  accent: string
}) {
  return (
    <div className="stat-mini">
      {icon}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-foreground)', lineHeight: 1.1 }}>
          {value}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: accent, lineHeight: 1 }}>
          {unit}
        </span>
      </div>
      <span style={{ fontSize: 11, color: 'var(--color-muted-foreground)', textAlign: 'center', lineHeight: 1.2 }}>
        {label}
      </span>
    </div>
  )
}

function QuickAction({
  emoji, label, sub, onClick,
}: {
  emoji: string
  label: string
  sub: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="card-interactive"
      style={{
        padding: '14px 14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        width: '100%',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1.2 }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: 'var(--color-muted-foreground)' }}>
        {sub}
      </span>
    </button>
  )
}
