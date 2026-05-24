import { useEffect } from 'react'
import { AppHeader } from '@/components/layout/app-header'
import { FlashcardSwipeable } from '@/components/flashcard/flashcard-swipeable'
import { StudyCompletionScreen } from '@/components/flashcard/study-completion-screen'
import { useReviewQueue } from '@/hooks/use-review-queue'

export function StudyPage() {
  const { current, total, completed, isLoading, isDone, loadQueue, rate } = useReviewQueue()

  useEffect(() => {
    loadQueue()
  }, [loadQueue])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppHeader title="Study" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'bounce 1s infinite' }}>📚</div>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Đang tải bài học...</p>
        </div>
      </div>
    )
  }

  if (isDone) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppHeader title="Study" />
        <StudyCompletionScreen completed={completed} />
      </div>
    )
  }

  const progressPercent = total > 0 ? (completed / total) * 100 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppHeader
        title="Study"
        subtitle={total > 0 ? `${completed + 1} / ${total}` : undefined}
      />
      {/* Progress bar */}
      <div style={{ height: 3, background: '#e2e8f0' }}>
        <div
          style={{
            height: '100%',
            background: '#6366f1',
            width: `${progressPercent}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {current && (
        <FlashcardSwipeable
          key={current.family.id}
          item={current}
          onRate={rate}
        />
      )}
    </div>
  )
}
