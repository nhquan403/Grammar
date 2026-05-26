# System Architecture

**Version:** 1.0  
**Last Updated:** May 2026

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     React 19 SPA (Vite)                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ React Router v6 (SPA Routes)                            │   │
│  │  /  /study  /browse  /word/add  /word/:id  /quiz  ...  │   │
│  └──────────────────┬──────────────────────────────────────┘   │
│                     │                                            │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │ Pages (React Components)                                │   │
│  │  HomePage, StudyPage, BrowsePage, QuizPage, StatsPage  │   │
│  └──────────────────┬──────────────────────────────────────┘   │
│                     │                                            │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │ Custom Hooks                                            │   │
│  │  useReviewQueue, useQuiz, useUserStats, useWordSearch  │   │
│  │  useDarkMode, usePwaInstallPrompt, useWordFamilyForm   │   │
│  └──────────────────┬──────────────────────────────────────┘   │
│                     │                                            │
│     ┌───────────────┼───────────────┐                           │
│     │               │               │                           │
│  ┌──▼────────┐  ┌──▼────────┐  ┌──▼────────┐                   │
│  │ Services  │  │ Utils     │  │ Components│                   │
│  │           │  │           │  │           │                   │
│  │ Custom WF │  │ SM-2 Algo │  │ Flashcard │                   │
│  │ Review    │  │ Word Mask │  │ Quiz      │                   │
│  │ Schedule  │  │           │  │ Stats     │                   │
│  └──┬────────┘  └────────────┘  └───────────┘                   │
│     │                                                            │
│  ┌──▼──────────────────────────────────────────────────────┐   │
│  │ Dexie.js (IndexedDB Wrapper) — Reactive Queries        │   │
│  │                                                         │   │
│  │  Transactions:                                          │   │
│  │  • addCustomWordFamily(WordFamily)                      │   │
│  │  • updateCustomWordFamily(id, updates)                  │   │
│  │  • submitReview(familyId, rating) — atomic SM-2 update  │   │
│  │  • importSeedWordFamilies()                             │   │
│  └──┬──────────────────────────────────────────────────────┘   │
│     │                                                            │
│  ┌──▼──────────────────────────────────────────────────────┐   │
│  │ IndexedDB (Browser Storage)                             │   │
│  │                                                         │   │
│  │  wordFamilies (197 seed + user-added custom)            │   │
│  │  reviewStats (SM-2 state per family)                    │   │
│  │  userProgress (singleton: streak, mastered count)       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
         │
         │ (Workbox Service Worker)
         │
    ┌────▼─────┐
    │   Cache   │
    │  (Offline)│
    └───────────┘
