import type { QuizRound } from '@/hooks/use-quiz'
import { QuizWordSlot } from './quiz-word-slot'

const CEFR_STYLES: Record<string, { bg: string; text: string }> = {
  A1: { bg: '#dcfce7', text: '#166534' }, A2: { bg: '#d1fae5', text: '#065f46' },
  B1: { bg: '#dbeafe', text: '#1e40af' }, B2: { bg: '#e0e7ff', text: '#3730a3' },
  C1: { bg: '#f3e8ff', text: '#6b21a8' }, C2: { bg: '#fce7f3', text: '#9d174d' },
}

interface Props {
  round: QuizRound
  isSubmitted: boolean
  isLast: boolean
  onUpdateInput: (slotIndex: number, value: string) => void
  onSubmit: () => void
  onNext: () => void
}

export function QuizRoundCard({ round, isSubmitted, isLast, onUpdateInput, onSubmit, onNext }: Props) {
  const cefrStyle = CEFR_STYLES[round.cefr] ?? { bg: '#f1f5f9', text: '#475569' }
  const correctCount = round.slots.filter(s => s.status === 'correct').length
  const allFilled = round.slots.every(s => s.userInput.trim().length > 0)

  return (
    <div style={{
      background: 'white',
      borderRadius: 24,
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px 0',
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 8px',
          borderRadius: 20, background: cefrStyle.bg, color: cefrStyle.text,
        }}>
          {round.cefr}
        </span>
        {isSubmitted && (
          <span style={{ fontSize: 12, fontWeight: 700, color: correctCount === round.slots.length ? '#16a34a' : '#dc2626' }}>
            {correctCount}/{round.slots.length} đúng
          </span>
        )}
      </div>

      {/* Root word */}
      <div style={{ padding: '10px 16px 0' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          {round.rootWord}
        </h2>
        {round.etymology && (
          <p style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 2 }}>
            🌱 {round.etymology}
          </p>
        )}
      </div>

      {/* Divider */}
      <div style={{ margin: '12px 16px', borderTop: '1px solid #f1f5f9' }} />

      {/* Word slots */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
            style={{
              width: '100%', height: 50, borderRadius: 14, border: 'none',
              background: allFilled ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0',
              color: allFilled ? 'white' : '#94a3b8',
              fontWeight: 700, fontSize: 15,
              cursor: allFilled ? 'pointer' : 'not-allowed',
              touchAction: 'manipulation',
              transition: 'background 0.2s',
            }}
          >
            ✏️ Kiểm tra
          </button>
        ) : (
          <button
            onClick={onNext}
            style={{
              width: '100%', height: 50, borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontWeight: 700, fontSize: 15,
              cursor: 'pointer', touchAction: 'manipulation',
            }}
          >
            {isLast ? '🏁 Xem kết quả' : 'Tiếp theo →'}
          </button>
        )}
      </div>
    </div>
  )
}
