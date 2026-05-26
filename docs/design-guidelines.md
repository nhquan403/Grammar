# Design Guidelines

**Version:** 1.0  
**Last Updated:** May 2026

---

## Design System Overview

Vocab Family uses a **token-based design system** built on CSS custom properties. This ensures consistency, maintainability, and seamless dark mode support. All colors, shadows, and spacing are defined once in `index.css` and inherited by all components via Tailwind CSS and custom CSS classes.

---

## Color Palette

### Light Mode (Default)

```css
/* Backgrounds */
--color-background: rgb(248 250 252)    /* Page background, lightest */
--color-card: rgb(255 255 255)          /* Card background */
--color-surface: rgb(255 255 255)       /* Elevated surface */
--color-surface-raised: rgb(248 250 252) /* Raised surface (subtle lift) */

/* Text & Foreground */
--color-foreground: rgb(15 23 42)       /* Primary text, darkest */
--color-muted-foreground: rgb(100 116 139) /* Secondary text, hints */

/* Interactive */
--color-primary: rgb(99 102 241)        /* Buttons, links, accents (indigo) */
--color-primary-foreground: rgb(255 255 255) /* Text on primary */

/* Borders & Dividers */
--color-border: rgb(226 232 240)        /* Subtle borders, dividers */

/* Parts of Speech (POS) Colors */
--color-pos-noun: rgb(59 130 246)       /* Blue */
--color-pos-verb: rgb(168 85 247)       /* Purple */
--color-pos-adj: rgb(249 115 22)        /* Orange */
--color-pos-adv: rgb(20 184 166)        /* Teal */
```

### Dark Mode

```css
.dark {
  /* Backgrounds */
  --color-background: rgb(10 15 28)     /* Page background, darkest */
  --color-card: rgb(20 28 46)           /* Card background, dark blue */
  --color-surface: rgb(20 28 46)        /* Elevated surface */
  --color-surface-raised: rgb(15 22 38) /* Raised surface (darker lift) */

  /* Text & Foreground */
  --color-foreground: rgb(241 245 249)  /* Primary text, lightest */
  --color-muted-foreground: rgb(148 163 184) /* Secondary text, hints */

  /* Interactive */
  --color-primary: rgb(129 140 248)     /* Buttons, links (lighter indigo) */
  --color-primary-foreground: rgb(255 255 255) /* Text on primary */

  /* Borders & Dividers */
  --color-border: rgb(30 41 59)         /* Subtle borders, dividers */

  /* POS Colors remain same (good contrast in dark mode too) */
}
```

### Color Usage

| Element | Light Mode | Dark Mode | Purpose |
|---------|-----------|-----------|---------|
| Page background | `#f8fafc` | `#0a0f1c` | Minimal, neutral |
| Card | `#ffffff` | `#141c2e` | Focus area, interactive |
| Text | `#0f172a` | `#f1f5f9` | Maximum contrast for readability |
| Links/buttons | `#6366f1` | `#8190f8` | Clear call-to-action |
| Hints/secondary | `#64748b` | `#94a3b8` | De-emphasized content |
| Borders | `#e2e8f0` | `#1e293b` | Subtle separators |

### Accessibility Notes

- **Light mode:** All text meets WCAG AA (4.5:1) contrast ratio
- **Dark mode:** All text meets WCAG AA (4.5:1) contrast ratio
- **POS colors:** Chosen for colorblind-safe palette (no red-green dependence)

---

## CEFR Level Colors

CEFR badges use a gradient from light (beginner) to dark (advanced):

| Level | Hex | Tailwind Class | Meaning |
|-------|-----|---|---------|
| A1 | `#dbeafe` | `bg-blue-100 text-blue-900` | Beginner (light blue) |
| A2 | `#bfdbfe` | `bg-blue-200 text-blue-900` | Elementary (soft blue) |
| B1 | `#93c5fd` | `bg-blue-400 text-white` | Intermediate (medium blue) |
| B2 | `#3b82f6` | `bg-blue-500 text-white` | Upper-intermediate (bold blue) |
| C1 | `#1e40af` | `bg-blue-800 text-white` | Advanced (dark blue) |
| C2 | `#0c0a1f` | `bg-blue-950 text-white` | Mastery (almost black) |

**Usage:**
```tsx
<span className="cefr-B1 px-2 py-1 rounded text-sm font-medium">B1</span>
```

---

## POS (Parts of Speech) Colors

Parts of speech use semantic colors for quick visual recognition:

```css
--color-pos-noun: rgb(59 130 246)       /* Blue: person, place, thing */
--color-pos-verb: rgb(168 85 247)       /* Purple: action, movement */
--color-pos-adj: rgb(249 115 22)        /* Orange: description, quality */
--color-pos-adv: rgb(20 184 166)        /* Teal: how, when, where */
```

**Usage:**
```tsx
<span className="pos-verb">verb</span>  /* Purple text */
<span className="badge bg-purple-100 text-purple-900">verb</span>  /* Purple badge */
```

