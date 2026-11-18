# Required Assets & Asset Inventory — Aditya Kumar Portfolio

**Last Updated:** November 18, 2026

This document lists all static visual media assets used in the portfolio, their status, verified locations in the repository, and recommended additions for future enhancement.

---

## 1. Existing Assets in Repository

| Asset | Location / URL | Description | Status |
|---|---|---|---|
| **Avatar Profile Image** | `/images/aditya_profile.png` | Aditya's headshot used in Hero, About, and Open Graph cards | Active & Verified |
| **Resume PDF** | `/images/ADITYA_RESUME.pdf` | Resume download link (`src/Data.ts`) | Active & Verified |
| **Site Favicon** | `/favicon.ico` | Standard browser icon | Active & Verified |
| **Social Open Graph Card** | Dynamic `@/app/opengraph-image.tsx` | Next.js Edge generated 1200×630 branded card | Active & Verified |
| **Twitter Card** | Dynamic `@/app/twitter-image.tsx` | Next.js Edge generated card | Active & Verified |

---

## 2. Project Screenshot Assets (Cloudinary & Local Fallbacks)

Projects in the MongoDB database store image URLs hosted on Cloudinary or public CDNs:

| Project | Primary Image Source | Fallback Handling | Status |
|---|---|---|---|
| **Callio AI** | Remote Cloudinary screenshot / DB | SVG Architecture & waveform fallback | Active |
| **Amplibuzz** | Remote Cloudinary screenshot / DB | Influencer campaign analytics layout | Active |
| **WAutomator** | Remote Cloudinary screenshot / DB | WhatsApp webhook flow preview | Active |
| **Observiq (Trubetix)** | Remote Cloudinary screenshot / DB | Social media intelligence UI | Active |
| **BrightVeil LMS** | Remote Cloudinary screenshot / DB | Course catalog & video player UI | Active |
| **Super Tasky** | Remote Cloudinary screenshot / DB | Kanban board & task manager preview | Active |
| **NotesHub** | Remote Cloudinary screenshot / DB | Markdown editor UI | Active |
| **Geeta Palace** | Remote Cloudinary screenshot / DB | Hospitality booking showcase | Active |
| **SITM Institute** | Remote Cloudinary screenshot / DB | College educational portal showcase | Active |

---

## 3. Recommended Future Assets (Owner Action Items)

The following assets would further elevate visual authority and can be uploaded via the Admin Portal (`/admin/media` or `/admin/projects/edit/[id]`):

1. **High-Resolution Architecture Diagrams:**
   - Callio AI: WebSockets telephony flow (Tata Smartflo ↔ Node.js ↔ ElevenLabs ↔ Deepgram).
   - Amplibuzz: Escrow payout flow with BullMQ workers and Puppeteer scraper.
   - WAutomator: Meta WhatsApp Cloud API multi-tenant webhook architecture.
2. **Short Screen Recordings (WebM/MP4):**
   - 10-second demo clips showing Callio AI voice response or WAutomator campaign dispatch.
3. **Verified Client / Colleague Testimonial Avatars:**
   - If genuine client permissions are secured in the future, individual headshots and linked LinkedIn profiles can be uploaded.
