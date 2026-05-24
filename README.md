# Vocab Family

A mobile-first English vocabulary learning app built with React + TypeScript.

Learn words by **word families** (root word + all POS forms: noun, verb, adjective, adverb) using a **Spaced Repetition System** (SM-2 algorithm).

## Features

- 📚 60+ word families (A1–C1, common / academic / IELTS / business)
- 🔁 SM-2 spaced repetition — swipe left/right on flashcards
- 📊 Progress dashboard with streak, mastery breakdown, CEFR distribution
- 🔍 Browse & search with CEFR and category filters
- 📲 PWA — installable on iPhone/Android, works offline
- 🌙 Dark mode
- 💾 All data stored in IndexedDB (no backend needed)

## Tech Stack

- React 19 + TypeScript + Vite 5
- Tailwind CSS v4 + framer-motion
- Dexie.js (IndexedDB)
- PWA via vite-plugin-pwa

## Getting Started

```bash
cd app
npm install
npm run dev
```

## Deploy

```bash
cd app
npm run build
npx vercel --prod
```
