import type { WordFamily } from '@/types/vocab-types'
import rawData from './seed-word-families.json'

// Cast raw JSON (with IDs + isCustom) to typed WordFamily array
export const SEED_WORD_FAMILIES: WordFamily[] = rawData as unknown as WordFamily[]
