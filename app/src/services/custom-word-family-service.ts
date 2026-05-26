import { db } from '@/db/vocab-database'
import type { WordFamily } from '@/types/vocab-types'
import { SEED_WORD_FAMILIES } from '@/data/seed-word-families'

// Generate unique ID from rootWord + timestamp to avoid collisions
export function generateFamilyId(rootWord: string): string {
  const slug = rootWord.trim().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 40)
  return `custom-${slug}-${Date.now()}`
}

// Add a new custom word family + bootstrap its ReviewStats in a single transaction
export async function addCustomWordFamily(
  data: Omit<WordFamily, 'id' | 'isCustom'>
): Promise<string> {
  const id = generateFamilyId(data.rootWord)
  const family: WordFamily = { ...data, id, isCustom: true }

  await db.transaction('rw', [db.wordFamilies, db.reviewStats], async () => {
    await db.wordFamilies.add(family)
    await db.reviewStats.add({
      familyId: id,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      lastReviewDate: 0,
      nextReviewDate: Date.now(),  // due immediately so it appears in study queue
      correctCount: 0,
      wrongCount: 0,
      addedAt: Date.now(),
    })
  })

  return id
}

// Update an existing custom word family (built-in words are read-only)
export async function updateCustomWordFamily(
  id: string,
  data: Omit<WordFamily, 'id' | 'isCustom'>
): Promise<void> {
  const existing = await db.wordFamilies.get(id)
  if (!existing?.isCustom) {
    throw new Error('Không thể chỉnh sửa từ có sẵn trong hệ thống')
  }
  await db.wordFamilies.put({ ...data, id, isCustom: true })
}

// Delete a custom word family + its review stats atomically
export async function deleteCustomWordFamily(id: string): Promise<void> {
  const existing = await db.wordFamilies.get(id)
  if (!existing?.isCustom) {
    throw new Error('Không thể xóa từ có sẵn trong hệ thống')
  }

  await db.transaction('rw', [db.wordFamilies, db.reviewStats], async () => {
    await db.wordFamilies.delete(id)
    await db.reviewStats.delete(id)
  })
}

// Bulk-import seed word families from the bundled dataset.
// Idempotent: skips families whose ID already exists in the DB.
// Returns the count of newly imported families.
export async function importSeedWordFamilies(): Promise<number> {
  const now = Date.now()
  let imported = 0

  // Check which IDs already exist to avoid duplicates
  const existingIds = new Set(await db.wordFamilies.toCollection().primaryKeys() as string[])
  const newFamilies = SEED_WORD_FAMILIES.filter(f => !existingIds.has(f.id))

  if (newFamilies.length === 0) return 0

  await db.transaction('rw', [db.wordFamilies, db.reviewStats], async () => {
    await db.wordFamilies.bulkAdd(newFamilies)
    await db.reviewStats.bulkAdd(
      newFamilies.map(f => ({
        familyId: f.id,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        lastReviewDate: 0,
        nextReviewDate: now,  // due immediately
        correctCount: 0,
        wrongCount: 0,
        addedAt: now,
      }))
    )
    imported = newFamilies.length
  })

  return imported
}

// Auto-translate English text to Vietnamese via MyMemory API (free, no key needed)
export async function autoTranslateToVietnamese(text: string): Promise<string> {
  const trimmed = text.trim()
  if (!trimmed) return ''

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|vi`
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) })

  if (!res.ok) throw new Error('API không phản hồi')

  const json = await res.json()
  const translated: string = json?.responseData?.translatedText ?? ''

  if (!translated || json?.responseStatus !== 200) {
    throw new Error('Dịch thất bại')
  }

  return translated
}
