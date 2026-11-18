import React from "react";
import { ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/public/JsonLd";
import { Container } from "@/components/Container";

export interface FAQItem {
  id: string;
  category: "engineering" | "projects" | "geo" | "pricing";
  question: string;
  answer: string;
}

/**
 * Visible FAQ + matching FAQPage schema. Answers are written to be quoted verbatim by search and AI
 * engines, so they only contain facts from the portfolio data. Keep them under ~80 words.
 */
export const PORTFOLIO_FAQS: FAQItem[] = [
  {
    id: "who-is-aditya-kumar",
    category: "geo",
    question: "Who is Aditya Kumar?",
    answer:
      "Aditya Kumar (GitHub: ErAditya1) is a Full Stack Developer from Barabanki, Uttar Pradesh, India. Since February 2026 he has worked as a Full Stack Developer at Feeding Trends in Lucknow. He builds web applications with Next.js, React, Node.js, NestJS, MongoDB and PostgreSQL, including the Callio AI voice-calling platform, the Amplibuzz influencer marketing platform and the WAutomator WhatsApp automation platform.",
  },
  {
    id: "location-remote",
    category: "geo",
    question: "Where is Aditya Kumar based, and does he work remotely?",
    answer:
      "Aditya lives in Barabanki and works in Lucknow, Uttar Pradesh, India. He is open to full-time roles, freelance projects and remote work with teams in any time zone.",
  },
  {
    id: "tech-stack",
    category: "engineering",
    question: "What technologies does Aditya Kumar use?",
    answer:
      "Frontend: Next.js, React, TypeScript, Tailwind CSS, Redux and Zustand. Backend: Node.js, Express.js, NestJS, Python with Django and FastAPI, REST APIs and WebSockets (Socket.io). Data and infrastructure: MongoDB, PostgreSQL with Prisma, MySQL, Redis, BullMQ queues and Docker. Integrations: ElevenLabs, Deepgram, the WhatsApp Cloud API, Razorpay and Cloudinary.",
  },
  {
    id: "ai-voice-calling",
    category: "projects",
    question: "What AI voice-calling work has Aditya done?",
    answer:
      "At Feeding Trends, Aditya worked on Callio AI, an outbound calling platform that connects Tata Smartflo cloud telephony with ElevenLabs voice synthesis. It streams call audio over WebSockets, handles barge-in (the caller interrupting the agent), queues calls with BullMQ and logs each call for follow-up. It is built with Next.js, NestJS, PostgreSQL, Prisma and Redis.",
  },
  {
    id: "whatsapp-automation",
    category: "projects",
    question: "Has Aditya built WhatsApp Cloud API automation?",
    answer:
      "Yes. WAutomator is a multi-tenant platform built on Meta's official WhatsApp Cloud API. Businesses use it to schedule broadcast campaigns, reply automatically with an AI chatbot and track results. Campaigns run through BullMQ and Redis queues; the stack is Next.js, NestJS, PostgreSQL and Prisma.",
  },
  {
    id: "amplibuzz",
    category: "projects",
    question: "What is Amplibuzz?",
    answer:
      "Amplibuzz is an influencer marketing platform Aditya worked on at Feeding Trends. Brands fund campaigns into an escrow wallet, creators publish sponsored posts, and Puppeteer workers on BullMQ queues check that each post is live on Instagram or YouTube before the payout is released. It uses Next.js, NestJS, PostgreSQL, Redis and Razorpay.",
  },
  {
    id: "quality-practices",
    category: "engineering",
    question: "How does Aditya keep his apps fast and secure?",
    answer:
      "He renders pages on the server with Next.js (React Server Components and incremental static regeneration), caches hot data in Redis, moves slow work such as scraping, calls and campaigns into BullMQ background jobs, and uses TypeScript throughout. APIs get authentication, input validation and rate limiting.",
  },
  {
    id: "pricing-timelines",
    category: "pricing",
    question: "How much does a project cost and how long does it take?",
    answer:
      "It depends on scope. Landing pages and portfolio sites usually take 1–2 weeks, starting at $499 (₹35,000). Full-stack MVPs and SaaS apps take about 3–6 weeks and are delivered in milestones with staging deployments. AI calling or automation pipelines are scoped individually. Every project includes documentation, Git history and 30 days of post-launch fixes.",
  },
  {
    id: "contact",
    category: "pricing",
    question: "How can I hire or contact Aditya Kumar?",
    answer:
      "Email mradityaji2@gmail.com, message him on WhatsApp at +91 9473774390, or use the form on the contact page. He usually replies within 24 hours to set up a short call about your requirements.",
  },
  {
    id: "npx-card",
    category: "engineering",
    question: "What is the npx aditya-kumar command?",
    answer:
      "It's Aditya's terminal business card, published on npm as aditya-kumar. Run npx aditya-kumar@latest --connect in any terminal to browse his projects and contact options without installing anything.",
  },
];

const PRESETS: Record<string, string[]> = {
  home: ["who-is-aditya-kumar", "location-remote", "tech-stack", "ai-voice-calling", "whatsapp-automation", "contact"],
  about: ["who-is-aditya-kumar", "location-remote", "tech-stack", "quality-practices", "npx-card"],
  contact: ["contact", "pricing-timelines", "location-remote", "who-is-aditya-kumar"],
};

export function faqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function FAQSection({
  preset = "home",
  title = "Frequently asked questions",
}: {
  preset?: keyof typeof PRESETS;
  title?: string;
}) {
  const ids = PRESETS[preset] || PRESETS.home;
  const items = ids.map((id) => PORTFOLIO_FAQS.find((f) => f.id === id)).filter((f): f is FAQItem => !!f);

  return (
    <section aria-labelledby={`faq-${preset}`} className="py-12">
      <JsonLd data={faqSchema(items)} />
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 id={`faq-${preset}`} className="mb-6 text-2xl font-black tracking-tight text-foreground md:text-3xl">
            {title}
          </h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
            {items.map((faq, i) => (
              <details key={faq.id} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base">{faq.question}</h3>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
