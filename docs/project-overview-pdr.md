# Vocab Family — Project Overview & PDR

**Version:** 1.0  
**Last Updated:** May 2026  
**Status:** Active Development

---

## Executive Summary

**Vocab Family** is a mobile-first English vocabulary learning PWA designed for self-directed learners. Unlike traditional apps with curated word lists, Vocab Family empowers users to build their own vocabulary databases using **word families** (a root word + all grammatical forms: noun, verb, adjective, adverb). Learning uses the **SM-2 spaced repetition algorithm**, proven by decades of cognitive science research. The app is 100% client-side (no backend, no accounts, no data collection) with full offline capability via PWA.

---

## Goals & Success Metrics

### Primary Goals

1. **Lower barrier to vocabulary learning** — eliminate account signup, privacy concerns, backend dependency
2. **Personalize vocabulary** — users study *their* chosen words, not dictated lists
3. **Maximize retention** — SM-2 algorithm + multiple learning modalities (flashcards + quizzes)
4. **Offline-first UX** — works on flights, commutes, areas with poor connectivity

### Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| PWA installability | ≥ 90% success on iOS/Android | Measure app discoverability |
| Offline functionality | 100% feature parity offline | Trust & reliability |
| First meaningful paint | ≤ 1.5s | Mobile-first responsiveness |
| Build size (gzipped) | ≤ 700 KB | Fast initial load |
| CEFR coverage | All levels A1–C2 available | Appeal to all proficiency tiers |
| Data durability | No data loss on browser refresh/crash | IndexedDB persistence |

---

## Problem Statement

### Pain Points

1. **Account fatigue** — Users reluctant to create yet another account; privacy concerns with data collection
2. **Misaligned vocabulary** — Word lists don't match user's real learning goals (exam prep, technical terms, hobbies)
3. **Passive learning** — Most apps show flashcards but don't reinforce *affix understanding* (morphology)
4. **Network dependency** — Apps require backend, fail offline
5. **Forgetting curve** — Without spaced repetition, users lose 70% of words within 1 week

### Why Word Families?

Learning root words + affixes (prefixes/suffixes) enables:
- **Etymology insight** — "create" → "creative," "creation," "recreate" are all one family
- **Productive learning** — Master 500 root words + 50 affixes = understand 5000+ words
- **Morphological awareness** — Proven by second language acquisition research to improve retention

---

## User Personas

### Persona 1: Self-Study Language Learner (30%, Core)

- Age: 22–45
- Goal: IELTS/TOEFL score, everyday English, accent reduction
- Tech comfort: High (uses Anki, language apps regularly)
- Pain: Wants control over word selection, minimal friction
- Behavior: 15–20 min daily study sessions, prefers phone

### Persona 2: Non-Native Professional (20%, Secondary)

- Age: 28–55
- Goal: Business English, technical vocabulary (IT, medical, legal fields)
- Tech comfort: Medium (uses standard apps, not power user)
- Pain: Needs domain-specific terminology not in public word lists
- Behavior: 10–15 min during commute, needs offline access

### Persona 3: Hobbyist Learner (20%, Secondary)

- Age: 18–50
- Goal: Learn language for travel, culture, entertainment
- Tech comfort: Medium
- Pain: Public lists boring or irrelevant; no accountability system
- Behavior: Inconsistent but passionate; needs streak/gamification

### Persona 4: Teacher/Instructor (10%, Niche)

- Age: 30–65
- Goal: Distribute vocabulary exercises to students
- Tech comfort: Medium-Low
- Pain: Existing tools are cloud-dependent, expensive, or privacy-unfriendly
- Behavior: Wants shareable word lists, progress tracking (offline class)

### Persona 5: Developer/Language Enthusiast (20%, Engaged)

- Age: 18–40
- Goal: Learn language + understand linguistic patterns
- Tech comfort: Very High
- Pain: Existing tools lack API or offline-first design; not open-source
- Behavior: Happy to contribute, fork, customize; values transparency

---

## Scope & Features

### MVP (Shipped)

- [x] Word family creation (noun, verb, adj, adv, other POS)
- [x] Seed dataset: 197 word families (A1–C2 CEFR)
- [x] Flashcard study: SM-2 algorithm, swipe left/right rating
- [x] Progress dashboard: streak, mastery bar, CEFR breakdown
- [x] Browse & search: CEFR + category filters, full-text search
- [x] Add/edit custom words
- [x] Suffix quiz: fill-in-the-blank with score screen
- [x] PWA: installable on iOS/Android, offline-capable
- [x] Dark mode
- [x] IndexedDB persistence

### Phase 2 (Planned)