**Why these colors?**
- Blue = nouns (stable, foundational like background)
- Purple = verbs (dynamic, elevated like primary action)
- Orange = adjectives (warm, descriptive)
- Teal = adverbs (cool, modifying)

---

## Shadow System

Shadows create depth and hierarchy through elevation:

```css
/* Light Mode */
--shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
--shadow-card-hover: 0 4px 16px rgba(99,102,241,0.12), 0 2px 6px rgba(0,0,0,0.06)
--shadow-fab: 0 4px 20px rgba(99,102,241,0.45)
--shadow-elevated: 0 8px 30px rgba(0,0,0,0.12)

/* Dark Mode */
--shadow-card: 0 1px 3px rgba(0,0,0,0.3)
--shadow-card-hover: 0 4px 16px rgba(99,102,241,0.2), 0 2px 8px rgba(0,0,0,0.3)
--shadow-fab: 0 4px 20px rgba(99,102,241,0.5)
--shadow-elevated: 0 8px 30px rgba(0,0,0,0.4)
```

### Shadow Elevation Levels

| Shadow | Elevation | Use Case |
|--------|-----------|----------|
| `--shadow-card` | Base | Default card (search results, word list) |
| `--shadow-card-hover` | +2 | Hover state on interactive cards |
| `--shadow-fab` | +3 | Floating Action Button (Add Word) |
| `--shadow-elevated` | +4 | Modals, toasts (not yet implemented) |

**Usage:**
```tsx
<div className="card" style={{ boxShadow: 'var(--shadow-card)' }}>
  Word family card
</div>

<button className="card-interactive" /* hover applies --shadow-card-hover */>
  Click me
</button>
```

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

**Rationale:** System fonts for fast load, native feel, optimal readability.

### Font Sizes & Weights

| Level | Size | Weight | Use Case |
|-------|------|--------|----------|
| Heading 1 | 28px | 700 | Page title (rare) |
| Heading 2 | 20px | 600 | Section title (stats label) |
| Heading 3 | 18px | 600 | Card title |
| Body | 16px | 400 | Default text |
| Small | 14px | 400 | Secondary text, hints |
| Tiny | 12px | 500 | Badge labels, footnotes |

**Usage in Tailwind:**
```tsx
<h1 className="text-2xl font-bold">Study Dashboard</h1>
<h2 className="text-lg font-semibold">Today's Goal</h2>
<p className="text-sm text-muted-foreground">3 cards due</p>
```

---

## Spacing & Layout

### Spacing Scale (8px base)

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

**Implemented via Tailwind classes:**
```tsx
<div className="p-4">          /* padding: 16px (md) */
  <div className="mb-6">       /* margin-bottom: 24px (lg) */
    <h1 className="text-xl">Title</h1>
  </div>
</div>
```

### Responsive Breakpoints

Mobile-first design. Vocab Family optimizes for **320px–480px** (mobile only; no tablet/desktop views):

```css
/* Mobile-first (all devices start here) */
.card { padding: 16px; }

/* Landscape optimization (optional, not enforced) */
@media (min-width: 640px) {
  .card { padding: 24px; }
}
```

---

## Component Patterns

### Cards

**Base card:**
```tsx
<div className="card p-4">
  <h3 className="text-lg font-semibold mb-2">Title</h3>
  <p className="text-muted-foreground">Content</p>
</div>
```

**Interactive card (hover effect):**
```tsx
<div className="card-interactive p-4 cursor-pointer">
  Clickable content
</div>
```

### Badges

**POS badge:**
```tsx
<span className="pos-verb px-2 py-1 rounded text-sm font-medium bg-purple-100">
  verb
</span>
```

**CEFR badge:**
```tsx
<span className="cefr-B1 px-2 py-1 rounded text-sm font-medium text-white">
  B1
</span>
```

**Generic badge:**
```tsx
<span className="badge bg-gray-200 text-gray-900 px-2 py-1 rounded">
  common
</span>
```

### Buttons

**Primary button:**
```tsx
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
  Study Now
</button>
```

**Ghost button (secondary):**
```tsx
<button className="text-primary hover:bg-secondary px-4 py-2 rounded-lg">
  Cancel
</button>
```

### Input Fields

**Search input:**
```tsx
<input
  type="text"
  placeholder="Search words..."
  className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground"
/>
```

---

## Animations

### Animation Library

**framer-motion** for all animations. No CSS transitions for complex interactions.

### Common Animations

**Fade + Slide Up (entry):**
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.3 }}
>
  Content fades in and slides up
</motion.div>
```

**Swipe gesture (flashcard):**
```tsx
<motion.div
  drag="x"
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    if (info.offset.x > 100) handleSwipeRight()
    else if (info.offset.x < -100) handleSwipeLeft()
  }}
>
  Drag me left or right
