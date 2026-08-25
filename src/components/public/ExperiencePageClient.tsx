"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Building2,
  ArrowRight,
  Code2,
  Bot,
  BookOpen,
  Layers,
  Cloud,
  CheckCircle2,
  Sparkles,
  Rocket,
  User,
  Calendar,
  Cpu,
  Wrench,
  Download,
  Flame,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Workflow
} from "lucide-react";
import { Container } from "@/components/Container";
import { ExperienceTimeline, TimelineExperienceItem } from "@/components/public/ExperienceTimeline";
import { CompanySlider, CompanyCardItem } from "@/components/public/CompanySlider";
import { CallToActionSection } from "@/components/public/CallToActionSection";
import { RESUME } from "@/Data";

interface ExperiencePageClientProps {
  experiences: TimelineExperienceItem[];
  companies: CompanyCardItem[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 24 },
  },
};

const keyContributions = [
  {
    title: "Scalable Web & SaaS Platforms",
    desc: "Architecting high-throughput Next.js App Router applications, REST/GraphQL APIs, and decoupled microservices.",
    icon: Code2,
    badge: "Next.js / Node",
  },
  {
    title: "AI Voice & Telephony Solutions",
    desc: "Engineering low-latency conversational AI voice calling systems using ElevenLabs, Deepgram STT, and WebSockets.",
    icon: Bot,
    badge: "Voice AI / Sockets",
  },
  {
    title: "EdTech & Learning Portals",
    desc: "Built comprehensive learning management architectures with video streaming, quiz engines, and progress analytics.",
    icon: BookOpen,
    badge: "LMS / Real-time",
  },
  {
    title: "Enterprise MERN Architecture",
    desc: "Deep expertise in React 19, Node.js, Express, MongoDB Atlas, and Redux Toolkit with strict TypeScript contracts.",
    icon: Layers,
    badge: "Full Stack",
  },
  {
    title: "Cloud & DevOps Automation",
    desc: "Multi-stage Docker builds, GitHub Actions CI/CD workflows, AWS S3 / Cloudinary CDNs, and Linux VPS servers.",
    icon: Cloud,
    badge: "Docker / CI/CD",
  },
  {
    title: "High-Performance API Design",
    desc: "Crafted secure JWT authentication pipelines, database indexing, rate-limiting, and Redis session caching.",
    icon: CheckCircle2,
    badge: "APIs / Security",
  },
];

const educationItems = [
  {
    title: "Diploma in Computer Science & Engineering",
    institution: "Government Polytechnic Aadanpur, Tanda",
    board: "BTEUP | 2022 – 2025",
    icon: GraduationCap,
    highlight: "Core Computing & Systems",
  },
  {
    title: "Intermediate (Mathematics & Science)",
    institution: "S.S. Inter College, Zaidpur Barabanki",
    board: "Uttar Pradesh Board | 2022",
    icon: User,
    highlight: "Higher Secondary",
  },
  {
    title: "High School (Science & Tech)",
    institution: "B V M Inter College, Kothi, Barabanki",
    board: "Uttar Pradesh Board | 2020",
    icon: Building2,
    highlight: "Secondary School",
  },
];

const certificationItems = [
  {
    title: "Python / Django Full Stack Training",
    org: "Softpro India, Lucknow",
    duration: "Intensive 45-Day Immersion",
    icon: Award,
  },
  {
    title: "Production Web Development & Cloud",
    org: "Project-Based Architectural Mastery",
    duration: "Continuous Delivery",
    icon: Cloud,
  },
  {
    title: "Conversational AI & Telephony Pipelines",
    org: "ElevenLabs & Deepgram Ecosystems",
    duration: "Real-time Systems",
    icon: Cpu,
  },
];