```

---

## Component Architecture

### Page Layer (Pages)

| Page | Route | Responsibility | Key Hooks |
|------|-------|-----------------|-----------|
| HomePage | `/` | Dashboard: daily stats, due count, quick actions | `useUserStats` |
| StudyPage | `/study` | Flashcard swipe interface, SM-2 rating | `useReviewQueue` |
| BrowsePage | `/browse` | Search + filter word families | `useWordSearch` |
| WordDetailPage | `/word/:familyId` | Full family details + review stats | Dexie live query |
| WordFamilyFormPage | `/word/add` / `/word/edit/:id` | Add/edit word family form | `useWordFamilyForm` |
| QuizPage | `/quiz` | Suffix quiz setup + play | `useQuiz` |
| StatsPage | `/stats` | Detailed progress (streak, mastery, CEFR) | `useUserStats` |

### Component Layer (UI Components)

**Layout:**
- `AppHeader` — Title + dark mode toggle
- `MobileBottomNav` — 4-tab navigation (Home, Study, Browse, Stats)
- `PwaInstallBanner` — iOS/Android install prompt + instructions

**Flashcard:**
- `FlashcardSwipeable` — Gesture detection (swipe left/right)
- `FlashcardWordFamilyDisplay` — Shows current family forms + definitions
- `FlashcardRatingButtons` — again / hard / good / easy buttons
- `StudyCompletionScreen` — "No more cards today" message

**Quiz:**
- `QuizRoundCard` — Single quiz round container
- `QuizWordSlot` — Input field for one word form suffix + hint
- `QuizResultScreen` — Score display + breakdown per word

**Word:**
- `WordFamilyCard` — Compact card (search/browse results)
- `WordFormSection` — Display all forms (noun, verb, adj, adv)
- `AffixFormSection` — Display affixes (prefix/suffix list)
- `CefrFilterChips` — CEFR level filter buttons
- `WordSearchInput` — Search box with real-time input

**Stats:**
- `StreakDisplay` — Current + longest streak badges
- `MasteryProgressBar` — Progress bar (new / learning / mastered)
- `CefrDistributionChart` — Bar chart: families per CEFR level

**UI (Reusable):**
- `Badge` — Label component (POS, CEFR, category)
- `Button` — Primary / secondary / ghost variants
- `Card` — Container with border + shadow + optional hover
- `Progress` — Linear progress bar
- `DarkModeToggle` — Light/dark mode button
- `PwaInstallBanner` — PWA install instructions

### Service Layer

#### `custom-word-family-service.ts`
- `generateFamilyId(rootWord)` — Create unique ID from root + timestamp
- `addCustomWordFamily(data)` — Add + bootstrap ReviewStats atomically
- `updateCustomWordFamily(id, data)` — Update (user-added only; guards against built-in)
- `deleteCustomWordFamily(id)` — Delete + clean up ReviewStats atomically
- `importSeedWordFamilies()` — Bulk-import seed dataset; idempotent

#### `review-schedule-service.ts`
- `getDueReviews(limit)` — Query reviews where `nextReviewDate ≤ now`
- `submitReview(familyId, rating)` — Apply SM-2 algorithm; update ReviewStats + UserProgress atomically

### Hook Layer

#### `useReviewQueue`
- State: queue of due ReviewItems, current index, completed count
- Methods: `loadQueue()`, `rate(rating)`
- Returns: current card, total, completed, loading, isDone

#### `useQuiz`
- State: quiz config (CEFR filter, question count), rounds, answers, score
- Methods: `initializeQuiz()`, `updateAnswer()`, `submitAnswer()`, `calculateScore()`

#### `useUserStats`
- Queries: UserProgress, ReviewStats aggregations
- Returns: totalFamiliesStudied, streaks, masteredCount, CEFR distribution

#### `useWordSearch`
- State: search text, selected filters (CEFR, category)
- Methods: `search()`, `filterByCategory()`, `filterByCefr()`
- Returns: filtered families, loading

#### `useWordFamilyForm`
- State: form data (rootWord, forms, affixes, CEFR, category, tags)
- Methods: `updateField()`, `submit()`
- Returns: form state, validation errors, loading

#### `useDarkMode`
- Init: detect system preference
- Methods: `toggle()`
- Side effect: apply `.dark` class to `<html>`

#### `usePwaInstallPrompt`
- State: showBanner, isIOS
- Methods: `install()`, `dismiss()`
- Side effect: listen to `beforeinstallprompt` event

---

## Data Model

### TypeScript Interfaces (from `types/vocab-types.ts`)

```ts
type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'other'
type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
type WordCategory = 'common' | 'academic' | 'business' | 'ielts' | 'toefl'

interface WordForm {
  word: string
  pos: PartOfSpeech
  definition: string
  example?: string
  frequency: 'very-common' | 'common' | 'less-common' | 'rare'
}

interface WordAffix {
  type: 'prefix' | 'suffix'
  form: string
  meaning: string
}

interface WordFamily {
  id: string
  rootWord: string
  etymology?: string
  forms: WordForm[]
  affixes: WordAffix[]
  cefr: CefrLevel
  category: WordCategory
  tags: string[]
  isCustom?: boolean
}

interface ReviewStats {
  familyId: string
  easeFactor: number           // Current SM-2 ease factor (1.3–5+)
  interval: number             // Days until next review
  repetitions: number           // Count of successful reviews (≥ 3 quality)
  lastReviewDate: number        // Timestamp
  nextReviewDate: number        // Timestamp of next due date
  correctCount: number
  wrongCount: number
  addedAt: number
}

interface UserProgress {
  id: 'singleton'
  totalFamiliesStudied: number
  totalReviewsDone: number
  masteredCount: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: number
}
```

### Database Schema (Dexie v2)

**VocabFamilyDB** (IndexedDB):

```ts
class VocabDatabase extends Dexie {
  wordFamilies!: Table<WordFamily>
  reviewStats!: Table<ReviewStats>
  userProgress!: Table<UserProgress>
}

