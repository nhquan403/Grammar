# Vocab Family Documentation

Welcome to the Vocab Family documentation hub. This directory contains comprehensive guides for understanding, developing, and deploying the application.

---

## 📚 Documentation Map

### Getting Started

**New to the project?** Start here:

1. **[Project Overview & PDR](./project-overview-pdr.md)** (353 LOC)
   - Executive summary and vision
   - Problem statement and user personas
   - Features, scope, success metrics
   - SM-2 algorithm details and CEFR levels
   - **Read this first** to understand the "why"

2. **[README.md (Project Root)](../README.md)**
   - Quick features summary
   - Local dev setup
   - Build & deployment quick start
   - **Read this second** for a high-level overview

### Understanding the Code

3. **[System Architecture](./system-architecture.md)** (615 LOC)
   - Architecture diagram (ASCII + Mermaid)
   - Component hierarchy
   - Data model and database schema
   - State management patterns
   - Algorithm explanations (SM-2, quiz mechanics)
   - Performance considerations
   - **Read this to understand how things fit together**

4. **[Codebase Summary](./codebase-summary.md)** (783 LOC)
   - File organization and module reference
   - Key exports by module
   - Dependencies flow
   - Module size and complexity metrics
   - Testing opportunities
   - **Read this as a code map; use for navigation**

### Development

5. **[Code Standards](./code-standards.md)** (900 LOC)
   - File naming and organization conventions
   - TypeScript strict mode rules
   - React component patterns
   - Hooks conventions and best practices
   - State management patterns
   - Service and utility function patterns
   - Database (Dexie) transaction patterns
   - CSS and design system usage
   - Error handling standards
   - Git and commit conventions
   - **Read this before writing code**

6. **[Design Guidelines](./design-guidelines.md)** (568 LOC)
   - Color palette (light & dark modes)
   - CEFR and POS color coding
   - Shadow elevation system
   - Typography scale
   - Spacing and responsive design
   - Component patterns (cards, badges, buttons)
   - Animation library (framer-motion)
   - Dark mode implementation
   - Accessibility considerations
   - Mobile-first design principles
   - **Read this for UI/styling questions**

### Deployment & Operations

7. **[Deployment Guide](./deployment-guide.md)** (576 LOC)
   - Local development setup
   - Production build process
   - Vercel deployment step-by-step
   - PWA configuration and testing
   - Performance optimization
   - Monitoring and debugging
   - Common issues and solutions
   - Rollback and versioning
   - Health check procedures
   - **Read this to deploy or troubleshoot**

### Planning & Roadmap

8. **[Project Roadmap](./project-roadmap.md)** (564 LOC)
   - Release timeline (Phases 1–6)
   - Feature backlog and future ideas
   - Success metrics per phase
   - Risk assessment and blockers
   - Budget and resource allocation
   - User feedback loop
   - Competitor comparison
   - Next steps and version history
   - **Read this for long-term vision**

---

## 🎯 Quick Navigation by Role

### I'm a New Developer

Read in order:
1. `project-overview-pdr.md` — understand the vision
2. `system-architecture.md` — see how it works
3. `codebase-summary.md` — find the code
4. `code-standards.md` — learn our conventions
5. Start coding! (See "Development" section below)

### I'm Fixing a Bug

1. Check `codebase-summary.md` to find the relevant module
2. Read `code-standards.md` for patterns
3. Run tests (if available)
4. Commit following `code-standards.md` conventions

### I'm Adding a Feature

1. Check `project-roadmap.md` to understand the phase
2. Read `design-guidelines.md` for UI consistency
3. Follow `code-standards.md` patterns
4. Update relevant docs in this directory
5. Test locally, then deploy via `deployment-guide.md`

### I'm Deploying

Follow `deployment-guide.md` step-by-step. Verify checklist before pushing.

### I'm Designing UI/Styling

Read `design-guidelines.md` for:
- Color tokens (light/dark modes)
- Component patterns
- Spacing and typography
- Dark mode implementation
- Accessibility requirements

### I'm Optimizing Performance

