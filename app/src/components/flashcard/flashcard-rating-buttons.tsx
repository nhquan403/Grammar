import type { RatingLabel } from '@/types/vocab-types'

const RATINGS: { id: RatingLabel; label: string; emoji: string; bg: string; text: string }[] = [
  { id: 'again', label: 'Again',  emoji: '✗',  bg: '#ef4444', text: 'white' },
  { id: 'hard',  label: 'Hard',   emoji: '⚡', bg: '#f97316', text: 'white' },
  { id: 'good',  label: 'Good',   emoji: '✓',  bg: '#3b82f6', text: 'white' },
  { id: 'easy',  label: 'Easy',   emoji: '⭐', bg: '#22c55e', text: 'white' },
]

interface Props {
  onRate: (rating: RatingLabel) => void
}

export function FlashcardRatingButtons({ onRate }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '12px 16px 16px' }}>
      {RATINGS.map(({ id, label, emoji, bg, text }) => (
        <button
          key={id}
          onClick={() => onRate(id)}
          style={{
            background: bg,
            color: text,
            minHeight: 56,
            borderRadius: 14,
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            cursor: 'pointer',
            fontWeight: 600,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
          onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{emoji}</span>
          <span style={{ fontSize: 11, lineHeight: 1.2 }}>{label}</span>
        </button>
      ))}
    </div>
  )
}
