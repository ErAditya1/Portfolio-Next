"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Check,
  Calendar,
  MessageSquare,
  Zap,
  Terminal,
  ShieldCheck
} from "lucide-react";
import { Container } from "@/components/Container";

export function CallToActionSection() {
  const [copied, setCopied] = useState(false);
  const email = "kumaraditya19747@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="work-together-cta" className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Ambient Blur Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <Container>
        <div className="relative rounded-[2.5rem] bg-card border border-border bg-gradient-to-br from-indigo-500/10 via-card to-purple-500/5 dark:from-indigo-950/70 dark:via-card dark:to-purple-950/40 p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Top Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Content Area */}
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              {/* Availability Beacon */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Available for Full-time Roles & High-Impact Contracts
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                Let&apos;s Engineer Something{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Extraordinary
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Whether you&apos;re architecting an AI-powered platform, scaling distributed backend microservices, or building an enterprise SaaS application — let&apos;s collaborate to build reliable, high-performance systems.
              </p>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" /> Production-Grade Quality
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Rapid Turnaround & High Scalability
                </span>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 group transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                Start a Conversation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={handleCopyEmail}
                className="px-8 py-4 rounded-2xl bg-card border border-border hover:border-indigo-500/50 hover:bg-accent text-foreground font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Email Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span>Copy Direct Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
