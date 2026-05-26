# Codebase Summary

**Version:** 1.0  
**Last Updated:** May 2026  
**Source Root:** `/Users/caoconnn/Desktop/Self/Grammar/app/src`

---

## Quick Overview

Vocab Family is a React 19 + TypeScript SPA (Single Page Application) bundled with Vite 5. The app uses Dexie.js to wrap IndexedDB for client-side persistence and implements the SM-2 spaced repetition algorithm for vocabulary learning. All routes are handled via React Router v6; styling uses Tailwind CSS v4 with CSS custom properties for theming.

**Key Metrics:**
- Total files: 45 (TS/TSX + types + utilities)
- Core logic: ~2,500 LOC (services, utils, hooks)
- Component code: ~1,500 LOC (pages, UI components)
- Build size: ~675 KB gzipped (includes React, Tailwind, framer-motion)
- Seed data: 197 word families bundled in `seed-word-families.json`

---

## Module Dependency Graph

```
App.tsx (Router entry point)
├── Pages (7 page components)
│   ├── HomePage
│   ├── StudyPage → useReviewQueue
│   ├── BrowsePage → useWordSearch
│   ├── WordFamilyFormPage → useWordFamilyForm
│   ├── WordDetailPage
│   ├── QuizPage → useQuiz
│   └── StatsPage → useUserStats
│
├── Services (2 services)
│   ├── custom-word-family-service.ts
│   │   └── db (Dexie instance)
│   └── review-schedule-service.ts
│       ├── db
│       ├── sm2-algorithm
│       └── user progress tracking
│
├── Hooks (8 custom hooks)
│   ├── useReviewQueue → submitReview
│   ├── useQuiz → maskWord
│   ├── useUserStats → Dexie query
│   ├── useWordSearch → Dexie filter
│   ├── useWordFamilyForm → validation
│   ├── useDarkMode → CSS class toggle
│   └── usePwaInstallPrompt → beforeinstallprompt listener
│
├── Utils (2 utility modules)
│   ├── sm2-algorithm.ts → calculateSM2, ratingToQuality
│   └── word-masking.ts → maskWord
│
├── Types (1 module)
│   └── vocab-types.ts → all interfaces
│
└── Components (25 components)
    ├── Layout (2)
    ├── Flashcard (4)
    ├── Quiz (3)
    ├── Word (5)
    ├── Stats (3)
    └── UI (8)
```

---

## Detailed Module Reference

### Types Module (`types/vocab-types.ts`)

**Exports:** 6 types, 6 interfaces

| Export | Purpose |
|--------|---------|
| `PartOfSpeech` | Union type: noun, verb, adjective, adverb, other |
| `CefrLevel` | Union type: A1–C2 proficiency levels |
| `WordCategory` | Union type: common, academic, business, ielts, toefl |
| `WordForm` | Interface: word + POS + definition + example + frequency |
| `WordAffix` | Interface: prefix/suffix + form + meaning |
| `WordFamily` | Interface: rootWord + forms + affixes + CEFR + category + tags + isCustom |
| `ReviewStats` | Interface: SM-2 state (easeFactor, interval, repetitions, dates, counts) |
| `UserProgress` | Interface: singleton (streak, mastered count, activity date) |
| `ReviewItem` | Interface: tuple of family + stats (for flashcard display) |
| `SM2Quality` | Union type: 0–5 quality rating |
| `RatingLabel` | Union type: again, hard, good, easy (UI-facing ratings) |

**Usage:** Imported by all modules that touch vocabulary or review data.

---

### Database Module (`db/vocab-database.ts`)

**Exports:** `db` (Dexie instance)

**Schema (Version 2):**

```ts
class VocabDatabase extends Dexie {
  wordFamilies!: Table<WordFamily>
  reviewStats!: Table<ReviewStats>
  userProgress!: Table<UserProgress>
}
```

