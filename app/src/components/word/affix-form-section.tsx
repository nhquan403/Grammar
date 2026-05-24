import type { AffixEntry } from '@/hooks/use-word-family-form'

interface Props {
  entry: AffixEntry
  index: number
  onUpdate: (patch: Partial<AffixEntry>) => void
  onRemove: () => void
}

export function AffixFormSection({ entry, index, onUpdate, onRemove }: Props) {
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 16,
    border: '1px solid #e2e8f0', background: 'white', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      background: '#fafafa', borderRadius: 14, padding: 12,
      border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Affix #{index + 1}</span>
        <button onClick={onRemove} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 18, padding: '2px 6px',
        }}>×</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 8 }}>
        <select
          value={entry.type}
          onChange={e => onUpdate({ type: e.target.value as 'prefix' | 'suffix' })}
          style={{ ...inputStyle, width: 'auto' }}
        >
          <option value="prefix">Tiền tố</option>
          <option value="suffix">Hậu tố</option>
        </select>
        <input
          value={entry.form}
          onChange={e => onUpdate({ form: e.target.value })}
          placeholder="e.g. un-, -tion"
          style={inputStyle}
        />
      </div>

      <input
        value={entry.meaning}
        onChange={e => onUpdate({ meaning: e.target.value })}
        placeholder="Ý nghĩa (tiếng Việt), e.g. không, phủ định"
        style={inputStyle}
      />
    </div>
  )
}
