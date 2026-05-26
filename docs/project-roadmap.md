# Project Roadmap

**Version:** 1.0  
**Last Updated:** May 2026  
**Status:** Active Development

---

## Vision

Vocab Family is a **client-first, user-driven vocabulary learning platform**. Unlike traditional apps that push curated word lists, Vocab Family empowers learners to build their own vocabularies using **word families** (root words + grammatical forms) and the **SM-2 spaced repetition algorithm** proven by decades of cognitive science research.

**Mission:** Lower the barrier to English vocabulary mastery by eliminating accounts, backends, and paywalls while providing the cognitive science tools (spaced repetition + morphological awareness) that actually work.

---

## Release Timeline

### Phase 1: MVP (Completed ✅)

**Duration:** 1–2 weeks  
**Status:** Live on Vercel  
**Shipped Features:**

- [x] Word family creation (noun, verb, adjective, adverb, other)
- [x] Seed dataset: 197 word families (A1–C2 CEFR, all categories)
- [x] Flashcard study: SM-2 algorithm, swipe left/right rating
- [x] Progress dashboard: streak, mastery bar, CEFR distribution
- [x] Browse & search: CEFR + category filters, full-text rootWord search
- [x] Add/edit custom words: user-driven vocabulary expansion
- [x] Suffix quiz: fill-in-the-blank masking, auto-scoring
- [x] PWA: installable on iOS/Android, full offline support
- [x] Dark mode: system-preference aware
- [x] IndexedDB persistence: 100% client-side, no backend
- [x] TypeScript strict mode + ESLint
- [x] Responsive mobile design (320px–480px)

**Metrics Achieved:**
- Build size: ~675 KB gzipped ✅
- Lighthouse PWA: 90+ ✅
- No console errors in production ✅
- All routes responsive ✅
- Dark mode tested ✅
- Offline-functional ✅

---

### Phase 2: Polish & Optimization (In Progress 🔄)

**Duration:** 1 week  
**Status:** Code review + performance tuning  
**Goals:**

- [ ] Performance audit: optimize render cycles, reduce jank
- [ ] Accessibility audit: WCAG 2.1 Level AA compliance
- [ ] Animation refinement: framer-motion transitions
- [ ] Mobile UX: iOS safe areas, notch handling, form inputs
- [ ] Error handling: graceful failures, user-friendly messages
- [ ] Browser compatibility: test on Chrome, Safari, Firefox, Edge
- [ ] Documentation: inline comments, JSDoc, code standards
- [ ] Test scaffolding: unit test examples (not full coverage yet)

**Success Criteria:**
- [ ] Lighthouse score 95+ (all categories)
- [ ] Zero console errors on iPhone/Android
- [ ] WCAG AA contrast ratio verified
- [ ] Smooth 60fps animations
- [ ] Quiz scoring 100% accurate
- [ ] SM-2 algorithm matches reference implementation
- [ ] Documentation complete and accurate

---

### Phase 3: Cloud Sync (Q3 2026 📅)

**Duration:** 2–3 weeks  
**Status:** Design phase  
**Scope:**

**Goal:** Optional cloud backup/restore for multi-device support (not mandatory; app remains fully offline-capable).

**Features:**
- [ ] Supabase integration (PostgreSQL + Auth)
- [ ] One-click backup to cloud
- [ ] One-click restore from cloud
- [ ] Conflict resolution (local vs cloud)
- [ ] Device sync (if user logs in on multiple devices)

**Technical Approach:**
- Supabase free tier (5MB storage, 500MB data transfer)
- Opt-in: users can skip cloud features entirely
- Local-first: sync only on user action (button click)
- No auto-sync (respects user privacy preference)

**Blockers:**
- Need Supabase schema design
- Need auth flow (email/password or OAuth)
- Need conflict resolution strategy

**Success Criteria:**
- [ ] Backup takes <5 seconds
- [ ] Restore takes <10 seconds
- [ ] No data loss on sync
- [ ] Users can delete cloud backup
- [ ] Option to disable sync in settings

---

### Phase 4: Audio & Pronunciation (Q3 2026 📅)

**Duration:** 2 weeks  
**Status:** Spike phase (research feasibility)

**Scope:**

**Goal:** Help users with pronunciation; leverage Web Speech API + optional TTS service.

**Features:**
- [ ] Text-to-Speech (TTS) for word forms
- [ ] Native Web Speech API (Chrome/Edge/Safari)
- [ ] Fallback to Google Translate API (if available)
- [ ] Play icon on word cards
- [ ] Audio controls: play, speed, repeat

**Technical Approach:**
- Browser `SpeechSynthesis` API (free, no backend)
- Fallback: Google Translate TTS (free tier limited)
- Store TTS preference per user (localStorage)