- [ ] Cloud sync (optional Supabase) — one-click backup/restore
- [ ] Spaced repetition stats — detailed analytics (forget curve, intervals over time)
- [ ] Audio pronunciation (TTS via Web Speech API or external API)
- [ ] Sharing word families — user-created lists shared via URL
- [ ] Collaborative study groups — peer accountability (optional)
- [ ] Habit reminders — local notifications at configurable times

### Out of Scope

- Multi-language support beyond English target language
- Video lessons or multimedia flashcards
- Paid premium features (all features free, always)
- Social leaderboards (privacy-first; no competitive tracking)
- Machine learning personalization (too much inference in browser; poor UX)

---

## Architecture Overview

### Technology Stack

| Layer | Tech | Why |
|-------|------|-----|
| UI Framework | React 19 + TypeScript | Type-safe, fast, ecosystem |
| Styling | Tailwind CSS v4 + CSS custom properties | Mobile-first, accessible, design tokens |
| State | React hooks + Dexie (IndexedDB) | Simple, reactive, persistent |
| Routing | React Router v6 | Lightweight, declarative SPA |
| Animations | framer-motion | Smooth, lightweight, mobile-friendly |
| Build | Vite 5 | Fast HMR, optimal production bundles |
| PWA | vite-plugin-pwa (Workbox) | Standard, battle-tested offline |
| Database | IndexedDB (Dexie.js wrapper) | Client-side, transactional, offline |

### Database Schema (Dexie v2)

**Tables:**
- `wordFamilies` — PK `id`, indexed on `rootWord`, `cefr`, `category`, `*tags`
- `reviewStats` — PK `familyId`, indexed on `nextReviewDate`, `easeFactor`, `repetitions`, `addedAt`
- `userProgress` — singleton record `id='singleton'`

**V2 Migration:** Removes all `!isCustom` word families on upgrade (clears old built-in data).

### Key Design Decisions

1. **Client-side only** — No backend = no GDPR/CCPA compliance burden; user owns their data
2. **SM-2 algorithm** — Proven spaced repetition; simple enough to implement correctly; doesn't require neural network
3. **Word families, not isolated words** — Teaches morphology; reduces vocabulary load via affixes
4. **PWA over native app** — Web tech reaches both iOS and Android; no app store review delays; easier to maintain
5. **Seed dataset, not API-driven** — Reduces surface area; users can add custom words if needed; no licensing issues
6. **Dark mode first** — Mobile users at night; reduces eye strain; good accessibility practice

---

## Data Flow

```
User Input (Flashcard Rating, Quiz Answer, Word Add)
         ↓
[React Hook] → [Review Schedule Service / Custom Word Service]
         ↓
[Dexie Transaction] → Update wordFamilies + reviewStats
         ↓
[IndexedDB] (persisted to disk)
         ↓
[Reactive Query] (dexie-react-hooks)
         ↓
[Component State Update]
         ↓
[UI Re-render]
```

---

## User Workflows

### Workflow 1: Morning Study Session

1. User opens app (offline, PWA installed)
2. HomePage shows "3 cards due today"
3. Taps /study
4. StudyPage loads due cards (query: `nextReviewDate ≤ now`)
5. User swipes through 3 flashcards (left=hard, right=easy)
6. SM-2 algorithm updates `easeFactor`, `interval`, `nextReviewDate`
7. StatsPage streak increments
8. Done screen shows "Come back tomorrow"

### Workflow 2: Learning New Word Family

1. User browses (BrowsePage) or searches "create"
2. Finds existing family or adds new via /word/add
3. Fills form: rootWord, forms (noun/verb/adj/adv), affixes, CEFR, category
4. Submits → transaction: add to wordFamilies + bootstrap reviewStats
5. Card appears in study queue immediately (`nextReviewDate: now`)

### Workflow 3: Quiz Session

1. User taps Quiz tab
2. QuizPage filters families (e.g., A2–B1 CEFR)
3. User selects 10 questions
4. Quiz loads 10 families; shows word form with suffix masked
5. User types suffix for each form; scores update
6. Result screen: "8/10 (80%)" with breakdown per form
7. Wrong answers marked for review

---

## Dependencies & Constraints

### External Dependencies

- **React 19**, **TypeScript**, **Tailwind** — actively maintained, wide ecosystem
- **Dexie 4.x** — maintained, IndexedDB abstraction stable
- **framer-motion** — animation library, actively maintained
- **lucide-react** — icon set, regularly updated
- **vite-plugin-pwa + Workbox** — PWA support, de facto standard

### Constraints

| Constraint | Impact | Mitigation |
|-----------|--------|-----------|
| Browser storage quota | IndexedDB max ~50 MB | Seed dataset ~2 MB; user data adds slowly |
| No persistent login | Can't sync across devices | Future: optional Supabase cloud sync |
| SM-2 in browser | No statistical analysis | Future: export to CSV for external analysis |
| iOS Safari PWA limits | No Web Bluetooth, NFC | OK for text-based learning; accept limitation |
| No server logs | Can't debug user issues | Encourage bug reports; local browser storage as evidence |

