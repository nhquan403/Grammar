import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/db/vocab-database'
import { FlashcardWordFamilyDisplay } from '@/components/flashcard/flashcard-word-family-display'

const CEFR_STYLES: Record<string, { bg: string; text: string }> = {
  A1: { bg: '#dcfce7', text: '#166534' }, A2: { bg: '#d1fae5', text: '#065f46' },
  B1: { bg: '#dbeafe', text: '#1e40af' }, B2: { bg: '#e0e7ff', text: '#3730a3' },
  C1: { bg: '#f3e8ff', text: '#6b21a8' }, C2: { bg: '#fce7f3', text: '#9d174d' },
}

export function WordDetailPage() {
  const { familyId } = useParams<{ familyId: string }>()
  const navigate = useNavigate()
  const family = useLiveQuery(() => familyId ? db.wordFamilies.get(familyId) : undefined, [familyId])
  const stats = useLiveQuery(() => familyId ? db.reviewStats.get(familyId) : undefined, [familyId])

  if (!family) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
        Loading...
      </div>
    )
  }

  const cefrStyle = CEFR_STYLES[family.cefr] ?? { bg: '#f1f5f9', text: '#475569' }
  const nextReview = stats?.nextReviewDate
    ? new Date(stats.nextReviewDate).toLocaleDateString('vi-VN')
    : 'Chưa học'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Custom header with back button */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(248,250,252,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        height: 56, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', flex: 1 }}>{family.rootWord}</h1>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: cefrStyle.bg, color: cefrStyle.text }}>
          {family.cefr}
        </span>
      </div>

      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Review stats */}
        {stats && (
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { label: 'Reviews', value: String(stats.repetitions) },
              { label: 'Ease', value: stats.easeFactor.toFixed(1) },
              { label: 'Next review', value: nextReview },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{value}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Full word family */}
        <div style={{ background: 'white', borderRadius: 16, padding: 16, border: '1px solid #e2e8f0' }}>
          <FlashcardWordFamilyDisplay family={family} />
        </div>
      </div>
    </div>
  )
}
