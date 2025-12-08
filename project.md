# PDFTalk AI – Project Specification

## 1. One-liner

DocDigest AI is a web app where you drop your long PDFs (contracts, quotes, CGV, reports) and instantly get:
- clear summaries,
- key risks & questions,
- easy-reading versions,
- and comparisons between multiple documents.

Designed for freelancers & small businesses who don’t have time (or the mindset) to read 25-page PDFs.

---

## 2. Founder context (constraints)

- Time: ~35h/week available.
- Budget: 0€ upfront → need fast monetization.
- Goal: Reach 2,000€ net MRR in < 3 months.
- Skills: Backend OK (Firebase / Netlify / Stripe), comfortable with AI APIs, GitHub.

Implications:
- Ship a sharp, small **MVP in 2–3 weeks**.
- Keep stack **simple, serverless, cheap**.
- Focus hard on **one core flow**: upload → digest → share/export.

---

## 3. Target users

**Primary**
- Freelancers & solopreneurs (devs, designers, consultants).
- Small business owners.
- Agency owners (who receive proposals & contracts).

**Secondary**
- Employees who deal with contracts, reports, meeting notes.

Pain:
- They receive PDFs and:
  - don’t have time to read everything,
  - don’t always understand legal / complex language,
  - miss important changes between versions.

---

## 4. Core value proposition

> “Understand any PDF in 2 minutes instead of 45.”

DocDigest AI will:
- Turn long PDFs into **bullet summaries**.
- Highlight **risks, obligations & deadlines**.
- Extract **action items**.
- Compare **version A vs version B** and tell you *what actually changed*.
- Provide a **simplified version** in plain language.

Key differentiator vs generic “PDF summarizers”:
- Opinionated output tailored to real business docs (contracts, quotes, invoices, CGV…).
- Clear blocks: Summary / Risks / Questions to ask / Actions / Changes.
- UX ultra simple, minimal, high-quality.

---

## 5. Feature scope

### 5.1 MVP – must-have

1. **Auth & trial**
   - Email + password / magic link signup.
   - 7-day **full premium** trial automatically on account creation.
   - After 7 days → must pick a paid plan to continue (no free tier).

2. **File upload**
   - Upload 1 PDF (max X MB, e.g. 20 MB for MVP).
   - Store original file in secure storage (S3/Supabase Storage).

3. **PDF extraction**
   - Extract text from PDF (server-side).
   - Basic handling of multi-page docs.

4. **AI digest**
   - Prompted LLM call that outputs:
     - Executive summary (5–10 bullets).
     - Key clauses / sections list.
     - Risks / points of attention.
     - Suggested questions to ask the other party.
     - Suggested next actions.

5. **“Easy reading” mode**
   - Generate a simplified version of the document:
     - Plain language,
     - Short paragraphs,
     - No legal jargon when possible.

6. **Document history**
   - List of uploaded documents per user.
   - Each item: name, date, number of pages, quick summary preview.
   - Ability to reopen a document and re-see summary.

7. **Quota / usage tracking**
   - Track pages processed per month per user.
   - Lock processing when quota is exceeded based on plan.

8. **Billing**
   - Stripe integration:
     - Subscription creation,
     - Plan upgrades/downgrades,
     - Webhooks to sync active/inactive status.

9. **Basic analytics**
   - Events: sign-ups, trial started, trial expired, docs uploaded, plan chosen.
   - Simple admin dashboard (could be a private Notion + Stripe + simple queries at first).

---

### 5.2 V2 – nice-to-have

1. **Multi-document comparison**
   - Upload 2–3 PDFs.
   - AI explains:
     - Main differences.
     - Clauses added/removed/modified.
     - Overall impact assessment.

2. **Template-aware mode**
   - Detect if the PDF matches a “contract” / “quote” / “CGV” type.
   - Adjust prompts to that type.

3. **Export**
   - Export summary as:
     - Markdown / PDF / DOCX.
     - Email draft to send to client/partner.

4. **Team seats**
   - Invite 2–10 team members.
   - Shared document workspace.

5. **Tags & search**
   - Tag documents (client name, project).
   - Full-text search in your uploaded docs & summaries.

6. **API access (Pro)**
   - Simple REST API for processing PDFs programmatically.

---

