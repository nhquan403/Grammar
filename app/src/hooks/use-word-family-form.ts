import { useState, useCallback } from 'react'
import type { CefrLevel, WordCategory, PartOfSpeech } from '@/types/vocab-types'
import {
  addCustomWordFamily,
  updateCustomWordFamily,
  autoTranslateToVietnamese,
} from '@/services/custom-word-family-service'

export interface FormEntry {
  _key: string  // local React key only, not DB id
  word: string
  pos: PartOfSpeech
  definition: string
  example: string
  frequency: 'very-common' | 'common' | 'less-common' | 'rare'
}

export interface AffixEntry {
  _key: string
  type: 'prefix' | 'suffix'
  form: string
  meaning: string
}

export interface WordFamilyFormState {
  rootWord: string
  cefr: CefrLevel
  category: WordCategory
  etymology: string
  tagsRaw: string
  forms: FormEntry[]
  affixes: AffixEntry[]
  isSaving: boolean
  translateLoadingKey: string | null
  errors: Record<string, string>
}

function newFormEntry(): FormEntry {
  return { _key: crypto.randomUUID(), word: '', pos: 'noun', definition: '', example: '', frequency: 'common' }
}

function newAffixEntry(): AffixEntry {
  return { _key: crypto.randomUUID(), type: 'suffix', form: '', meaning: '' }
}

const INITIAL: WordFamilyFormState = {
  rootWord: '', cefr: 'B1', category: 'common',
  etymology: '', tagsRaw: '',
  forms: [newFormEntry()],
  affixes: [],
  isSaving: false,
  translateLoadingKey: null,
  errors: {},
}

export function useWordFamilyForm(
  prefill?: Partial<WordFamilyFormState>,
  editId?: string,
) {
  const [state, setState] = useState<WordFamilyFormState>(() => ({
    ...INITIAL,
    ...prefill,
  }))

  const set = useCallback((patch: Partial<WordFamilyFormState>) => {
    setState(s => ({ ...s, ...patch }))
  }, [])

  // Field setters
  const setRootWord = (v: string) => set({ rootWord: v, errors: {} })
  const setCefr = (v: CefrLevel) => set({ cefr: v })
  const setCategory = (v: WordCategory) => set({ category: v })
  const setEtymology = (v: string) => set({ etymology: v })
  const setTagsRaw = (v: string) => set({ tagsRaw: v })

  // Form entries
  const addForm = () => set({ forms: [...state.forms, newFormEntry()] })
  const removeForm = (key: string) =>
    set({ forms: state.forms.filter(f => f._key !== key) })
  const updateForm = (key: string, patch: Partial<FormEntry>) =>
    set({ forms: state.forms.map(f => f._key === key ? { ...f, ...patch } : f) })

  // Affix entries
  const addAffix = () => set({ affixes: [...state.affixes, newAffixEntry()] })
  const removeAffix = (key: string) =>
    set({ affixes: state.affixes.filter(a => a._key !== key) })
  const updateAffix = (key: string, patch: Partial<AffixEntry>) =>
    set({ affixes: state.affixes.map(a => a._key === key ? { ...a, ...patch } : a) })

  // Auto-translate a form's word into Vietnamese definition
  const translateForm = useCallback(async (key: string, word: string) => {
    if (!word.trim()) return
    setState(s => ({ ...s, translateLoadingKey: key }))
    try {
      const vi = await autoTranslateToVietnamese(word)
      setState(s => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [`translate-${key}`]: _removed, ...restErrors } = s.errors
        return {
          ...s,
          translateLoadingKey: null,
          errors: restErrors,
          forms: s.forms.map(f => f._key === key ? { ...f, definition: vi } : f),
        }
      })
    } catch {
      setState(s => ({
        ...s,
        translateLoadingKey: null,
        errors: { ...s.errors, [`translate-${key}`]: 'Không thể dịch tự động. Vui lòng nhập thủ công.' },
      }))
    }
  }, [])

  // Validate and save
  const save = useCallback(async (): Promise<string | null> => {
    const errs: Record<string, string> = {}
    if (!state.rootWord.trim()) errs.rootWord = 'Vui lòng nhập từ gốc'
    state.forms.forEach((f, i) => {
      if (!f.word.trim()) errs[`form-word-${i}`] = 'Vui lòng nhập từ'
      if (!f.definition.trim()) errs[`form-def-${i}`] = 'Vui lòng nhập định nghĩa'
    })
    if (Object.keys(errs).length > 0) {
      set({ errors: errs })
      return null
    }

    set({ isSaving: true, errors: {} })
    try {
      const payload = {
        rootWord: state.rootWord.trim(),
        cefr: state.cefr,
        category: state.category,
        etymology: state.etymology.trim() || undefined,
        tags: state.tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        forms: state.forms.map(({ _key, ...rest }) => ({ ...rest, example: rest.example.trim() || undefined })),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        affixes: state.affixes.map(({ _key, ...rest }) => rest),
      }

      if (editId) {
        await updateCustomWordFamily(editId, payload)
        return editId
      } else {
        return await addCustomWordFamily(payload)
      }
    } finally {
      set({ isSaving: false })
    }
  }, [state, editId, set])

  return {
    state, set,
    setRootWord, setCefr, setCategory, setEtymology, setTagsRaw,
    addForm, removeForm, updateForm,
    addAffix, removeAffix, updateAffix,
    translateForm, save,
    newFormEntry, newAffixEntry,
  }
}
