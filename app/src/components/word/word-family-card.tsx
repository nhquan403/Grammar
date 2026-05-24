import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/vocab-database'
import type { WordFamily } from '@/types/vocab-types'

const CEFR_STYLES: Record<string, { bg: string; text: string }> = {
  A1: { bg: '#dcfce7', text: '#166534' },
  A2: { bg: '#d1fae5', text: '#065f46' },
  B1: { bg: '#dbeafe', text: '#1e40af' },
  B2: { bg: '#e0e7ff', text: '#3730a3' },
  C1: { bg: '#f3e8ff', text: '#6b21a8' },
  C2: { bg: '#fce7f3', text: '#9d174d' },
}

interface Props {
  family: WordFamily
}

export function WordFamilyCard({ family }: Props) {
  const navigate = useNavigate()
  const stats = useLiveQuery(() => db.reviewStats.get(family.id), [family.id])

  const cefrStyle = CEFR_STYLES[family.cefr] ?? { bg: '#f1f5f9', text: '#475569' }
  const isMastered = (stats?.repetitions ?? 0) >= 5 && (stats?.easeFactor ?? 0) >= 2.0
  const hasBeenReviewed = (stats?.repetitions ?? 0) > 0

  return (
    <button
      onClick={() => navigate(`/word/${family.id}`)}
      style={{
        width: '100%',
        background: 'white',
        border: '1px solid #f1f5f9',
        borderRadius: 16,
        padding: '14px 14px 14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        textAlign: 'left',
        touchAction: 'manipulation',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#0f172a' }}>
            {family.rootWord}
          </span>
          {isMastered && <span style={{ fontSize: 14 }}>⭐</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10, background: cefrStyle.bg, color: cefrStyle.text }}>
            {family.cefr}
          </span>
          {family.isCustom && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: '#e0e7ff', color: '#4338ca' }}>
              Của tôi
            </span>
          )}
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            {family.forms.length} forms
          </span>
          {hasBeenReviewed && (
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              · {stats!.repetitions}× reviewed
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={16} style={{ color: '#cbd5e1', flexShrink: 0 }} />
    </button>
  )
}
