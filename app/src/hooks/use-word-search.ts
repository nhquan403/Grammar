import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/vocab-database'
import type { WordFamily, CefrLevel, WordCategory } from '@/types/vocab-types'

interface SearchFilters {
  query: string
  cefr: CefrLevel | ''
  category: WordCategory | ''
}

export function useWordSearch() {
  const [filters, setFilters] = useState<SearchFilters>({ query: '', cefr: '', category: '' })
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(filters.query.trim()), 300)
    return () => clearTimeout(timer)
  }, [filters.query])

  const results = useLiveQuery<WordFamily[]>(async () => {
    let base: WordFamily[]

    if (filters.cefr && filters.category) {
      const byCefr = await db.wordFamilies.where('cefr').equals(filters.cefr).toArray()
      base = byCefr.filter(f => f.category === filters.category)
    } else if (filters.cefr) {
      base = await db.wordFamilies.where('cefr').equals(filters.cefr).toArray()
    } else if (filters.category) {
      base = await db.wordFamilies.where('category').equals(filters.category).toArray()
    } else {
      base = await db.wordFamilies.toArray()
    }

    if (!debouncedQuery) {
      return base.sort((a, b) => a.rootWord.localeCompare(b.rootWord))
    }

    const q = debouncedQuery.toLowerCase()
    return base
      .filter(f =>
        f.rootWord.toLowerCase().includes(q) ||
        f.forms.some(form => form.word.toLowerCase().includes(q)) ||
        f.forms.some(form => form.definition.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        const aExact = a.rootWord.toLowerCase() === q ? 0 : 1
        const bExact = b.rootWord.toLowerCase() === q ? 0 : 1
        return aExact - bExact || a.rootWord.localeCompare(b.rootWord)
      })
  }, [debouncedQuery, filters.cefr, filters.category])

  return {
    results: results ?? [],
    filters,
    isLoading: results === undefined,
    setQuery: (query: string) => setFilters(f => ({ ...f, query })),
    setCefr: (cefr: CefrLevel | '') => setFilters(f => ({ ...f, cefr })),
    setCategory: (category: WordCategory | '') => setFilters(f => ({ ...f, category })),
  }
}