// Version 1
version(1).stores({
  wordFamilies: '&id, rootWord, cefr, category, *tags',
  reviewStats: '&familyId, nextReviewDate, easeFactor, repetitions, addedAt',
  userProgress: '&id'
})

// Version 2 (migration)
version(2).stores({...}).upgrade(async tx => {
  // Remove all !isCustom word families (built-in from v1)
  // Idempotent: v2 → v3 skips this step
})
```

**Index Design:**
- `wordFamilies`: Primary key `id`; secondary indexes on `rootWord` (search), `cefr` (filter), `category` (filter), `*tags` (multi-valued)
- `reviewStats`: Primary key `familyId`; secondary indexes on `nextReviewDate` (due cards), `easeFactor` (sorting), `repetitions` (mastery), `addedAt` (recency)
- `userProgress`: Single record; no secondary indexes

**Query Patterns:**

| Purpose | Query | Performance |
|---------|-------|-------------|
| Due reviews | `reviewStats.where('nextReviewDate').belowOrEqual(now).limit(20)` | O(log n) on `nextReviewDate` index |
| Search word | `wordFamilies.where('rootWord').startsWith('cre')` | O(log n) on `rootWord` index |
| Filter CEFR | `wordFamilies.where('cefr').equals('A2')` | O(log n) on `cefr` index |
| Stats aggregation | `reviewStats.toArray()` → JS map/reduce | O(n) full scan; cached in UserProgress |
| Add family | Dexie transaction: add to `wordFamilies` + `reviewStats` | ACID guaranteed |

---

## State Management

### Architecture

**No Redux/Zustand.** React hooks + Dexie reactive queries only:

1. **Component-local state** → `useState` (form inputs, UI toggles)
2. **Derived state** → `useMemo` (computed stats, filtered lists)
3. **Async state** → Custom hooks (`useReviewQueue`, `useUserStats`) + Dexie `useQuery`, `useLiveQuery`
4. **Persistence** → IndexedDB + Dexie transactions (ACID)

### Data Flow Example: Submitting a Review

```
User clicks "good" button
      ↓
StudyPage.handleRating('good')
      ↓
useReviewQueue.rate('good')
      ↓
submitReview(familyId='word-create-123', rating='good')
      ↓
[services/review-schedule-service.ts]
  1. Get current ReviewStats from DB
  2. Calculate SM-2: quality=4 → new EF, interval, nextReviewDate
  3. Get UserProgress (singleton)
  4. Update streak if qualified (lastActivityDate == today - 1)
  5. Atomic transaction:
     - UPDATE reviewStats SET easeFactor, interval, repetitions, nextReviewDate
     - UPDATE userProgress SET totalReviewsDone++, streak, lastActivityDate
      ↓
[DB persisted]
      ↓
[Dexie reactive queries trigger]
  useReviewQueue.loadQueue() → re-fetch due reviews
  useUserStats() → re-calculate streak
      ↓
