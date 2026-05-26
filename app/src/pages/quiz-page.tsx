import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Lightbulb } from 'lucide-react'
import { AppHeader } from '@/components/layout/app-header'
import { QuizRoundCard } from '@/components/quiz/quiz-round-card'
import { QuizResultScreen } from '@/components/quiz/quiz-result-screen'
import { useQuiz } from '@/hooks/use-quiz'
import type { CefrLevel } from '@/types/vocab-types'

const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const COUNT_OPTIONS = [5, 10, 20]

export function QuizPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'setup' | 'playing' | 'done'>('setup')
  const [cefrFilter, setCefrFilter] = useState<CefrLevel | undefined>(undefined)
  const [count, setCount] = useState(10)

  const {
    round, roundIndex, totalRounds, isSubmitted, isDone,
    isLoading, totalCorrect, totalSlots,
    loadQuiz, updateInput, submitRound, nextRound, reset,
  } = useQuiz()

  const handleStart = async () => {
    await loadQuiz(cefrFilter, count)
    setPhase('playing')
  }

  const handleNext = () => {
    if (isDone || roundIndex + 1 >= totalRounds) setPhase('done')
    else nextRound()
  }

  const handleRestart = () => { reset(); setPhase('setup') }

  const progressPercent = totalRounds > 0
    ? ((roundIndex + (isSubmitted ? 1 : 0)) / totalRounds) * 100
    : 0

  /* ── Result screen ── */
  if (phase === 'done') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppHeader title="Kết quả" showBack />
        <QuizResultScreen
          totalCorrect={totalCorrect}
          totalSlots={totalSlots}
          onRestart={handleRestart}
          onHome={() => navigate('/')}
        />
      </div>
    )
  }

  /* ── Playing screen ── */
  if (phase === 'playing') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppHeader
          title="Kiểm tra"
          showBack
          subtitle={totalRounds > 0 ? `Câu ${roundIndex + 1} / ${totalRounds}` : undefined}
        />

        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--color-border)', flexShrink: 0 }}>
          <div style={{
            height: '100%',
            background: 'var(--color-primary)',
            width: `${progressPercent}%`,
            transition: 'width 0.35s ease',
            borderRadius: '0 3px 3px 0',
          }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
          {isLoading || !round ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ color: 'var(--color-muted-foreground)', fontSize: 14 }}>Đang tải...</p>
            </div>
          ) : (
            <QuizRoundCard
              round={round}
              isSubmitted={isSubmitted}
              isLast={roundIndex + 1 >= totalRounds}
              onUpdateInput={updateInput}
              onSubmit={submitRound}
              onNext={handleNext}
            />
          )}
        </div>
      </div>
    )
  }

  /* ── Setup screen ── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppHeader title="Quiz" subtitle="Điền đuôi còn thiếu" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Hero card */}
        <div
          className="gradient-brand"
          style={{
            borderRadius: 24, padding: '24px 20px',
            color: 'white', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: -24, right: -24,
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <Rocket size={26} strokeWidth={1.8} color="white" />
            </div>
            <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, lineHeight: 1.2 }}>
              Kiểm tra từ vựng
            </p>
            <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>
              Điền phần đuôi bị ẩn của các từ trong word family
            </p>
          </div>
        </div>

        {/* CEFR filter */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 12 }}>
            Cấp độ CEFR
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <CefrChip
              label="Tất cả"
              active={cefrFilter === undefined}
              activeColor="#6366f1"
              onClick={() => setCefrFilter(undefined)}
            />
            {CEFR_LEVELS.map(level => (
              <CefrChip
                key={level}
                label={level}
                active={cefrFilter === level}
                activeColor="#6366f1"
                cssClass={`cefr-${level}`}
                onClick={() => setCefrFilter(level)}
              />
            ))}
          </div>
        </div>

        {/* Count selector */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-foreground)', marginBottom: 12 }}>
            Số câu hỏi
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {COUNT_OPTIONS.map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                style={{
                  flex: 1, height: 52, borderRadius: 14,
                  border: `2px solid ${count === n ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  fontWeight: 800, fontSize: 18,
                  cursor: 'pointer', touchAction: 'manipulation',
                  background: count === n ? 'rgba(99,102,241,0.1)' : 'var(--color-card)',
                  color: count === n ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                  transition: 'all 0.15s ease',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="gradient-brand"
          style={{
            width: '100%', height: 54, borderRadius: 16, border: 'none',
            color: 'white', fontWeight: 700, fontSize: 16,
            cursor: 'pointer', touchAction: 'manipulation',
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <Rocket size={18} strokeWidth={2} />
          Bắt đầu kiểm tra
        </button>

        {/* Tip */}
        <div
          className="card"
          style={{ padding: '13px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}
        >
          <Lightbulb size={16} strokeWidth={2} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: 'var(--color-muted-foreground)', lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: 'var(--color-foreground)' }}>Mẹo:</strong> Mỗi câu là 1 word family.
            Điền phần đuôi còn thiếu cho tất cả các dạng từ, rồi nhấn{' '}
            <strong style={{ color: 'var(--color-foreground)' }}>Kiểm tra</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

function CefrChip({
  label, active, activeColor, cssClass, onClick,
}: {
  label: string
  active: boolean
  activeColor: string
  cssClass?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={active && cssClass ? cssClass : undefined}
      style={{
        padding: '7px 16px', borderRadius: 20,
        border: `1.5px solid ${active ? activeColor : 'var(--color-border)'}`,
        fontWeight: 700, fontSize: 13,
        cursor: 'pointer', touchAction: 'manipulation',
        background: active ? (cssClass ? undefined : activeColor) : 'var(--color-card)',
        color: active ? (cssClass ? undefined : 'white') : 'var(--color-muted-foreground)',
        transition: 'all 0.15s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {label}
    </button>
  )
}
