import { useState, useCallback } from 'react'
import { getDueReviews, submitReview } from '@/services/review-schedule-service'
import type { ReviewItem, RatingLabel } from '@/types/vocab-types'

export function useReviewQueue() {
  const [queue, setQueue] = useState<ReviewItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDone, setIsDone] = useState(false)

  const loadQueue = useCallback(async () => {
    setIsLoading(true)
    setCurrentIndex(0)
    setCompleted(0)
    setIsDone(false)
    const items = await getDueReviews(20)
    setQueue(items)
    setIsDone(items.length === 0)
    setIsLoading(false)
  }, [])

  const rate = useCallback(
    async (rating: RatingLabel) => {
      const current = queue[currentIndex]
      if (!current) return

      await submitReview(current.family.id, rating)

      const next = currentIndex + 1
      if (next >= queue.length) {
        setIsDone(true)
      } else {
        setCurrentIndex(next)
      }
      setCompleted(c => c + 1)
    },
    [queue, currentIndex]
  )

  return {
    current: queue[currentIndex] ?? null,
    total: queue.length,
    completed,
    isLoading,
    isDone,
    loadQueue,
    rate,
  }
}