**Indexes:**
- `wordFamilies`: `&id` (primary), `rootWord`, `cefr`, `category`, `*tags`
- `reviewStats`: `&familyId` (primary), `nextReviewDate`, `easeFactor`, `repetitions`, `addedAt`
- `userProgress`: `&id` (primary, singleton)

**Migrations:**
- **v1 → v2:** Deletes all non-custom (`!isCustom`) word families on upgrade (one-time migration when rolling out v2 removal of built-in seed data)

**Key Queries (via services):**
- `wordFamilies.get(id)` → fetch single family
- `reviewStats.where('nextReviewDate').belowOrEqual(now).limit(20)` → due reviews
- `wordFamilies.where('rootWord').startsWith(search)` → search by prefix
- `wordFamilies.where('cefr').equals(cefrLevel)` → filter by CEFR
- Transactions for atomic updates: `db.transaction('rw', [tables], async tx => {...})`

**Transactions Used:**
- `addCustomWordFamily` → insert family + bootstrap ReviewStats
- `updateCustomWordFamily` → update family (guard: check `isCustom`)
- `deleteCustomWordFamily` → delete family + ReviewStats
- `submitReview` → update ReviewStats + UserProgress atomically
- `importSeedWordFamilies` → bulk insert seed data

---

### Data Module (`data/`)

#### `seed-word-families.ts`

**Exports:** `SEED_WORD_FAMILIES: WordFamily[]`

**Content:** 197 English word families spanning A1–C2 CEFR, all categories (common, academic, business, IELTS, TOEFL). Each family has:
- Root word (e.g., "create")
- 2–4 POS forms (noun, verb, adj, adv)
- 1–3 affixes (prefix/suffix meanings)
- CEFR level
- Category
- Tags (optional)
- `isCustom: true` flag (preserved across migrations)

**Loaded:** On first app load via `importSeedWordFamilies()` in HomePage or initial setup.

---

### Services (`services/`)

#### `custom-word-family-service.ts`

**Exports:** 5 functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `generateFamilyId` | `(rootWord: string) → string` | Create unique ID: `custom-{slug}-{timestamp}` |
| `addCustomWordFamily` | `(data: Omit<WordFamily, 'id' \| 'isCustom'>) → Promise<string>` | Add + bootstrap ReviewStats; returns family ID |
| `updateCustomWordFamily` | `(id: string, data: Omit<WordFamily, 'id' \| 'isCustom'>) → Promise<void>` | Update (guards `isCustom`; throws if built-in) |
| `deleteCustomWordFamily` | `(id: string) → Promise<void>` | Delete family + ReviewStats atomically |
| `importSeedWordFamilies` | `() → Promise<number>` | Bulk import; idempotent (skips duplicates); returns count imported |

**Error Handling:**
- Throws if trying to update/delete non-custom family
- Uses Dexie transactions for atomicity

#### `review-schedule-service.ts`

**Exports:** 2 functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `getDueReviews` | `(limit: number) → Promise<ReviewItem[]>` | Query reviews where `nextReviewDate ≤ now`, ordered by due date; join family + stats |
| `submitReview` | `(familyId: string, rating: RatingLabel) → Promise<void>` | Apply SM-2 algorithm; update ReviewStats + UserProgress atomically |

**submitReview Flow:**
1. Get current ReviewStats
2. Map rating ('again'/'hard'/'good'/'easy') → quality (1/3/4/5)
3. Call `calculateSM2()` → new EF, interval, nextReviewDate, repetitions
4. Get current UserProgress (singleton)
5. Check streak: if `lastActivityDate === today - 1`, increment `currentStreak`; else reset to 1
6. If repetitions ≥ 5 and quality ≥ 3 (mastered), increment `masteredCount`
7. Transaction: update ReviewStats + UserProgress
8. Log timestamp to `lastActivityDate`

---

### Utilities (`utils/`)

#### `sm2-algorithm.ts`

**Exports:** 1 interface, 1 function, 1 function

