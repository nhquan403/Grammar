import { db } from '@/db/vocab-database'
import { calculateSM2, ratingToQuality } from '@/utils/sm2-algorithm'
import type { ReviewItem, RatingLabel } from '@/types/vocab-types'

export async function getDueReviews(limit = 20): Promise<ReviewItem[]> {
  const now = Date.now()

  const dueStats = await db.reviewStats
    .where('nextReviewDate')
    .belowOrEqual(now)
    .sortBy('easeFactor') // hardest (lowest EF) first

  const limited = dueStats.slice(0, limit)

  const items = await Promise.all(
    limited.map(async stats => {
      const family = await db.wordFamilies.get(stats.familyId)
      return { family, stats }
    })
  )

  return items.filter((item): item is ReviewItem => item.family != null)
}

export async function submitReview(familyId: string, rating: RatingLabel): Promise<void> {
  const stats = await db.reviewStats.get(familyId)
  if (!stats) return

  const quality = ratingToQuality(rating)
  const result = calculateSM2({
    quality,
    easeFactor: stats.easeFactor,
    interval: stats.interval,
    repetitions: stats.repetitions
  })

  await db.reviewStats.update(familyId, {
    easeFactor: result.easeFactor,
    interval: result.interval,
    repetitions: result.repetitions,
    lastReviewDate: Date.now(),
    nextReviewDate: result.nextReviewDate,
    correctCount: rating !== 'again' ? stats.correctCount + 1 : stats.correctCount,
    wrongCount: rating === 'again' ? stats.wrongCount + 1 : stats.wrongCount
  })

  await updateUserStreak()
}

export async function getDueCount(): Promise<number> {
  return db.reviewStats.where('nextReviewDate').belowOrEqual(Date.now()).count()
}

async function updateUserStreak(): Promise<void> {
  const progress = await db.userProgress.get('singleton')
  if (!progress) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTs = today.getTime()

  const yesterday = new Date(todayTs)
  yesterday.setDate(yesterday.getDate() - 1)

  const lastDate = new Date(progress.lastActivityDate)
  lastDate.setHours(0, 0, 0, 0)

  let newStreak = progress.currentStreak
  if (lastDate.getTime() === yesterday.getTime()) {
    newStreak += 1 // continued
  } else if (lastDate.getTime() < yesterday.getTime()) {
    newStreak = 1 // broken — restart
  }
  // same day → unchanged

  const masteredCount = await db.reviewStats
    .filter(s => s.repetitions >= 5 && s.easeFactor >= 2.0)
    .count()

  await db.userProgress.update('singleton', {
    totalReviewsDone: progress.totalReviewsDone + 1,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, progress.longestStreak),
    lastActivityDate: Date.now(),
    masteredCount
  })
}
