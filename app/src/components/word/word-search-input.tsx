import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function WordSearchInput({ value, onChange, placeholder = 'Search words...' }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <Search
        size={17}
        style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: '#94a3b8', pointerEvents: 'none',
        }}
      />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: 44,
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          paddingLeft: 38,
          paddingRight: value ? 38 : 12,
          fontSize: 16, // prevents iOS zoom
          color: '#0f172a',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
        onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            minWidth: 24, minHeight: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: 6,
          }}
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}