[Components re-render]
```

---

## Algorithm: SM-2 Spaced Repetition

### Implementation (`utils/sm2-algorithm.ts`)

```ts
export function calculateSM2({ quality, easeFactor, interval, repetitions }): SM2Result {
  const newEF = Math.max(1.3, easeFactor + (0.1 - (5-q)*(0.08 + (5-q)*0.02)))
  
  let newInterval, newRep
  if (quality < 3) {
    newRep = 0          // Reset repetitions
    newInterval = 1     // Review again tomorrow
  } else {
    newRep = repetitions + 1
    if (repetitions === 0) newInterval = 1
    else if (repetitions === 1) newInterval = 6
    else newInterval = Math.round(interval * newEF)
  }
  
  return { easeFactor: newEF, interval: newInterval, repetitions: newRep, nextReviewDate: now + days(newInterval) }
}
```

**Quality Mapping:**
- `again` → quality 1 (incorrect, hard; reset)
- `hard` → quality 3 (correct, hard; standard progression)
- `good` → quality 4 (correct, standard progression)
- `easy` → quality 5 (correct, easy; accelerate)

**Mastery:** When `repetitions ≥ 5` and last `quality ≥ 3`.

---

## Quiz Mechanics

### Algorithm (`utils/word-masking.ts`, `hooks/use-quiz.ts`)

**Suffix Masking:**
```ts
function maskWord(word: string) {
  const len = word.length
  const suffixLen = Math.ceil(len * 0.4)  // Last 30–50% of letters
  const visibleLen = len - suffixLen
  return {
    visible: word.substring(0, visibleLen),
    hidden: word.substring(visibleLen),
  }
}
// "create" → visible="cr", hidden="eate"
```

**Quiz Round:**
1. User selects filters (CEFR, question count)
2. Quiz loads N word families matching filters
3. For each family, for each form in family, create slot with masked word
4. User fills each slot (suffix input)
5. On submit, compare case-insensitively to expected suffix
6. Score = correct slots / total slots

---

## PWA & Offline

### Service Worker (Workbox)

**vite-plugin-pwa** auto-generates:
- Service worker (cached via Workbox)
- Precache manifest (all `.js`, `.css`, `.wasm`, images)
- `manifest.json` (PWA metadata: app name, icons, colors)

**Offline Behavior:**
- First visit: fetch all static assets + cache
- Subsequent visits: serve from cache; fallback to network
- IndexedDB persists across sessions (fully offline-capable)

### Install Prompt (`hooks/use-pwa-install-prompt.ts`)

**Desktop/Android:** `beforeinstallprompt` event triggers banner  
**iOS:** Manual instructions (Share → Add to Home Screen) since Safari doesn't support `beforeinstallprompt`

---

## CSS Design System

### CSS Custom Properties (Light Mode in `index.css`)

```css
--color-background: rgb(248 250 252)       /* Page background */
--color-foreground: rgb(15 23 42)          /* Text */
--color-card: rgb(255 255 255)             /* Card background */
--color-primary: rgb(99 102 241)           /* Buttons, links */
--color-muted-foreground: rgb(100 116 139) /* Hint text */
--color-border: rgb(226 232 240)           /* Dividers */

--color-pos-noun: rgb(59 130 246)          /* POS badge: blue */
--color-pos-verb: rgb(168 85 247)          /* POS badge: purple */
--color-pos-adj: rgb(249 115 22)           /* POS badge: orange */
--color-pos-adv: rgb(20 184 166)           /* POS badge: teal */

--shadow-card: 0 1px 3px rgba(0,0,0,0.06) /* Card shadow */
--shadow-fab: 0 4px 20px rgba(99,102,241,0.45) /* FAB elevation */
```

**Dark Mode:** `.dark` class on `<html>` toggles all values (verified in browser `<html>` element).

### Tailwind CSS v4 with `@theme` Tokens

```css
@theme {
  --color-primary: rgb(99 102 241);
  /* Tailwind reads @theme block and makes tokens available */
}

/* Usage */
<button class="bg-primary text-primary-foreground">Study</button>
```

---

## File Organization

```
app/src/
├── App.tsx                         # Router + layout shell
├── main.tsx                        # React entry + PWA registration
├── index.css                       # Global styles + design system + animations
│
├── types/
│   └── vocab-types.ts              # All TypeScript interfaces
│
├── db/
│   └── vocab-database.ts           # Dexie schema + migrations (v1 → v2)
│
├── data/
│   ├── seed-word-families.json     # 197 word families (bundled)
│   └── seed-word-families.ts       # TypeScript loader
│
├── services/
│   ├── custom-word-family-service.ts    # CRUD + import logic
│   └── review-schedule-service.ts       # SM-2 + streak updates
│
├── hooks/
│   ├── use-review-queue.ts         # Due cards + rating
│   ├── use-quiz.ts                 # Quiz state machine
│   ├── use-user-stats.ts           # Progress aggregation
│   ├── use-word-search.ts          # Search + filter
│   ├── use-word-family-form.ts     # Add/edit form state
│   ├── use-dark-mode.ts            # Dark mode toggle
│   └── use-pwa-install-prompt.ts   # beforeinstallprompt listener
│
├── utils/
│   ├── sm2-algorithm.ts            # Spaced repetition math
│   └── word-masking.ts             # Quiz suffix extraction
│
├── pages/
│   ├── home-page.tsx               # Dashboard
│   ├── study-page.tsx              # Flashcards
│   ├── browse-page.tsx             # Search + filter
│   ├── word-detail-page.tsx        # Word family details
│   ├── word-family-form-page.tsx   # Add/edit form
│   ├── quiz-page.tsx               # Quiz
│   └── stats-page.tsx              # Progress dashboard
│
├── components/
│   ├── layout/
│   │   ├── app-header.tsx
│   │   └── mobile-bottom-nav.tsx
│   ├── flashcard/
│   │   ├── flashcard-swipeable.tsx
│   │   ├── flashcard-word-family-display.tsx
│   │   ├── flashcard-rating-buttons.tsx
│   │   └── study-completion-screen.tsx
│   ├── quiz/
│   │   ├── quiz-round-card.tsx
│   │   ├── quiz-word-slot.tsx
│   │   └── quiz-result-screen.tsx
│   ├── word/
│   │   ├── word-family-card.tsx
│   │   ├── word-form-section.tsx
│   │   ├── affix-form-section.tsx
│   │   ├── cefr-filter-chips.tsx
│   │   └── word-search-input.tsx
│   ├── stats/
│   │   ├── streak-display.tsx
│   │   ├── mastery-progress-bar.tsx
│   │   └── cefr-distribution-chart.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       ├── dark-mode-toggle.tsx
│       └── pwa-install-banner.tsx
│
└── lib/
    └── utils.ts                    # Helper utilities (cn, etc.)
