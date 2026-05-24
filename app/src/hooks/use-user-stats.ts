import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/vocab-database'
import type { CefrLevel } from '@/types/vocab-types'

export function useUserStats() {
  const progress = useLiveQuery(() => db.userProgress.get('singleton'))
  const totalFamilies = useLiveQuery(() => db.wordFamilies.count(), [], 0) ?? 0
  const dueCount = useLiveQuery(
    () => db.reviewStats.where('nextReviewDate').belowOrEqual(Date.now()).count(),
    [],
    0
  ) ?? 0

  const masteryBreakdown = useLiveQuery(async () => {
    const all = await db.reviewStats.toArray()
    return {
      new: all.filter(s => s.repetitions === 0).length,
      learning: all.filter(s => s.repetitions > 0 && s.repetitions < 5).length,
      mastered: all.filter(s => s.repetitions >= 5 && s.easeFactor >= 2.0).length,
    }
  })

  const cefrDistribution = useLiveQuery(async () => {
    const families = await db.wordFamilies.toArray()
    const masteredStats = await db.reviewStats
      .filter(s => s.repetitions >= 5 && s.easeFactor >= 2.0)
      .toArray()
    const masteredIds = new Set(masteredStats.map(s => s.familyId))

    const dist: Record<CefrLevel, { total: number; mastered: number }> = {
      A1: { total: 0, mastered: 0 }, A2: { total: 0, mastered: 0 },
      B1: { total: 0, mastered: 0 }, B2: { total: 0, mastered: 0 },
      C1: { total: 0, mastered: 0 }, C2: { total: 0, mastered: 0 },
    }
    for (const f of families) {
      dist[f.cefr].total++
      if (masteredIds.has(f.id)) dist[f.cefr].mastered++
    }
    return dist
  })

  return { progress, totalFamilies, dueCount, masteryBreakdown, cefrDistribution }
}
