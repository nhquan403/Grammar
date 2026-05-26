import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function WordSearchInput({ value, onChange, placeholder = 'Tìm từ...' }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <Search
        size={16}
        style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--color-muted-foreground)', pointerEvents: 'none',
        }}
      />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: 42,
          background: 'var(--color-card)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 12,
          paddingLeft: 36,
          paddingRight: value ? 36 : 12,
          fontSize: 16,
          color: 'var(--color-foreground)',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'var(--color-primary)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="btn-ghost"
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            width: 26, height: 26,
          }}
          aria-label="Xóa tìm kiếm"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
