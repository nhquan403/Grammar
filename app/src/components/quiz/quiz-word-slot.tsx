import type { QuizSlot } from '@/hooks/use-quiz'
import type { PartOfSpeech } from '@/types/vocab-types'

const POS_LABELS: Record<PartOfSpeech, string> = {
  noun: 'N', verb: 'V', adjective: 'ADJ', adverb: 'ADV', other: '?',
}

interface Props {
  slot: QuizSlot
  slotIndex: number
  isSubmitted: boolean
  onInput: (value: string) => void
  onEnter: () => void
}

export function QuizWordSlot({ slot, isSubmitted, onInput, onEnter }: Props) {
  const pos: PartOfSpeech = (slot.pos as PartOfSpeech) in POS_LABELS ? slot.pos as PartOfSpeech : 'other'
  const inputWidth = Math.max(slot.maskLen * 14, 32)

  const inputBg =
    !isSubmitted ? 'transparent' :
    slot.status === 'correct' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'

  const inputColor =
    !isSubmitted ? 'var(--color-foreground)' :
    slot.status === 'correct' ? '#22c55e' : '#ef4444'

  const inputBorder =
    !isSubmitted ? 'var(--color-muted-foreground)' :
    slot.status === 'correct' ? '#22c55e' : '#ef4444'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        {/* POS badge */}
        <span className={`badge pos-${pos}`} style={{ fontSize: 10, padding: '2px 6px', flexShrink: 0, alignSelf: 'center' }}>
          {POS_LABELS[pos]}
        </span>

        {/* Visible prefix + hidden suffix input */}
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-foreground)', letterSpacing: '-0.3px' }}>
            {slot.visible}
          </span>
          <input
            value={isSubmitted ? slot.hidden : slot.userInput}
            onChange={e => !isSubmitted && onInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isSubmitted && onEnter()}
            disabled={isSubmitted}
            maxLength={slot.maskLen + 2}
            style={{
              width: inputWidth,
              fontSize: 20,
              fontWeight: 700,
              textAlign: 'center',
              background: inputBg,
              color: inputColor,
              border: 'none',
              borderBottom: `2.5px solid ${inputBorder}`,
              borderRadius: 0,
              outline: 'none',
              padding: '0 2px',
              letterSpacing: '-0.3px',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            }}
          />
        </span>

        {/* Definition */}
        <span style={{ fontSize: 13, color: 'var(--color-muted-foreground)', marginLeft: 2 }}>
          — {slot.definition}
        </span>
      </div>

      {/* Wrong answer: show correct answer */}
      {isSubmitted && slot.status === 'wrong' && slot.userInput.trim() !== '' && (
        <p style={{ fontSize: 11, color: '#ef4444', marginLeft: 32 }}>
          Đáp án đúng: <strong>{slot.hidden}</strong>
        </p>
      )}
    </div>
  )
}
