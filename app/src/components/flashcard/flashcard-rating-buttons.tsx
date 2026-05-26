import type { RatingLabel } from '@/types/vocab-types'

const RATINGS: { id: RatingLabel; label: string; emoji: string; bg: string }[] = [
  { id: 'again', label: 'Lại',  emoji: '✗',  bg: '#ef4444' },
  { id: 'hard',  label: 'Khó',  emoji: '⚡', bg: '#f97316' },
  { id: 'good',  label: 'Ổn',   emoji: '✓',  bg: '#3b82f6' },
  { id: 'easy',  label: 'Dễ',   emoji: '⭐', bg: '#22c55e' },
]

interface Props {
  onRate: (rating: RatingLabel) => void
}

export function FlashcardRatingButtons({ onRate }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '12px 16px 16px' }}>
      {RATINGS.map(({ id, label, emoji, bg }) => (
        <button
          key={id}
          onClick={() => onRate(id)}
          style={{
            background: bg,
            color: 'white',
            minHeight: 56,
            borderRadius: 14,
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            cursor: 'pointer',
            fontWeight: 600,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          }}
          onPointerDown={e => {
            e.currentTarget.style.transform = 'scale(0.95)'
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.18)'
          }}
          onPointerUp={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)'
          }}
          onPointerLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)'
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{emoji}</span>
          <span style={{ fontSize: 11, lineHeight: 1.2 }}>{label}</span>
        </button>
      ))}
    </div>
  )
}