export function ExperiencePageClient({ experiences, companies }: ExperiencePageClientProps) {
  return (
    <main className="pt-28 pb-20 overflow-hidden bg-background">
      {/* Ambient Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[650px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px]" />
      </div>

      <Container>
        <div className="space-y-20 md:space-y-28">
          {/* ================= 1. HERO SECTION ================= */}
          <div className="relative rounded-[2.5rem] bg-card border border-border bg-gradient-to-br from-indigo-500/10 via-card to-purple-500/5 dark:from-indigo-950/70 dark:via-card dark:to-purple-950/40 p-8 sm:p-12 lg:p-14 overflow-hidden shadow-2xl">
            {/* Subtle Blueprint Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Full-Time Full Stack Engineer
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.12] tracking-tight">
                  Professional Journey &{" "}
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Technical Track Record.
                  </span>
                </h1>

                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                  A chronicle of full-time engineering roles, MERN internships, scalable SaaS architectures, and production milestones built for real-world impact.
                </p>

                {/* Quick Career Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card/80 border border-border text-xs font-bold text-foreground shadow-sm">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    <span>Feeding Trends (Present)</span>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card/80 border border-border text-xs font-bold text-foreground shadow-sm">
                    <Code2 className="w-4 h-4 text-purple-500" />
                    <span>Next.js • Node • Django • Docker</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <a
                    href={RESUME}
                    download
                    className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Complete Resume</span>
                  </a>

                  <Link
                    href="/contact"
                    className="px-6 py-3.5 bg-card border border-border hover:border-indigo-500/50 hover:bg-accent text-foreground font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="w-4 h-4 text-indigo-500" />
                  </Link>
                </div>
              </div>

              {/* Right Stats Showcase */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-card/90 border border-border text-center space-y-1 shadow-md">
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">1+</div>
                  <div className="text-xs font-semibold text-muted-foreground">Years Full Stack</div>
                </div>

                <div className="p-5 rounded-3xl bg-card/90 border border-border text-center space-y-1 shadow-md">
                  <div className="text-3xl font-black text-purple-600 dark:text-purple-400">20+</div>
                  <div className="text-xs font-semibold text-muted-foreground">Projects Built</div>
                </div>

                <div className="p-5 rounded-3xl bg-card/90 border border-border text-center space-y-1 shadow-md">
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">&lt;250ms</div>
                  <div className="text-xs font-semibold text-muted-foreground">Voice Latency</div>
                </div>

                <div className="p-5 rounded-3xl bg-card/90 border border-border text-center space-y-1 shadow-md">
                  <div className="text-3xl font-black text-pink-600 dark:text-pink-400">100%</div>
                  <div className="text-xs font-semibold text-muted-foreground">Production Code</div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 2. INTERACTIVE ANIMATED TIMELINE ================= */}
          <ExperienceTimeline experiences={experiences} />

          {/* ================= 3. KEY CONTRIBUTIONS MATRIX ================= */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Technical Impact
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Core <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Contributions</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Specialized architectural domains and capabilities I bring to software engineering teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keyContributions.map((item, idx) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="p-7 rounded-[2rem] bg-card border border-border hover:border-indigo-500/40 transition-all duration-300 shadow-md space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-accent border border-border text-muted-foreground uppercase tracking-wider">
                          {item.badge}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-foreground tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Production Tested</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ================= 4. COMPANIES SLIDER ================= */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest">
                <Building2 className="w-3.5 h-3.5" />
                Organizations
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Companies & <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Collaborations</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Organizations where I have contributed, architected software, and scaled engineering solutions.
              </p>
            </div>

            <CompanySlider companies={companies} />
          </div>

          {/* ================= 5. ACADEMIC FOUNDATION & CREDENTIALS ================= */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <GraduationCap className="w-3.5 h-3.5" />
                Education & Credentials
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Academic & <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Certifications</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Strong engineering foundation combined with continuous professional technical training.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Education Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/50">
                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                  <span>Academic Education</span>
                </h3>

                <div className="space-y-4">
                  {educationItems.map((edu, idx) => {
                    const Icon = edu.icon;
                    return (
                      <div
                        key={idx}
                        className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-2 hover:border-indigo-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            {edu.highlight}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground">{edu.board}</span>
                        </div>
                        <h4 className="font-bold text-base text-foreground">{edu.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{edu.institution}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Certifications Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/50">
                  <Award className="w-5 h-5 text-emerald-500" />
                  <span>Technical Certifications & Training</span>
                </h3>

                <div className="space-y-4">
                  {certificationItems.map((cert, idx) => {
                    const Icon = cert.icon;
                    return (
                      <div
                        key={idx}
                        className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-2 hover:border-emerald-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {cert.duration}
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h4 className="font-bold text-base text-foreground">{cert.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{cert.org}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ================= 6. CALL TO ACTION ================= */}
          <CallToActionSection />
        </div>
      </Container>
    </main>
  );
}