| Export | Purpose |
|--------|---------|
| `SM2Input` | Interface: quality, easeFactor, interval, repetitions |
| `SM2Result` | Interface: easeFactor, interval, repetitions, nextReviewDate |
| `calculateSM2` | Pure function: apply Wozniak SM-2 formula |
| `ratingToQuality` | Map UI rating ('again'/'hard'/'good'/'easy') → quality (1/3/4/5) |

**Formula:**
```
newEF = max(1.3, easeFactor + 0.1 - (5-q)*(0.08 + (5-q)*0.02))
if quality < 3:
  newRep = 0
  newInterval = 1
else:
  newRep = repetitions + 1
  if repetitions == 0: newInterval = 1
  elif repetitions == 1: newInterval = 6
  else: newInterval = round(interval * newEF)
nextDate = today + newInterval days
```

**Quality Mapping:**
- 0 = blackout (instant forget)
- 1 = incorrect hard (reset)
- 2 = incorrect easy (reset)
- 3 = correct hard (standard progression)
- 4 = correct ok (standard progression)
- 5 = correct easy (accelerate)

**UI Ratings:**
- `again` → 1 (reset)
- `hard` → 3 (difficult progression)
- `good` → 4 (standard progression)
- `easy` → 5 (accelerated progression)

#### `word-masking.ts`

**Exports:** 1 function

| Export | Purpose |
|--------|---------|
| `maskWord` | `(word: string) → { visible: string, hidden: string }` |

**Logic:** Split word at ~40% visible, ~60% hidden suffix.
- "create" (6 chars) → visible="cr" (40%), hidden="eate" (60%)
- Used in quiz to mask suffix for fill-in-the-blank

---

### Hooks (`hooks/`)

#### `use-review-queue.ts`

**Exports:** 1 hook

| Hook | Return Type | Purpose |
|------|------------|---------|
| `useReviewQueue` | Object with queue, currentIndex, completed, isDone, rate() | Manage flashcard study session |

**State:**
- `queue: ReviewItem[]` — due flashcards
- `currentIndex: number` — current position in queue
- `completed: number` — count submitted so far
- `isLoading: boolean` — loading state
- `isDone: boolean` — session finished

**Methods:**
- `loadQueue()` → fetch due reviews via `getDueReviews(20)`
- `rate(rating: RatingLabel)` → submit review, advance to next card

#### `use-quiz.ts`

**Exports:** 1 hook

| Hook | Purpose |
|------|---------|
| `useQuiz` | Initialize quiz state, track user answers, calculate score |

**State:**
- Quiz config (CEFR filter, question count)
- Current round, user answers, score

**Methods:**
- `initializeQuiz(config)` → load families, create slots
- `updateAnswer(slotId, userInput)` → update answer
- `submitAnswer()` → check answer case-insensitively
- `calculateScore()` → correct / total slots

#### `use-user-stats.ts`

**Exports:** 1 hook

| Hook | Purpose |
|------|---------|
| `useUserStats` | Fetch UserProgress + ReviewStats; compute aggregations (CEFR distribution, mastery breakdown) |

**Queries:**
- Dexie `useLiveQuery` on UserProgress (reactive)
- ReviewStats aggregation: map over all reviews, count by CEFR/mastery status

#### `use-word-search.ts`

**Exports:** 1 hook

| Hook | Purpose |
|------|---------|
| `useWordSearch` | Search + filter word families by text, CEFR, category |

**State:**
- Search text, selected filters

**Methods:**
- `search(text)` → query wordFamilies by `rootWord` prefix
- `filterByCefr(level)`, `filterByCategory(cat)` → apply filters

#### `use-word-family-form.ts`

**Exports:** 1 hook

| Hook | Purpose |
|------|---------|
| `useWordFamilyForm` | Manage add/edit form state; validate; submit |

**State:**
- Form fields: rootWord, forms (array), affixes (array), CEFR, category, tags
- Validation errors, loading state

