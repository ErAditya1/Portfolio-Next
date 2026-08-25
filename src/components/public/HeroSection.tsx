"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Download,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Code2,
  Cpu,
  Terminal,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  Radio,
  Layers,
  Flame,
  Activity
} from "lucide-react";
import Image from "next/image";
import { ISiteSettings } from "@/types";
import { RESUME, EMAIL } from "@/Data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 }
  },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const floatingBadgeVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const floatingBadgeVariantsAlt = {
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 4.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export function HeroSection({ settings }: { settings?: ISiteSettings }) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"terminal" | "telemetry">("terminal");

  const name = settings?.ownerName || "Aditya Kumar";
  const title = settings?.ownerTitle || "Full Stack & Realtime System Engineer";
  const bio =
    settings?.ownerBio ||
    "Architecting scalable web platforms, high-throughput backend microservices, and real-time AI voice telephony applications with modern Next.js and Python ecosystems.";
  const resumeLink = settings?.resumeUrl || RESUME;
  const githubLink = settings?.githubUrl || "https://github.com/ErAditya1";
  const linkedinLink = settings?.linkedinUrl || "https://linkedin.com";
  const twitterLink = settings?.twitterUrl || "https://twitter.com";
  const emailLink = settings?.ownerEmail ? `mailto:${settings.ownerEmail}` : `mailto:${EMAIL}`;

  const terminalCommand = "npx aditya-kumar@latest --connect";

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(terminalCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <section id="home" className="pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden relative">
      {/* Background Ambient Lights & Technical Grid Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-indigo-600/15 dark:bg-indigo-600/20 rounded-full blur-[150px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-purple-600/15 dark:bg-purple-600/20 rounded-full blur-[150px]" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-pink-500/10 dark:bg-pink-500/15 rounded-full blur-[130px]" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT CONTENT COLUMN ================= */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="lg:col-span-7 space-y-8"
          >
            {/* 1. Live Availability Beacon Badge */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Available for Full-time Roles & High-Impact Projects</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Full Stack & AI Engineer</span>
              </div>
            </motion.div>

            {/* 2. Main High-Impact Typography Headline */}
            <motion.div variants={fadeUp} className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.12] tracking-tight">
                Architecting Scalable Systems &{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Intelligent Web
                </span>{" "}
                Experiences.
              </h1>
              <div className="text-sm font-mono text-muted-foreground flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-500" />
                <span>
                  <strong className="text-foreground">{name}</strong> — Engineering at <span className="text-indigo-600 dark:text-indigo-400 font-bold">Feeding Trends</span>
                </span>
              </div>
            </motion.div>

            {/* 3. Concise Enterprise Bio */}
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed font-normal"
            >
              {bio}
            </motion.p>

            {/* 4. Interactive Live System Command Console */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg max-w-xl"
            >
              {/* Console Header Bar */}
              <div className="px-4 py-2.5 bg-accent/60 border-b border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-muted-foreground font-semibold">
                    developer-telemetry.sh
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveConsoleTab("terminal")}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition-colors ${
                      activeConsoleTab === "terminal"
                        ? "bg-indigo-600 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Console
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab("telemetry")}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition-colors ${
                      activeConsoleTab === "telemetry"
                        ? "bg-indigo-600 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Status
                  </button>
                </div>
              </div>

              {/* Console Body */}
              <div className="p-4 font-mono text-xs space-y-2">
                {activeConsoleTab === "terminal" ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground overflow-x-auto py-1">
                      <span className="text-emerald-500 font-bold">$</span>
                      <span className="text-foreground">{terminalCommand}</span>
                    </div>

                    <button
                      onClick={handleCopyCommand}
                      className="px-2.5 py-1 rounded-lg bg-accent border border-border text-muted-foreground hover:text-foreground text-[10px] font-bold flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
                      title="Copy CLI Command"
                    >
                      {copiedCmd ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-indigo-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-accent/40 border border-border/50">
                      <div className="text-[9px] text-muted-foreground uppercase font-bold">Stack</div>
                      <div className="text-foreground font-bold font-sans">Next.js & MERN</div>
                    </div>
                    <div className="p-2 rounded-xl bg-accent/40 border border-border/50">
                      <div className="text-[9px] text-muted-foreground uppercase font-bold">AI Voice</div>
                      <div className="text-foreground font-bold font-sans">ElevenLabs & STT</div>
                    </div>
                    <div className="p-2 rounded-xl bg-accent/40 border border-border/50">
                      <div className="text-[9px] text-muted-foreground uppercase font-bold">Latency</div>
                      <div className="text-emerald-500 font-bold font-sans">Low-Latency &lt;250ms</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 5. Action CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="#featured-projects"
                className="group px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2.5 active:scale-95"
              >
                <span>Explore Featured Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={resumeLink}
                download
                className="px-6 py-3.5 bg-card border border-border hover:border-indigo-500/50 hover:bg-accent text-foreground font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4 text-indigo-500" />
                <span>Resume / CV</span>
              </a>

              <Link
                href="/contact"
                className="px-5 py-3.5 text-muted-foreground hover:text-foreground font-bold text-sm rounded-2xl hover:bg-accent/60 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span>Let&apos;s Connect</span>
              </Link>
            </motion.div>

            {/* 6. Capability Highlights & Social Media Row */}
            <motion.div
              variants={fadeUp}
              className="pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Tech Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] px-3 py-1 rounded-xl bg-accent/70 border border-border/70 text-foreground font-semibold flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-indigo-500" /> Next.js & React 19
                </span>
                <span className="text-[11px] px-3 py-1 rounded-xl bg-accent/70 border border-border/70 text-foreground font-semibold flex items-center gap-1.5">
                  <Code2 className="w-3 h-3 text-purple-500" /> Node & Django
                </span>
                <span className="text-[11px] px-3 py-1 rounded-xl bg-accent/70 border border-border/70 text-foreground font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-pink-500" /> AI Voice & Sockets
                </span>
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-2.5">
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all shadow-sm"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all shadow-sm"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-sky-500 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all shadow-sm"
                  title="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={emailLink}
                  className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all shadow-sm"
                  title="Direct Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT 3D GLASS AVATAR SHOWCASE ================= */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Ambient Multi-layer Glow Behind Profile */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-pink-500/15 rounded-full blur-3xl -z-10 scale-110" />

            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              {/* Profile Card Container with Glass Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative rounded-[2.5rem] p-3.5 bg-gradient-to-b from-indigo-500/30 via-card/90 to-card border border-indigo-500/30 shadow-2xl backdrop-blur-xl group"
              >
                {/* Top Right Corner Status Beacon */}
                <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-card border border-border text-[10px] font-bold text-foreground flex items-center gap-1.5 shadow-xl z-30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live in Production
                </div>

                {/* Avatar Frame */}
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-gradient-to-b from-accent/50 to-card">
                  <Image
                    src={settings?.avatarUrl || "/images/aditya_profile.png"}
                    alt={name}
                    fill
                    priority
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Bottom Gradient Fade on Avatar */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Identity Banner Inside Avatar Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-card/85 backdrop-blur-md border border-border/80 text-center shadow-lg">
                    <h3 className="text-sm font-black text-foreground">{name}</h3>
                    <p className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400">
                      {title}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 1: Top Left Tech Stack */}
              <motion.div
                variants={floatingBadgeVariants}
                animate="animate"
                className="absolute -top-6 -left-6 sm:-left-10 z-30 px-3.5 py-2 rounded-2xl bg-card/95 backdrop-blur-md border border-border text-[11px] font-bold text-foreground shadow-2xl flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="leading-tight">Next.js & MERN</div>
                  <div className="text-[9px] text-muted-foreground font-medium">Modern Full Stack</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Right Voice / AI Tech */}
              <motion.div
                variants={floatingBadgeVariantsAlt}
                animate="animate"
                className="absolute -bottom-4 -right-4 sm:-right-8 z-30 px-3.5 py-2 rounded-2xl bg-card/95 backdrop-blur-md border border-border text-[11px] font-bold text-foreground shadow-2xl flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="leading-tight">AI & Real-Time</div>
                  <div className="text-[9px] text-muted-foreground font-medium">Telephony & WebSockets</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
