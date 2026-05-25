import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/app-header'
import { QuizRoundCard } from '@/components/quiz/quiz-round-card'
import { QuizResultScreen } from '@/components/quiz/quiz-result-screen'
import { useQuiz } from '@/hooks/use-quiz'
import type { CefrLevel } from '@/types/vocab-types'

const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const COUNT_OPTIONS = [5, 10, 20]

const CEFR_CHIP_STYLES: Record<string, { bg: string; text: string; activeBg: string; activeText: string }> = {
  A1: { bg: '#f0fdf4', text: '#16a34a', activeBg: '#dcfce7', activeText: '#166534' },
  A2: { bg: '#f0fdf4', text: '#16a34a', activeBg: '#d1fae5', activeText: '#065f46' },
  B1: { bg: '#eff6ff', text: '#2563eb', activeBg: '#dbeafe', activeText: '#1e40af' },
  B2: { bg: '#eef2ff', text: '#4338ca', activeBg: '#e0e7ff', activeText: '#3730a3' },
  C1: { bg: '#faf5ff', text: '#7e22ce', activeBg: '#f3e8ff', activeText: '#6b21a8' },
  C2: { bg: '#fdf2f8', text: '#9d174d', activeBg: '#fce7f3', activeText: '#9d174d' },
}

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
    if (isDone || roundIndex + 1 >= totalRounds) {
      setPhase('done')
    } else {
      nextRound()
    }
  }

  const handleRestart = () => {
    reset()
    setPhase('setup')
  }

  const progressPercent = totalRounds > 0 ? ((roundIndex + (isSubmitted ? 1 : 0)) / totalRounds) * 100 : 0

  if (phase === 'done') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppHeader title="Kết quả" />
        <QuizResultScreen
          totalCorrect={totalCorrect}
          totalSlots={totalSlots}
          onRestart={handleRestart}
          onHome={() => navigate('/')}
        />
      </div>
    )
  }

  if (phase === 'playing') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppHeader
          title="Kiểm tra"
          subtitle={totalRounds > 0 ? `${roundIndex + 1} / ${totalRounds}` : undefined}
        />

        {/* Progress bar */}
        <div style={{ height: 3, background: '#e2e8f0', flexShrink: 0 }}>
          <div style={{
            height: '100%', background: '#6366f1',
            width: `${progressPercent}%`, transition: 'width 0.35s ease',
          }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
          {isLoading || !round ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Đang tải...</p>
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

  // Setup screen
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppHeader title="Kiểm tra" subtitle="Điền đuôi còn thiếu" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: 20, padding: '20px 18px', color: 'white', textAlign: 'center',
        }}>
          <p style={{ fontSize: 40, marginBottom: 8 }}>✏️</p>
          <p style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Kiểm tra từ vựng</p>
          <p style={{ fontSize: 13, opacity: 0.85 }}>
            Điền đuôi bị ẩn của các từ trong word family
          </p>
        </div>

        {/* CEFR filter */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 10 }}>
            Cấp độ CEFR
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {/* All chip */}
            <button
              onClick={() => setCefrFilter(undefined)}
              style={{
                padding: '7px 14px', borderRadius: 20, border: 'none',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', touchAction: 'manipulation',
                background: cefrFilter === undefined ? '#6366f1' : '#f1f5f9',
                color: cefrFilter === undefined ? 'white' : '#475569',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              Tất cả
            </button>
            {CEFR_LEVELS.map(level => {
              const s = CEFR_CHIP_STYLES[level]
              const active = cefrFilter === level
              return (
                <button
                  key={level}
                  onClick={() => setCefrFilter(level)}
                  style={{
                    padding: '7px 14px', borderRadius: 20, border: 'none',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer', touchAction: 'manipulation',
                    background: active ? s.activeBg : s.bg,
                    color: active ? s.activeText : s.text,
                    outline: active ? `2px solid ${s.activeText}` : 'none',
                    outlineOffset: 1,
                    transition: 'all 0.15s',
                  }}
                >
                  {level}
                </button>
              )
            })}
          </div>
        </div>

        {/* Count selector */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 10 }}>
            Số câu hỏi
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {COUNT_OPTIONS.map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                style={{
                  flex: 1, height: 48, borderRadius: 14, border: 'none',
                  fontWeight: 700, fontSize: 16, cursor: 'pointer', touchAction: 'manipulation',
                  background: count === n ? '#6366f1' : '#f1f5f9',
                  color: count === n ? 'white' : '#475569',
                  transition: 'background 0.15s, color 0.15s',
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
          style={{
            width: '100%', height: 54, borderRadius: 16, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', fontWeight: 700, fontSize: 16,
            cursor: 'pointer', touchAction: 'manipulation',
            boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
          }}
        >
          🚀 Bắt đầu kiểm tra
        </button>

        {/* Tip */}
        <div style={{
          background: '#f8fafc', borderRadius: 14, padding: '12px 14px',
          border: '1px solid #e2e8f0',
        }}>
          <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
            💡 <strong>Mẹo:</strong> Mỗi câu hỏi là 1 word family. Điền đuôi còn thiếu (2–4 ký tự) cho tất cả các dạng từ, rồi nhấn <strong>Kiểm tra</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
