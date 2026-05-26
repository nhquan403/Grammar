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
        <AppHeader title="Ôn tập" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'bounce 1s infinite' }}>📚</div>
          <p style={{ color: 'var(--color-muted-foreground)', fontSize: 14 }}>Đang tải bài học...</p>
        </div>
      </div>
    )
  }

  if (isDone) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppHeader title="Ôn tập" />
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
      <div style={{ height: 3, background: 'var(--color-border)', flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            background: 'var(--color-primary)',
            width: `${progressPercent}%`,
            transition: 'width 0.35s ease',
            borderRadius: '0 3px 3px 0',
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
