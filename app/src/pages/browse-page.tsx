import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
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

  const isFiltered = !!(filters.query || filters.cefr || filters.category)

  async function handleImportSeedData() {
    setIsImporting(true)
    setImportMessage(null)
    try {
      const count = await importSeedWordFamilies()
      setImportMessage(count > 0
        ? `✅ Đã nhập ${count} word families thành công!`
        : 'ℹ️ Dữ liệu mẫu đã được nhập trước đó.'
      )
    } catch {
      setImportMessage('❌ Lỗi khi nhập dữ liệu. Vui lòng thử lại.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppHeader
        title="Browse"
        subtitle={isLoading ? 'Đang tải...' : `${results.length} word families`}
      />

      {/* Sticky search + filters */}
      <div
        className="glass-light"
        style={{
          position: 'sticky',
          top: 56,
          zIndex: 10,
          borderBottom: '1px solid var(--color-border)',
          padding: '10px 16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <WordSearchInput
          value={filters.query}
          onChange={setQuery}
          placeholder="Tìm từ, định nghĩa..."
        />
        <CefrFilterChips
          selectedCefr={filters.cefr}
          selectedCategory={filters.category}
          onCefrChange={setCefr}
          onCategoryChange={setCategory}
        />
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/word/add')}
        className="fab gradient-brand"
        aria-label="Thêm từ mới"
        style={{
          bottom: 'calc(68px + env(safe-area-inset-bottom, 0px))',
          right: 20,
          zIndex: 50,
          color: 'white',
          fontSize: 26,
        }}
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Word list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
            <p style={{ color: 'var(--color-muted-foreground)', fontSize: 14 }}>Đang tải...</p>
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            isFiltered={isFiltered}
            isImporting={isImporting}
            importMessage={importMessage}
            onImport={handleImportSeedData}
          />
        ) : (
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map(family => (
              <WordFamilyCard key={family.id} family={family} />
            ))}
            <div style={{ height: 8 }} />
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  isFiltered, isImporting, importMessage, onImport,
}: {
  isFiltered: boolean
  isImporting: boolean
  importMessage: string | null
  onImport: () => void
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '56px 32px', gap: 12, textAlign: 'center',
    }}>
      <span style={{ fontSize: 48, lineHeight: 1 }}>{isFiltered ? '🔍' : '📚'}</span>

      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-foreground)', margin: 0 }}>
        {isFiltered ? 'Không tìm thấy kết quả' : 'Chưa có word families'}
      </p>

      <p style={{ fontSize: 13, color: 'var(--color-muted-foreground)', lineHeight: 1.6, margin: 0 }}>
        {isFiltered
          ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'
          : 'Nhập dữ liệu mẫu để bắt đầu học, hoặc thêm từ mới của bạn.'
        }
      </p>

      {!isFiltered && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%', maxWidth: 280 }}>
          <button
            onClick={onImport}
            disabled={isImporting}
            className="gradient-brand"
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: 14,
              border: 'none',
              cursor: isImporting ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 700,
              color: 'white',
              opacity: isImporting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
            }}
          >
            {isImporting ? '⏳ Đang nhập...' : '📥 Nhập 197 word families'}
          </button>

          {importMessage && (
            <p style={{ fontSize: 13, color: 'var(--color-muted-foreground)', margin: 0 }}>
              {importMessage}
            </p>
          )}

          <p style={{ fontSize: 12, color: 'var(--color-muted-foreground)', opacity: 0.6, margin: 0 }}>
            hoặc nhấn <strong style={{ color: 'var(--color-primary)' }}>+</strong> để thêm thủ công
          </p>
        </div>
      )}
    </div>
  )
}
