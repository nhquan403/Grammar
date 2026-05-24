import type { CefrLevel, WordCategory } from '@/types/vocab-types'

const CEFR_LEVELS: Array<CefrLevel | ''> = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const CATEGORIES: Array<{ value: WordCategory | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'common', label: '📗 Common' },
  { value: 'academic', label: '🎓 Academic' },
  { value: 'ielts', label: '📝 IELTS' },
  { value: 'business', label: '💼 Business' },
]

interface Props {
  selectedCefr: CefrLevel | ''
  selectedCategory: WordCategory | ''
  onCefrChange: (v: CefrLevel | '') => void
  onCategoryChange: (v: WordCategory | '') => void
}

function Chip({
  label,
  active,
  activeColor,
  onClick,
}: {
  label: string
  active: boolean
  activeColor: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        height: 32,
        padding: '0 12px',
        borderRadius: 20,
        border: `1px solid ${active ? activeColor : '#e2e8f0'}`,
        background: active ? activeColor : 'white',
        color: active ? 'white' : '#64748b',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        touchAction: 'manipulation',
      }}
    >
      {label}
    </button>
  )
}

export function CefrFilterChips({ selectedCefr, selectedCategory, onCefrChange, onCategoryChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="scrollbar-hide" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {CEFR_LEVELS.map(level => (
          <Chip
            key={level || 'all-cefr'}
            label={level || 'All levels'}
            active={selectedCefr === level}
            activeColor="#6366f1"
            onClick={() => onCefrChange(level)}
          />
        ))}
      </div>
      <div className="scrollbar-hide" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {CATEGORIES.map(({ value, label }) => (
          <Chip
            key={value || 'all-cat'}
            label={label}
            active={selectedCategory === value}
            activeColor="#8b5cf6"
            onClick={() => onCategoryChange(value)}
          />
        ))}
      </div>
    </div>
  )
}
