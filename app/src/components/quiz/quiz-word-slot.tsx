import type { QuizSlot } from '@/hooks/use-quiz'
import type { PartOfSpeech } from '@/types/vocab-types'

const POS_STYLES: Record<PartOfSpeech, { bg: string; text: string; label: string }> = {
  noun:      { bg: '#dbeafe', text: '#1d4ed8', label: 'N' },
  verb:      { bg: '#f3e8ff', text: '#7e22ce', label: 'V' },
  adjective: { bg: '#ffedd5', text: '#c2410c', label: 'ADJ' },
  adverb:    { bg: '#ccfbf1', text: '#0f766e', label: 'ADV' },
  other:     { bg: '#f1f5f9', text: '#475569', label: '?' },
}

interface Props {
  slot: QuizSlot
  slotIndex: number
  isSubmitted: boolean
  onInput: (value: string) => void
  onEnter: () => void
}

export function QuizWordSlot({ slot, isSubmitted, onInput, onEnter }: Props) {
  const posStyle = POS_STYLES[slot.pos as PartOfSpeech] ?? POS_STYLES.other
  const inputWidth = Math.max(slot.maskLen * 14, 32)

  const inputBg =
    !isSubmitted ? 'white' :
    slot.status === 'correct' ? '#dcfce7' : '#fee2e2'

  const inputColor =
    !isSubmitted ? '#0f172a' :
    slot.status === 'correct' ? '#166534' : '#991b1b'

  const inputBorder =
    !isSubmitted ? '#94a3b8' :
    slot.status === 'correct' ? '#86efac' : '#fca5a5'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        {/* POS badge */}
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
          background: posStyle.bg, color: posStyle.text,
          flexShrink: 0, alignSelf: 'center',
        }}>
          {posStyle.label}
        </span>

        {/* Visible prefix + input suffix */}
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>
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
        <span style={{ fontSize: 13, color: '#64748b', marginLeft: 2 }}>
          — {slot.definition}
        </span>
      </div>

      {/* Wrong answer: show correct */}
      {isSubmitted && slot.status === 'wrong' && slot.userInput.trim() !== '' && (
        <p style={{ fontSize: 11, color: '#ef4444', marginLeft: 32 }}>
          Đáp án đúng: <strong>{slot.hidden}</strong>
        </p>
      )}
    </div>
  )
}
