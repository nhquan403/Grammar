import type { FormEntry } from '@/hooks/use-word-family-form'
import type { PartOfSpeech } from '@/types/vocab-types'

const POS_OPTIONS: Array<{ value: PartOfSpeech; label: string }> = [
  { value: 'noun', label: 'Danh từ (N)' },
  { value: 'verb', label: 'Động từ (V)' },
  { value: 'adjective', label: 'Tính từ (ADJ)' },
  { value: 'adverb', label: 'Trạng từ (ADV)' },
  { value: 'other', label: 'Khác' },
]

const FREQ_OPTIONS = [
  { value: 'very-common', label: 'Rất phổ biến' },
  { value: 'common', label: 'Phổ biến' },
  { value: 'less-common', label: 'Ít phổ biến' },
  { value: 'rare', label: 'Hiếm gặp' },
] as const

interface Props {
  entry: FormEntry
  index: number
  canRemove: boolean
  isTranslating: boolean
  translateError?: string
  errors: Record<string, string>
  onUpdate: (patch: Partial<FormEntry>) => void
  onRemove: () => void
  onTranslate: (word: string) => void
}

export function WordFormSection({
  entry, index, canRemove, isTranslating, translateError, errors,
  onUpdate, onRemove, onTranslate,
}: Props) {
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 16,
    border: `1px solid ${hasError ? '#ef4444' : '#e2e8f0'}`,
    background: 'white', outline: 'none', boxSizing: 'border-box',
  })

  return (
    <div style={{
      background: '#f8fafc', borderRadius: 16, padding: 14,
      border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1' }}>
          Dạng từ #{index + 1}
        </span>
        {canRemove && (
          <button onClick={onRemove} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#ef4444', fontSize: 18, padding: '2px 6px',
          }}>×</button>
        )}
      </div>

      {/* Word + POS row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
        <div>
          <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Từ *</label>
          <input
            value={entry.word}
            onChange={e => onUpdate({ word: e.target.value })}
            placeholder="e.g. innovation"
            style={inputStyle(!!errors[`form-word-${index}`])}
          />
          {errors[`form-word-${index}`] && (
            <p style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{errors[`form-word-${index}`]}</p>
          )}
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Loại từ</label>
          <select
            value={entry.pos}
            onChange={e => onUpdate({ pos: e.target.value as PartOfSpeech })}
            style={{ ...inputStyle(false), paddingRight: 8 }}
          >
            {POS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Definition + translate button */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Định nghĩa (tiếng Việt) *</label>
          <button
            onClick={() => onTranslate(entry.word)}
            disabled={isTranslating || !entry.word.trim()}
            style={{
              fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
              border: '1px solid #6366f1', background: isTranslating ? '#f1f5f9' : '#eef2ff',
              color: '#6366f1', cursor: isTranslating || !entry.word.trim() ? 'not-allowed' : 'pointer',
              opacity: !entry.word.trim() ? 0.5 : 1,
            }}
          >
            {isTranslating ? '⏳ Đang dịch...' : '🔄 Dịch tự động'}
          </button>
        </div>
        <textarea
          value={entry.definition}
          onChange={e => onUpdate({ definition: e.target.value })}
          placeholder="Nhập nghĩa tiếng Việt..."
          rows={2}
          style={{ ...inputStyle(!!errors[`form-def-${index}`]), resize: 'vertical', fontFamily: 'inherit' }}
        />
        {errors[`form-def-${index}`] && (
          <p style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{errors[`form-def-${index}`]}</p>
        )}
        {translateError && (
          <p style={{ fontSize: 11, color: '#f97316', marginTop: 2 }}>{translateError}</p>
        )}
      </div>

      {/* Example */}
      <div>
        <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Ví dụ (tiếng Anh, không bắt buộc)</label>
        <input
          value={entry.example}
          onChange={e => onUpdate({ example: e.target.value })}
          placeholder="e.g. This is an innovative solution."
          style={inputStyle(false)}
        />
      </div>

      {/* Frequency */}
      <div>
        <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Tần suất sử dụng</label>
        <select
          value={entry.frequency}
          onChange={e => onUpdate({ frequency: e.target.value as FormEntry['frequency'] })}
          style={inputStyle(false)}
        >
          {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  )
}