See:
- `deployment-guide.md` — performance budget and monitoring
- `system-architecture.md` — performance profiles and optimization opportunities
- `codebase-summary.md` — module size and complexity

### I'm Planning Features

See `project-roadmap.md`:
- Current phase status
- Upcoming phases
- Success metrics
- Risk assessment
- Backlog and future ideas

---

## 📊 Documentation Statistics

| Document | Lines | Size | Focus |
|-----------|-------|------|-------|
| project-overview-pdr.md | 353 | 14K | Vision, scope, metrics |
| system-architecture.md | 615 | 23K | Code structure, algorithms |
| codebase-summary.md | 783 | 24K | Module reference, navigation |
| code-standards.md | 900 | 22K | Conventions, patterns, rules |
| design-guidelines.md | 568 | 14K | Colors, typography, components |
| deployment-guide.md | 576 | 14K | Setup, build, deploy, ops |
| project-roadmap.md | 564 | 17K | Vision, timeline, features |
| **Total** | **4,359** | **128K** | **Comprehensive coverage** |

**All documents kept ≤ 800 LOC for optimal token efficiency.**

---

## 🔍 Key Concepts Explained

### Word Families

A **word family** is a root word (e.g., "create") plus all its grammatical forms:
- Noun: creator
- Verb: create
- Adjective: creative
- Adverb: creatively

Teaching words in families makes learning more efficient (affix understanding = 5000+ words from 500 roots + 50 affixes).

**See:** `project-overview-pdr.md` → "Core Concepts"

### SM-2 Spaced Repetition Algorithm

Piotr Wozniak's SuperMemo 2 (1987). Users rate flashcards 0–5 (quality); algorithm calculates next review date based on:
- Ease factor (how easy the word is)
- Repetition count
- Previous intervals

Mastery = 5+ repetitions with quality ≥ 3.

**See:** `system-architecture.md` → "Algorithm: SM-2 Spaced Repetition"

### Quiz Mechanics

Users fill-in-the-blank: suffix is masked (hidden), user types it, scored case-insensitively.
- Suffix = last ~30–50% of letters
- Example: "create" → visible="cr", hidden="eate"

**See:** `system-architecture.md` → "Quiz Mechanics"

### PWA (Progressive Web App)

An app installed on mobile home screen via browser (no app store). Works offline. Cached via Service Worker + Workbox.

**See:** `system-architecture.md` → "PWA & Offline"

### Dark Mode

System preference auto-detected; user can toggle. All colors defined as CSS custom properties that switch on `.dark` class.

**See:** `design-guidelines.md` → "Dark Mode Implementation"

### Dexie.js & Transactions

IndexedDB wrapper. All data stored client-side (no backend). Transactions ensure atomic updates (all-or-nothing).

**See:** `codebase-summary.md` → "Database Module"

---

## 🛠️ Development Workflow

### Before You Code

1. Read `code-standards.md` (your rules)
2. Check `codebase-summary.md` for similar patterns
3. Understand the SM-2 algorithm if touching reviews

### While Coding

- Keep files ≤200 LOC (split if larger)
- Follow naming conventions from `code-standards.md`
- Use TypeScript strict mode (no `any`)
- Test dark mode
- Test mobile (320px–480px)

### Before Committing

```bash
npm run lint      # ESLint check
npm run build     # TypeScript + Vite build
```

Then commit:
```bash
git commit -m "feat: add suffix quiz feature"
# Or: fix: / docs: / refactor: / test: / chore:
```

### Before Deploying

1. Follow checklist in `deployment-guide.md`
2. Test locally with `npm run preview`
3. Verify PWA installs
4. Test offline (DevTools → Network → Offline)
5. Push to main; Vercel auto-deploys

---

## 🚀 Common Tasks

### Add a New Page

1. Create file in `pages/` (e.g., `pages/new-page.tsx`)
2. Add route in `App.tsx`
3. Create custom hook in `hooks/` if needed
4. Create components in `components/`
5. Style using CSS variables from `design-guidelines.md`
6. Update `codebase-summary.md` with the new module

### Add a New Custom Hook

