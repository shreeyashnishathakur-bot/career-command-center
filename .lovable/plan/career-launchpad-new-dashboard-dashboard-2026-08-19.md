# Career Launchpad — New Dashboard (`/dashboard`)

## What I found (analysis)

I cloned and read `shreeyash-thakur/career-launchpad-pro`. Important: **this Lovable project is currently empty** (a bare template), while your site lives in the GitHub repo. Good news — the repo uses the *same* stack as this project, so step 0 is to import your repo's source into this project so the dashboard is built on your real app.

Existing architecture:

- **Framework:** TanStack Start (React 19) + Vite 8, Tailwind v4 tokens in `src/styles.css`, full shadcn UI kit (incl. `ui/sidebar.tsx`, `ui/sheet.tsx`, `ui/progress.tsx`).
- **Routing:** file-based, `src/routes/` (`index`, `login`, `signup`, `forgot-password`, `onboarding`, `builder`, `resumes/index`, `resumes/$resumeId/{questionnaire,editor,template,check}`). `src/routeTree.gen.ts` is generated.
- **Firebase:** `src/lib/firebase.ts` — lazy, browser-only getters (`getFirebaseAuth/Db/Storage/Analytics`), config hardcoded (public client keys only).
- **Auth:** `src/contexts/AuthContext.tsx` (`useAuth()` → `user`, `loading`, `configured`, `logOut`, …), mounted in `__root.tsx`. Client-side guard: `components/auth/protected-route.tsx` (`<ProtectedRoute>` redirects to `/login?redirect=`).
- **Data:** Firestore `users/{uid}` profile doc (`uid`, `name`, `email`, `photoURL`, `updatedAt`) and `resumes` collection via `src/lib/resume-service.ts` (`getUserResumes`, `createResume`, `duplicateResume`, `deleteResume`, `ResumeDocument` with `resumeData`, `style`, `templateId`, `questionnaireCompleted`, `questionnaireAnswers`, `updatedAt`).
- **Resume content model:** `features/resume-builder/types` + `sample-data`; PDF/export via `resume-export-surface.tsx` / `download-menu.tsx` (jspdf + html2canvas-pro).
- **AI:** `src/lib/ai-service.ts` — OpenRouter, key from `VITE_OPENROUTER_API_KEY`.
- **Not present today:** applications tracker, job-match, interview prep, skill gap, certifications collection, portfolio, career-AI chat. So those dashboard cards get real empty states, no fake data.

## Routing

`src/routes/dashboard.tsx` → `/dashboard`, component wrapped in the existing `<ProtectedRoute>`, with its own `head()` metadata. Login/signup redirect targets change from `/resumes` to `/dashboard` (existing `redirect` search param still honoured). No new router, no changes to `routeTree.gen.ts` by hand.

## Files I will create

Layout / chrome
- `src/components/dashboard/dashboard-layout.tsx` — shell: sidebar + topbar + content grid
- `src/components/dashboard/dashboard-sidebar.tsx` — collapsible sidebar (MAIN / CAREER / AI / BOTTOM groups), Sheet drawer on mobile, active-state on Dashboard; items that have no route yet render as "Coming soon" (disabled, not broken links)
- `src/components/dashboard/dashboard-topbar.tsx` — page title, search, notifications, avatar + real `user.displayName`/email, dropdown with Sign out (`logOut()` + navigate to `/login`)

Cards
- `greeting-section.tsx` (time-aware "Good evening, {name} 👋")
- `career-ai-input.tsx` — ✨ Ask Career AI, example chips; calls a thin `askCareerAI()` in `src/lib/career-ai.ts` that reuses the existing OpenRouter service; if no key is configured it shows a clear "not connected yet" state rather than failing silently
- `career-readiness-card.tsx` — SVG ring + per-factor bars
- `recommendation-card.tsx` + `recommended-for-you.tsx`
- `application-overview.tsx`, `job-match-card.tsx`, `interview-readiness-card.tsx`, `profile-completion-card.tsx`, `career-activity.tsx`, `resume-card.tsx` + `my-resumes-section.tsx`
- `empty-state.tsx` — shared empty-state primitive

Data / logic
- `src/lib/career-score.ts` — pure, testable scoring: derives Resume / Profile / Skills / Projects / Certifications / Portfolio / Interview sub-scores from the user's real `users/{uid}` doc + `ResumeDocument[]`, returns overall 0–100 plus the missing items that drive recommendations. Returns `insufficientData` when there's nothing to score → "Complete your profile to calculate your career readiness."
- `src/lib/dashboard-service.ts` — Firestore reads for the new-but-empty domains (`applications`, `jobMatches`, `interviewSessions`, `activity`, all `where uid == user.uid`), each returning `[]` safely if the collection doesn't exist. No writes, no rules changes.
- `src/hooks/use-dashboard-data.ts` — one TanStack Query hook per domain, keyed by uid, `staleTime` set so revisiting the dashboard doesn't refetch (avoids extra Firebase reads); resumes reuse `getUserResumes`.

## Files I will modify

- `src/routes/login.tsx`, `src/routes/signup.tsx` — default post-auth destination `/dashboard`
- `src/routes/resumes/index.tsx` — add a "Back to dashboard" link only (no behaviour change)
- `src/styles.css` — add a few dashboard tokens (surface, ring gradient, soft shadow, radius) as semantic variables; no existing token values changed
- `src/components/landing/navbar.tsx` — signed-in CTA points at `/dashboard`

Nothing is deleted: builder, templates, PDF export, questionnaire, onboarding, auth, resume service all untouched.

## How data connects

`useAuth().user` → uid → parallel queries: `users/{uid}` profile, `getUserResumes(uid)`, plus best-effort reads of the four future collections. Everything feeds `computeCareerScore()`; every card renders a real value or a designed empty state. Resume cards use real titles/`updatedAt` and link to the existing editor/check/download flows.

## Design

Premium 2026 SaaS feel using your existing token system: whitespace, subtle borders, soft shadows, `rounded-xl/2xl`, one accent, ring visualisation, `motion` for restrained enter/hover animation. Responsive: desktop sidebar + 12-col grid, tablet collapsed rail, mobile drawer + single column.

## Security

Client Firebase config stays as-is (publishable). No admin credentials, no key echoing, no Firestore rules changes. AI key stays in `VITE_OPENROUTER_API_KEY`.

## After implementation

I'll run the dev server and verify: `/dashboard` renders for signed-out (redirect to login) and signed-in users, empty-data and populated-data paths, resumes flow still works, desktop + mobile layouts, and zero console errors.
