import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/app-header'
import { WordSearchInput } from '@/components/word/word-search-input'
import { CefrFilterChips } from '@/components/word/cefr-filter-chips'
import { WordFamilyCard } from '@/components/word/word-family-card'
import { useWordSearch } from '@/hooks/use-word-search'
import { importSeedWordFamilies } from '@/services/custom-word-family-service'

export function BrowsePage() {
  const navigate = useNavigate()
  const { results, filters, isLoading, setQuery, setCefr, setCategory } = useWordSearch()
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  async function handleImportSeedData() {
    setIsImporting(true)
    setImportMessage(null)
    try {
      const count = await importSeedWordFamilies()
      if (count > 0) {
        setImportMessage(`✅ Đã nhập ${count} word families thành công!`)
      } else {
        setImportMessage('ℹ️ Dữ liệu mẫu đã được nhập trước đó.')
      }
    } catch (err) {
      setImportMessage('❌ Lỗi khi nhập dữ liệu. Vui lòng thử lại.')
      console.error('Import seed data error:', err)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppHeader
        title="Browse"
        subtitle={isLoading ? 'Loading...' : `${results.length} word families`}
      />

      {/* Sticky search + filters */}
      <div style={{
        position: 'sticky',
        top: 56,
        zIndex: 10,
        background: 'rgba(248,250,252,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #f1f5f9',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <WordSearchInput
          value={filters.query}
          onChange={setQuery}
          placeholder="Search words, definitions..."
        />
        <CefrFilterChips
          selectedCefr={filters.cefr}
          selectedCategory={filters.category}
          onCefrChange={setCefr}
          onCategoryChange={setCategory}
        />
      </div>

      {/* FAB: Add new word */}
      <button
        onClick={() => navigate('/word/add')}
        aria-label="Thêm từ mới"
        style={{
          position: 'fixed', bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))', right: 20, zIndex: 50,
          width: 52, height: 52, borderRadius: 26,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
          fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
          touchAction: 'manipulation',
        }}
      >
        +
      </button>

      {/* Word list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 64 }}>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Loading...</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 64, gap: 16 }}>
            <span style={{ fontSize: 40 }}>🔍</span>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              {filters.query || filters.cefr || filters.category ? 'Không tìm thấy từ nào' : 'Chưa có word families nào'}
            </p>
            {!filters.query && !filters.cefr && !filters.category && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={handleImportSeedData}
                  disabled={isImporting}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 12,
                    background: isImporting ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: isImporting ? '#94a3b8' : 'white',
                    border: 'none',
                    cursor: isImporting ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    boxShadow: isImporting ? 'none' : '0 4px 12px rgba(99,102,241,0.35)',
                  }}
                >
                  {isImporting ? '⏳ Đang nhập...' : '📥 Nhập dữ liệu mẫu (197 từ)'}
                </button>
                {importMessage && (
                  <p style={{ color: '#64748b', fontSize: 13, textAlign: 'center' }}>{importMessage}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map(family => (
              <WordFamilyCard key={family.id} family={family} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