```

---

## Performance Considerations

| Concern | Solution | Measured |
|---------|----------|----------|
| Large study queue | Query limit 20; lazy-load additional rounds | O(log n) with `nextReviewDate` index |
| Search with 1000+ words | Full-text on `rootWord` index in Dexie | < 50ms for "cre" → 10 results |
| Stats aggregation | Maintain singleton UserProgress; increment on review | O(1) read; async write |
| Dark mode flicker | Apply `.dark` class on hydration (no SSR) | Imperceptible |
| Build size | Tree-shake unused components; Vite optimizes | ~675 KB gzipped |

---

## Security & Privacy

**No sensitive data handling:**
- No user authentication (no passwords, tokens, sessions)
- No backend server (no data transmission, no GDPR compliance needed)
- All data stored locally in IndexedDB (user controls export/delete)
- No analytics or tracking

**Secure defaults:**
- TypeScript prevents common errors (null pointer, type confusion)
- Dexie transactions ensure atomic updates (no partial writes)
- CSP headers (configured on Vercel) block inline scripts

---

## Error Handling

### Pattern

```ts
try {
  const result = await customWordFamilyService.addCustomWordFamily(data)
  // Success
} catch (err) {
  console.error('Failed to add word family:', err.message)
  // Show user-friendly message
  setError('Không thể thêm từ. Vui lòng thử lại.')
}
```

**Common Errors:**
- `WordFamily not found` → Navigate to browse page; offer search
- `IndexedDB quota exceeded` → Suggest deleting unused families
- `Invalid CEFR level` → Form validation (pre-submit)
- `Offline in add form` → Works offline; sync on connection restore (future)

---

## Future Architecture Changes

| Change | Rationale | Timeline |
|--------|-----------|----------|
| Cloud Sync (Supabase) | Backup/restore across devices | Q3 2026 |
| Service Worker improvements | Background sync for offline submissions | Q3 2026 |
| WebWorker for stats | Offload aggregation to avoid jank | Q4 2026 |
| Virtual scrolling (long lists) | Optimize memory for 5000+ word families | Q4 2026 |

---

## Testing Strategy

### Unit Tests (Future)

- SM-2 algorithm against reference implementation
- Word masking (suffix extraction edge cases: "create" → "eate")
- Dexie transactions (rollback on error)

### Integration Tests (Future)

- Add word family → appears in browse + study queue
- Submit review → updateUserProgress + recalculate streak
- Quiz flow → all answers scored correctly

### E2E Tests (Future)

- iOS PWA install + offline functionality
- Study session → completion → stats update
- Dark mode toggle persists across session

---

## Deployment Architecture

**Hosting:** Vercel (static SPA + PWA assets)

**Build:**
```bash
cd app
npm run build  # tsc + vite build → dist/
```

**Serve:**
- HTTP/2 + gzip compression
- CDN caching (long TTL for versioned assets)
- Service Worker caching (Workbox) for offline

**Monitoring:**
- Vercel analytics (page load, edge latency)
- Browser console errors (user reports)
- IndexedDB quota (future: add telemetry)
