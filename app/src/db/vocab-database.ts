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
  }
}

export const db = new VocabDatabase()