## 6. UX & UI direction

**Branding / Feel**
- Style: clean, minimal, high-end (inspired by Notion / Linear / Framer).
- Colors:
  - Background: off-white / very light grey.
  - Accent: soft blue or teal.
  - Secondary: muted purple or slate.
- Typography:
  - Sans serif (Inter / SF Pro / similar).
  - Large titles, good line-height, lots of whitespace.

**Key screens (MVP)**
1. Landing page
   - Hero: “Understand any PDF in 2 minutes.”
   - Single CTA: “Start 7-day free trial – no credit card required” (if you choose that).
   - Short explanation + 3 screenshots of UI.
   - 3 use cases: Contracts, Quotes, CGV/Terms.

2. Signup / onboarding
   - Step 1: email + password.
   - Step 2: ask “What do you mainly upload?” (contract / quote / other) – for analytics only.
   - Directly redirect to **Upload screen**.

3. Dashboard
   - Top: “Upload a new document” primary CTA.
   - Below: list of past documents with mini summary and status (within quota / over quota).

4. Document view
   - Left: original PDF preview (or at least file info).
   - Right: tabs:
     - Summary
     - Risks & Questions
     - Easy reading
   - Clear buttons: “Copy summary”, “Export”.

---

## 7. Pricing & monetization

### 7.1 Trial

- **7-day free premium trial** automatically at account creation.
- During trial:
  - User has **full access to highest plan features and quotas**.
- No separate free tier after trial:
  - After the 7 days, user must pick a paid plan to continue using the service.
- You can decide:
  - **With card or without card** at signup.
    - For fastest conversion early on, you can start **without card**, then test card-upfront later.

### 7.2 Plans (monthly, no freemium)

All prices in €/month (you can adjust to local currency later):

1. **Basic – 3.99€/month**
   - Target: light users, occasional freelancers.
   - Includes:
     - Up to **150 pages/month** processed.
     - Max 20 pages per document.
     - Access to:
       - Summary,
       - Risks & Questions,
       - Easy reading mode.
     - History of last 30 documents.
   - No multi-document comparison.

2. **Growth – 12.99€/month** (mid plan)
   - Target: active freelancers / small teams.
   - Includes:
     - Up to **600 pages/month** processed.
     - Max 60 pages per document.
     - Everything in Basic, plus:
       - Multi-document comparison (2 PDFs).
       - Priority processing (faster queue).
       - Save custom “prompt presets” (e.g. “legal risk focus”, “sales focus”).
     - History of last 200 documents.

3. **Pro – 20.99€/month** (high usage)
   - Target: agencies / power users.
   - Includes:
     - Up to **1,500 pages/month** processed.
     - Max 100 pages per document.
     - Everything in Growth, plus:
       - Multi-document comparison (up to 3 PDFs).
       - Team access (up to 5 seats).
       - API access (simple REST, rate-limited).
       - Priority support.

### 7.3 Billing details

- Payments: Stripe subscriptions.
- Monthly by default; later you can add annual pricing (2 months free).
- Soft limits: when user hits limit, show:
  - “You’ve reached your monthly page limit. Upgrade plan or wait for reset on [date].”
- Overages (later): charge per extra pack of pages.

---

## 8. Tech stack

### 8.1 Frontend

- **Framework**: Next.js (React, TypeScript).
- **Styling**: Tailwind CSS.
- **UI components**: shadcn/ui or headless UI components.
- **Auth integration**: Clerk / Supabase Auth / Auth0 (pick one you’re comfortable with).

### 8.2 Backend

- **Runtime**: Node.js / TypeScript (API routes in Next.js or serverless functions).
- **Database**: Postgres (Supabase) or Firestore (if you prefer Firebase).
- **File storage**: 
  - Supabase Storage / S3 / Firebase Storage.
- **AI**:
  - LLM provider (e.g. OpenAI) for:
    - Summaries,
    - Risks & Questions,
    - Easy reading version,
    - Comparisons.
  - PDF text extraction:
    - Use existing libraries or a managed PDF parsing API.

### 8.3 Infrastructure

- Hosting: Vercel / Netlify (for frontend + serverless API).
- Background jobs (if needed later):
  - Simple queue (e.g. hosted solution, or cron jobs) to process heavy PDFs asynchronously if needed.
