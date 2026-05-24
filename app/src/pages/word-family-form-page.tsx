import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/db/vocab-database'
import { useWordFamilyForm } from '@/hooks/use-word-family-form'
import { WordFormSection } from '@/components/word/word-form-section'
import { AffixFormSection } from '@/components/word/affix-form-section'
import { deleteCustomWordFamily } from '@/services/custom-word-family-service'
import type { CefrLevel, WordCategory } from '@/types/vocab-types'

const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const CATEGORIES: Array<{ value: WordCategory; label: string }> = [
  { value: 'common', label: '📗 Thông dụng' },
  { value: 'academic', label: '🎓 Học thuật' },
  { value: 'ielts', label: '📝 IELTS' },
  { value: 'business', label: '💼 Kinh doanh' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 12, fontSize: 16,
  border: '1px solid #e2e8f0', background: 'white', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
}

export function WordFamilyFormPage() {
  const { familyId } = useParams<{ familyId: string }>()
  const navigate = useNavigate()
  const isEdit = !!familyId

  // Load existing data when editing
  const existingFamily = useLiveQuery(
    () => familyId ? db.wordFamilies.get(familyId) : undefined,
    [familyId]
  )

  const { state, setRootWord, setCefr, setCategory, setEtymology, setTagsRaw,
    addForm, removeForm, updateForm, addAffix, removeAffix, updateAffix,
    translateForm, save, set,
  } = useWordFamilyForm(undefined, familyId)

  // Redirect if trying to edit a built-in (non-custom) word
  useEffect(() => {
    if (isEdit && existingFamily && !existingFamily.isCustom) {
      navigate(`/word/${familyId}`, { replace: true })
    }
  }, [isEdit, existingFamily, familyId, navigate])

  // Pre-fill form when editing
  useEffect(() => {
    if (!existingFamily) return
    set({
      rootWord: existingFamily.rootWord,
      cefr: existingFamily.cefr,
      category: existingFamily.category,
      etymology: existingFamily.etymology ?? '',
      tagsRaw: existingFamily.tags.join(', '),
      forms: existingFamily.forms.map(f => ({
        _key: crypto.randomUUID(),
        word: f.word,
        pos: f.pos,
        definition: f.definition,
        example: f.example ?? '',
        frequency: f.frequency,
      })),
      affixes: existingFamily.affixes.map(a => ({
        _key: crypto.randomUUID(),
        type: a.type,
        form: a.form,
        meaning: a.meaning,
      })),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingFamily?.id])

  const handleSave = async () => {
    try {
      const id = await save()
      if (!id) return  // validation failed, errors already set
      navigate(isEdit ? `/word/${id}` : '/browse')
    } catch (err) {
      window.alert('Lỗi khi lưu: ' + (err instanceof Error ? err.message : 'Vui lòng thử lại'))
    }
  }

  const handleDelete = async () => {
    if (!familyId) return
    const ok = window.confirm('Xóa từ này? Hành động không thể hoàn tác.')
    if (!ok) return
    try {
      await deleteCustomWordFamily(familyId)
      navigate('/browse')
    } catch (err) {
      window.alert('Lỗi khi xóa: ' + (err instanceof Error ? err.message : 'Vui lòng thử lại'))
    }
  }

  const sectionLabel = (text: string) => (
    <h2 style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8, marginTop: 4 }}>
      {text}
    </h2>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(248,250,252,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        height: 56, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px',
      }}>
        <button onClick={() => navigate(-1)} style={{
          minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: -8, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
        }}>
          <ArrowLeft size={22} />
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', flex: 1 }}>
          {isEdit ? 'Sửa từ' : 'Thêm từ mới'}
        </h1>
      </div>

      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Basic info */}
        <div style={{ background: 'white', borderRadius: 18, padding: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sectionLabel('Thông tin cơ bản')}

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Từ gốc *</label>
            <input value={state.rootWord} onChange={e => setRootWord(e.target.value)}
              placeholder="e.g. innovate" style={{ ...inputStyle, marginTop: 4 }} />
            {state.errors.rootWord && (
              <p style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{state.errors.rootWord}</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Cấp độ CEFR</label>
              <select value={state.cefr} onChange={e => setCefr(e.target.value as CefrLevel)}
                style={{ ...inputStyle, marginTop: 4 }}>
                {CEFR_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Danh mục</label>
              <select value={state.category} onChange={e => setCategory(e.target.value as WordCategory)}
                style={{ ...inputStyle, marginTop: 4 }}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Từ nguyên (không bắt buộc)</label>
            <input value={state.etymology} onChange={e => setEtymology(e.target.value)}
              placeholder="e.g. Latin: innovare (to renew)" style={{ ...inputStyle, marginTop: 4 }} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Tags (phân cách bằng dấu phẩy)</label>
            <input value={state.tagsRaw} onChange={e => setTagsRaw(e.target.value)}
              placeholder="e.g. business, academic" style={{ ...inputStyle, marginTop: 4 }} />
          </div>
        </div>

        {/* Word forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sectionLabel('Các dạng từ *')}
          {state.forms.map((entry, i) => (
            <WordFormSection
              key={entry._key}
              entry={entry}
              index={i}
              canRemove={state.forms.length > 1}
              isTranslating={state.translateLoadingKey === entry._key}
              translateError={state.errors[`translate-${entry._key}`]}
              errors={state.errors}
              onUpdate={patch => updateForm(entry._key, patch)}
              onRemove={() => removeForm(entry._key)}
              onTranslate={word => translateForm(entry._key, word)}
            />
          ))}
          <button onClick={addForm} style={{
            padding: '10px', borderRadius: 12, border: '1.5px dashed #c7d2fe',
            background: '#eef2ff', color: '#6366f1', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', touchAction: 'manipulation',
          }}>
            + Thêm dạng từ
          </button>
        </div>

        {/* Affixes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sectionLabel('Tiền tố / Hậu tố (không bắt buộc)')}
          {state.affixes.map((entry, i) => (
            <AffixFormSection
              key={entry._key}
              entry={entry}
              index={i}
              onUpdate={patch => updateAffix(entry._key, patch)}
              onRemove={() => removeAffix(entry._key)}
            />
          ))}
          <button onClick={addAffix} style={{
            padding: '10px', borderRadius: 12, border: '1.5px dashed #d1d5db',
            background: '#f9fafb', color: '#6b7280', fontWeight: 600, fontSize: 13,
            cursor: 'pointer', touchAction: 'manipulation',
          }}>
            + Thêm affix
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
          <button
            onClick={handleSave}
            disabled={state.isSaving}
            style={{
              padding: '14px', borderRadius: 14, border: 'none',
              background: state.isSaving ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontWeight: 700, fontSize: 16, cursor: state.isSaving ? 'not-allowed' : 'pointer',
              touchAction: 'manipulation',
            }}
          >
            {state.isSaving ? 'Đang lưu...' : isEdit ? '💾 Lưu thay đổi' : '✅ Thêm từ'}
          </button>

          <button onClick={() => navigate(-1)} style={{
            padding: '12px', borderRadius: 14, border: '1px solid #e2e8f0',
            background: 'white', color: '#64748b', fontWeight: 600, fontSize: 15,
            cursor: 'pointer', touchAction: 'manipulation',
          }}>
            Hủy
          </button>

          {isEdit && (
            <button onClick={handleDelete} style={{
              padding: '12px', borderRadius: 14, border: '1px solid #fecaca',
              background: '#fff5f5', color: '#ef4444', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', touchAction: 'manipulation',
            }}>
              🗑️ Xóa từ này
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