</motion.div>
```

**Pulse animation (loading):**
```tsx
<motion.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ duration: 1.5, repeat: Infinity }}
>
  Loading...
</motion.div>
```

### Duration Guidelines

| Duration | Use Case |
|----------|----------|
| 150ms | Quick feedback (button click, toggle) |
| 300ms | Enter/exit animations (fade, slide) |
| 500ms | Complex transitions (carousel) |
| 1500ms+ | Loops (pulse, breathing) |

---

## Dark Mode Implementation

### System Detection

**On app load, detect system preference:**
```ts
// In useDarkMode hook
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (prefersDark) {
  document.documentElement.classList.add('dark')
}
```

### Manual Toggle

**User can override system preference:**
```tsx
function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })

  const toggle = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button onClick={toggle}>
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}
```

### Testing Dark Mode

1. Open DevTools → Rendering → Emulate CSS media feature `prefers-color-scheme`
2. Toggle between `light` and `dark`
3. Verify all colors readable in both modes
4. Verify icons/badges visible and clear

---

## Accessibility Considerations

### Color Contrast

**Verified with WebAIM Contrast Checker:**
- Text on background: ≥4.5:1 (WCAG AA)
- UI components: ≥3:1 (WCAG AA for graphics)

### Icon Usage

**All icons paired with text or aria-label:**
```tsx
// ✓ Good
<button aria-label="Delete word family" title="Delete">
  <Trash2 size={20} />
</button>

// ✗ Bad: icon only, unclear
<button><Trash2 size={20} /></button>
```

### Focus States

**All interactive elements have visible focus:**
```css
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Text Sizing

**Allow user to increase text size (browser zoom):**
- Use relative units (em, rem, %) not px
- Test at 200% zoom

---

## Mobile-First Design

### Viewport & Safe Areas

**Set viewport meta tag:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

**Account for notch/safe area on iOS:**
```css
/* Layout respects notch and home indicator */
main {
  padding: 16px;
  padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
}
```

### Touch Targets

**All buttons ≥44px × 44px (iOS guideline):**
```tsx
<button className="px-4 py-2">  /* ~48px × 40px minimum */
  Study
</button>
```

**Avoid hover-only interfaces:**
```tsx
// ✗ Bad: hover reveals action (mobile can't hover)
<div className="card hover:bg-gray-100">
  Hover to see menu
</div>

// ✓ Good: visible by default
<div className="card flex items-center justify-between">
  <span>Word</span>
  <button>Menu</button>
</div>
```

### Portrait & Landscape

**Design for portrait (320px–480px wide):**
- Navigation at bottom (easier thumb reach)
- Content scrolls vertically
- No fixed sidebars

---

## Theming Strategy

### Light Mode (Default)

- Clean, minimal aesthetic
- High contrast for daytime use
- Indigo primary color (#6366F1)

### Dark Mode

- Reduced eye strain for night use
- Softer shadows (dark background = darker shadows look wrong)
- Lighter indigo primary (#8190F8) for readability

### Testing Checklist

- [ ] Light mode text readable (4.5:1 contrast)
- [ ] Dark mode text readable (4.5:1 contrast)
- [ ] CEFR badges visible in both modes
- [ ] POS colors distinct in both modes
- [ ] Shadows appropriate (not too harsh in dark)
- [ ] Cards have clear boundary in both modes
- [ ] Icons/badges don't disappear

---

## Future Design Tokens

**Reserved for Phase 2+:**
- Animation tokens (durations, easing)
- Spacing tokens as CSS variables
- Breakpoint tokens
- Opacity/blend modes for hover states

---

## References

- **Design System:** CSS Custom Properties (CSS Variables)
- **Utility CSS:** Tailwind CSS v4
- **Color Palette:** Based on Tailwind colors (indigo, slate, blue, purple, orange, teal)
- **Spacing:** 8px base scale (inspired by Material Design, Chakra UI)
- **Typography:** System fonts (Apple San Francisco, Segoe UI)
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Icons:** lucide-react (24px default size)

---

## Component Color Reference

| Component | Color | Light | Dark |
|-----------|-------|-------|------|
| Page background | `--color-background` | `#f8fafc` | `#0a0f1c` |
| Card | `--color-card` | `#ffffff` | `#141c2e` |
| Primary button | `--color-primary` | `#6366f1` | `#8190f8` |
| Text | `--color-foreground` | `#0f172a` | `#f1f5f9` |
| Hint text | `--color-muted-foreground` | `#64748b` | `#94a3b8` |
| Border | `--color-border` | `#e2e8f0` | `#1e293b` |
| POS noun | `--color-pos-noun` | `#3b82f6` | `#3b82f6` |
| POS verb | `--color-pos-verb` | `#a855f7` | `#a855f7` |
| POS adjective | `--color-pos-adj` | `#f97316` | `#f97316` |
| POS adverb | `--color-pos-adv` | `#14b8a6` | `#14b8a6` |

All colors auto-switch when `.dark` class applied to `<html>` element.
