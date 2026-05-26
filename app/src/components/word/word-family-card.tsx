import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/vocab-database'
import type { WordFamily } from '@/types/vocab-types'

interface Props {
  family: WordFamily
}

export function WordFamilyCard({ family }: Props) {
  const navigate = useNavigate()
  const stats = useLiveQuery(() => db.reviewStats.get(family.id), [family.id])

  const isMastered = (stats?.repetitions ?? 0) >= 5 && (stats?.easeFactor ?? 0) >= 2.0
  const repetitions = stats?.repetitions ?? 0

  // Preview: first definition from forms
  const preview = family.forms[0]?.definition ?? ''

  // Count unique POS types
  const posTypes = [...new Set(family.forms.map(f => f.pos))]

  return (
    <button
      onClick={() => navigate(`/word/${family.id}`)}
      className="card-interactive"
      style={{
        width: '100%',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Left: content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Root word row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-foreground)', lineHeight: 1 }}>
            {family.rootWord}
          </span>
          {isMastered && (
            <span style={{ fontSize: 13 }} title="Thuần thục">⭐</span>
          )}
        </div>

        {/* Definition preview */}
        {preview && (
          <p style={{
            fontSize: 12,
            color: 'var(--color-muted-foreground)',
            marginBottom: 7,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {preview}
          </p>
        )}

        {/* Badges row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span className={`badge cefr-${family.cefr}`} style={{ fontSize: 10, padding: '2px 7px' }}>
            {family.cefr}
          </span>
          {posTypes.map(pos => (
            <span key={pos} className={`badge pos-${pos}`} style={{ fontSize: 9, padding: '2px 6px' }}>
              {pos === 'adjective' ? 'adj' : pos === 'adverb' ? 'adv' : pos}
            </span>
          ))}
          {repetitions > 0 && (
            <span style={{ fontSize: 11, color: 'var(--color-muted-foreground)' }}>
              · {repetitions}× ôn
            </span>
          )}
        </div>
      </div>

      {/* Right: progress arc or arrow */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {repetitions > 0 ? (
          <MiniProgress value={Math.min(repetitions / 5, 1)} mastered={isMastered} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 5l4 4-4 4" stroke="var(--color-border)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  )
}

function MiniProgress({ value, mastered }: { value: number; mastered: boolean }) {
  const r = 7
  const circ = 2 * Math.PI * r
  const dash = circ * value

  return (
    <svg width="22" height="22" viewBox="0 0 22 22" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="11" cy="11" r={r} fill="none" stroke="var(--color-border)" strokeWidth="2.5" />
      <circle
        cx="11" cy="11" r={r} fill="none"
        stroke={mastered ? '#22c55e' : 'var(--color-primary)'}
        strokeWidth="2.5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  )
}
