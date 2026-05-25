/**
 * Determines how many trailing characters to mask based on word length.
 * ≤4 chars → 2 | 5–6 chars → 3 | ≥7 chars → 4
 */
export function getMaskLength(word: string): number {
  const len = word.length
  if (len <= 4) return 2
  if (len <= 6) return 3
  return 4
}

/**
 * Splits a word into visible prefix and hidden suffix.
 * Words shorter than 3 chars are returned unmasked (hidden = '').
 */
export function maskWord(word: string): { visible: string; hidden: string; maskLen: number } {
  if (word.length < 3) return { visible: word, hidden: '', maskLen: 0 }
  const maskLen = getMaskLength(word)
  return {
    visible: word.slice(0, word.length - maskLen),
    hidden: word.slice(word.length - maskLen),
    maskLen,
  }
}
