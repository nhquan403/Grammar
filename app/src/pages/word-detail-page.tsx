import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Pencil, Calendar, RotateCcw, Zap } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/db/vocab-database'
import { deleteCustomWordFamily } from '@/services/custom-word-family-service'
import { FlashcardWordFamilyDisplay } from '@/components/flashcard/flashcard-word-family-display'

export function WordDetailPage() {
  const { familyId } = useParams<{ familyId: string }>()
  const navigate = useNavigate()
  const family = useLiveQuery(() => familyId ? db.wordFamilies.get(familyId) : undefined, [familyId])
  const stats = useLiveQuery(() => familyId ? db.reviewStats.get(familyId) : undefined, [familyId])

  if (!family) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'var(--color-muted-foreground)', fontSize: 14 }}>Đang tải...</p>
      </div>
    )
  }

  const isCustom = family.isCustom === true
  const isMastered = (stats?.repetitions ?? 0) >= 5 && (stats?.easeFactor ?? 0) >= 2.0
  const nextReview = stats?.nextReviewDate
    ? new Date(stats.nextReviewDate).toLocaleDateString('vi-VN')
    : '—'

  async function handleDelete() {
    if (!familyId) return
    const ok = window.confirm(`Xóa "${family!.rootWord}"? Không thể hoàn tác.`)
    if (!ok) return
    try {
      await deleteCustomWordFamily(familyId)
      navigate('/browse')
    } catch (err) {
      window.alert('Lỗi: ' + (err instanceof Error ? err.message : 'Thử lại'))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

      {/* Header */}
      <header
        className="glass-light"
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          height: 56, display: 'flex', alignItems: 'center',
          gap: 4, padding: '0 12px 0 8px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost"
          style={{ width: 40, height: 40 }}
          aria-label="Quay lại"
        >
          <ArrowLeft size={21} />
        </button>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-foreground)', margin: 0, lineHeight: 1 }}>
            {family.rootWord}
          </h1>
          {isMastered && <span style={{ fontSize: 14 }}>⭐</span>}
          <span className={`badge cefr-${family.cefr}`} style={{ fontSize: 10, padding: '2px 8px' }}>
            {family.cefr}
          </span>
        </div>

        {isCustom && (
          <button
            onClick={() => navigate(`/word/edit/${familyId}`)}
            className="btn-ghost"
            style={{ width: 38, height: 38, color: 'var(--color-primary)' }}
            aria-label="Chỉnh sửa"
          >
            <Pencil size={16} />
          </button>
        )}
      </header>

      <div style={{ flex: 1, padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Review stats strip */}
        {stats && (
          <div
            className="card"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
              gap: 0, overflow: 'hidden', padding: 0,
            }}
          >
            {[
              { icon: <RotateCcw size={14} />, label: 'Đã ôn', value: String(stats.repetitions) },
              { icon: <Zap size={14} />,        label: 'Ease',  value: stats.easeFactor.toFixed(1) },
              { icon: <Calendar size={14} />,   label: 'Ôn tiếp', value: nextReview },
            ].map(({ icon, label, value }, i) => (
              <div
                key={label}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  borderRight: i < 2 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-muted-foreground)', marginBottom: 4 }}>
                  {icon}
                </div>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-foreground)', margin: 0, lineHeight: 1 }}>
                  {value}
                </p>
                <p style={{ fontSize: 10, color: 'var(--color-muted-foreground)', margin: '3px 0 0', lineHeight: 1 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Category & tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: 'var(--color-muted-foreground)',
            background: 'var(--color-muted)',
            padding: '3px 8px', borderRadius: 8,
          }}>
            {family.category}
          </span>
          {family.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, color: 'var(--color-muted-foreground)',
              background: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border)',
              padding: '3px 8px', borderRadius: 8,
            }}>
              #{tag}
            </span>
          ))}
          {isCustom && (
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: 'rgba(99,102,241,0.12)',
              color: 'var(--color-primary)',
              padding: '3px 8px', borderRadius: 8,
            }}>
              Của tôi
            </span>
          )}
        </div>

        {/* Word family content */}
        <div className="card" style={{ padding: '18px 16px' }}>
          <FlashcardWordFamilyDisplay family={family} />
        </div>

        {/* Delete — custom only */}
        {isCustom && (
          <button
            onClick={handleDelete}
            style={{
              padding: '13px', borderRadius: 14,
              border: '1.5px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.06)',
              color: '#ef4444', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', touchAction: 'manipulation', width: '100%',
              transition: 'background 0.15s ease',
            }}
          >
            Xóa từ này
          </button>
        )}
      </div>
    </div>
  )
}