1. Create file in `hooks/` (e.g., `hooks/use-new-feature.ts`)
2. Follow pattern from `code-standards.md` → "Hook Rules"
3. Export hook function
4. Document return type with JSDoc
5. Test with component

### Modify SM-2 Algorithm

1. Read `system-architecture.md` → "Algorithm: SM-2 Spaced Repetition"
2. Update `utils/sm2-algorithm.ts`
3. Write unit tests to verify against reference implementation
4. Test with actual reviews in the app
5. Document any changes in commit message

### Deploy to Production

1. Follow `deployment-guide.md` → "Deployment to Vercel"
2. Run pre-deploy checklist
3. Vercel auto-builds and deploys
4. Monitor via Vercel dashboard

### Report a Bug

1. Check `codebase-summary.md` to find related module
2. Create GitHub issue using bug report template (see `project-roadmap.md`)
3. Include reproduction steps, screenshots, console errors
4. Link to relevant code if possible

---

## 📖 Reading Order by Use Case

**First time learning the project:**
- `project-overview-pdr.md` (30 min)
- `system-architecture.md` (40 min)
- `codebase-summary.md` (30 min)
- ✓ You now understand the whole system

**Adding a feature:**
- `project-roadmap.md` (10 min) — check if it's in the plan
- `design-guidelines.md` (15 min) — UI consistency
- `code-standards.md` (20 min) — patterns & conventions
- ✓ You're ready to code

**Fixing a bug:**
- `codebase-summary.md` (5 min) — find the module
- Read the relevant code file
- ✓ Fix it

**Deploying:**
- `deployment-guide.md` (20 min) — full checklist
- ✓ Ship it

**Performance optimization:**
- `system-architecture.md` (30 min) — current perf profile
- `deployment-guide.md` (15 min) — monitoring & budgets
- ✓ Optimize

---

## 🔗 External Resources

- **React Docs:** https://react.dev
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Dexie.js:** https://dexie.org/
- **framer-motion:** https://www.framer.com/motion/
- **Vercel Docs:** https://vercel.com/docs
- **vite-plugin-pwa:** https://vite-pwa-org.netlify.app/
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **SM-2 Paper:** https://supermemo.guru/wiki/SuperMemo_2

---

## 📝 How to Update Docs

When changing code, update relevant docs:

1. **New feature?** → Update `project-roadmap.md` (mark as complete)
2. **New module/file?** → Update `codebase-summary.md`
3. **New patterns/conventions?** → Update `code-standards.md`
4. **New endpoints/schema?** → Update `system-architecture.md`
5. **UI changes?** → Update `design-guidelines.md`
6. **Deployment changes?** → Update `deployment-guide.md`
7. **Major changes?** → Update `project-overview-pdr.md`

**Keep docs accurate:** Stale docs are worse than no docs. Remove outdated sections rather than leaving TODO markers.

---

## 🎓 Onboarding Checklist (for New Developers)

- [ ] Clone repository: `git clone ...`
- [ ] Install dependencies: `cd app && npm install`
- [ ] Run locally: `npm run dev` → verify app loads
- [ ] Read `project-overview-pdr.md` (understand the vision)
- [ ] Read `system-architecture.md` (understand the code)
- [ ] Read `code-standards.md` (learn our conventions)
- [ ] Try adding a word family (test the feature)
- [ ] Try a study session (test SM-2)
- [ ] Toggle dark mode (test theming)
- [ ] Run linter: `npm run lint`
- [ ] Try build: `npm run build`
- [ ] Ask questions! (GitHub issues or direct message)

---

## 💬 Questions?

If something is unclear:

1. **Search this directory** — your question might be answered in one of the docs
2. **Check code comments** — complex logic has explanations
3. **Open GitHub issue** — describe what confused you
4. **Ask the team** — we're here to help

**Remember:** Good documentation saves time. If you find gaps, please update the docs for the next person!

---

## 📄 Document License

All documentation is part of Vocab Family. Same license as the code repository.

---

**Last Updated:** May 2026  
**Maintained By:** Development Team  
**Next Review:** June 2026
