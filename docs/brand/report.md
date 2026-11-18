# Personal brand SEO report — Aditya Kumar

_Date: 2026-11-18 · Site: https://eraditya.vercel.app · Branch: `feat/personal-brand-seo`_

## Summary
The site had strong content but four indexing problems that hid most of it from Google. Every page except the
project and blog details declared the **homepage as its canonical**, so Google could treat About, Projects,
Experience, Blog and Contact as duplicates of `/`. Titles were doubled by the layout template (100–120
characters), each page carried 2–3 conflicting Person schemas plus a business schema with an invented street
address and opening hours, and the FAQ schema described content that wasn't visible on the page. All of that is
fixed; facts now come from one source (the database) for the pages, the schema, `llms.txt` and the AI agent.

## Audit (automated, `audit-url.mjs`)
| | Live site (before) | Local build (after) |
|---|---|---|
| Errors | 30 | 0* |
| Warnings | 20 | 4 (cover images 16:9 instead of 1.91:1, /login has no canonical by design) |
| Wrong canonical | 7 pages | 0 |
| Title > 65 chars / doubled | 9 pages | 0 |
| Person nodes per page | 2–3 (conflicting) | 1 (`@id` graph) |
| OG image | 830×944 JPEG labelled 1200×630 | Generated 1200×630 card + real covers |
| `/login` indexable | yes | `noindex` (meta + header) |

\* The default share image URL is absolute to production, so it reports 404 until this branch is deployed.

## Code changes
- `src/lib/seo/` — `site.ts` (SITE_URL, cached profile loader), `schema.ts` (Person/WebSite graph, page nodes,
  breadcrumbs), `meta.ts` (per-page metadata with own canonical + OG), `llms.ts` (llms.txt builders).
- Root layout: metadata only, template `"%s · Aditya Kumar"`, no inherited canonical, no stuffed keywords;
  JSON-LD moved to the public layout (not on admin).
- Every public page: own title/description/canonical/OG; page schema (ProfilePage, CollectionPage + ItemList,
  ContactPage, BlogPosting, WebApplication, BreadcrumbList).
- Home and About H1s now name the person (visual design unchanged).
- FAQ is now visible (accordion) with matching FAQPage schema, per page; unverifiable claims removed.
- Blog detail: removed the hidden duplicate "AI context" block; byline links to `/about` with `rel="author"`.
- `robots.ts`: search + AI crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot …), `/login` blocked.
- `sitemap.ts`: real `lastModified` dates, image entries, new pages.
- `/llms.txt` and `/llms-full.txt` generated from the DB (old static files had a dead domain).
- `opengraph-image.tsx` / `twitter-image.tsx`: 1200×630 branded card.
- Footer profile links get `rel="me"`; stale LinkedIn fallbacks replaced.
- `next.config.ts`: `X-Robots-Tag: noindex` on `/admin` and `/login`.

## Data changes (backup: `.backups/seo-before-2026-11-18T05-45-12-935Z.json`)
- Settings: headline "Full Stack Developer", new entity-statement bio, site title/description, location,
  skill names (Tailwind CSS, Microsoft Azure, GitHub Actions, Prisma ORM).
- 11 projects: new `seoTitle` + `seoDescription`, tech names normalised (PostgreSQL, Next.js, Node.js …).
- 9 posts: new `seoTitle` + `seoDescription`; the three posts that shared a title with a project got distinct
  titles; their **wrong cover images** (White Swan / BrightVeil / Super Tasky screenshots) replaced with the
  right project covers; stray "generative-ai," tag fixed.
- Feeding Trends experience: present-tense description and bullets.

## Removed or softened claims (please confirm)
See `fact-ledger.md` → *Needs confirmation*. Removed: invented street address/postal code/geo/opening hours,
"clients in US/UK/UAE/Europe", "AES-256", "OWASP Top 10", "tamper-proof", "(Junior Level)" in the headline,
"Best/Top developer" keywords. Kept but flagged: pricing, 30-day fixes, 24-hour replies, "<300 ms", "10+
networks", homepage testimonials.

## Your to-do list (needs your logins)
- [ ] Merge the PR, then in **Search Console**: submit `sitemap.xml`, request indexing for `/`, `/about`,
      `/projects`, `/experience`, `/blog`, `/contact`.
- [ ] **Bing Webmaster Tools**: import from Search Console (ChatGPT/Copilot ground on Bing).
- [x] LinkedIn URL confirmed: `linkedin.com/in/adityaji1/` (already used on the site and in schema).
- [ ] Apply GitHub + LinkedIn copy from `profile-copy.md`.
- [ ] Create/refresh Peerlist, Contra, Twine, Upwork profiles; add their URLs in Admin → Settings → social links.
- [ ] Add education in Admin → Experiences → Education if you want it shown (schema picks it up).
- [ ] Rich Results Test + validator.schema.org on `/`, `/about`, one project, one post after deploy.

## 90-day plan
| Weeks | Task | Target |
|---|---|---|
| 1 | Deploy, Search Console + Bing, apply GitHub/LinkedIn copy | Name queries |
| 2–3 | Post: WhatsApp Cloud API with Next.js + NestJS (from WAutomator) | Long tail |
| 4–5 | Post: ElevenLabs + telephony over WebSockets, handling barge-in | Long tail |
| 6 | Marketplace profiles live; add to sameAs | Local queries |
| 7–8 | Post: escrow payouts with Razorpay + BullMQ | Long tail |
| 9–10 | Refresh the oldest post (System Design 101) with real examples | Authority |
| 11–12 | Review Search Console: rewrite titles with impressions but low CTR | All |

## How to measure
- Search Console queries: `aditya kumar`, `aditya kumar developer`, `eraditya`, `aditya kumar lucknow`,
  `aditya kumar barabanki`, project names.
- AI prompts (monthly, web search on): see `keyword-map.md` → AI prompts.

## Not verified
- Live rendering after deploy (verified only on the local dev server).
- LinkedIn and X URLs (bot-walled; can't be fetched).
- Search volumes (no keyword tool credits).