**Blockers:**
- iOS Safari TTS limited (male voice only)
- Some languages/accents missing
- API rate limits if using external service

**Success Criteria:**
- [ ] 80%+ word forms have working audio
- [ ] <500ms latency to play
- [ ] Fallback works if TTS API unavailable
- [ ] No additional dependencies (use native APIs)

---

### Phase 5: Analytics & Insights (Q4 2026 📅)

**Duration:** 1–2 weeks  
**Status:** Backlog

**Scope:**

**Goal:** Help users understand their learning patterns without compromising privacy.

**Features:**
- [ ] Learn curve visualization (how interval changes over time)
- [ ] Forget curve analysis (when do you tend to forget?)
- [ ] Time-of-day analysis (when do you study best?)
- [ ] Export study log as CSV
- [ ] Anki-style statistics (minutes studied, cards/hour, retention %)

**Technical Approach:**
- All analysis done locally (no data sent to server)
- Export as CSV for external analysis (Anki, Supermemo)
- Use Recharts library for charts

**Privacy Notes:**
- No server logs
- No user tracking
- No third-party analytics
- User owns all data

**Success Criteria:**
- [ ] Charts render in <1 second
- [ ] CSV export accurate
- [ ] No memory leaks (large datasets)

---

### Phase 6: Collaborative Features (Q4 2026 📅)

**Duration:** 3+ weeks  
**Status:** Backlog (dependent on cloud sync)

**Scope:**

**Goal:** Enable teachers/study groups to share vocabulary lists.

**Features:**
- [ ] Share word family via URL (read-only link)
- [ ] Create study group (multiple users)
- [ ] Group progress tracking (optional)
- [ ] Peer accountability (optional leaderboard)

**Technical Approach:**
- Short URLs for sharing (e.g., `vocab-family.app/share/abc123`)
- Supabase for group data (if Phase 3 implemented)
- No real-time sync (async updates OK)

**Privacy Considerations:**
- Users choose what to share
- No forced social features
- Leaderboards opt-in, not default
- No email collection for invites

**Success Criteria:**
- [ ] Share links work across devices
- [ ] Group data stored securely
- [ ] No spam/harassment vectors

---

## Feature Backlog (Not Planned)

### Won't Implement (Out of Scope)

These features align with "client-first" philosophy; adding them would require backend + complexity:

- **User accounts** — Privacy-unfriendly; app works offline without login
- **Multimedia (video/audio flashcards)** — Storage-heavy; increases complexity
- **AI-powered personalization** — Requires neural networks; poor UX in browser
- **Spaced repetition tutoring** — Too complex for initial scope
- **Multi-language support** — Scope creep; focus on English first
- **Native mobile apps** — PWA covers 90% of use cases

### Future (Post-Phase 6)

- Social leaderboards (if demand exists)
- Teacher classroom dashboard (requires backend)
- Mobile app (native iOS/Android) if PWA inadequate
- Flashcard API for third-party tools
- Integration with Anki/Supermemo

---

## Success Metrics (Per Phase)

### Phase 1 (MVP)

| Metric | Target | Achieved |
|--------|--------|----------|
| Features implemented | All listed | ✅ Yes |
| Build size | ≤700 KB gzipped | ✅ ~675 KB |
| Lighthouse PWA | ≥90 | ✅ Pass |
| Mobile responsive | 320px–480px | ✅ Pass |
| Offline-functional | 100% | ✅ Pass |
| No console errors | 0 | ✅ Pass |
| SM-2 accuracy | Matches reference | ✅ Verified |
| Deployment | Live on Vercel | ✅ Live |

### Phase 2 (Polish)

| Metric | Target | Status |
|--------|--------|--------|
| Lighthouse score | 95+ all categories | TBD |
| WCAG AA compliance | 100% | TBD |
| Animation FPS | 60 FPS consistent | TBD |
| Quiz accuracy | 100% scoring | TBD |
| Documentation | Complete + accurate | TBD |
| Test coverage | Core utilities | TBD |
| Browser support | Chrome, Safari, Firefox, Edge | TBD |

### Phase 3 (Cloud Sync)

| Metric | Target | Status |
|--------|--------|--------|
| Backup time | <5s | TBD |
| Restore time | <10s | TBD |
| Data loss incidents | 0 | TBD |
| Users opting in | >10% (opt-in feature) | TBD |
| Sync conflict resolution | 100% correct | TBD |

---

## Dependencies & Blockers

### Technical Blockers

