# Deployment Guide

**Version:** 1.0  
**Last Updated:** May 2026  
**Current Deployment:** Vercel (https://vocab-family.vercel.app)

---

## Quick Start

### Local Development

```bash
cd app
npm install
npm run dev
```

Open http://localhost:5173 (Vite default). Hot module replacement (HMR) enabled; changes reflect immediately.

**First Time Setup:**
1. App auto-imports 197 seed word families on first visit
2. IndexedDB created (`VocabFamilyDB`)
3. Dark mode auto-detected from system preference

### Production Build

```bash
cd app
npm run build      # Outputs dist/
npm run lint       # Check for lint errors
```

Build includes:
- TypeScript compilation (`tsc`)
- Vite bundling + minification
- CSS purging (unused Tailwind removed)
- Service Worker generation (PWA)
- Source maps for debugging

**Output:** `app/dist/` (ready to deploy)

---

## Deployment to Vercel

### Prerequisites

- Vercel account (free tier sufficient)
- Git repository (GitHub, GitLab, Bitbucket)
- Node.js 18+ locally

### Step 1: Connect Repository

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import git repository (Github/GitLab/Bitbucket)
4. Select repository: `Grammar` (or your repo name)

### Step 2: Configure Build Settings

Vercel auto-detects Next.js but this is a Vite SPA. Configure:

| Setting | Value | Notes |
|---------|-------|-------|
| Framework | Other (Vite) | Select "Other" from dropdown |
| Build Command | `cd app && npm install && npm run build` | Must cd into app/ directory |
| Output Directory | `app/dist` | Vercel serves this folder |
| Install Command | `npm install` | Default is fine |
| Development Command | `npm run dev` | For preview only |

**Click "Deploy"** and wait ~2 minutes for first build.

### Step 3: Verify Deployment

1. Vercel provides a preview URL (e.g., `https://vocab-family-abc123.vercel.app`)
2. Open in browser; verify:
   - [ ] Page loads (no 404 or blank page)
   - [ ] Seed data imported (197 word families visible in browse)
   - [ ] Dark mode works
   - [ ] Service Worker registered (DevTools → Application → Service Workers)
   - [ ] PWA installable (Chrome: "Install app", iOS: Share → Add Home Screen)
   - [ ] IndexedDB persisted (DevTools → Application → Storage → IndexedDB)
3. Promote to production: Click "Domains" → assign production domain (or use `vercel.app` subdomain)

### Step 4: Production Domain (Optional)

To use custom domain (e.g., `vocab-family.com`):

1. Vercel dashboard → Project → Settings → Domains
2. Add domain: `vocab-family.com`
3. Update DNS to point to Vercel (Vercel provides CNAME record)
4. Wait 5–10 min for DNS propagation

---

## Environment Variables

**Vocab Family requires no environment variables.** All configuration is client-side (no backend API keys, secrets, or database credentials).

If future features require secrets (e.g., cloud sync with Supabase), add to `.env.local`:

```bash
# .env.local (not committed)
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_KEY=...
```

Access in code:
```ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
```

**Never commit `.env.local` or any secrets to git.**

---

## PWA Configuration

### Service Worker & Manifest

Vercel auto-serves:
- `public/sw.js` — Service Worker (cached by Workbox)
- `public/manifest.json` — PWA metadata

**Workbox precaches:**
- All `.js` and `.css` bundles
- `index.html`
- Images and icons
- Fonts (if any)

### Testing PWA Install

#### Desktop / Android Chrome

1. Open app in Chrome
2. DevTools → Application → Manifest
3. Click "Install app" (or browser shows prompt)
4. App installed to home screen

#### iOS Safari

1. Open app in iOS Safari
2. Tap Share (bottom right) → Add to Home Screen
3. Name the shortcut, tap "Add"
4. App icon added to home screen
5. Works offline after first visit

**Verify offline capability:**
1. Toggle DevTools Network → Offline
2. Refresh page (should load from cache)
3. Navigate between routes (should work)
4. Try adding a word (works; persisted to IndexedDB)

### Icons & Splash Screen

**Icons generated from `public/icon.png`** (if present):
- Apple touch icon (180×180)
- Android icons (multiple sizes)
- PWA splash screen (dark mode aware)

**To customize:**
1. Replace `public/icon.png` (192×192 minimum, PNG preferred)
2. Update `vite.config.ts`:
```ts
VitePWA({
  workbox: { ...existing config... },
  includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
  manifest: {
    name: 'Vocab Family',
    short_name: 'Vocab',
    description: 'Learn English word families with spaced repetition',
    theme_color: '#6366f1',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    icons: [
      { src: 'icon.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'icon.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    ]
  }
})
```
3. Rebuild: `npm run build`

---

## Performance Optimization

### Build Size

**Current metrics:**
- Gzipped bundle: ~675 KB
- Uncompressed: ~2.1 MB
- Service Worker cache: ~700 KB (precached assets)

**To reduce size:**
1. **Tree-shake unused code:** Vite auto-does this; ensure no dead imports
2. **Lazy-load components:** (Not yet implemented; future optimization)
   ```ts
   const HomePage = lazy(() => import('./pages/home-page'))
   ```
3. **Analyze bundle:** 
   ```bash
   npm install -D vite-plugin-visualizer
   # Then use plugin to see what's large
   ```

### Caching Strategy

**Vercel CDN:**
- Static assets (`.js`, `.css`, images): 1 year TTL (immutable due to hash names)
- `index.html`: No cache (always fetch fresh to check for updates)

**Service Worker (Workbox):**
- Precaches all static assets on first visit
- Offline: serves from cache
- Online: checks for updates in background (transparent to user)

### Network Performance

**Recommendations:**
1. Monitor Core Web Vitals via Vercel Analytics
2. Target: LCP ≤ 2.5s, CLS ≤ 0.1, FID ≤ 100ms
3. Optimize: reduce app code, lazy-load routes, optimize images

---

## Monitoring & Debugging

### Vercel Dashboard

1. Project Overview:
   - Recent deployments
   - Error logs (if build fails)
   - Analytics (request count, response time)

2. Logs:
   - Click "Logs" to see build & runtime logs
   - Useful for diagnosing deployment issues

3. Analytics:
   - Page views, edge requests, data consumed
   - Core Web Vitals (if enabled)

### Browser DevTools

**Application Tab:**
- Service Workers: verify registered and active
- Manifest: verify PWA metadata
- Storage → IndexedDB: verify `VocabFamilyDB` exists and contains data
- Cache Storage: verify Workbox precache entries

**Console Tab:**
- Check for errors (should be none in production)
- Verify PWA registration logs

**Network Tab:**
- Check offline mode (toggle offline, refresh)
- Verify cache hits (response from cache, not network)

### Error Tracking (Future)

If errors occur in production:
1. Users will see error in browser console
2. Encourage users to report via GitHub issues
3. No server-side error logs (no backend)

---

## Common Issues & Solutions

### Issue: Build Fails

**Error:** `npm run build` fails with TypeScript errors

**Solution:**
```bash
cd app
npm run lint    # Check for lint errors first
tsc -b          # Check TypeScript
npm run build   # Try again
```

**Check:**
- TypeScript strict mode enabled
- All imports resolved
- No `any` types without justification

### Issue: PWA Not Installable

**Error:** No install prompt appears; Service Worker not registered

**Solution:**
1. Verify HTTPS (required for PWA; Vercel provides this)
2. Check `public/manifest.json` exists and is valid
3. DevTools → Application → Manifest: verify metadata
4. Clear browser cache: DevTools → Clear site data

### Issue: Data Lost After Refresh

**Error:** IndexedDB not persisting; words disappear

**Solution:**
1. Check DevTools → Application → Storage → IndexedDB → `VocabFamilyDB`
2. Verify tables exist: `wordFamilies`, `reviewStats`, `userProgress`
3. Check browser storage quota (unlikely to exceed unless 1000+ families added)
4. Try incognito window (ensures no privacy mode issues)

### Issue: Offline Not Working

**Error:** App requires network; doesn't work offline

**Solution:**
1. DevTools → Network → offline toggle
2. Verify Service Worker active (DevTools → Application)
3. Verify `dist/sw.js` served (Network tab, offline should show from cache)
4. Check Workbox precache (inspect `dist/workbox-*.js` files)

### Issue: Dark Mode Not Working

**Error:** Dark mode toggle doesn't apply

**Solution:**
1. Verify `.dark` class applied to `<html>` (DevTools Elements)
2. Check CSS variables defined in `index.css` (should see `.dark { --color-background: ... }`)
3. Clear browser cache
4. Try incognito window

---

## Rollback & Versioning

### Rollback a Deployment

If a deployment has critical issues:

1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click deployment → "Promote to Production"
4. Takes ~1 minute

### Semantic Versioning (Future)

Track releases in `app/package.json`:
```json
{
  "version": "1.0.0",
  ...
}
```

**Format:** `MAJOR.MINOR.PATCH`
- MAJOR: breaking changes (e.g., database schema migration)
- MINOR: new features (e.g., cloud sync)
- PATCH: bug fixes (e.g., SM-2 algorithm correction)

**Update on release:**
```bash
npm version minor  # Bumps version, creates git tag
git push --tags
```

---

## Staging & Preview Deployments

### Preview Deployments (Automatic)

Every git push creates a preview deployment (unique URL):
- Vercel: `https://vocab-family-pr-123.vercel.app` (for pull requests)
- Use to test changes before production

### Manual Staging (Optional)

To test before production push:

```bash
# Create a staging branch
git checkout -b staging

# Make changes, test locally
npm run dev

# Build & test prod build
npm run build
npm run preview   # Serves dist/ locally at http://localhost:5000

# If OK, merge to main
git checkout main
git merge staging
git push
```

---

## Health Checks

### Weekly Checklist

- [ ] App loads in 2–3 seconds (measure via DevTools)
- [ ] Dark mode toggles without flicker
- [ ] PWA installs on iOS/Android
- [ ] Offline functionality works (no network, app still usable)
- [ ] Seed data intact (197 word families in browse)
- [ ] No console errors (DevTools Console)
- [ ] Service Worker updated (check "Update" button in DevTools)

### Monthly Checklist

- [ ] Vercel logs clean (no deploy errors, runtime errors)
- [ ] Core Web Vitals check (Vercel Analytics or PageSpeed Insights)
- [ ] Database size check (DevTools Storage → IndexedDB size)
- [ ] Review analytics (users, page views, error rate)
- [ ] Test quiz feature (ensure scoring correct)
- [ ] Test SM-2 algorithm (review a card, verify interval updated)

---

## CI/CD Pipeline (Future)

**If added to GitHub Actions:**

```yaml
name: Build & Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd app && npm install && npm run lint && npm run build
      - uses: vercel/actions@v3
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

**Steps:**
1. Add `VERCEL_TOKEN` to GitHub Secrets
2. Add workflow to `.github/workflows/deploy.yml`
3. Push triggers automatic deploy (no manual `vercel --prod` needed)

---

## Security Considerations

### No Sensitive Data

✅ **Safe to expose:**
- Source code (open-source friendly)
- Seed word families (educational, public domain)
- Type definitions
- Configuration (no secrets)

❌ **Never commit:**
- `.env.local` (environment variables)
- API keys or tokens
- Database credentials
- Private user data

### HTTPS & CSP

**Vercel auto-provides:**
- HTTPS with auto-renewal SSL certificate
- CSP headers (blocks inline scripts, external resources)

**Verify:**
```bash
curl -I https://vocab-family.vercel.app
# Look for: Strict-Transport-Security, Content-Security-Policy
```

### Data Privacy

- No server logs (no backend = no data collection)
- All data stored locally in browser (user controls deletion)
- No cookies or tracking
- No third-party scripts

---

## Performance Budget

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Gzipped bundle | ≤ 700 KB | ~675 KB | ✅ Pass |
| First Contentful Paint | ≤ 1.5s | ~1.0s | ✅ Pass |
| Largest Contentful Paint | ≤ 2.5s | ~2.0s | ✅ Pass |
| Cumulative Layout Shift | ≤ 0.1 | ~0.03 | ✅ Pass |
| TTL on static assets | 1 year | Configured | ✅ Pass |

---

## Backup & Recovery

### Local Backup

Users can export their vocabulary:

```ts
// Future feature: export IndexedDB as JSON
const allFamilies = await db.wordFamilies.toArray()
const allStats = await db.reviewStats.toArray()
const backup = { wordFamilies: allFamilies, reviewStats: allStats }
download(JSON.stringify(backup, null, 2), 'vocab-backup.json')
```

### Browser Storage Recovery

If IndexedDB is lost:
1. Clear browser data: DevTools → Application → Clear site data
2. Reload app
3. Seed data re-imported automatically
4. User-added families are lost (use backup file if available)

---

## Support & Resources

### Links

- **Live App:** https://vocab-family.vercel.app (update URL after deployment)
- **Repository:** https://github.com/[username]/Grammar
- **Issues:** https://github.com/[username]/Grammar/issues
- **Vercel Docs:** https://vercel.com/docs

### Contact

**Project Lead:** Brian Nguyen  
**Email:** nghong.quan403@gmail.com

---

## Deployment Checklist

Before pushing to production:

- [ ] `npm run lint` passes (no errors)
- [ ] `npm run build` succeeds
- [ ] All routes accessible in `dist/` (test with `npm run preview`)
- [ ] Dark mode works
- [ ] PWA installable
- [ ] Offline-functional
- [ ] No console errors
- [ ] Seed data loads (197 families)
- [ ] SM-2 algorithm tested (review a card, check interval)
- [ ] Quiz scoring verified
- [ ] Mobile responsive (320px–480px)
- [ ] iOS safe areas accounted for
- [ ] Git commit message follows conventional commits
- [ ] No secrets in commit

**Once checked:**
```bash
git push origin main   # Triggers Vercel auto-deploy
# Vercel builds & deploys automatically; monitor at https://vercel.com/dashboard
```

---

## Post-Deployment

1. **Test production URL:** Open in desktop + mobile browsers
2. **Share with users:** Send deployment link via social/email
3. **Monitor:** Watch Vercel Analytics for errors, slow requests
4. **Gather feedback:** Set up issue tracker for user reports
5. **Plan next release:** Roadmap updates based on user requests
