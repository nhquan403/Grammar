import type { CefrLevel, WordCategory } from '@/types/vocab-types'

const CEFR_LEVELS: Array<CefrLevel | ''> = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const CATEGORIES: Array<{ value: WordCategory | ''; label: string }> = [
  { value: '',         label: 'Tất cả'  },
  { value: 'common',   label: 'Phổ thông' },
  { value: 'academic', label: 'Học thuật' },
  { value: 'ielts',    label: 'IELTS'    },
  { value: 'business', label: 'Kinh doanh' },
]

interface Props {
  selectedCefr: CefrLevel | ''
  selectedCategory: WordCategory | ''
  onCefrChange: (v: CefrLevel | '') => void
  onCategoryChange: (v: WordCategory | '') => void
}

function Chip({
  label, active, activeColor, onClick,
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
        height: 30,
        padding: '0 11px',
        borderRadius: 20,
        border: `1.5px solid ${active ? activeColor : 'var(--color-border)'}`,
        background: active ? activeColor : 'var(--color-card)',
        color: active ? 'white' : 'var(--color-muted-foreground)',
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        touchAction: 'manipulation',
        transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {label}
    </button>
  )
}

export function CefrFilterChips({ selectedCefr, selectedCategory, onCefrChange, onCategoryChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="scrollbar-hide" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {CEFR_LEVELS.map(level => (
          <Chip
            key={level || 'all-cefr'}
            label={level || 'Tất cả'}
            active={selectedCefr === level}
            activeColor="#6366f1"
            onClick={() => onCefrChange(level)}
          />
        ))}
      </div>
      <div className="scrollbar-hide" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
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