**Methods:**
- `updateField(path, value)` → update nested form state
- `submit()` → validate, call service (add or update)

#### `use-dark-mode.ts`

**Exports:** 1 hook

| Hook | Purpose |
|------|---------|
| `useDarkMode` | Detect system preference, apply `.dark` class to `<html>`, toggle |

**Side Effect:** On init, check `window.matchMedia('(prefers-color-scheme: dark)')`, apply class.

#### `use-pwa-install-prompt.ts`

**Exports:** 1 hook

| Hook | Purpose |
|------|---------|
| `usePwaInstallPrompt` | Listen to `beforeinstallprompt` event; detect iOS; manage install banner |

**Side Effects:**
- Listen to `beforeinstallprompt` (desktop/Android)
- Detect iOS Safari (no event; show manual instructions)

**Methods:**
- `install()` → trigger browser install prompt
- `dismiss()` → hide banner

---

### Pages (`pages/`)

#### HomePage (`home-page.tsx`)

**Components Used:** `useUserStats`, `useReviewQueue`, streak display, mastery bar

**Route:** `/`

**Responsibilities:**
1. Fetch UserProgress (streak, mastery count)
2. Fetch due review count via `getDueReviews(1)` (for badge)
3. Show quick actions: "Study Today", "Browse", "Add Word"
4. Show progress summary (streak badge, mastery bar, CEFR distribution)
5. On mount, call `importSeedWordFamilies()` if first visit

#### StudyPage (`study-page.tsx`)

**Components Used:** `useReviewQueue`, FlashcardSwipeable, FlashcardRatingButtons, StudyCompletionScreen

**Route:** `/study`

**Responsibilities:**
1. Load due reviews via `useReviewQueue.loadQueue()`
2. Display current flashcard (front: definition, back: word + forms)
3. Listen to swipe gesture (left=hard, right=easy) or button clicks
4. Call `useReviewQueue.rate(rating)` → SM-2 update
5. Show completion screen when queue empty

#### BrowsePage (`browse-page.tsx`)

**Components Used:** `useWordSearch`, WordFamilyCard, CefrFilterChips, WordSearchInput

**Route:** `/browse`

**Responsibilities:**
1. Search by rootWord (on input change)
2. Filter by CEFR + category via chips
3. Display matching families as cards
4. FAB to add new word

#### WordDetailPage (`word-detail-page.tsx`)

**Components Used:** WordFormSection, AffixFormSection, ReviewStats display

**Route:** `/word/:familyId`

**Responsibilities:**
1. Fetch WordFamily by ID
2. Display all forms, affixes, definitions, examples
3. Show review stats (last reviewed, next due, interval, EF)
4. Edit/delete buttons (only if `isCustom`)

#### WordFamilyFormPage (`word-family-form-page.tsx`)

**Components Used:** `useWordFamilyForm`, form inputs

**Routes:** `/word/add`, `/word/edit/:familyId`

**Responsibilities:**
1. Load family (if edit mode) via URL param
2. Manage form state via hook
3. Validate: rootWord required, ≥1 form, valid CEFR
4. Submit via service (add or update)
5. Redirect to word detail on success

#### QuizPage (`quiz-page.tsx`)

**Components Used:** `useQuiz`, QuizRoundCard, QuizWordSlot, QuizResultScreen

**Route:** `/quiz`

**Responsibilities:**
1. Show quiz config: CEFR filter, question count selector
2. Start quiz: load families, create slots (one per word form)
3. Display word with masked suffix; listen to user input
4. Submit → score calculation + result screen
5. Breakdown per word form

#### StatsPage (`stats-page.tsx`)

**Components Used:** `useUserStats`, StreakDisplay, MasteryProgressBar, CefrDistributionChart

**Route:** `/stats`

