import React from "react";
import { JsonLd } from "@/components/public/JsonLd";

export interface FAQItem {
  id: string;
  category: "all" | "engineering" | "projects" | "geo" | "pricing";
  categoryLabel: string;
  question: string;
  answer: string;
  highlight?: string;
  keywords?: string[];
}

export const PORTFOLIO_FAQS: FAQItem[] = [
  {
    id: "who-is-aditya-kumar",
    category: "geo",
    categoryLabel: "Profile & Geolocation",
    question: "Who is Aditya Kumar and what are his core technical specializations?",
    answer:
      "Aditya Kumar is a Full-Stack Web Developer and AI Systems Engineer based in Barabanki / Lucknow, Uttar Pradesh, India. He specializes in architecting high-performance web applications using Next.js 15, React 19, TypeScript, NestJS, Python (FastAPI/Django), and building sub-300ms conversational Voice AI systems (ElevenLabs) and Meta WhatsApp Cloud API automation platforms.",
    highlight: "Full-Stack Web Architect & AI Voice Systems Engineer with production experience at Feeding Trends.",
    keywords: ["Aditya Kumar", "Full Stack Developer", "Barabanki", "Lucknow", "India", "Next.js", "React", "AI Engineer"],
  },
  {
    id: "geolocation-remote-availability",
    category: "geo",
    categoryLabel: "Profile & Geolocation",
    question: "Where is Aditya Kumar located, and is he available for remote or international work?",
    answer:
      "Aditya is located in the Lucknow/Barabanki technology corridor (Uttar Pradesh, India) and works seamlessly with clients, startups, and engineering teams globally across the US, UK, UAE, Europe, and India. He is fully available for remote full-time software engineering roles, high-impact contract consulting, and freelance project engagements.",
    highlight: "Available for worldwide remote contracts & full-time engineering opportunities.",
    keywords: ["Remote Developer", "Lucknow Developer", "Barabanki Developer", "US Remote Contract", "Hire Developer India"],
  },
  {
    id: "ai-voice-telephony-projects",
    category: "projects",
    categoryLabel: "Projects & Architecture",
    question: "What real-time AI Voice Telephony & Conversational AI systems has Aditya built?",
    answer:
      "Aditya engineered Callio AI, an enterprise outbound calling platform that bridges Tata Smartflo cloud telephony trunks with ElevenLabs neural voice synthesis. It features full-duplex WebSocket audio streams, barge-in speech interruption detection, BullMQ queue management, and automated GPT-4 post-call CRM telemetry with sub-300ms real-time audio latency.",
    highlight: "Engineered Callio AI: Sub-300ms conversational voice telephony using ElevenLabs & WebSockets.",
    keywords: ["Callio AI", "ElevenLabs Voice AI", "Tata Smartflo", "Conversational AI", "Voice Telephony Developer"],
  },
  {
    id: "whatsapp-automation-saas",
    category: "projects",
    categoryLabel: "Projects & Architecture",
    question: "How does Aditya build enterprise WhatsApp Cloud API marketing platforms?",
    answer:
      "Aditya designed and developed WAutomator, a scalable multi-tenant SaaS platform built on Meta's official WhatsApp Cloud API. It features automated broadcast campaign scheduling with BullMQ and Redis queues, Google Gemini AI chatbots for intelligent auto-replies, dynamic template variable injection, and Razorpay credit-based subscription billing.",
    highlight: "Built WAutomator: Scalable multi-tenant WhatsApp Cloud API marketing engine with Gemini AI.",
    keywords: ["WAutomator", "WhatsApp Cloud API SaaS", "Meta WhatsApp API", "Gemini Chatbot", "BullMQ Queue"],
  },
  {
    id: "tech-stack-capabilities",
    category: "engineering",
    categoryLabel: "Engineering & Tech Stack",
    question: "What is Aditya Kumar's complete production technology stack?",
    answer:
      "Aditya's production stack includes:\n• Frontend: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Shadcn UI, Zustand, TanStack Query.\n• Backend: NestJS, Node.js, Express.js, Python (FastAPI & Django), RESTful APIs, WebSockets (ws & Socket.io).\n• AI & Real-time: ElevenLabs Voice AI, Deepgram STT, Google Gemini, OpenAI GPT-4, Meta WhatsApp Cloud API.\n• Databases & DevOps: PostgreSQL (Prisma ORM), MongoDB Atlas, Redis, BullMQ, Docker Compose, Linux VPS, Nginx.",
    highlight: "Next.js 15, React 19, NestJS, Python, PostgreSQL, MongoDB, Redis, Docker & ElevenLabs.",
    keywords: ["Next.js 15", "React 19", "TypeScript", "NestJS", "PostgreSQL", "MongoDB", "Tailwind CSS", "Docker"],
  },
  {
    id: "performance-and-security",
    category: "engineering",
    categoryLabel: "Engineering & Tech Stack",
    question: "How does Aditya ensure sub-second page speeds, high availability, and security?",
    answer:
      "Aditya enforces modern web engineering best practices: Incremental Static Regeneration (ISR) and React Server Components for near-zero TTFB, Redis in-memory caching for database queries, BullMQ job queues for async task offloading, strict TypeScript interfaces, AES-256 data encryption, rate-limiting, and comprehensive OWASP Top 10 security guards.",
    highlight: "ISR caching, sub-second TTFB, Redis pre-caching, BullMQ failovers, and OWASP security.",
    keywords: ["Web Performance", "ISR Caching", "Redis Architecture", "OWASP Security", "Fast Next.js"],
  },
  {
    id: "pricing-and-timelines",
    category: "pricing",
    categoryLabel: "Pricing & Engagement",
    question: "What is the typical project delivery timeline and pricing model?",
    answer:
      "Timelines and pricing depend on project scope:\n• Modern Landing Pages / High-Conversion Portfolios: 1–2 weeks (Starting at $499 / ₹35,000).\n• Full-Stack MVP Web Applications & SaaS: 3–6 weeks with milestone-based staging deployments.\n• Enterprise Telephony & AI Automation Pipelines: Custom scope with weekly sprints and SLA support.\nAll projects include clean code documentation, Git version control, and 30 days of post-launch warranty.",
    highlight: "Milestone-based pricing, transparent delivery timelines, and 30-day warranty support.",
    keywords: ["Web Development Cost", "Hire Full Stack Developer Price", "Freelance Web Developer Rate India"],
  },
  {
    id: "how-to-hire-and-contact",
    category: "pricing",
    categoryLabel: "Pricing & Engagement",
    question: "How can recruiters, founders, or clients get in touch to hire Aditya?",
    answer:
      "You can connect directly via WhatsApp at +91 9473774390 or email mradityaji2@gmail.com. Aditya responds within 24 hours to schedule an introductory discovery call, review technical requirements, and provide architectural roadmaps and estimates.",
    highlight: "Direct WhatsApp: +91 9473774390 | Email: mradityaji2@gmail.com | Response <24 hours.",
    keywords: ["Contact Aditya Kumar", "Hire Aditya Kumar", "WhatsApp Developer", "Schedule Discovery Call"],
  },
  {
    id: "terminal-cli-package",
    category: "engineering",
    categoryLabel: "Engineering & Tech Stack",
    question: "How do I run Aditya Kumar's interactive developer terminal card?",
    answer:
      "You can run Aditya's official interactive terminal business card directly from any terminal (macOS, Windows PowerShell, Linux, or WSL) without installing anything by executing:\n\n$ npx aditya-kumar@latest --connect\n\nThis launches a multi-menu interactive terminal portfolio with project deep-dives, live architecture highlights, and one-click contact options.",
    highlight: "Execute 'npx aditya-kumar@latest --connect' in any terminal worldwide.",
    keywords: ["npx aditya-kumar", "npm package aditya-kumar", "CLI Portfolio", "Terminal Business Card"],
  },
  {
    id: "influencer-marketing-amplibuzz",
    category: "projects",
    categoryLabel: "Projects & Architecture",
    question: "What fintech and scraper features were engineered for Amplibuzz?",
    answer:
      "For Amplibuzz, Aditya built a locked escrow financial workflow that holds brand budgets securely and releases instant automated payouts to social media creators. The system uses headless Puppeteer workers on BullMQ queues to scrape and verify live sponsored posts on Instagram and YouTube with tamper-proof validation.",
    highlight: "Built automated Puppeteer post-verification scrapers with locked escrow payouts.",
    keywords: ["Amplibuzz", "Escrow Wallet SaaS", "Puppeteer Scraper", "Influencer Marketing Platform"],
  },
];

export const faqSchemaData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": PORTFOLIO_FAQS.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer.replace(/\n/g, " "),
    },
  })),
};

/**
 * Invisible SEO & GEO FAQ Schema Generator
 * Injects Google Schema.org FAQPage structured data in the background with zero visible UI impact.
 */
export function FAQSection() {
  return <JsonLd data={faqSchemaData} />;
}
