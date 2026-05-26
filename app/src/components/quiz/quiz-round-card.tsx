import { CheckCircle, ArrowRight, Flag } from 'lucide-react'
import type { QuizRound } from '@/hooks/use-quiz'
import { QuizWordSlot } from './quiz-word-slot'

interface Props {
  round: QuizRound
  isSubmitted: boolean
  isLast: boolean
  onUpdateInput: (slotIndex: number, value: string) => void
  onSubmit: () => void
  onNext: () => void
}

export function QuizRoundCard({ round, isSubmitted, isLast, onUpdateInput, onSubmit, onNext }: Props) {
  const correctCount = round.slots.filter(s => s.status === 'correct').length
  const allFilled = round.slots.every(s => s.userInput.trim().length > 0)
  const allCorrect = isSubmitted && correctCount === round.slots.length

  return (
    <div className="card" style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 0' }}>
        <span className={`badge cefr-${round.cefr}`} style={{ fontSize: 11 }}>
          {round.cefr}
        </span>
        {isSubmitted && (
          <span style={{ fontSize: 12, fontWeight: 700, color: allCorrect ? '#22c55e' : '#ef4444' }}>
            {correctCount}/{round.slots.length} đúng
          </span>
        )}
      </div>

      {/* Root word */}
      <div style={{ padding: '10px 16px 0' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-foreground)', letterSpacing: '-0.5px' }}>
          {round.rootWord}
        </h2>
        {round.etymology && (
          <p style={{ fontSize: 11, color: 'var(--color-muted-foreground)', fontStyle: 'italic', marginTop: 2 }}>
            🌱 {round.etymology}
          </p>
        )}
      </div>

      {/* Divider */}
      <div style={{ margin: '12px 16px', borderTop: '1px solid var(--color-border)' }} />

      {/* Word slots */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: 'var(--color-muted-foreground)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          📚 Điền đuôi còn thiếu
        </p>
        {round.slots.map((slot, i) => (
          <QuizWordSlot
            key={slot.word + i}
            slot={slot}
            slotIndex={i}
            isSubmitted={isSubmitted}
            onInput={v => onUpdateInput(i, v)}
            onEnter={onSubmit}
          />
        ))}
      </div>

      {/* Actions */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!isSubmitted ? (
          <button
            onClick={onSubmit}
            disabled={!allFilled}
            className={allFilled ? 'gradient-brand' : undefined}
            style={{
              width: '100%', height: 50, borderRadius: 14, border: 'none',
              background: allFilled ? undefined : 'var(--color-surface-raised)',
              color: allFilled ? 'white' : 'var(--color-muted-foreground)',
              fontWeight: 700, fontSize: 15,
              cursor: allFilled ? 'pointer' : 'not-allowed',
              touchAction: 'manipulation',
              transition: 'background 0.2s, color 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <CheckCircle size={18} strokeWidth={2} />
            Kiểm tra
          </button>
        ) : (
          <button
            onClick={onNext}
            className="gradient-brand"
            style={{
              width: '100%', height: 50, borderRadius: 14, border: 'none',
              color: 'white', fontWeight: 700, fontSize: 15,
              cursor: 'pointer', touchAction: 'manipulation',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {isLast
              ? <><Flag size={18} strokeWidth={2} /> Xem kết quả</>
              : <>Tiếp theo <ArrowRight size={18} strokeWidth={2} /></>
            }
          </button>
        )}
      </div>
    </div>
  )
}
