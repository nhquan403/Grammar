import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { PwaInstallBanner } from '@/components/ui/pwa-install-banner'
import { HomePage } from '@/pages/home-page'
import { StudyPage } from '@/pages/study-page'
import { BrowsePage } from '@/pages/browse-page'
import { WordDetailPage } from '@/pages/word-detail-page'
import { WordFamilyFormPage } from '@/pages/word-family-form-page'
import { StatsPage } from '@/pages/stats-page'
import { useDarkMode } from '@/hooks/use-dark-mode'
import { usePwaInstallPrompt } from '@/hooks/use-pwa-install-prompt'

export default function App() {
  // Initialize dark mode (applies class to <html> element)
  useDarkMode()
  const { showBanner, isIOS, install, dismiss } = usePwaInstallPrompt()

  return (
    <BrowserRouter>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          maxWidth: 448,
          margin: '0 auto',
          position: 'relative',
          background: 'var(--color-background)',
        }}
      >
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            {/* /word/add and /word/edit/:familyId MUST be declared before /word/:familyId */}
            <Route path="/word/add" element={<WordFamilyFormPage />} />
            <Route path="/word/edit/:familyId" element={<WordFamilyFormPage />} />
            <Route path="/word/:familyId" element={<WordDetailPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <MobileBottomNav />
        {showBanner && <PwaInstallBanner isIOS={isIOS} onInstall={install} onDismiss={dismiss} />}
      </div>
    </BrowserRouter>
  )
}
