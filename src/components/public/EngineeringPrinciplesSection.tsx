"use client";

import { Container } from "@/components/Container";
import {
  ShieldCheck,
  Zap,
  Layers,
  Workflow,
  Cpu,
  CheckCircle2,
  Server,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface PrincipleItem {
  icon: React.ElementType;
  title: string;
  category: string;
  description: string;
  verifiedEvidence: string;
  evidenceLink: string;
  badgeColor: string;
}

const principles: PrincipleItem[] = [
  {
    icon: Zap,
    title: "Low Latency & Real-Time Performance",
    category: "Real-Time Systems",
    description:
      "Engineering bi-directional WebSocket audio streaming and optimistic client updates for instantaneous interaction with zero UI freezing.",
    verifiedEvidence: "Implemented in Callio AI voice telephony pipelines",
    evidenceLink: "/projects/callio-ai-ai-calling-voice-ai-platform",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    icon: Workflow,
    title: "Resilient Background Job Queues",
    category: "Asynchronous Architecture",
    description:
      "Decoupling slow tasks (scraping, notifications, media transcoding, payment webhooks) into BullMQ workers backed by Redis for failure recovery.",
    verifiedEvidence: "Powering Amplibuzz verification & WAutomator campaigns",
    evidenceLink: "/projects/amplibuzz",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    icon: ShieldCheck,
    title: "End-to-End Type Safety & Data Validation",
    category: "Code Integrity",
    description:
      "Strict TypeScript types across frontend and backend, combined with Zod schema validation at every network boundary to prevent runtime errors.",
    verifiedEvidence: "Applied across Next.js App Router & NestJS microservices",
    evidenceLink: "/experience",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    icon: Server,
    title: "Production-First Architecture & DevOps",
    category: "Reliability & Scalability",
    description:
      "Multi-stage Docker builds, PostgreSQL / MongoDB indexing, Redis caching, and automated deployment pipelines configured for reproducible builds.",
    verifiedEvidence: "Live deployments across Vercel, Render, and Linux VPS",
    evidenceLink: "/projects",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
];

export function EngineeringPrinciplesSection() {
  return (
    <section
      id="engineering-principles"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container>
        <div className="space-y-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-b border-border/40">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Standards
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Engineering Principles & <span className="text-gradient">Outcomes</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Rather than relying on unverified ratings, I measure engineering success through architectural rigor, predictable system uptime, and measurable business deliverables.
              </p>
            </div>

            <Link
              href="/contact"
              className="group px-5 py-3 rounded-2xl bg-card border border-border hover:border-indigo-500/40 text-foreground text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0 hover:bg-accent active:scale-95"
            >
              Discuss Your Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-500" />
            </Link>
          </div>

          {/* Grid of Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-8 rounded-3xl bg-card border border-border hover:border-indigo-500/40 transition-all duration-300 shadow-sm flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-foreground border border-border group-hover:border-indigo-500/40 group-hover:text-indigo-500 transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${item.badgeColor}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Grounded Evidence Link */}
                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="line-clamp-1">{item.verifiedEvidence}</span>
                    </div>

                    <Link
                      href={item.evidenceLink}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 flex items-center gap-1 group/link"
                    >
                      Case Study
                      <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