---

## Success Criteria & Definition of Done

### Per Feature

- **Flashcard session:** User completes rating; SM-2 calc updates nextReviewDate correctly ± 1 day
- **Quiz:** All answers marked correctly; score calculation matches expected (100% = all correct)
- **Word add:** Form submission creates family + reviewStats atomically (no orphaned records)
- **PWA install:** Works on iOS Safari Share→Add Home Screen; works offline (no network errors)
- **Dark mode:** All colors readable in light + dark; no text disappears or becomes invisible

### Per Release

- [ ] No console errors in prod build
- [ ] Lighthouse PWA score ≥ 90
- [ ] 100% data persistence (IndexedDB verified via DevTools)
- [ ] All routes responsive on 320px–480px mobile screens
- [ ] SM-2 algorithm accuracy validated against reference implementation

---

## Timeline & Phases

| Phase | Duration | Deliverables | Status |
|-------|----------|--------------|--------|
| **Phase 1: MVP** | 1–2 weeks | Core features + PWA + 197 seed families | ✅ Complete |
| **Phase 2: Polish** | 1 week | UI/UX refinement, accessibility audit, animations | ✅ Complete |
| **Phase 3: Optimization** | 1 week | Performance, build size, offline robustness | In Progress |
| **Phase 4: Cloud Sync** | 2–3 weeks | Optional Supabase, backup/restore | Q3 2026 |
| **Phase 5: Audio** | 2 weeks | TTS pronunciation, Web Speech API | Q3 2026 |

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| IndexedDB quota exceeded | Low | Loss of data | Monitor usage; add quota warning; implement cleanup |
| Browser vendor removes PWA | Low | Install base drops | Monitor platform changes; fallback to web-only distribution |
| SM-2 algorithm bugs | Medium | Incorrect review scheduling | Comprehensive unit tests; compare against reference impl. |
| iOS Safari limitations evolve | Medium | Feature loss | Follow WebKit commits; maintain compatibility layer |
| User data privacy breach (unlikely) | Very Low | Trust loss | No data collected; no backend; no account = no breach surface |

---

## Definition of Success (6 Months)

- [ ] 500+ monthly active users (measured via PWA install stats)
- [ ] ≥ 4.5/5 rating on app stores (user feedback)
- [ ] ≥ 80% of users complete ≥ 1 study session per week
- [ ] Zero data loss incidents
- [ ] ≤ 5 critical bugs reported per month

---

## Contact & Ownership

**Project Lead:** Brian Nguyen  
**Repository:** `/Users/caoconnn/Desktop/Self/Grammar`  
**Live Site:** (Vercel deployment URL — to be updated)

---

## Appendix: SM-2 Algorithm Details

Piotr Wozniak's SuperMemo 2 (1987). Each review updates:

1. **EF (Ease Factor):**
   ```
   EF' = max(1.3, EF + 0.1 - (5-q)(0.08 + (5-q)×0.02))
   ```
   where `q` = quality (0–5), `EF` = current ease factor (starts at 2.5)

2. **Interval (days until next review):**
   - If quality < 3: interval = 1, repetitions = 0 (reset)
   - If quality ≥ 3 and rep = 0: interval = 1
   - If quality ≥ 3 and rep = 1: interval = 6
   - If quality ≥ 3 and rep ≥ 2: interval = round(previous_interval × EF')

3. **Quality Mapping:**
   - 0 = blackout (instant forgot)
   - 1 = incorrect (hard)
   - 2 = incorrect (easy)
   - 3 = correct (hard)
   - 4 = correct (ok)
   - 5 = correct (easy)

   **Mapped to UI ratings:**
   - "again" → quality 1 (reset)
   - "hard" → quality 3 (difficult, shorter interval)
   - "good" → quality 4 (standard progression)
   - "easy" → quality 5 (accelerate interval)

**Mastery:** Family marked as mastered when repetitions ≥ 5 with quality ≥ 3.

---

## Appendix: CEFR Levels

Common European Framework of Reference for Languages (A1 beginner → C2 mastery):

| Level | Proficiency | Example |
|-------|-------------|---------|
| A1 | Beginner | Can understand and use very basic everyday words |
| A2 | Elementary | Can interact in simple, routine matters |
| B1 | Intermediate | Can produce clear text on topics of interest |
| B2 | Upper-Intermediate | Can interact fluently with native speakers |
| C1 | Advanced | Can use language flexibly for professional/academic purposes |
| C2 | Mastery | Near-native comprehension and production |

App seeds families across all levels; users can filter by target level.
