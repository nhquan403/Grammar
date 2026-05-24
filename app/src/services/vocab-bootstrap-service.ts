import { db } from '@/db/vocab-database'
import type { WordFamily, ReviewStats } from '@/types/vocab-types'

interface VocabDataFile {
  metadata: { version: string; totalFamilies: number; lastUpdated: string }
  families: WordFamily[]
}

export async function bootstrapVocabData(): Promise<void> {
  const existingCount = await db.wordFamilies.count()
  if (existingCount > 0) return

  const response = await fetch('/assets/vocab-data.json')
  if (!response.ok) throw new Error(`Failed to fetch vocab data: ${response.status}`)

  const data: VocabDataFile = await response.json()
  const now = Date.now()

  await db.wordFamilies.bulkAdd(data.families)

  const stats: ReviewStats[] = data.families.map(f => ({
    familyId: f.id,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    lastReviewDate: 0,
    nextReviewDate: now,
    correctCount: 0,
    wrongCount: 0,
    addedAt: now
  }))

  await db.reviewStats.bulkAdd(stats)

  await db.userProgress.put({
    id: 'singleton',
    totalFamiliesStudied: 0,
    totalReviewsDone: 0,
    masteredCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: now
  })

  console.info(`[VocabBootstrap] Loaded ${data.families.length} word families`)
}