**Responsibilities:**
1. Fetch UserProgress (streaks, mastered count)
2. Aggregate ReviewStats: count families per CEFR, per mastery level
3. Display streak (current + best), mastery bar, CEFR chart
4. Show total studied, total reviews done

---

### Components (`components/`)

#### Layout

**app-header.tsx:** Title + dark mode toggle  
**mobile-bottom-nav.tsx:** 4-tab navigation (Home, Study, Browse, Stats)

#### Flashcard

**flashcard-swipeable.tsx:** Gesture detection (swipe left/right on touch)  
**flashcard-word-family-display.tsx:** Show word family (front: definition, back: forms)  
**flashcard-rating-buttons.tsx:** 4 rating buttons (again, hard, good, easy)  
**study-completion-screen.tsx:** "No more cards today" message

#### Quiz

**quiz-round-card.tsx:** Container for one quiz word  
**quiz-word-slot.tsx:** Input field for suffix + hint  
**quiz-result-screen.tsx:** Score display + breakdown

#### Word

**word-family-card.tsx:** Compact card (for search results)  
**word-form-section.tsx:** Display all forms (noun, verb, adj, adv)  
**affix-form-section.tsx:** Display affixes (prefix/suffix)  
**cefr-filter-chips.tsx:** CEFR filter buttons (A1–C2)  
**word-search-input.tsx:** Search input with real-time updates

#### Stats

**streak-display.tsx:** Current + best streak badges  
**mastery-progress-bar.tsx:** Progress bar (new / learning / mastered)  
**cefr-distribution-chart.tsx:** Bar chart: family count per CEFR

#### UI (Reusable)

**badge.tsx:** Label component (POS, CEFR, category)  
**button.tsx:** Variants: primary, secondary, ghost  
**card.tsx:** Container with border + shadow  
**progress.tsx:** Linear progress bar  
**dark-mode-toggle.tsx:** Light/dark mode button  
**pwa-install-banner.tsx:** Install instructions (iOS manual, Android prompt)

---

### Root Files

#### `App.tsx`

**Exports:** Default App component

**Responsibilities:**
1. Router setup (BrowserRouter)
2. Layout shell (flex column, max-width 448px for mobile)
3. Route definitions (7 routes)
4. Initialize dark mode hook
5. Show PWA install banner

**Routes:**
```
/ → HomePage
/study → StudyPage
/browse → BrowsePage
/word/add → WordFamilyFormPage (add mode)
/word/edit/:familyId → WordFamilyFormPage (edit mode)
/word/:familyId → WordDetailPage
/quiz → QuizPage
/* → Redirect to /
```

#### `main.tsx`

**Exports:** App initialization

**Responsibilities:**
1. Render React app to DOM
2. Register service worker for PWA
3. Import CSS (global styles + design system)

#### `index.css`

**Content:** Global styles + design system

**Sections:**
- `@theme` block: CSS custom property definitions (light mode)
- Dark mode rules (`.dark` class on `<html>`)
- Base styles (*, html, body, input focus)
- Shared card styles (`.card`, `.card-interactive`)
- Button variants (`.btn-ghost`, `.btn-primary`)
- Badge styles (`.badge`, `.cefr-A1`, `.pos-noun`)
- Tailwind directives (`@import "tailwindcss"`)
- Animations (fadeSlideUp, pulse-ring)

---

### Build Configuration

#### `vite.config.ts`

**Plugins:**
- `@vitejs/plugin-react` — JSX/refresh
- `@tailwindcss/vite` — Tailwind CSS v4
- `VitePWA` — Service worker + manifest

**Output:**
- Code splitting: bundle.js + vendor chunks
- Minified CSS/JS
- Source maps (dev mode)

#### `tsconfig.json`

**Settings:**
- Target: ES2020
- Module: ESNext
- Lib: ES2020, DOM, DOM.Iterable
- JSX: react-jsx
- Path alias: `@/ → ./src/`

#### `package.json`

