"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Code2,
  Cpu,
  Layers,
  Terminal,
  ShieldCheck,
  Zap,
  Flame,
  ArrowRight,
  Download,
  MessageSquare,
  Globe,
  Compass,
  Coffee,
  CheckCircle2,
  Building2,
  Radio,
  BookOpen,
  Award,
  Lightbulb,
  Workflow
} from "lucide-react";
import { Container } from "@/components/Container";
import { FAQSection } from "@/components/public/FAQSection";
import { CallToActionSection } from "@/components/public/CallToActionSection";
import { ISiteSettings } from "@/types";
import { RESUME, EMAIL } from "@/Data";

interface AboutPageClientProps {
  settings?: ISiteSettings;
}

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const corePillars = [
  {
    icon: Layers,
    title: "Scalable Architecture",
    description:
      "Designing modular Next.js App Router applications, REST/GraphQL APIs, and resilient backend microservices built to withstand traffic surges.",
    tags: ["SSR & ISR", "Microservices", "Event Loops"],
    gradient: "from-indigo-500/15 via-indigo-500/5 to-transparent",
    borderHover: "hover:border-indigo-500/50",
    iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  {
    icon: Zap,
    title: "Low-Latency Real-Time",
    description:
      "Engineering bi-directional event pipelines with WebSockets and integrating low-latency conversational AI voice telephony systems.",
    tags: ["Socket.io", "ElevenLabs", "Deepgram STT"],
    gradient: "from-purple-500/15 via-purple-500/5 to-transparent",
    borderHover: "hover:border-purple-500/50",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    icon: ShieldCheck,
    title: "Type Safety & Security",
    description:
      "Strict end-to-end TypeScript contracts, robust JWT/OAuth authorization layers, SQL injection prevention, and database query optimizations.",
    tags: ["Strict Types", "JWT Auth", "Data Sanitize"],
    gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    borderHover: "hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    icon: Sparkles,
    title: "Pixel-Perfect UI/UX",
    description:
      "Crafting responsive, accessible design systems with Tailwind CSS, Framer Motion micro-interactions, and harmonic light & dark themes.",
    tags: ["Framer Motion", "Design Systems", "A11y"],
    gradient: "from-pink-500/15 via-pink-500/5 to-transparent",
    borderHover: "hover:border-pink-500/50",
    iconBg: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
  },
];

const technicalMastery = [
  {
    domain: "Frontend Engineering",
    icon: Globe,
    skills: [
      { name: "Next.js 15 (App Router)", focus: "Server Components, Actions & Route Handlers" },
      { name: "React 19 & TypeScript", focus: "Strict type safety & custom hooks architecture" },
      { name: "Tailwind CSS & Framer Motion", focus: "Dynamic animations & design systems" },
      { name: "Redux Toolkit & Context API", focus: "Global client-side state management" },
    ],
  },
  {
    domain: "Backend & Systems",
    icon: Terminal,
    skills: [
      { name: "Node.js & Express.js", focus: "High-throughput asynchronous REST APIs" },
      { name: "Python & Django REST", focus: "Relational modeling, ORM & authentication" },
      { name: "WebSockets & Socket.io", focus: "Bi-directional event rooms & broadcasting" },
      { name: "AI Voice Telephony", focus: "ElevenLabs, Deepgram & audio stream pipelines" },
    ],
  },
  {
    domain: "Databases & Storage",
    icon: Cpu,
    skills: [
      { name: "MongoDB Atlas & Mongoose", focus: "Schema modeling, aggregation & indexing" },
      { name: "PostgreSQL & MySQL", focus: "Relational queries, transactions & ACID" },
      { name: "Redis Cache", focus: "In-memory caching, rate-limiting & session store" },
      { name: "Cloudinary & AWS S3", focus: "Optimized media delivery & asset CDNs" },
    ],
  },
  {
    domain: "DevOps & Toolchains",
    icon: Workflow,
    skills: [
      { name: "Docker & Containerization", focus: "Multi-stage Dockerfiles & Docker-Compose" },
      { name: "GitHub Actions CI/CD", focus: "Automated build, test & deploy pipelines" },
      { name: "Payment Gateways", focus: "Razorpay & Stripe webhooks & verification" },
      { name: "Linux & Cloud Hosting", focus: "Vercel, Render, AWS & Nginx reverse proxies" },
    ],
  },
];

const personalPursuits = [
  {
    icon: Globe,
    title: "Technical Writing & Architecture Notes",
    desc: "Writing detailed walkthroughs on Next.js performance, WebSockets state management, and real-time audio streams.",
  },
  {
    icon: Compass,
    title: "Open Source & Developer Tooling",
    desc: "Building developer CLI utilities, reusable UI component blocks, and collaborating with global open-source developers.",
  },
  {
    icon: Coffee,
    title: "Continuous Exploration & AI Benchmarking",
    desc: "Exploring frontier LLM integrations, voice synthesis latency benchmarks, and emerging web platform specifications.",
  },
];

export function AboutPageClient({ settings }: AboutPageClientProps) {
  const name = settings?.ownerName || "Aditya Kumar";
  const title = settings?.ownerTitle || "Full Stack & Realtime System Engineer";
  const bio =
    settings?.ownerBio ||
    "Full-stack software engineer specializing in building high-performance web applications, scalable backend microservices, and AI voice solutions with modern Next.js and Python ecosystems.";
  const resumeLink = settings?.resumeUrl || RESUME;

  return (
    <main className="pt-28 pb-20 overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[650px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px]" />
      </div>

      <Container>
        <div className="space-y-20 md:space-y-28">
          {/* ================= 1. HERO SECTION ================= */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Narrative */}
            <motion.div variants={fadeUp} className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Engineering Philosophy & Story
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.12] tracking-tight">
                Engineering Scalable Systems with{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Precision & Impact.
                </span>
              </h1>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
                {bio}
              </p>

              {/* Verified Career Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card border border-border text-xs font-bold text-foreground shadow-sm">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <span>Full Stack Developer at <strong>Feeding Trends</strong></span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card border border-border text-xs font-bold text-foreground shadow-sm">
                  <Radio className="w-4 h-4 text-purple-500" />
                  <span>AI Voice & Real-Time Telephony</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/projects"
                  className="group px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2 active:scale-95"
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
                  <span>Download Resume</span>
                </a>
              </div>
            </motion.div>

            {/* Right Profile Card */}
            <motion.div variants={fadeUp} className="lg:col-span-5 flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/15 rounded-full blur-3xl -z-10 scale-110" />

              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
                <div className="relative rounded-[2.5rem] p-3.5 bg-gradient-to-b from-indigo-500/30 via-card/90 to-card border border-indigo-500/30 shadow-2xl backdrop-blur-xl group">
                  {/* Top Status */}
                  <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-card border border-border text-[10px] font-bold text-foreground flex items-center gap-1.5 shadow-xl z-30">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available for Projects
                  </div>

                  {/* Avatar Frame */}
                  <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-accent/40">
                    <Image
                      src={settings?.avatarUrl || "/images/aditya_profile.png"}
                      alt={name}
                      fill
                      priority
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Bottom Label */}
                    <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 text-center shadow-lg">
                      <h3 className="text-sm font-black text-foreground">{name}</h3>
                      <p className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400">
                        {title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= 2. CORE ENGINEERING PILLARS ================= */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Lightbulb className="w-3.5 h-3.5" />
                Guiding Principles
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Architectural <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Pillars</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                The core engineering values that govern how I architect, optimize, and deliver high-impact digital systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {corePillars.map((pillar, idx) => {
                const Icon = pillar.icon;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`p-8 rounded-[2.2rem] bg-card border border-border ${pillar.borderHover} transition-all duration-300 shadow-md hover:shadow-xl space-y-5 relative overflow-hidden`}
                  >
                    <div className="w-14 h-14 rounded-2xl border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 ${pillar.iconBg}">
                      <Icon className="w-7 h-7 text-indigo-500" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {pillar.tags.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-3 py-1 rounded-xl bg-accent text-foreground font-semibold border border-border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ================= 3. TECHNICAL MASTERY MATRIX ================= */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest">
                <Code2 className="w-3.5 h-3.5" />
                Technical Mastery
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Categorized <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Capabilities</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                A structured breakdown of my core toolchains, distributed databases, and real-time telephony protocols.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {technicalMastery.map((cat, idx) => {
                const Icon = cat.icon;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="p-8 rounded-[2.2rem] bg-card border border-border shadow-md space-y-6"
                  >
                    <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-foreground">{cat.domain}</h3>
                    </div>

                    <div className="space-y-4">
                      {cat.skills.map((sk, sIdx) => (
                        <div key={sIdx} className="space-y-1 p-3 rounded-2xl bg-accent/40 border border-border/50">
                          <div className="flex items-center justify-between text-xs font-bold text-foreground">
                            <span>{sk.name}</span>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">Production</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {sk.focus}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ================= 4. LIFE BEYOND CODE ================= */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Coffee className="w-3.5 h-3.5" />
                Creative Pursuits
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Life Beyond <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Code</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                What fuels my curiosity, creative output, and continuous evolution as an engineer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {personalPursuits.map((pursuit, idx) => {
                const Icon = pursuit.icon;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="p-7 rounded-[2rem] bg-card border border-border hover:border-indigo-500/40 transition-all duration-300 shadow-md space-y-4 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-inner">
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="font-bold text-base text-foreground">{pursuit.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{pursuit.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ================= 5. SEO & GEO FAQS ================= */}
          <FAQSection />

          {/* ================= 6. CALL TO ACTION ================= */}
          <CallToActionSection />
        </div>
      </Container>
    </main>
  );
}
