import type { SM2Quality, RatingLabel } from '@/types/vocab-types'

export interface SM2Input {
  quality: SM2Quality
  easeFactor: number
  interval: number
  repetitions: number
}

export interface SM2Result {
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: number
}

/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the SuperMemo 2 algorithm by Piotr Wozniak (1987)
 * Quality: 0=blackout, 1=incorrect hard, 2=incorrect easy, 3=correct hard, 4=correct ok, 5=correct easy
 */
export function calculateSM2({ quality, easeFactor, interval, repetitions }: SM2Input): SM2Result {
  const newEF = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  let newInterval: number
  let newRep: number

  if (quality < 3) {
    // Failed — reset repetitions but keep ease factor
    newRep = 0
    newInterval = 1
  } else {
    newRep = repetitions + 1
    if (repetitions === 0) {
      newInterval = 1
    } else if (repetitions === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * newEF)
    }
  }

  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + newInterval)
  nextDate.setHours(0, 0, 0, 0) // normalize to start of day

  return {
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newRep,
    nextReviewDate: nextDate.getTime()
  }
}

export function ratingToQuality(rating: RatingLabel): SM2Quality {
  const map: Record<RatingLabel, SM2Quality> = {
    again: 1,
    hard: 3,
    good: 4,
    easy: 5
  }
  return map[rating]
}
