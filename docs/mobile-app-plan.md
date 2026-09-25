# CramDesk Mobile App Plan

This document captures the implementation plan to ship a mobile version of CramDesk with the requested capabilities: PDF ingest, AI summary → flashcards → quizzes, a humanizer, an app-lock quiz gate (5 fresh questions on each launch), and a $5.99/mo subscription after the first trial.

## 1) Stack & Project Skeleton
- **Client**: Expo (React Native, TypeScript), single codebase for iOS/Android.
- **Auth**: Supabase email/password + magic links; re-use existing Supabase project so user/session tokens remain valid across web and mobile.
- **Storage**: Supabase Storage bucket `documents` (same as web). Upload from mobile via signed upload URLs.
- **APIs**: Re-use Next.js routes by adding bearer-token support, or expose a small mobile-friendly API layer (see section 3).
- **Payments**: Native paywalls via RevenueCat or Stripe Mobile SDK. Price point: **$5.99/mo** with 1st launch free trial (or 7-day trial if store rules require).
- **Navigation**: React Navigation (stack + bottom tabs): Library, Flashcards, Quiz, Humanizer, Settings.
- **State**: React Query (TanStack Query) for network + caching; Zustand or Context for light UI state.
- **App-lock**: Shown on every cold start, requires passing a 5-question quiz before unlocking.

## 2) Core User Flows
1) **Onboarding/Paywall**
   - First launch → trial enabled → on completion, paywall for $5.99/mo.
   - Post-trial launches show paywall if no active subscription.
2) **App-Lock Quiz**
   - On cold start, fetch 5 random questions (prioritize user flashcards; fall back to a static bank).
   - Must answer 4/5 to unlock. Failure regenerates a new quiz set.
3) **Document Intake**
   - Import PDF via system picker → upload to Supabase Storage via signed URL → call `/api/process-document` → poll document status until ready.
4) **Summary & Knowledge Objects**
   - Once processed, fetch summary, risks, and easy-reading digest.
   - Generate flashcards `/api/flashcards` and quiz items `/api/quiz` from the same document.
5) **Chat with PDF**
   - Re-use `/api/chat` endpoint for conversational Q&A on document chunks.
6) **Humanizer**
   - Text input → call `/api/writer` (or add `/api/humanizer`) to restyle content to a chosen tone.
7) **Quizzes**
   - Create custom quizzes from flashcards, PDF digest, or free text. Track score locally; optionally sync progress.

## 3) API Readiness Checklist (server)
- Add bearer-token support to existing API routes (mobile will send `Authorization: Bearer <supabase_jwt>` instead of relying on cookies).
- Create a signed-upload helper route: returns a presigned Supabase Storage URL for PDFs, scoped to `user.id`.
- Add `/api/humanizer` alias that wraps the existing writer/humanizer prompt.
- Add `/api/lock-quiz` that returns 5 random questions from recent flashcards (fallback to static set).
- Ensure CORS is enabled for mobile origins.

## 4) Mobile App Skeleton (proposed file map)
```
mobile/
  app.json / app.config.js       # Expo config
  package.json                   # Expo + RN deps
  App.tsx                        # Entry + navigation
  src/
    navigation/                  # React Navigation setup
    screens/
      OnboardingScreen.tsx
      AppLockScreen.tsx
      LibraryScreen.tsx
      DocumentDetailScreen.tsx
      FlashcardsScreen.tsx
      QuizScreen.tsx
      HumanizerScreen.tsx
      SettingsScreen.tsx
    components/                  # Upload button, cards, quiz UI
    services/
      api.ts                     # fetch wrappers to Next/Supabase APIs
      storage.ts                 # signed upload helper
      auth.ts                    # Supabase auth helpers
    state/                       # Zustand or context stores
    types/                       # DTOs for summary, flashcard, quiz
```

## 5) App-Lock Quiz Logic
- Triggered on every cold start (or after inactivity timeout).
- Source questions:
  1) User flashcards from the most recent documents.
  2) If fewer than 5, pad with static general-knowledge questions.
- Passing criteria: >=4/5 correct. Otherwise, regenerate a new set.
- Persist last failure timestamp to discourage brute force; allow override if user is offline with no data.

## 6) Subscription & Trial
- First launch: auto-start trial flag stored locally and in Supabase profile.
- Paywall: native purchase via RevenueCat or Stripe Billing Portal deep link.
- Enforce paywall server-side by checking `subscription_status` and `trial_end_at` before processing documents (already enforced in `/api/process-document`; mirror for other endpoints).

## 7) Offline & Caching
- Cache summaries/flashcards/quizzes per document locally (AsyncStorage).
- Allow reading flashcards/quizzes offline; uploads and AI calls require connectivity.

## 8) Next Steps to Start Building
1) Create `mobile/` Expo project with TS + React Navigation + React Query.
2) Add Supabase mobile client config and bearer-token auth to server routes.
3) Build AppLockScreen (uses `/api/lock-quiz`).
4) Build Library + Document intake (PDF picker → signed upload → process).
5) Build Flashcards/Quiz/Humanizer screens wired to existing endpoints.
6) Integrate paywall at $5.99/mo and gate processing routes server-side.

This plan keeps feature parity with the web experience while adding the requested mobile-only behaviors (app-lock quiz and native paywall). Let me know and I’ll scaffold the `mobile/` Expo app next.
