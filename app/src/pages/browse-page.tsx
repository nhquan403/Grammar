import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/app-header'
import { WordSearchInput } from '@/components/word/word-search-input'
import { CefrFilterChips } from '@/components/word/cefr-filter-chips'
import { WordFamilyCard } from '@/components/word/word-family-card'
import { useWordSearch } from '@/hooks/use-word-search'

export function BrowsePage() {
  const navigate = useNavigate()
  const { results, filters, isLoading, setQuery, setCefr, setCategory } = useWordSearch()

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
          position: 'fixed', bottom: 80, right: 20, zIndex: 50,
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 64, gap: 8 }}>
            <span style={{ fontSize: 40 }}>🔍</span>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No words found</p>
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