- Monitoring:
  - Basic: logging + error tracking (Sentry) when possible.

---

## 9. Architecture (high-level)

1. **Client (Next.js)**
   - Auth UI + dashboard + upload.
   - Calls your backend API endpoints.

2. **API layer**
   - `/api/upload`:
     - Validates auth & quotas.
     - Stores file in storage.
     - Enqueues job or runs extraction + AI call.
   - `/api/summary/:id`:
     - Returns cached AI outputs.
   - `/api/billing/*`:
     - Handles Stripe checkout URLs, webhooks.

3. **Database schema (MVP)**
   - `users`: id, email, created_at, trial_end_at, stripe_customer_id, current_plan, etc.
   - `documents`: id, user_id, file_path, pages_count, created_at, type_guess (contract/quote/other).
   - `summaries`: id, document_id, summary, risks, questions, easy_reading, tokens_used.
   - `usage`: per user, per month – pages_processed, docs_processed.
   - `subscriptions`: sync with Stripe (or just read from Stripe via webhooks).

---

## 10. Analytics & KPIs

Track at minimum:

- Acquisition:
  - Visits to landing.
  - Signups.
- Activation:
  - Users who upload at least 1 document.
- Engagement:
  - Docs processed per active user.
  - Pages processed per plan.
- Monetization:
  - Trial started.
  - Trial → paid conversion rate.
  - Plan distribution (Basic vs Growth vs Pro).
- Churn:
  - Cancellations per month and reason (simple dropdown on cancel).

---

## 11. Go-to-market (0€ budget)

**Initial playbook (weeks 3–6)**

1. **Personal brand & demo content**
   - Short Loom videos:
     - “I uploaded this 23-page contract, here’s what the AI found (in 2 minutes).”
   - Post on:
     - Twitter/X (indie dev audience),
     - LinkedIn (freelancers + SMB owners),
     - Indie Hackers / r/Entrepreneur / r/freelance.

2. **“Doc of the week” series**
   - Anonymous real-life examples (quotes, contracts, CGV).
   - Show before (messy) vs after (clear summary, risks, questions).
   - CTA: “Try this on your own docs – 7-day full premium trial.”

3. **Cold outreach**
   - Target: small agencies / dev shops / UX studios.
   - Offer:
     - “I’ll process 2 of your contracts for free and send you the report. If you like it, you can subscribe.”

4. **Partnerships**
   - Tools used by freelancers (proposal software, time tracking, invoicing).
   - Offer affiliate rev share.

---

## 12. Roadmap (first 6 weeks)

### Week 1
- Finalize feature scope & naming (DocDigest AI).
- Set up repo, CI, basic Next.js + Tailwind project.
- Implement auth (signup/login) + basic layout.
- Design simple landing page.

### Week 2
- Implement file upload UI + API endpoint.
- Integrate storage (Supabase/S3).
- Implement basic PDF text extraction.
- Connect to LLM for 1st version of summary prompt.
- Save full AI result in DB.

### Week 3
- Build dashboard (document list + detail page).
- Implement “Summary / Risks / Questions / Easy reading” sections.
- Implement usage tracking per user.
- Add trial logic:
  - trial_start_at, trial_end_at, gating when expired.
- Polish UI for document view.

### Week 4
- Integrate Stripe:
  - Create plans (3.99 / 12.99 / 12.99 / 20.99).
  - Checkout & customer portal.
  - Webhooks to update `current_plan` and quotas.
- Implement quotas enforcement by plan.
- Add minimal analytics events (even simple DB logs).

### Week 5
- Improve prompt quality & formatting of outputs.
- Add quality-of-life features:
  - Copy buttons,
  - Simple search in document history,
  - Loading states & error handling.
- Start posting early previews on social media.

### Week 6
- Launch public beta:
  - Simplify landing with unique CTA: start trial.
- Collect user feedback; iterate on:
  - Copywriting,
  - Pricing positioning,
  - Limits (pages per plan).

---

## 13. Long-term opportunities

- Strong focus on **contracts & legal** → niche product for lawyers / paralegals.
- Deeper integration with:
  - CRM,
  - Proposal tools,
  - Project management tools (auto-generating tasks from contracts).
- White-label API for other SaaS needing document digestion.

---
