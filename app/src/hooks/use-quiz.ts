import { useState, useCallback } from 'react'
import { db } from '@/db/vocab-database'
import { maskWord } from '@/utils/word-masking'
import type { WordFamily, CefrLevel } from '@/types/vocab-types'

export interface QuizSlot {
  word: string
  visible: string
  hidden: string
  maskLen: number
  pos: string
  definition: string
  userInput: string
  status: 'idle' | 'correct' | 'wrong'
}

export interface QuizRound {
  familyId: string
  rootWord: string
  cefr: string
  etymology?: string
  slots: QuizSlot[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRound(family: WordFamily): QuizRound {
  const slots: QuizSlot[] = family.forms
    .map(f => {
      const { visible, hidden, maskLen } = maskWord(f.word)
      return { word: f.word, visible, hidden, maskLen, pos: f.pos, definition: f.definition, userInput: '', status: 'idle' as const }
    })
    .filter(s => s.maskLen > 0)

  return {
    familyId: family.id,
    rootWord: family.rootWord,
    cefr: family.cefr,
    etymology: family.etymology,
    slots,
  }
}

export function useQuiz() {
  const [rounds, setRounds] = useState<QuizRound[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalSlots, setTotalSlots] = useState(0)

  const loadQuiz = useCallback(async (cefrFilter?: CefrLevel, count = 10) => {
    setIsLoading(true)
    setIsDone(false)
    setCurrentIndex(0)
    setIsSubmitted(false)
    setTotalCorrect(0)
    setTotalSlots(0)

    const all = cefrFilter
      ? await db.wordFamilies.where('cefr').equals(cefrFilter).toArray()
      : await db.wordFamilies.toArray()

    const selected = shuffle(all).slice(0, count)
    const built = selected.map(buildRound).filter(r => r.slots.length > 0)

    setRounds(built)
    setTotalSlots(built.reduce((sum, r) => sum + r.slots.length, 0))
    setIsLoading(false)
  }, [])

  const updateInput = useCallback((slotIndex: number, value: string) => {
    setRounds(prev => {
      const next = [...prev]
      const round = { ...next[currentIndex], slots: [...next[currentIndex].slots] }
      round.slots[slotIndex] = { ...round.slots[slotIndex], userInput: value }
      next[currentIndex] = round
      return next
    })
  }, [currentIndex])

  const submitRound = useCallback(() => {
    setRounds(prev => {
      const next = [...prev]
      const round = { ...next[currentIndex], slots: [...next[currentIndex].slots] }
      let correct = 0
      round.slots = round.slots.map(slot => {
        const isCorrect = slot.userInput.trim().toLowerCase() === slot.hidden.toLowerCase()
        if (isCorrect) correct++
        return { ...slot, status: isCorrect ? 'correct' : 'wrong' }
      })
      next[currentIndex] = round
      setTotalCorrect(c => c + correct)
      return next
    })
    setIsSubmitted(true)
  }, [currentIndex])

  const nextRound = useCallback(() => {
    const next = currentIndex + 1
    if (next >= rounds.length) {
      setIsDone(true)
    } else {
      setCurrentIndex(next)
      setIsSubmitted(false)
    }
  }, [currentIndex, rounds.length])

  const reset = useCallback(() => {
    setRounds([])
    setCurrentIndex(0)
    setIsSubmitted(false)
    setIsDone(false)
    setTotalCorrect(0)
    setTotalSlots(0)
  }, [])

  return {
    round: rounds[currentIndex] ?? null,
    roundIndex: currentIndex,
    totalRounds: rounds.length,
    isSubmitted,
    isDone,
    isLoading,
    totalCorrect,
    totalSlots,
    loadQuiz,
    updateInput,
    submitRound,
    nextRound,
    reset,
  }
}
