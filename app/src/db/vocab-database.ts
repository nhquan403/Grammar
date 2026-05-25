import Dexie, { type Table } from 'dexie'
import type { WordFamily, ReviewStats, UserProgress } from '@/types/vocab-types'

class VocabDatabase extends Dexie {
  wordFamilies!: Table<WordFamily>
  reviewStats!: Table<ReviewStats>
  userProgress!: Table<UserProgress>

  constructor() {
    super('VocabFamilyDB')

    this.version(1).stores({
      wordFamilies: '&id, rootWord, cefr, category, *tags',
      reviewStats: '&familyId, nextReviewDate, easeFactor, repetitions, addedAt',
      userProgress: '&id'
    })

    // v2: remove all built-in (non-custom) word families and their stats
    this.version(2).stores({
      wordFamilies: '&id, rootWord, cefr, category, *tags',
      reviewStats: '&familyId, nextReviewDate, easeFactor, repetitions, addedAt',
      userProgress: '&id'
    }).upgrade(async tx => {
      const builtInIds = await tx.table<WordFamily>('wordFamilies')
        .filter(f => !f.isCustom)
        .primaryKeys()

      await tx.table('wordFamilies').bulkDelete(builtInIds as string[])
      await tx.table('reviewStats').bulkDelete(builtInIds as string[])
    })
  }
}

export const db = new VocabDatabase()