| Blocker | Impact | Mitigation | Status |
|---------|--------|-----------|--------|
| IndexedDB quota (~50 MB) | Large vocab sets fail | Cleanup routine, user warning | Low risk |
| iOS PWA limits | Missing WebGL, NFC | Accept limitation; not needed for vocab | Accepted |
| Service Worker update lag | Stale code in production | Workbox skip-waiting | Acceptable |
| Browser storage sync | No cross-device sync (Phase 3) | Implement Supabase cloud sync | Planned |

### Resource Blockers

| Resource | Status | Notes |
|----------|--------|-------|
| Development time | Available | Solo developer OK for Phases 1–2 |
| Supabase account | Ready | Free tier sufficient |
| Hosting (Vercel) | Available | Free tier covers usage |
| Design review | Needed | No dedicated designer; self-review acceptable |

### Dependencies (Phase 3+)

- Supabase PostgreSQL database
- Email service for password reset (built into Supabase)
- CDN for user-generated assets (if file uploads added later)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| IndexedDB data loss | Low | High | Backup feature (Phase 3) |
| PWA install rate low | Medium | Medium | Better onboarding instructions |
| SM-2 bug discovered | Low | High | Comprehensive test suite (Phase 2) |
| Browser vendor removes PWA | Very Low | High | Fallback to web-only distribution |
| Supabase outage (Phase 3) | Low | Medium | Graceful degradation; local sync continues |
| User data privacy concern | Low | High | Clear privacy policy; no tracking |

---

## User Feedback Loop

### Channels (Future)

1. **GitHub Issues** — Bug reports, feature requests
2. **Feedback form** (in-app) — Quick UX feedback
3. **Email** — Direct user contact (from issue template)
4. **Analytics** (Vercel) — Page load time, error rates

### Feedback Integration

**Phase 2–3:** Collect feedback on:
- Most commonly added word categories (drives Phase 3 scope)
- Pain points with flashcard UI
- Quiz difficulty/scoring concerns
- PWA install success rate

**Phase 4+:** Use feedback to prioritize audio, analytics, sharing features.

---

## Budget & Resource Allocation

### Development (Estimated Effort)

| Phase | Duration | Focus | Dev Time |
|-------|----------|-------|----------|
| Phase 1 (MVP) | Completed | Core features | 40–60 hours |
| Phase 2 (Polish) | 1 week | Perf, a11y, docs | 20–30 hours |
| Phase 3 (Cloud) | 2–3 weeks | Supabase, auth | 40–60 hours |
| Phase 4 (Audio) | 2 weeks | TTS, Web Speech API | 20–30 hours |
| Phase 5 (Analytics) | 1–2 weeks | Charts, export | 15–25 hours |
| Phase 6 (Collab) | 3+ weeks | Sharing, groups | 40–80 hours |

**Total (Phases 1–6):** ~175–265 hours (4–7 weeks full-time or 2–3 months part-time)

### Infrastructure Costs

| Service | Cost | Usage | Total |
|---------|------|-------|-------|
| Vercel | Free | Static hosting | $0/month |
| Supabase | Free (Phase 3) | 500MB storage | $0/month |
| Custom domain | ~$12/year | vocab-family.com | $1/month |
| **Total** | | | **$1/month** |

(Free tier sufficient for MVP through Phase 3; premium tiers only if 1000+ concurrent users.)

---

## Maintenance & Support

### Ongoing (All Phases)

- **Bug fixes:** ASAP (blocking features) vs. next release (nice-to-have)
- **Dependency updates:** Monthly security updates; quarterly minor/major
- **Monitoring:** Vercel analytics dashboard + user issue reports
- **Documentation:** Updated on each release

### Monitoring Schedule

- **Daily:** Check Vercel error logs, user reports
- **Weekly:** Review analytics, performance metrics
- **Monthly:** Security updates, dependency review
- **Quarterly:** Roadmap review, user feedback synthesis

---

## Communication & Announcements

### Release Notes

For each phase release:
1. GitHub Releases page (detailed changelog)
2. README.md updated
3. In-app notification (if applicable)
4. Twitter/social (if user base reaches 100+)

### Breaking Changes

If Phase 2+ introduces breaking changes (e.g., database migration):
1. Announce in changelog
2. Provide migration guide
3. Support old format for 1 release before removal

---

## Comparison with Competitors

| Feature | Vocab Family | Anki | Memrise | Quizlet |
|---------|---|---|---|---|
| **Free** | ✅ Always | ✅ Free version | Freemium | Freemium |
| **No account** | ✅ | ❌ | ❌ | ❌ |
| **Offline** | ✅ Full | ❌ No | Partial | ❌ |
| **Word families** | ✅ | ❌ | ❌ | ❌ |
| **SM-2 algo** | ✅ | ✅ (better) | ❌ (proprietary) | ❌ |
| **Mobile app** | ✅ PWA | ❌ | ✅ Native | ✅ Native |
| **Quiz** | ✅ | ✅ (more modes) | ✅ | ✅ (more) |
| **Open source** | Possible (Phase 3+) | ✅ | ❌ | ❌ |

