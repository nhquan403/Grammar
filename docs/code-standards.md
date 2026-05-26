# Code Standards & Conventions

**Version:** 1.0  
**Last Updated:** May 2026  
**Enforced By:** TypeScript (strict mode), ESLint, peer review

---

## Principles

1. **YAGNI (You Aren't Gonna Need It):** Don't add code for hypothetical future features
2. **KISS (Keep It Simple, Stupid):** Prefer obvious solutions over clever ones
3. **DRY (Don't Repeat Yourself):** Extract reusable logic into functions/hooks
4. **Type Safety:** Strict TypeScript; no `any` unless unavoidable (with comment)
5. **Testability:** Write code that can be tested in isolation
6. **Accessibility:** Components work on keyboard + screen readers; colors accessible

---

## File Organization & Naming

### Directory Structure

```
app/src/
├── types/                # TypeScript interfaces + unions
├── db/                   # Dexie database schema
├── data/                 # Static data (seed word families)
├── services/             # Business logic (external to React)
├── utils/                # Pure utilities (algorithms, formatting)
├── hooks/                # Custom React hooks
├── pages/                # Page components (route handlers)
├── components/           # UI components (layout, flashcard, quiz, word, stats, ui)
├── lib/                  # Library utilities (cn, etc.)
├── index.css             # Global styles
├── App.tsx               # Router + layout shell
└── main.tsx              # Entry point
```

### File Naming Convention

| File Type | Convention | Example |
|-----------|-----------|---------|
| TypeScript/React | kebab-case | `sm2-algorithm.ts`, `word-family-card.tsx`, `use-review-queue.ts` |
| Interfaces | PascalCase in file | interface `WordFamily` in `vocab-types.ts` |
| React Components | PascalCase filename + PascalCase export | `HomePage.tsx` exports `function HomePage()` |
| Hooks | kebab-case filename, `useXxx` export | `use-review-queue.ts` exports `function useReviewQueue()` |
| Utilities | kebab-case filename | `sm2-algorithm.ts`, `word-masking.ts` |
| CSS | Global in `index.css`; scoped via class names | `.card`, `.cefr-A1`, `.pos-noun` |

**Rationale:** kebab-case files aid discoverability for LLM tools (Grep, Glob); PascalCase exports match React conventions.

---

## TypeScript Standards

### Strict Mode

All files compiled with `strict: true` in `tsconfig.json`:
- `noImplicitAny` — no implicit `any` type
- `strictNullChecks` — null/undefined checked explicitly
- `strictFunctionTypes` — strict callback types
- `noImplicitThis` — explicit `this` type
- `alwaysStrict` — use strict pragma

### Type Declarations

**Always type function signatures:**
```ts
// ✓ Good
function addCustomWordFamily(data: Omit<WordFamily, 'id' | 'isCustom'>): Promise<string> {
  // ...
}

// ✗ Bad
function addCustomWordFamily(data) {  // data type unknown
  // ...
}
```

**Use interfaces for objects, not `type` (unless union):**
```ts
// ✓ Good
interface WordFamily {
  id: string
  rootWord: string
  forms: WordForm[]
}

// ✓ Good (union type)
type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

// ✗ Avoid
type WordFamily = {
  id: string
  rootWord: string
  forms: WordForm[]
}
```

**Avoid `any` at all costs:**
```ts
// ✗ Never
function process(data: any) { }

// ✓ Good
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'id' in data) {
    // now narrowed safely
  }
}
```

### Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Variables/functions | camelCase | `easeFactor`, `generateFamilyId()` |
| Classes (rare) | PascalCase | `VocabDatabase` |
| React components | PascalCase | `HomePage`, `WordFamilyCard` |
| Interfaces | PascalCase | `WordFamily`, `ReviewStats` |
| Union types | camelCase | `partOfSpeech`, `cefrLevel` |
| Constants | UPPER_SNAKE_CASE | `SEED_WORD_FAMILIES`, `MAX_INTERVAL_DAYS` |
| Private methods/fields | `_prefix` | `_calculateStreak()` |

---

## React & Component Standards

### Functional Components Only

All components are functional (no class components):

```ts
// ✓ Good
export function HomePage() {
  const { streak } = useUserStats()
  return <div>{streak}</div>
}

// ✗ Bad (class component)
export class HomePage extends React.Component { }
```

### Props Typing

**Always define props interface:**
```ts
// ✓ Good
interface WordFamilyCardProps {
  family: WordFamily
  onSelect?: (id: string) => void
  isSelected?: boolean
}

export function WordFamilyCard({ family, onSelect, isSelected }: WordFamilyCardProps) {
  return <div onClick={() => onSelect?.(family.id)}>{family.rootWord}</div>
}

// ✗ Bad
export function WordFamilyCard({ family, onSelect, isSelected }) {  // no types
  return <div>{family.rootWord}</div>
}

// ✗ Bad (inline props)
export function WordFamilyCard(props: { family: WordFamily }) { }  // use interface instead
```

### Hook Rules

**Custom hooks follow `useXxx` convention:**
```ts
// ✓ Good
export function useReviewQueue() {
  const [queue, setQueue] = useState<ReviewItem[]>([])
  // ...
  return { queue, loadQueue, rate }
}

// ✗ Bad
export function getReviewQueue() {  // not a hook (doesn't use hooks)
  return ReviewQueue
}
```

**Dependencies array in hooks must be explicit:**
```ts
// ✓ Good
useEffect(() => {
  loadQueue()
}, [])  // load once on mount

useEffect(() => {
  updateStats(streak)
}, [streak])  // update when streak changes

// ✗ Bad
useEffect(() => {
  loadQueue()
})  // no dependency array; runs every render (infinite loop risk)
```

### Component Composition

**Split large components (≥150 LOC) into smaller ones:**
```ts
// ✓ Good: separated concerns
function StudyPage() {
  return (
    <div>
      <FlashcardDisplay />
      <FlashcardRatingButtons />
    </div>
  )
}

function FlashcardDisplay() { /* 50 LOC */ }
function FlashcardRatingButtons() { /* 50 LOC */ }

// ✗ Bad: monolithic
function StudyPage() {
  // 200+ LOC: display + buttons + logic all mixed
}
```

### Props Drilling

**Avoid prop drilling; use hooks instead:**
```ts
// ✓ Good: hook provides value
function QuizRound() {
  const { answers, updateAnswer } = useQuiz()
  return <QuizWordSlot answer={answers[0]} onChange={updateAnswer} />
}

// ✗ Bad: drilling through 5+ layers
<Page family={family} onUpdate={onUpdate}>
  <Section family={family} onUpdate={onUpdate}>
    <Card family={family} onUpdate={onUpdate}>
      <Input onChange={onUpdate} />
    </Card>
  </Section>
</Page>
```

---

## State Management Standards

### Local Component State

**Use `useState` for component-only state:**
```ts
function SearchBox() {
  const [text, setText] = useState('')
  return <input value={text} onChange={e => setText(e.target.value)} />
}
```

### Derived State

**Use `useMemo` for computed values:**
```ts
// ✓ Good
const masteredCount = useMemo(() => {
  return reviewStats.filter(s => s.repetitions >= 5).length
}, [reviewStats])

// ✗ Bad (recalculated every render)
const masteredCount = reviewStats.filter(s => s.repetitions >= 5).length
```

### Async Data

**Use custom hooks with `useEffect` + `useState`:**
```ts
export function useReviewQueue() {
  const [queue, setQueue] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadQueue = useCallback(async () => {
    setLoading(true)
    try {
      const items = await getDueReviews(20)
      setQueue(items)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { queue, loading, error, loadQueue }
}
```

### Dexie Reactive Queries

**Use `useLiveQuery` for reactive IndexedDB queries:**
```ts
import { useLiveQuery } from 'dexie-react-hooks'

export function useUserStats() {
  const progress = useLiveQuery(() => db.userProgress.get('singleton'))

  return {
    streak: progress?.currentStreak ?? 0,
    masteredCount: progress?.masteredCount ?? 0,
  }
}
```

---

## Service & Utility Standards

### Services (Business Logic)

**Export pure functions; no side effects (except DB):**
```ts
// ✓ Good
export async function submitReview(familyId: string, rating: RatingLabel): Promise<void> {
  const stats = await db.reviewStats.get(familyId)
  if (!stats) throw new Error('Review stats not found')

  const { easeFactor, interval, repetitions, nextReviewDate } = calculateSM2({
    quality: ratingToQuality(rating),
    easeFactor: stats.easeFactor,
    interval: stats.interval,
    repetitions: stats.repetitions,
  })

  await db.transaction('rw', [db.reviewStats], async () => {
    await db.reviewStats.update(familyId, {
      easeFactor,
      interval,
      repetitions,
      nextReviewDate,
    })
  })
}

// ✗ Bad (hides logic in component)
function StudyPage() {
  const handleRate = async (rating) => {
    // All SM-2 logic here = hard to test, reuse, reason about
  }
}
```

### Utilities (Pure Functions)

**No side effects; deterministic input → output:**
```ts
// ✓ Good: pure function
export function calculateSM2({ quality, easeFactor, interval, repetitions }): SM2Result {
  const newEF = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (...)))
  return { easeFactor: newEF, interval: newInterval, repetitions: newRep, nextReviewDate }
}

// ✗ Bad: side effect (database mutation)
export function calculateSM2(stats: ReviewStats): SM2Result {
  const result = { /* calculation */ }
  db.reviewStats.update(stats.familyId, result)  // side effect!
  return result
}
```

### Error Handling

**Use try-catch; provide user-friendly error messages:**
```ts
// ✓ Good
export async function addCustomWordFamily(data: Omit<WordFamily, 'id' | 'isCustom'>): Promise<string> {
  try {
    const id = generateFamilyId(data.rootWord)
    const family: WordFamily = { ...data, id, isCustom: true }

    await db.transaction('rw', [db.wordFamilies, db.reviewStats], async () => {
      await db.wordFamilies.add(family)
      await db.reviewStats.add({
        familyId: id,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: Date.now(),
        correctCount: 0,
        wrongCount: 0,
        addedAt: Date.now(),
      })
    })

    return id
  } catch (err) {
    console.error('Failed to add word family:', err)
    throw new Error('Không thể thêm từ. Vui lòng thử lại.')
  }
}

// ✗ Bad (swallows error; no context)
export async function addCustomWordFamily(data) {
  try {
    // ...
  } catch (err) {
    console.log('error')  // no context for debugging
  }
}
```

---

## CSS & Styling Standards

### Design System: CSS Custom Properties

**All colors/shadows defined in `index.css` as custom properties:**

```css
/* Light mode (in @theme block) */
--color-background: rgb(248 250 252)
--color-foreground: rgb(15 23 42)
--color-card: rgb(255 255 255)
--color-primary: rgb(99 102 241)
--color-pos-noun: rgb(59 130 246)
--color-pos-verb: rgb(168 85 247)
--color-pos-adj: rgb(249 115 22)
--color-pos-adv: rgb(20 184 166)

--shadow-card: 0 1px 3px rgba(0,0,0,0.06)
--shadow-fab: 0 4px 20px rgba(99,102,241,0.45)

/* Dark mode (in .dark selector) */
.dark {
  --color-background: rgb(10 15 28)
  --color-foreground: rgb(241 245 249)
  --color-card: rgb(20 28 46)
  /* etc. */
}
```

**Usage in components:**

```ts
// ✓ Good: use CSS variables
<button style={{ background: 'var(--color-primary)' }}>Study</button>

// ✓ Good: use Tailwind utility (based on @theme)
<button className="bg-primary text-primary-foreground">Study</button>

// ✗ Bad: hardcoded colors
<button style={{ background: '#6366F1' }}>Study</button>
```

### Tailwind CSS Classes

**Use Tailwind utilities for layout, spacing, responsive:**

```ts
// ✓ Good: responsive, semantic classes
<div className="p-4 mb-6 rounded-lg border border-border bg-card shadow-card">
  <h2 className="text-lg font-semibold text-foreground mb-2">Title</h2>
</div>

// ✓ Good: use Tailwind utilities
<button className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90">
  Click me
</button>

// ✗ Bad: inline styles
<div style={{ padding: '16px', marginBottom: '24px', borderRadius: '12px' }}>
  Title
</div>
```

### Global Styles

**Use `.card` for common card styling; extend with child utilities:**

```css
.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.card-interactive:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
```

**Usage:**
```ts
<div className="card p-4">
  <p>Card content</p>
</div>

<button className="card card-interactive">
  Clickable card
</button>
```

### POS & CEFR Badges

**Predefined badge classes:**

```css
/* POS colors */
.pos-noun { color: var(--color-pos-noun); }
.pos-verb { color: var(--color-pos-verb); }
.pos-adjective { color: var(--color-pos-adj); }
.pos-adverb { color: var(--color-pos-adv); }

/* CEFR colors (Tailwind classes) */
.cefr-A1 { /* pale blue */ }
.cefr-A2 { /* light blue */ }
.cefr-B1 { /* medium blue */ }
.cefr-B2 { /* dark blue */ }
.cefr-C1 { /* dark purple */ }
.cefr-C2 { /* almost black */ }
```

**Usage:**
```ts
<span className="pos-verb">verb</span>
<span className="cefr-B1 px-2 py-1 rounded text-white">B1</span>
```

### Dark Mode

**Applied automatically via system preference; toggle via `useDarkMode()`:**

```ts
// In App.tsx
useDarkMode()  // Adds/removes .dark class on <html>

// In CSS: define dark mode variables
.dark {
  --color-background: rgb(10 15 28);
  --color-foreground: rgb(241 245 249);
  /* ... */
}

// Components inherit automatically
<div style={{ background: 'var(--color-background)' }}>
  Works in both light & dark modes
</div>
```

---

## Database & Dexie Standards

### Schema Definition

**Always use version migrations for schema changes:**
```ts
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

    this.version(2).stores({
      wordFamilies: '&id, rootWord, cefr, category, *tags',
      reviewStats: '&familyId, nextReviewDate, easeFactor, repetitions, addedAt',
      userProgress: '&id'
    }).upgrade(async tx => {
      // Migration: remove all !isCustom entries
      const builtInIds = await tx.table<WordFamily>('wordFamilies')
        .filter(f => !f.isCustom)
        .primaryKeys()
      await tx.table('wordFamilies').bulkDelete(builtInIds as string[])
      await tx.table('reviewStats').bulkDelete(builtInIds as string[])
    })
  }
}
```

### Transactions

**Use transactions for multi-table mutations:**
```ts
// ✓ Good: atomic
await db.transaction('rw', [db.wordFamilies, db.reviewStats], async tx => {
  await tx.table('wordFamilies').add(family)
  await tx.table('reviewStats').add(stats)
})

// ✗ Bad: not atomic; family added but stats might fail
await db.wordFamilies.add(family)
await db.reviewStats.add(stats)
```

### Queries

**Use appropriate indexes for performance:**
```ts
// ✓ Good: leverages nextReviewDate index
const dueItems = await db.reviewStats
  .where('nextReviewDate')
  .belowOrEqual(Date.now())
  .limit(20)
  .toArray()

// ✓ Good: leverages rootWord index for starts-with
const results = await db.wordFamilies
  .where('rootWord')
  .startsWith('cre')
  .toArray()

// ✓ Good: leverages cefr index
const b1Families = await db.wordFamilies
  .where('cefr')
  .equals('B1')
  .toArray()

// ✗ Bad: full table scan
const results = await db.wordFamilies.toArray()
  .then(all => all.filter(f => f.rootWord.startsWith('cre')))
```

---

## Testing Standards (Future)

### Unit Tests

**Test pure utilities in isolation:**
```ts
describe('calculateSM2', () => {
  it('should increase interval for quality >= 3', () => {
    const result = calculateSM2({
      quality: 4,
      easeFactor: 2.5,
      interval: 6,
      repetitions: 1,
    })
    expect(result.repetitions).toBe(2)
    expect(result.interval).toBeGreaterThan(6)
  })

  it('should reset repetitions for quality < 3', () => {
    const result = calculateSM2({
      quality: 1,
      easeFactor: 2.5,
      interval: 6,
      repetitions: 2,
    })
    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
  })
})
```

### Integration Tests

**Test service methods with real Dexie instance:**
```ts
describe('submitReview', () => {
  it('should update ReviewStats and UserProgress', async () => {
    // Setup: add family + initial stats
    const familyId = await addCustomWordFamily(testData)
    
    // Action: submit review
    await submitReview(familyId, 'good')
    
    // Assert: stats updated
    const stats = await db.reviewStats.get(familyId)
    expect(stats.repetitions).toBe(1)
    expect(stats.nextReviewDate).toBeGreaterThan(Date.now())
  })
})
```

---

## Linting & Formatting

### ESLint Configuration

**Rules enforced:**
- `no-console` (warn) — allow console but flag for cleanup
- `no-unused-vars` — strict; unused code is debt
- `react-hooks/rules-of-hooks` — hooks only in hooks + components
- `react-hooks/exhaustive-deps` — dependency arrays explicit
- `prefer-const` — use const over let when reassignment unlikely
- `eqeqeq` — strict equality (=== not ==)

**Run before commit:**
```bash
npm run lint
```

### Code Formatting

**No Prettier in this project.** Manual formatting expected:
- 2-space indentation (TypeScript default)
- Semicolons always
- Single quotes for strings (except JSX attributes)
- Max line length: ~100 characters (wrap long lines)

---

## Documentation Standards

### Code Comments

**Comment the 'why', not the 'what':**
```ts
// ✓ Good: explains intent
// Guard against update/delete of built-in families.
// Users can only modify custom (isCustom: true) entries.
if (!existing?.isCustom) {
  throw new Error('Cannot edit built-in family')
}

// ✗ Bad: obvious from code
// Check if isCustom is true
if (!existing?.isCustom) {
  throw new Error('Cannot edit built-in family')
}
```

**JSDoc for public functions:**
```ts
/**
 * Apply SM-2 spaced repetition algorithm.
 * @param quality Quality rating 0–5 (0=blackout, 3+=correct, <3=failed)
 * @returns Updated ease factor, interval, repetitions, next review date
 */
export function calculateSM2({ quality, easeFactor, interval, repetitions }: SM2Input): SM2Result {
  // ...
}
```

### Inline Explanations

**For non-obvious logic, explain the algorithm:**
```ts
// Wozniak SM-2: EF' = max(1.3, EF + 0.1 - (5-q)(0.08 + (5-q)×0.02))
const newEF = Math.max(
  1.3,
  easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
)
```

---

## Git & Commit Standards

### Commit Messages

**Follow conventional commits:**
```
feat: add suffix masking quiz feature
fix: correct SM-2 interval calculation for rep=1
refactor: extract quiz scoring to utility
docs: update deployment guide
test: add SM-2 algorithm test cases
chore: update dependencies
```

**No AI references; focus on what changed and why.**

### PR Checklist

- [ ] Code passes ESLint (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] New code has tests (if testable)
- [ ] No console.error calls left (except intentional logging)
- [ ] Dark mode tested
- [ ] Mobile responsive (320px–480px)
- [ ] Commit message follows conventional commits
- [ ] No sensitive data committed

---

## Performance Best Practices

### React Rendering

**Memoize expensive components:**
```ts
import { memo } from 'react'

// ✓ Good: avoids re-render if props unchanged
const WordFamilyCard = memo(({ family }: Props) => {
  return <div>{family.rootWord}</div>
})

// ✗ Bad: renders every time parent renders
function WordFamilyCard({ family }: Props) {
  return <div>{family.rootWord}</div>
}
```

**Use useCallback for stable function references:**
```ts
const handleRate = useCallback((rating: RatingLabel) => {
  submitReview(familyId, rating)
}, [familyId])  // Only recreate if familyId changes

return <button onClick={handleRate}>Rate</button>
```

### Database Queries

**Limit results; use pagination:**
```ts
// ✓ Good: limits to 20 results
const dueItems = await getDueReviews(20)

// ✗ Bad: fetches all (could be 1000+)
const allItems = await db.reviewStats.toArray()
```

**Index all filtered queries:**
```ts
// Index on nextReviewDate in schema
this.version(1).stores({
  reviewStats: '&familyId, nextReviewDate, ...',  // nextReviewDate indexed
})

// Query uses index
db.reviewStats.where('nextReviewDate').belowOrEqual(now)
```

---

## Accessibility Standards

### Keyboard Navigation

**All interactive elements keyboard-accessible:**
```ts
// ✓ Good: button is focusable, Enter/Space triggers
<button onClick={handleClick}>Study</button>

// ✗ Bad: div not keyboard-accessible by default
<div onClick={handleClick} style={{ cursor: 'pointer' }}>Study</div>
```

### Color Contrast

**Use design system colors; verify WCAG AA in light + dark modes:**
```ts
// ✓ Good: design system colors have ≥4.5:1 contrast
<div className="bg-card text-foreground">Text is readable</div>

// ✗ Bad: low contrast
<div style={{ background: '#f0f0f0', color: '#999999' }}>Hard to read</div>
```

### Icons

**Icons have semantic labels:**
```ts
// ✓ Good: aria-label provides context
<button aria-label="Dark mode toggle">
  {isDark ? <Moon /> : <Sun />}
</button>

// ✗ Bad: icon only, unclear purpose
<button>
  <Moon />
</button>
```

---

## Summary Checklist

- [ ] File named in kebab-case; self-documenting
- [ ] TypeScript strict mode; no `any`
- [ ] Component ≤ 150 LOC (split if larger)
- [ ] Hooks follow `useXxx` convention
- [ ] Props defined via interface
- [ ] Services are pure functions
- [ ] Utilities are deterministic
- [ ] Database queries use indexes
- [ ] Transactions for multi-table mutations
- [ ] CSS uses design system variables
- [ ] Dark mode tested
- [ ] Mobile responsive
- [ ] Code commented for 'why', not 'what'
- [ ] No console.error left behind
- [ ] ESLint passes
- [ ] Commit message follows conventional commits
