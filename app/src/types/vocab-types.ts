export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'other'
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type WordCategory = 'common' | 'academic' | 'business' | 'ielts' | 'toefl'

export interface WordForm {
  word: string
  pos: PartOfSpeech
  definition: string
  example: string
  frequency: 'very-common' | 'common' | 'less-common' | 'rare'
}

export interface WordAffix {
  type: 'prefix' | 'suffix'
  form: string
  meaning: string
}

export interface WordFamily {
  id: string
  rootWord: string
  etymology?: string
  forms: WordForm[]
  affixes: WordAffix[]
  cefr: CefrLevel
  category: WordCategory
  tags: string[]
}

export interface ReviewStats {
  familyId: string
  easeFactor: number
  interval: number
  repetitions: number
  lastReviewDate: number
  nextReviewDate: number
  correctCount: number
  wrongCount: number
  addedAt: number
}

export interface UserProgress {
  id: 'singleton'
  totalFamiliesStudied: number
  totalReviewsDone: number
  masteredCount: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: number
}

export interface ReviewItem {
  family: WordFamily
  stats: ReviewStats
}

export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5
export type RatingLabel = 'again' | 'hard' | 'good' | 'easy'