**Vocab Family unique value:**
- Zero friction (no signup)
- Offline-first + PWA
- Word families (morphological awareness)
- User-driven vocabulary (not curated lists)

---

## Success Criteria (Overall)

**MVP Success (Phase 1):** ✅ ACHIEVED
- [ ] Build ships with zero setup
- [ ] 197 word families load automatically
- [ ] Flashcard + quiz work offline
- [ ] Dark mode toggle works
- [ ] Installable on iOS/Android
- [ ] No console errors

**Phase 2 Success:**
- [ ] Lighthouse 95+ (all categories)
- [ ] WCAG AA compliance
- [ ] 10+ user reports of successful use

**Phase 3 Success (Cloud Sync):**
- [ ] >5 users opt in to cloud sync
- [ ] Backup/restore work reliably
- [ ] Zero data loss incidents

**6-Month Success Goal:**
- [ ] 500+ monthly active users
- [ ] ≥4.5/5 rating on app stores (if listed)
- [ ] ≥80% users complete ≥1 study session/week
- [ ] Zero critical bugs
- [ ] Zero data loss incidents

---

## Next Steps

### Immediate (This Week)

1. **Phase 2 kickoff:**
   - [ ] Performance audit (measure current metrics)
   - [ ] Accessibility audit (WCAG compliance)
   - [ ] Code review for clarity
   - [ ] Documentation completion

2. **User feedback:**
   - [ ] Set up GitHub discussions/issues
   - [ ] Share MVP link with beta testers
   - [ ] Collect feature requests

### Short Term (Next 2–4 Weeks)

1. **Phase 2 completion:**
   - [ ] Fix perf issues (if any)
   - [ ] Improve animations
   - [ ] Complete documentation
   - [ ] Ship Phase 2 release

2. **Phase 3 planning:**
   - [ ] Design Supabase schema
   - [ ] Design backup/restore flow
   - [ ] Plan conflict resolution

### Medium Term (Next 2–3 Months)

1. **Phase 3 implementation:**
   - [ ] Supabase setup
   - [ ] Auth flow
   - [ ] Backup/restore feature
   - [ ] Testing + launch

2. **Community building:**
   - [ ] GitHub star goal: 100+
   - [ ] User testimonials
   - [ ] Blog post or case study

---

## Version History

| Version | Date | Phase | Status |
|---------|------|-------|--------|
| 0.0.0 | May 2026 | MVP (Phase 1) | Shipped ✅ |
| 1.0.0 | June 2026 (planned) | Polish (Phase 2) | In progress 🔄 |
| 1.1.0 | July 2026 (planned) | Cloud Sync (Phase 3) | Backlog 📅 |
| 1.2.0 | August 2026 (planned) | Audio (Phase 4) | Backlog 📅 |
| 1.3.0 | September 2026 (planned) | Analytics (Phase 5) | Backlog 📅 |
| 2.0.0 | Q4 2026 (planned) | Collab (Phase 6) | Backlog 📅 |

---

## Appendix: Feature Request Template

Users can suggest features via GitHub Issues:

```markdown
## Feature Request

**Title:** [Feature name]

**Problem:** What problem does this solve?

**Proposed Solution:** How should it work?

**Use Case:** Who needs this? When?

**Alternatives Considered:** Any other approaches?

**Additional Context:** Sketches, examples, links?
```

---

## Appendix: Bug Report Template

```markdown
## Bug Report

**Title:** [Brief description]

**Reproduction Steps:**
1. ...
2. ...
3. ...

**Expected Behavior:** What should happen?

**Actual Behavior:** What happened instead?

**Environment:**
- Browser: Chrome/Safari/Firefox
- OS: iOS/Android/macOS/Windows
- PWA Installed: Yes/No
- Offline Mode: Yes/No

**Screenshots:** (if applicable)

**Console Errors:** (paste from DevTools)
```

---

## Summary

Vocab Family is a **lean, focused MVP** designed to solve a specific problem: **lower the barrier to vocabulary learning** by eliminating accounts, backends, and paid tiers. Phase 1 shipped successfully with all core features. Phase 2 focuses on polish and documentation. Phases 3–6 add optional features (cloud sync, audio, analytics, collaboration) based on user feedback.

**Philosophy:** Offline-first, user-driven, privacy-respecting vocabulary learning powered by SM-2 spaced repetition.

**Timeline:** Phases 1–3 by Q3 2026; Phases 4–6 by Q4 2026 (if demand exists).

**Success:** 500+ MAU, 4.5+ rating, zero data loss, zero critical bugs.
