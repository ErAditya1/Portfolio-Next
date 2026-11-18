# Engineering Implementation Plan — Portfolio Transformation

**Objective:** Transform Aditya Kumar's portfolio into a premium, conversion-focused, SEO & GEO-optimized developer portfolio serving both Recruiters / Hiring Managers and International Clients / Businesses.

---

## Stage A: Discovery & Documentation (Completed)
- [x] Full repository audit (`package.json`, Next.js 15 App Router, Tailwind v4, MongoDB models, SEO library, routes).
- [x] Create `docs/PORTFOLIO_AUDIT.md`.
- [x] Create `docs/SEO_AUDIT.md`.
- [x] Create `docs/REQUIRED_ASSETS.md`.
- [x] Verify baseline production build with Turbopack.

---

## Stage B: Personal Branding & Content Refinement
- [ ] **Hero Section Enhancement:**
  - Standardize professional positioning:  
    `Aditya Kumar — Full Stack Developer | SaaS & AI Systems Engineer`
  - Headline:  
    `Building Scalable Web Applications, SaaS Products & Intelligent Digital Experiences.`
  - Supporting Copy:  
    `I develop modern web applications and digital products, combining frontend engineering, backend architecture and intelligent integrations to solve real-world problems.`
  - Dual Conversion Paths:
    - Primary CTA: *Explore My Work* (`#featured-projects`)
    - Secondary CTA: *Let's Work Together* (`/contact`)
    - Quick actions: Resume download, GitHub, LinkedIn, Email.
  - Verified availability indicator.
- [ ] **Trust & Credibility Strip:**
  - Add a dedicated trust strip immediately below Hero:
    - Current Role: Full Stack Developer at Feeding Trends (Lucknow)
    - Production Architectures: Next.js App Router, NestJS, BullMQ, Redis, WebSockets
    - AI & Voice Pipelines: ElevenLabs, Deepgram STT, WhatsApp Cloud API
    - Education: AKTU (B.Tech CSE, Pursuing) & BTEUP (Diploma CSE, 2025)
    - Terminal Card: `npx aditya-kumar@latest --connect`
- [ ] **Section 9 Transformation:**
  - Replace generic testimonials with **Engineering Principles & Verified Project Delivery Outcomes** (high performance, resilient queues, type safety, zero data loss, production SLA).

---

## Stage C: Information Architecture, Navigation & Services Route
- [ ] **Header & Navigation Updates (`src/components/Header.tsx`):**
  - Add `Services` (`/services`) to primary desktop & mobile navigation.
  - Support `Insights` alias for `/blog`.
- [ ] **Dedicated Services Route (`src/app/(public)/services`):**
  - Create `/services/page.tsx` and `ServicesPageClient.tsx`.
  - Comprehensive service breakdowns:
    1. Full Stack Web Application Development
    2. SaaS Platform Development
    3. Next.js & Frontend Architecture
    4. Backend & Distributed API Engineering
    5. AI Voice & Real-Time Automation
    6. Cloud Deployment & Linux VPS Infrastructure
  - Business value, deliverables, tech stacks, and direct project inquiry CTAs.
- [ ] **Dedicated Insights Route (`src/app/(public)/insights`):**
  - Create `/insights/page.tsx` redirecting or rendering the technical publications index with case-study links.

---

## Stage D: Reusable 13-Section Project Case Studies
- [ ] **Upgrade `src/app/(public)/projects/[slug]/page.tsx`:**
  - Standardize 13 essential case-study sections:
    1. Project Overview & Context
    2. Problem Statement
    3. Project Objectives
    4. My Role & Engineering Ownership
    5. Technology Stack (Categorized Badges)
    6. Key Architecture Decisions & Data Flow
    7. Core System Features
    8. Engineering Challenges & Solutions
    9. Results & Real Outcomes
    10. Visual System Walkthrough / Screenshots
    11. Source Code & Live Demonstration
    12. Related Case Studies
    13. Project Inquiry CTA
  - Handle both Markdown and rich HTML case studies from DB gracefully.
  - Validate all links and metadata.

---

## Stage E: Technical SEO, GEO & Structured Data
- [ ] **Metadata & Canonical Enforcement:**
  - Add `/services` and `/insights` to `src/lib/seo/meta.ts` and `sitemap.ts`.
  - Ensure canonical tags, Open Graph images, and Twitter cards are unique.
- [ ] **Structured Data (JSON-LD):**
  - Update `src/lib/seo/schema.ts` to include `Service` catalog and case study `SoftwareSourceCode` / `WebApplication` schema.
- [ ] **LLMs & Entity Discoverability:**
  - Update `src/lib/seo/llms.ts` to reflect the new services and engineering achievements.

---

## Stage F: Quality Assurance, Performance & Verification
- [ ] Verify `npx tsc --noEmit` passes with 0 errors.
- [ ] Verify `npm run build` succeeds cleanly.
- [ ] Verify mobile responsiveness across viewports (360px, 768px, 1024px, 1440px).
- [ ] Verify keyboard navigation, accessibility landmarks, and form validation.
- [ ] Create `docs/IMPLEMENTATION_REPORT.md`.