**Dependencies:**
- React 19, React DOM 19
- React Router v6
- Dexie 4.4, dexie-react-hooks 4.4
- TypeScript 6
- Tailwind CSS v4, Tailwind Merge
- framer-motion, lucide-react
- vite-plugin-pwa, workbox-window

**Scripts:**
- `npm run dev` → Vite dev server (HMR)
- `npm run build` → tsc + vite build
- `npm run lint` → ESLint
- `npm run preview` → preview prod build

---

## Code Patterns & Conventions

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `use-review-queue.ts`, `word-family-card.tsx`, `sm2-algorithm.ts` |
| React components | PascalCase | `HomePage`, `StudyPage`, `WordFamilyCard` |
| Functions/hooks | camelCase | `calculateSM2()`, `maskWord()`, `useReviewQueue()` |
| Interfaces | PascalCase | `WordFamily`, `ReviewStats`, `SM2Input` |
| Union types | camelCase | `partOfSpeech`, `cefrLevel` |
| Constants | UPPER_SNAKE_CASE | `SEED_WORD_FAMILIES` |

### React Patterns

**Hooks:**
- Custom hooks prefixed with `use-` and exported from `hooks/` directory
- Reactive queries via `useLiveQuery` (Dexie) or `useState` + `useEffect`
- Minimal prop drilling; prefer hooks for shared state

**Components:**
- Functional components only (no class components)
- Props typed with TypeScript interfaces
- Separation of concerns: page (container) vs component (presentational)

**Data Flow:**
- Unidirectional: User action → Hook → Service → Dexie → Reactive query → Component update
- No Redux; React Context avoided (hooks sufficient for this app scale)

### Error Handling

**Pattern:**
```ts
try {
  const result = await asyncOperation()
  setData(result)
} catch (err) {
  console.error('Operation failed:', err.message)
  setError('User-friendly message')
}
```

**Error types:** Dexie validation errors, network errors (offline), user input validation.

### Dexie Transactions

**Pattern:**
```ts
await db.transaction('rw', [table1, table2], async tx => {
  await tx.table('table1').add(data)
  await tx.table('table2').update(id, update)
  // All-or-nothing atomicity
})
```

**Used for:** Multi-table operations (add family + bootstrap ReviewStats, update ReviewStats + UserProgress).

### TypeScript

**Strict mode:** Enabled (non-null assertions rare).

**Types:** All function signatures typed; no `any`. Union types for open enums (CEFR levels, POS).

**Interfaces:** Extend only when sharing base structure; prefer composition.

---

## Module Size & Complexity

| Module | LOC | Complexity | Dependencies |
|--------|-----|-----------|--------------|
| `types/vocab-types.ts` | 60 | Low | None |
| `db/vocab-database.ts` | 35 | Low | Dexie |
| `services/custom-word-family-service.ts` | 90 | Medium | db, types |
| `services/review-schedule-service.ts` | 80 | Medium | db, sm2-algorithm, types |
| `utils/sm2-algorithm.ts` | 67 | Medium | types |
| `utils/word-masking.ts` | 15 | Low | None |
| `hooks/use-review-queue.ts` | 50 | Low | types, services |
| `pages/study-page.tsx` | 120 | Medium | hooks, components |
| All components (25 files) | ~1500 | Low–Medium | React, lucide, framer-motion |
| All pages (7 files) | ~600 | Low–Medium | hooks, services, components |

**Largest files:** StudyPage (~120 LOC), custom-word-family-service (~90 LOC), review-schedule-service (~80 LOC). All under 200 LOC limit.

---

## Key Exports by Module

