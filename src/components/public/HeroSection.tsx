"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Terminal,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";
import { ISiteSettings } from "@/types";
import { RESUME, EMAIL } from "@/Data";
import { DynamicBioText } from "@/components/public/DynamicBioText";
import { TypewriterText } from "@/components/public/TypewriterText";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function HeroSection({ settings }: { settings?: ISiteSettings }) {
  const [copiedCmd, setCopiedCmd] = useState(false);

  const name = settings?.ownerName || "Aditya Kumar";
  const resumeLink = settings?.resumeUrl || RESUME;
  const githubLink = settings?.githubUrl || "https://github.com/ErAditya1";
  const linkedinLink = settings?.linkedinUrl || "https://www.linkedin.com/in/adityaji1/";
  const twitterLink = settings?.twitterUrl || "https://x.com/excited_adi";
  const emailLink = settings?.ownerEmail ? `mailto:${settings.ownerEmail}` : `mailto:${EMAIL}`;

  const terminalCommand = "npx aditya-kumar@latest --connect";

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(terminalCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <section id="home" className="pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden relative">
      {/* Background Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[650px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 dark:bg-indigo-600/20 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-purple-600/15 dark:bg-purple-600/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-pink-500/10 dark:bg-pink-500/15 rounded-full blur-[120px]" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT CONTENT COLUMN ================= */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="lg:col-span-7 space-y-6 sm:space-y-7"
          >
            {/* 1. Availability Beacon Badge */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Available for Full-time Roles & Client Projects</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Full Stack & AI Systems</span>
              </div>
            </motion.div>

            {/* 2. Main Headline with Auto-Typer Dynamic Rotation */}
            <motion.div variants={fadeUp} className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.14] tracking-tight">
                Building Modern{" "}
                <br className="hidden sm:inline" />
                <TypewriterText
                  words={[
                    "Intelligent AI Systems",
                    "Scalable SaaS Platforms",
                    "Real-Time Voice Agents",
                    "Cloud Architectures",
                  ]}
                  textClassName="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  typingSpeed={65}
                  deletingSpeed={30}
                  pauseDuration={2400}
                />
              </h1>

              {/* Semantic Entity Locator */}
              <p className="text-xs sm:text-sm font-mono text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong className="text-foreground">{name}</strong> — Full Stack Developer at{" "}
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Feeding Trends</span>, Lucknow
                </span>
              </p>
            </motion.div>

            {/* 3. Dynamically Loaded Engineering Statement */}
            <motion.div
              variants={fadeUp}
              className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed font-normal min-h-[4rem] sm:min-h-[3rem]"
            >
              <DynamicBioText
                text="Engineering high-performance web applications, scalable SaaS architectures, and intelligent AI voice integrations with modern Next.js and Python ecosystems."
              />
            </motion.div>

            {/* 4. Action CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3.5 pt-1">
              {/* Primary CTA */}
              <Link
                href="#featured-projects"
                className="group px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2.5 active:scale-95"
              >
                <span>Explore My Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/contact"
                className="group px-6 py-3.5 bg-card border border-indigo-500/40 hover:border-indigo-500 hover:bg-indigo-500/10 text-foreground font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span>Let&apos;s Work Together</span>
              </Link>

              {/* Resume / CV Link */}
              <a
                href={resumeLink}
                download
                className="px-5 py-3.5 bg-card/60 border border-border hover:border-border/80 hover:bg-accent text-muted-foreground hover:text-foreground font-bold text-sm rounded-2xl transition-all flex items-center gap-2 active:scale-95"
                title="Download Aditya Kumar's Resume"
              >
                <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                <span>Resume / CV</span>
              </a>
            </motion.div>

            {/* 5. Minimal, Clean Bottom Bar: Social Channels + Quick Terminal Pill */}
            <motion.div
              variants={fadeUp}
              className="pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-xl"
            >
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

              {/* Sleek One-Click Interactive Terminal Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/60 border border-border text-xs font-mono text-muted-foreground">
                <Terminal className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="text-foreground font-medium text-[11px] truncate max-w-[210px]">
                  {terminalCommand}
                </span>
                <button
                  onClick={handleCopyCommand}
                  className="ml-0.5 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy Command"
                >
                  {copiedCmd ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT AVATAR SHOWCASE (MINIMAL & CHIP-FREE) ================= */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Ambient Soft Glow Behind Profile */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-pink-500/10 rounded-full blur-3xl -z-10 scale-105" />

            <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
              {/* Clean Profile Card with Subtle Glass Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative rounded-3xl p-2.5 bg-card/70 border border-border/80 shadow-2xl backdrop-blur-md group"
              >
                {/* Avatar Frame (Free of distracting chips/badges) */}
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-accent/40">
                  <Image
                    src={settings?.avatarUrl || "/images/aditya_profile.png"}
                    alt={name}
                    fill
                    priority
                    sizes="(max-width: 768px) 320px, 360px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle soft gradient fade at base */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
