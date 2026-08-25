"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Server,
  Bot,
  Layers,
  Cloud,
  Palette,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
  Database
} from "lucide-react";
import { Container } from "@/components/Container";

export interface ServiceItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  deliverables: string[];
  tech: string[];
  icon: React.ElementType;
  gradient: string;
  borderHover: string;
  iconBg: string;
}

const services: ServiceItem[] = [
  {
    id: "fullstack-apps",
    badge: "Full-Stack Development",
    title: "Web & Enterprise SaaS Platforms",
    description:
      "End-to-end full-stack web applications with Next.js App Router, React, and TypeScript. Optimized for sub-second load times, SEO, and massive scalability.",
    deliverables: [
      "Server-Side Rendering (SSR) & Dynamic ISR",
      "Robust REST & GraphQL API Integration",
      "Role-Based Access Control & Auth (NextAuth/JWT)",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    icon: Globe,
    gradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
    borderHover: "hover:border-indigo-500/50",
    iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  {
    id: "ai-voice-telephony",
    badge: "AI & Real-Time",
    title: "AI Voice Agents & Telephony Solutions",
    description:
      "Real-time conversational voice platforms with low-latency Speech-to-Text (STT), natural Text-to-Speech (TTS), and WebSocket streaming orchestration.",
    deliverables: [
      "Sub-200ms Latency Audio Streaming",
      "Deepgram STT & ElevenLabs Voice Synthesis",
      "Automated Inbound & Outbound Calling Workflows",
    ],
    tech: ["WebSockets", "ElevenLabs", "Deepgram", "Node.js"],
    icon: Bot,
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    borderHover: "hover:border-purple-500/50",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    id: "backend-systems",
    badge: "Backend Engineering",
    title: "High-Throughput APIs & Distributed Backends",
    description:
      "Fault-tolerant backend architectures engineered with Node.js, Express, and Django. Designed to process high concurrency with database indexing and caching.",
    deliverables: [
      "Microservices & Clean Architecture Patterns",
      "Database Schema Design & Query Optimization",
      "Redis Caching, Rate Limiting & Queue Workers",
    ],
    tech: ["Node.js", "Django", "MongoDB", "PostgreSQL"],
    icon: Server,
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    borderHover: "hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    id: "lms-ecommerce",
    badge: "Portals & LMS",
    title: "Learning Portals & E-Commerce Systems",
    description:
      "Interactive Learning Management Systems (LMS) and e-commerce platforms featuring automated payment gateways, video streaming, quizzes, and live progress dashboards.",
    deliverables: [
      "Razorpay & Stripe Payment Gateway Integration",
      "Cloudinary & S3 Secure Video/Asset Delivery",
      "Student Analytics, Grading & Certification Engine",
    ],
    tech: ["Next.js", "Razorpay", "Cloudinary", "Express"],
    icon: Layers,
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    borderHover: "hover:border-amber-500/50",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    id: "devops-cloud",
    badge: "Cloud & DevOps",
    title: "Dockerization, CI/CD & Cloud Deployments",
    description:
      "Containerizing applications with multi-stage Docker builds and setting up automated CI/CD deployment pipelines on Azure, GCP, Vercel, Render, and Linux VPS.",
    deliverables: [
      "Docker & Docker-Compose Container Orchestration",
      "Automated GitHub Actions CI/CD Workflows",
      "SSL, Custom Domains, Nginx Reverse Proxy & Monitoring",
    ],
    tech: ["Docker", "AWS", "Vercel", "GitHub Actions"],
    icon: Cloud,
    gradient: "from-sky-500/10 via-blue-500/5 to-transparent",
    borderHover: "hover:border-sky-500/50",
    iconBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  },
  {
    id: "ui-ux-design",
    badge: "Design Systems",
    title: "UI/UX Engineering & Interactive Design",
    description:
      "Crafting sleek, high-converting interfaces with Figma and implementing them into pixel-perfect, accessible React components with buttery-smooth animations.",
    deliverables: [
      "Design Systems & Component Libraries in Figma",
      "Framer Motion Micro-Interactions & Glassmorphism",
      "100% Mobile Responsive & WCAG Accessibility",
    ],
    tech: ["Figma", "Framer Motion", "Tailwind CSS", "Shadcn"],
    icon: Palette,
    gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
    borderHover: "hover:border-pink-500/50",
    iconBg: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export function ServicesSection() {
  return (
    <section id="services" className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container>
        <div className="space-y-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/40">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Specialized Services
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Services engineered for{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  speed & scale
                </span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                From full-stack enterprise SaaS platforms to low-latency AI telephony agents, here is how I can build and elevate your digital products.
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

          {/* Responsive 3-Column Services Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className={`group rounded-[2rem] bg-card/90 backdrop-blur-sm border border-border/80 p-7 md:p-8 flex flex-col justify-between space-y-6 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 relative overflow-hidden ${s.borderHover}`}
                >
                  {/* Subtle top-to-bottom card gradient glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  {/* Top Section: Icon & Category Badge */}
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 ${s.iconBg}`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-accent/70 border border-border/70 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {s.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                        {s.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  {/* Middle Section: Deliverables Checklist */}
                  <div className="space-y-4 pt-4 border-t border-border/50 relative z-10">
                    <div className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Key Deliverables:
                    </div>
                    <ul className="space-y-2">
                      {s.deliverables.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-muted-foreground font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Section: Tech Stack Pills & CTA link */}
                  <div className="space-y-4 pt-4 border-t border-border/40 relative z-10">
                    <div className="flex flex-wrap gap-1.5">
                      {s.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2.5 py-1 rounded-xl bg-accent/60 border border-border/60 text-foreground font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        href={`/contact?service=${encodeURIComponent(s.title)}`}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 flex items-center gap-1.5 transition-colors"
                      >
                        Inquire Service
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Capability" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