| Module | Key Exports |
|--------|------------|
| `types/vocab-types.ts` | `WordFamily`, `ReviewStats`, `UserProgress`, `PartOfSpeech`, `CefrLevel` |
| `db/vocab-database.ts` | `db` (Dexie instance) |
| `data/seed-word-families.ts` | `SEED_WORD_FAMILIES` (197 word families) |
| `services/custom-word-family-service.ts` | `addCustomWordFamily()`, `updateCustomWordFamily()`, `deleteCustomWordFamily()`, `importSeedWordFamilies()` |
| `services/review-schedule-service.ts` | `getDueReviews()`, `submitReview()` |
| `utils/sm2-algorithm.ts` | `calculateSM2()`, `ratingToQuality()` |
| `utils/word-masking.ts` | `maskWord()` |
| `hooks/use-review-queue.ts` | `useReviewQueue` hook |
| `hooks/use-quiz.ts` | `useQuiz` hook |
| `hooks/use-user-stats.ts` | `useUserStats` hook |
| `hooks/use-word-search.ts` | `useWordSearch` hook |
| `hooks/use-word-family-form.ts` | `useWordFamilyForm` hook |
| `hooks/use-dark-mode.ts` | `useDarkMode` hook |
| `hooks/use-pwa-install-prompt.ts` | `usePwaInstallPrompt` hook |
| `App.tsx` | `App` (default export) |

---

## Dependencies Flow

```
App.tsx
├── All Pages (import components, hooks)
│   ├── StudyPage imports useReviewQueue
│   ├── BrowsePage imports useWordSearch
│   ├── QuizPage imports useQuiz
│   └── etc.
├── All Hooks (import services, utils, types)
│   ├── useReviewQueue imports submitReview
│   ├── useUserStats imports db (Dexie)
│   └── etc.
├── Services (import db, utils, types)
│   ├── review-schedule-service imports calculateSM2
│   └── custom-word-family-service imports SEED_WORD_FAMILIES
└── Components (import hooks, types, utilities)
    ├── Flashcard components import useReviewQueue
    ├── Quiz components import useQuiz, maskWord
    └── etc.
```

---

## Future Refactoring Opportunities

| Opportunity | Rationale | Priority |
|-------------|-----------|----------|
| Extract quiz scoring to utility | Reduce component complexity | Low |
| Create `useLocalStorage` hook | Decouple dark mode from CSS | Low |
| Add `useAsync` wrapper | DRY up error handling | Medium |
| Separate Dexie queries into `queries/` | Easier to mock for tests | Medium |
| Virtual scrolling for large lists | Performance at 5000+ families | Low (future need) |

---

## Testing Opportunities

| Test Type | Target | Coverage |
|-----------|--------|----------|
| Unit | `calculateSM2()` against reference | Critical |
| Unit | `maskWord()` edge cases | Important |
| Integration | Add family → appears in queue | Important |
| Integration | Submit review → stats update | Critical |
| E2E | Full study session (iOS PWA) | Important |

---

## Performance Profiles

**Startup:**
- Vite HMR: ~300ms (dev)
- React hydration: ~100ms
- IndexedDB open: ~10ms
- Initial page render: ~150ms

**Operations:**
- Search (indexed query): ~10–50ms
- SM-2 calculation: <1ms
- Review submit (transaction): ~5–20ms
- Stats aggregation: ~20–100ms (O(n) full scan; cached in singleton)

**Build:**
- Dev build: ~2s (Vite esbuild)
- Prod build: ~10s (tsc + vite + minify)
- Gzip size: ~675 KB

---

## Security Checklist

- [x] No sensitive data in code
- [x] No external API calls (except Vercel CDN)
- [x] TypeScript strict mode enabled
- [x] Dexie transactions for atomicity
- [x] Input validation on forms
- [x] No eval() or dynamic code execution
- [x] CSP headers configured (Vercel)
- [x] Service Worker only caches static assets

---

## Deployment Checklist

- [x] Build succeeds (`npm run build`)
- [x] No console errors (DevTools)
- [x] Lighthouse scores ≥ 90
- [x] PWA installable (Web Manifest valid)
- [x] Offline-functional (Service Worker active)
- [x] Dark mode works
- [x] All routes accessible
- [x] IndexedDB quota monitored
