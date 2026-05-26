# Vocab Family

Mobile-first English vocabulary learning PWA built with React 19 + TypeScript. Learn words by **word families** (root word + all POS forms) using **SM-2 spaced repetition**. Fully client-side, offline-capable, no backend required.

## Features

- 📚 197 seed word families (A1–C2 CEFR levels, common/academic/IELTS/business/TOEFL)
- 🔁 SM-2 spaced repetition algorithm — swipe left/right on flashcards
- 📝 Suffix masking quiz — fill-in-the-blank suffix portions with auto-scoring
- 📊 Progress dashboard — streak tracking, mastery breakdown, CEFR distribution
- 🔍 Browse & search — full-text rootWord search + CEFR/category filters
- ➕ Add/edit custom word families — user-driven vocabulary expansion
- 📲 PWA — installable on iPhone/Android, fully offline-capable
- 🌙 Dark mode — system preference aware
- 💾 IndexedDB persistence — 100% client-side, no backend or accounts needed

## Tech Stack

- **React 19** + **TypeScript 6** + **Vite 5**
- **Tailwind CSS v4** (with `@theme` tokens) + **framer-motion**
- **Dexie.js** (IndexedDB wrapper) + **dexie-react-hooks** (reactive queries)
- **React Router v6** — SPA routing
- **vite-plugin-pwa** (Workbox) — offline service workers
- **lucide-react** — icon library

## Getting Started

```bash
cd app
npm install
npm run dev
```

Open http://localhost:5173 (Vite default port). App works fully offline after first visit.

## Build & Deploy

```bash
cd app
npm run build      # tsc + vite build → dist/
npm run lint       # ESLint check
npx vercel --prod  # Deploy to Vercel
```

Build output ~675 KB (gzipped). PWA assets precached via Workbox.

## Documentation

- **[Project Overview & PDR](./docs/project-overview-pdr.md)** — Goals, user stories, scope, success metrics
- **[System Architecture](./docs/system-architecture.md)** — Architecture diagram, DB schema, data flow, state management
- **[Codebase Summary](./docs/codebase-summary.md)** — File organization, module responsibilities, key exports
- **[Code Standards](./docs/code-standards.md)** — Conventions, CSS design system, component patterns, naming rules
- **[Design Guidelines](./docs/design-guidelines.md)** — CSS variables, dark mode, CEFR colors, POS badges, animations
- **[Deployment Guide](./docs/deployment-guide.md)** — Local setup, build, PWA configuration, Vercel deployment

## Core Concepts

### Word Families

Each entry combines a root word with all grammatical forms:

```ts
{
  rootWord: "create"
  forms: [
    { word: "create", pos: "verb", definition: "...", frequency: "very-common" },
    { word: "creator", pos: "noun", definition: "...", frequency: "common" },
    { word: "creative", pos: "adjective", definition: "...", frequency: "very-common" },
    { word: "creatively", pos: "adverb", definition: "...", frequency: "less-common" }
  ]
  affixes: [
    { type: "suffix", form: "-ive", meaning: "having quality of" },
    { type: "suffix", form: "-ity", meaning: "state or quality" }
  ]
  cefr: "A2"
  category: "common"
}
```

### SM-2 Algorithm

Piotr Wozniak's SuperMemo 2 (1987). Quality ratings (0–5) map to review intervals:
- **again (1)** → reset repetitions, review in 1 day
- **hard (3)** → correct but difficult, extend interval by ease factor
- **good (4)** → correct, standard progression
- **easy (5)** → correct and easy, accelerate interval

Mastery threshold: 5+ repetitions with quality ≥ 3.

### Quiz Mechanics

Suffix masking: hidden suffix = last ~30–50% of letters. User types suffix; scored case-insensitively. Configurable CEFR filter + question count (5/10/20).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Dashboard: today's due count, stats, quick actions |
| `/study` | Flashcard session with SM-2 rating |
| `/browse` | Search & filter word families by CEFR/category |
| `/word/add` | Add custom word family |
| `/word/edit/:familyId` | Edit custom word family |
| `/word/:familyId` | Word family detail + review stats |
| `/quiz` | Suffix masking quiz with CEFR filter |
| `/stats` | Progress: streak, mastery, CEFR distribution |

## Design System

CSS custom properties (light + dark mode):
- Colors: `--color-background`, `--color-card`, `--color-primary`, etc.
- Shadows: `--shadow-card`, `--shadow-fab`, `--shadow-elevated`
- POS colors: `--color-pos-noun`, `--color-pos-verb`, `--color-pos-adj`, `--color-pos-adv`

Utility classes: `.card`, `.btn-ghost`, `.badge`, `.cefr-A1` through `.cefr-C2`, `.pos-noun/verb/adjective/adverb/other`.

## Contributing

1. Read [`./docs/code-standards.md`](./docs/code-standards.md) for conventions
2. Keep component files ≤ 200 LOC (split if needed)
3. Use IndexedDB + Dexie transactions for data mutations
4. Test SM-2 algorithm changes with spaced repetition scenarios
5. Verify PWA install banner on iOS/Android before deploying

## License

MIT
