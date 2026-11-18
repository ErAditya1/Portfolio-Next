# Fact ledger — Aditya Kumar

_Last verified: 2026-11-18. Only facts in this file may be published (site copy, schema, llms.txt, profiles).
Update this file first whenever something changes. Built with the `developer-personal-brand-growth` skill._

## Identity
| Fact | Value | Source | Status |
|---|---|---|---|
| Full name | Aditya Kumar | DB settings, GitHub API | Verified |
| Handles | ErAditya1 (GitHub), eraditya (site), excited_adi (X) | GitHub API, DB | Verified |
| Headline role | Full Stack Developer | DB `ownerTitle`, Feeding Trends role | Verified |
| Home location | Barabanki, Uttar Pradesh, India | GitHub profile location | Verified |
| Work location | Lucknow, Uttar Pradesh, India | Experience records | Verified |
| Canonical website | https://eraditya.vercel.app | GitHub `blog` field, Vercel | Verified |
| Email (public) | mradityaji2@gmail.com | DB, site | Verified |
| Phone/WhatsApp (public) | +91 9473774390 | DB, site | Verified |
| Headshot | Cloudinary avatar in DB settings | DB | Verified |

## Profiles (sameAs)
| Platform | URL | Resolves? | Notes |
|---|---|---|---|
| GitHub | https://github.com/ErAditya1 | 200 | Location, website match |
| LinkedIn | https://www.linkedin.com/in/adityaji1/ | bot-walled | Confirmed by owner (2026-11-18) |
| X | https://x.com/excited_adi | bot-walled | From DB |
| npm | https://www.npmjs.com/package/aditya-kumar | 200 | `npx aditya-kumar` card |

## Roles
| Title (exact) | Organisation | Type | Location | Period | Source |
|---|---|---|---|---|---|
| Full Stack Developer | Feeding Trends | Full time | Lucknow | Feb 2026 – present | Experience DB |
| MERN Stack Developer | Softpro India | Internship | Lucknow | Jul 2025 – Feb 2026 | Experience DB |
| Python / Django Trainee | Softpro India | Training | Lucknow | May 2024 – Jul 2024 | Experience DB |
| Freelance / client projects | Multiple clients | Freelance | Remote | 2023 – 2024 | Experience DB |

## Education
| Qualification | Institution / board | Years | Status | Source |
|---|---|---|---|---|
| B.Tech, Computer Science & Engineering | Dr. A.P.J. Abdul Kalam Technical University (AKTU) | 2025 – present (owner's latest edit; commit ca48fa6 said 2024) | Pursuing | ExperiencePageClient, original bio |
| Diploma, Computer Science & Engineering | Board of Technical Education Uttar Pradesh (BTEUP) | 2022 – 2025 | Completed | ExperiencePageClient, original bio |

Education is hard-coded in `ExperiencePageClient.tsx` and mirrored in `src/lib/seo/schema.ts`
(`hasCredential` + `memberOf`). Entries added in Admin → Experiences → Education replace both automatically.
The polytechnic's own name was removed on purpose (commit df6495c) — don't reintroduce it.

## Projects
| Name | Context | Stack (from DB) | Live |
|---|---|---|---|
| Callio AI | Feeding Trends | Next.js, NestJS, PostgreSQL, Prisma, Redis, BullMQ, Socket.io, Tata Smartflo, ElevenLabs | callio.cheetahagi.com |
| Amplibuzz | Feeding Trends | Next.js, NestJS, PostgreSQL, Prisma, Redis, BullMQ, Puppeteer, Razorpay | amplibuzz.com |
| Observiq (Trubetix) | Feeding Trends | FastAPI, Next.js, PostgreSQL, Redis, Playwright, scikit-learn | observiq.cheetahagi.com |
| Cheetah AGI | (context not stated) | Node.js, NestJS, Next.js, OpenAI/Claude/Gemini APIs | cheetahagi.com |
| WAutomator | (context not stated) | Next.js, NestJS, PostgreSQL, Redis, BullMQ, Prisma | whatsapp.billionairevox.com |
| BrightVeil LMS | Personal | Next.js, Node.js, Express, MongoDB, Cloudinary, Razorpay | brightveil.vercel.app |
| Super Tasky | Personal | Next.js, Express, MongoDB, Redux, JWT | supertasky.vercel.app |
| NotesHub | Personal | React, Express, MongoDB, JWT | noteshubio.vercel.app |
| Adarsh Inter College | (context not stated) | Django, PostgreSQL | clg-ms-django.onrender.com |
| Geeta Palace | Client | Next.js, Tailwind CSS | geeta-palace.vercel.app |
| Sagar Institute (SITM) | Client | Next.js, Tailwind CSS | sagar-aditya.vercel.app |

## Conflicts
| Attribute | Value A | Value B | Resolution |
|---|---|---|---|
| LinkedIn URL | `/in/adityaji1/` (DB, Aug 2026) | `/in/eraditya1` (old hard-coded fallbacks, old llms.txt) | **Resolved 2026-11-18: owner confirmed `/in/adityaji1/`.** Used everywhere; `eraditya1` must not be used. |
| Website | eraditya.vercel.app | eraditya.dev (old llms.txt) | eraditya.dev doesn't resolve → removed |
| X handle | @excited_adi (DB) | @eraditya1 (old twitter:creator) | Using DB value |
| Headline | Full Stack Developer | "(Junior Level)", "AI Systems Engineer", "Backend & System Engineer" | Unified to "Full Stack Developer" |

## Needs confirmation (owner-asserted, high-risk)
| Claim | Where | Wording now | Decision |
|---|---|---|---|
| Callio AI latency "<300 ms" | Project description/case study | Kept on the project page; removed from meta descriptions and FAQ | Confirm measured |
| Observiq "10+ social networks" | Project description | Kept on page; removed from meta | Confirm |
| Pricing "from $499 / ₹35,000", "30 days of post-launch fixes" | FAQ (contact) | Kept | Confirm still offered |
| "Replies within 24 hours" | FAQ (contact) | Kept | Confirm |
| Testimonials (4, attributed to teams) | Homepage | Kept on page, **not** in schema | Confirm they're real quotes; add names if possible |
| "Clients in US, UK, UAE, Europe" | Old FAQ | **Removed** → "open to remote work with teams in any time zone" | Restore only if true |
| "AES-256 encryption", "OWASP Top 10 guards" | Old FAQ | **Removed** → auth, validation, rate limiting | Restore only if documented |
| Fake business data (street "Lucknow Tech Corridor", postal code, geo, 9–22h hours, priceRange) | Old root schema | **Removed** | — |
