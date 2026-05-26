import type { WordFamily, PartOfSpeech } from '@/types/vocab-types'

const POS_META: Record<PartOfSpeech, { label: string; cssClass: string }> = {
  noun:      { label: 'N',   cssClass: 'pos-noun'      },
  verb:      { label: 'V',   cssClass: 'pos-verb'      },
  adjective: { label: 'ADJ', cssClass: 'pos-adjective' },
  adverb:    { label: 'ADV', cssClass: 'pos-adverb'    },
  other:     { label: '?',   cssClass: 'pos-other'     },
}

const POS_ORDER: PartOfSpeech[] = ['verb', 'noun', 'adjective', 'adverb', 'other']

interface Props {
  family: WordFamily
}

export function FlashcardWordFamilyDisplay({ family }: Props) {
  // Group by POS in canonical order
  const grouped = POS_ORDER.reduce<Record<string, typeof family.forms>>((acc, pos) => {
    const forms = family.forms.filter(f => f.pos === pos)
    if (forms.length > 0) acc[pos] = forms
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Etymology */}
      {family.etymology && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          padding: '10px 12px',
          background: 'var(--color-surface-raised)',
          borderRadius: 12,
          borderLeft: '3px solid var(--color-primary)',
        }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>🌱</span>
          <p style={{ fontSize: 12, color: 'var(--color-muted-foreground)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
            {family.etymology}
          </p>
        </div>
      )}

      {/* Word forms grouped by POS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Object.entries(grouped).map(([pos, forms]) => {
          const meta = POS_META[pos as PartOfSpeech] ?? POS_META.other
          return (
            <div key={pos} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              {/* POS badge */}
              <span
                className={`badge ${meta.cssClass}`}
                style={{
                  fontSize: 9, padding: '3px 6px',
                  minWidth: 30, textAlign: 'center',
                  flexShrink: 0, marginTop: 3,
                  letterSpacing: '0.04em',
                }}
              >
                {meta.label}
              </span>

              {/* Forms */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {forms.map((form, idx) => (
                  <div key={`${form.word}-${idx}`}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        fontWeight: 700, fontSize: 16,
                        color: 'var(--color-foreground)', lineHeight: 1.2,
                      }}>
                        {form.word}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--color-muted-foreground)', lineHeight: 1.4 }}>
                        {form.definition}
                      </span>
                    </div>
                    {form.example && (
                      <p style={{
                        fontSize: 12,
                        color: 'var(--color-muted-foreground)',
                        fontStyle: 'italic',
                        opacity: 0.75,
                        marginTop: 3,
                        lineHeight: 1.5,
                      }}>
                        "{form.example}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Affixes */}
      {family.affixes.length > 0 && (
        <div>
          <p className="section-label" style={{ marginBottom: 8 }}>Affixes</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {family.affixes.map((a, idx) => (
              <span
                key={`${a.form}-${idx}`}
                style={{
                  fontSize: 12,
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  padding: '5px 10px',
                  color: 'var(--color-muted-foreground)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <strong style={{ color: 'var(--color-foreground)' }}>{a.form}</strong>
                <span style={{ opacity: 0.7 }}>·</span>
                {a.meaning}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
