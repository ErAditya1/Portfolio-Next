# Technical SEO & Generative Engine Optimization (GEO) Audit — Aditya Kumar Portfolio

**Audit Date:** November 18, 2026  
**Domain:** https://eraditya.vercel.app/  
**Target Entities:** Aditya Kumar, ErAditya1, Feeding Trends, Callio AI, Amplibuzz, WAutomator, BrightVeil  

---

## 1. Technical SEO Audit

### 1.1 Metadata Architecture
- **Root Layout (`src/app/layout.tsx`):**
  - Title template: `"%s · Aditya Kumar"`
  - Description fallback properly configured.
  - Viewport, theme color, icons, and Apple touch icons declared.
- **Page-Level Metadata (`src/lib/seo/meta.ts`):**
  - Every indexable page defines its own canonical URL using `SITE_URL` (`https://eraditya.vercel.app`).
  - Open Graph title, description, URL, and dynamic card generator (`opengraph-image.tsx`) are registered.
  - Twitter card metadata configured with `twitterHandle` (`@excited_adi`).
  - No indexable page points back to the homepage as its canonical (resolving duplicate content issues).

### 1.2 Crawlability & Indexing Directives
- **`src/app/robots.ts`:**
  - Standard user agents: Allowed `/`, `/api/mcp`, disallowed `/admin`, `/login`, `/api/`.
  - AI Search Crawlers: Explicitly permitted (`OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `DuckAssistBot`).
  - Training Crawlers: Permitted (`GPTBot`, `ClaudeBot`, `Google-Extended`, `Meta-ExternalAgent`).
  - Correct reference to `sitemap.xml`.
- **`src/app/sitemap.ts`:**
  - Dynamically queries MongoDB collections with accurate `lastModified` timestamps.
  - Includes static roots (`/`, `/about`, `/projects`, `/experience`, `/blog`, `/contact`, `/gallery`, `/mcp`).
  - Dynamically appends `/projects/[slug]` with project cover images.
  - Dynamically appends `/blog/[slug]` with blog cover images.
  - **Needs improvement:** Add the new `/services` route and `/insights` alias into the sitemap.

### 1.3 Heading Hierarchy & Semantics
- Page headings must strictly follow one `<h1>` per page:
  - Homepage: `<h1>Aditya Kumar — Full Stack Developer & SaaS Systems Engineer</h1>` (cleanly styled).
  - About: `<h1>About Aditya Kumar — Full Stack & Systems Engineer</h1>`.
  - Projects: `<h1>Engineering Projects & Case Studies</h1>`.
  - Experience: `<h1>Professional Experience & Career Timeline</h1>`.
  - Services: `<h1>Engineering Services & Solutions</h1>`.
  - Contact: `<h1>Get in Touch — Start a Project or Hire</h1>`.
- All subheadings appropriately use `<h2>` and `<h3>` tags with descriptive semantic labels rather than decorative text.

---

## 2. Generative Engine Optimization (GEO) Audit

### 2.1 Entity Consistency Matrix
| Entity Attribute | Canonical Value | Status & Source |
|---|---|---|
| **Full Name** | Aditya Kumar | Consistent across DB, Schema, Meta |
| **Online Handles** | ErAditya1 (GitHub), excited_adi (X), eraditya (Vercel) | Verified in `docs/brand/fact-ledger.md` |
| **Headline Role** | Full Stack Developer \| SaaS & AI Systems Engineer | Standardized |
| **Home Location** | Barabanki, Uttar Pradesh, India | Verified |
| **Work Location** | Lucknow, Uttar Pradesh, India | Verified |
| **Employer** | Feeding Trends | Active role since February 2026 |
| **Educational Degrees**| B.Tech (AKTU, 2025–Present), Diploma (BTEUP, 2022–2025) | Verified |
| **Flagship Systems** | Callio AI, Amplibuzz, WAutomator, Observiq, BrightVeil | Verified in DB & repos |

### 2.2 Structured Data (JSON-LD) Validation
The current schema implementation in `src/lib/seo/schema.ts` establishes a valid Schema.org graph:
- `@type: "Person"` with stable `@id: "https://eraditya.vercel.app/#person"`
- `@type: "WebSite"` with stable `@id: "https://eraditya.vercel.app/#website"`
- `@type: "ProfilePage"` and `@type: "WebPage"` nodes connected via `isPartOf` and `about`.
- Valid `sameAs` array referencing verified URLs:
  - `https://github.com/ErAditya1`
  - `https://www.linkedin.com/in/adityaji1/`
  - `https://x.com/excited_adi`
  - `https://www.npmjs.com/package/aditya-kumar`
- Valid `hasCredential` declaring the BTEUP Diploma and `memberOf` for AKTU B.Tech.
- `makesOffer` containing structured `Offer` > `Service` records.

### 2.3 LLM Discoverability Files
- `/llms.txt` and `/llms-full.txt` are dynamically generated at runtime (`src/lib/seo/llms.ts`), summarizing:
  - Direct answers to *"Who is Aditya Kumar?"*
  - Key technical competencies (Next.js, React, Node.js, NestJS, Python, WebSockets, ElevenLabs, PostgreSQL, MongoDB, Redis, Docker).
  - Production applications built with exact problems solved and architecture details.
  - Contact methods.

---

## 3. SEO & GEO Recommendations

1. **Add `/services` Route:** Provide dedicated indexable page with structured `Service` metadata and breadcrumbs.
2. **Support `/insights` Route:** Add route mapping/alias for `/insights` alongside `/blog` so recruiters and clients looking for engineering insights find high-value content.
3. **Structured Case Studies:** Ensure each project page at `/projects/[slug]` has `SoftwareSourceCode`, `WebApplication`, and `BreadcrumbList` schema.
4. **Enhanced FAQ Schema:** Maintain page-specific visible FAQs and corresponding `FAQPage` JSON-LD schemas.
