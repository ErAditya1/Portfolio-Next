"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import {
  Briefcase,
  Layers,
  Cpu,
  GraduationCap,
  Github,
  Linkedin,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function TrustCredibilityStrip() {
  return (
    <section
      aria-label="Professional Credibility & Verified Experience"
      className="py-6 border-y border-border/60 bg-accent/25 backdrop-blur-sm relative"
    >
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Verified Active Role */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-card/60 border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span>Current Role</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-foreground truncate">
                Full Stack Developer
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Feeding Trends · Lucknow, India
              </p>
            </div>
          </div>

          {/* 2. Flagship Production Work */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-card/60 border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Flagship Systems
              </div>
              <p className="text-sm font-bold text-foreground truncate">
                Callio AI & Amplibuzz
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Voice AI Telephony · Escrow SaaS
              </p>
            </div>
          </div>

          {/* 3. Core Production Tech Stack */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-card/60 border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Production Stack
              </div>
              <p className="text-sm font-bold text-foreground truncate">
                Next.js, NestJS & MERN
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                PostgreSQL · Redis / BullMQ · Sockets
              </p>
            </div>
          </div>

          {/* 4. Verified Education & Identity */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-card/60 border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                CSE Education
              </div>
              <p className="text-sm font-bold text-foreground truncate">
                B.Tech (AKTU) & Diploma (BTEUP)
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Computer Science & Engineering
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
