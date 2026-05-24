import type { WordFamily, PartOfSpeech } from '@/types/vocab-types'

const POS_STYLES: Record<PartOfSpeech, { bg: string; text: string; label: string }> = {
  noun:      { bg: '#dbeafe', text: '#1d4ed8', label: 'N' },
  verb:      { bg: '#f3e8ff', text: '#7e22ce', label: 'V' },
  adjective: { bg: '#ffedd5', text: '#c2410c', label: 'ADJ' },
  adverb:    { bg: '#ccfbf1', text: '#0f766e', label: 'ADV' },
  other:     { bg: '#f1f5f9', text: '#475569', label: '?' },
}

interface Props {
  family: WordFamily
}

export function FlashcardWordFamilyDisplay({ family }: Props) {
  const grouped = family.forms.reduce<Record<string, typeof family.forms>>((acc, form) => {
    const key = form.pos
    if (!acc[key]) acc[key] = []
    acc[key].push(form)
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Etymology */}
      {family.etymology && (
        <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
          🌱 {family.etymology}
        </p>
      )}

      {/* Word family grouped by POS */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          📚 Word Family
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(grouped).map(([pos, forms]) => {
            const style = POS_STYLES[pos as PartOfSpeech] ?? POS_STYLES.other
            return (
              <div key={pos} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 6,
                    background: style.bg,
                    color: style.text,
                    minWidth: 28,
                    textAlign: 'center',
                    marginTop: 2,
                  }}
                >
                  {style.label}
                </span>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {forms.map(form => (
                    <div key={form.word}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>
                          {form.word}
                        </span>
                        <span style={{ fontSize: 13, color: '#64748b' }}>
                          — {form.definition}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginTop: 2 }}>
                        "{form.example}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Affixes */}
      {family.affixes.length > 0 && (
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            🔤 Affixes
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {family.affixes.map(a => (
              <span
                key={a.form}
                style={{
                  fontSize: 12,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '4px 8px',
                  color: '#475569',
                }}
              >
                <strong>{a.form}</strong> {a.meaning}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
