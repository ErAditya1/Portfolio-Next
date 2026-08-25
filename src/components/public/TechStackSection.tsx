"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import {
  Sparkles,
  Layers,
  Server,
  Database,
  Cloud,
  Cpu,
  Globe,
  CheckCircle2,
  Workflow
} from "lucide-react";

export interface TechItem {
  name: string;
  category: "frontend" | "backend" | "database" | "cloud" | "ai-realtime";
  level: string;
  icon: string;
  description: string;
  color: string;
  badgeBg: string;
}

const techItems: TechItem[] = [
  // Frontend
  {
    name: "Next.js (App Router)",
    category: "frontend",
    level: "Core Stack",
    icon: "▲",
    description: "SSR, ISR, Server Actions, Dynamic Routing & Route Handlers",
    color: "from-slate-500 to-zinc-900 text-foreground",
    badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    name: "TypeScript",
    category: "frontend",
    level: "Advanced",
    icon: "TS",
    description: "Strict Type Safety, Generic Interfaces & Safe API Contracts",
    color: "from-blue-600 to-indigo-700 text-blue-500",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    name: "React 19",
    category: "frontend",
    level: "Core Stack",
    icon: "⚛️",
    description: "Server Components, Hooks, Context API & Custom Hooks",
    color: "from-cyan-500 to-blue-600 text-cyan-500",
    badgeBg: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    level: "Expert",
    icon: "🌊",
    description: "Design Systems, Glassmorphism, Dark Mode & Responsive Layouts",
    color: "from-teal-500 to-cyan-600 text-teal-500",
    badgeBg: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
  },
  {
    name: "Framer Motion",
    category: "frontend",
    level: "Advanced",
    icon: "✨",
    description: "Interactive Micro-Interactions, Spring Physics & Layout Animations",
    color: "from-purple-500 to-pink-600 text-purple-500",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    name: "Redux Toolkit",
    category: "frontend",
    level: "Production",
    icon: "🔄",
    description: "Global State Management, Slice Reducers & RTK Query",
    color: "from-violet-500 to-purple-600 text-violet-500",
    badgeBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },

  // Backend
  {
    name: "Node.js",
    category: "backend",
    level: "Core Stack",
    icon: "🟢",
    description: "Asynchronous Event Loop, Streaming Buffers & Cluster Workers",
    color: "from-emerald-600 to-green-700 text-emerald-500",
    badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    name: "Express.js",
    category: "backend",
    level: "Core Stack",
    icon: "⚡",
    description: "RESTful API Architecture, JWT Auth & Middleware Pipelines",
    color: "from-zinc-700 to-slate-800 text-zinc-400",
    badgeBg: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20",
  },
  {
    name: "Python",
    category: "backend",
    level: "Advanced",
    icon: "🐍",
    description: "Object-Oriented Architecture, Automation & Data Processing",
    color: "from-yellow-500 to-amber-600 text-amber-500",
    badgeBg: "bg-yellow-500/10 text-amber-700 dark:text-yellow-400 border-yellow-500/20",
  },
  {
    name: "Django",
    category: "backend",
    level: "Production",
    icon: "🎸",
    description: "Django REST Framework, ORM, Admin Portals & Secure Auth",
    color: "from-emerald-700 to-teal-800 text-emerald-600",
    badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },

  // Database
  {
    name: "MongoDB Atlas",
    category: "database",
    level: "Core Stack",
    icon: "🍃",
    description: "Schema Modeling, Mongoose Aggregations & Document Indexes",
    color: "from-green-600 to-emerald-700 text-green-500",
    badgeBg: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  {
    name: "PostgreSQL",
    category: "database",
    level: "Advanced",
    icon: "🐘",
    description: "Relational Modeling, Foreign Keys, SQL Queries & Transactions",
    color: "from-blue-700 to-indigo-800 text-blue-500",
    badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  {
    name: "Redis Cache",
    category: "database",
    level: "Production",
    icon: "⚡",
    description: "In-Memory Session Caching, Rate Limiting & Pub/Sub Queues",
    color: "from-red-600 to-rose-700 text-red-500",
    badgeBg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },

  // AI & Real-time
  {
    name: "WebSockets / Socket.io",
    category: "ai-realtime",
    level: "Expert",
    icon: "📡",
    description: "Bi-directional Real-time Events, Rooms & Live Broadcasting",
    color: "from-indigo-600 to-purple-700 text-indigo-500",
    badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    name: "ElevenLabs AI",
    category: "ai-realtime",
    level: "Production",
    icon: "🎙️",
    description: "Ultra-Low Latency Conversational Voice Synthesis & Streaming",
    color: "from-amber-600 to-orange-700 text-amber-500",
    badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  {
    name: "Deepgram STT",
    category: "ai-realtime",
    level: "Production",
    icon: "🧠",
    description: "Live Real-Time Audio Transcription & Telephony Pipelines",
    color: "from-purple-600 to-pink-700 text-purple-500",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },

  // Cloud & DevOps
  {
    name: "Docker Containers",
    category: "cloud",
    level: "Advanced",
    icon: "🐳",
    description: "Multi-Stage Dockerfiles, Compose & Isolated Microservices",
    color: "from-sky-600 to-blue-700 text-sky-500",
    badgeBg: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
  {
    name: "Git & GitHub Actions",
    category: "cloud",
    level: "Expert",
    icon: "🐙",
    description: "Automated CI/CD Workflows, Branch Protection & Code Quality",
    color: "from-slate-700 to-zinc-800 text-zinc-400",
    badgeBg: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20",
  },
  {
    name: "Cloudinary & AWS S3",
    category: "cloud",
    level: "Production",
    icon: "☁️",
    description: "Media CDN Optimization, Secure Uploads & Video Streaming",
    color: "from-blue-600 to-cyan-700 text-blue-500",
    badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  {
    name: "Razorpay / Stripe",
    category: "cloud",
    level: "Production",
    icon: "💳",
    description: "Webhook Verification, Order APIs, Subscriptions & Invoicing",
    color: "from-blue-500 to-indigo-600 text-blue-500",
    badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
];

type CategoryKey = "all" | "frontend" | "backend" | "database" | "ai-realtime" | "cloud";

const categories: { key: CategoryKey; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All Technologies", icon: Layers },
  { key: "frontend", label: "Frontend & UI", icon: Globe },
  { key: "backend", label: "Backend & APIs", icon: Server },
  { key: "database", label: "Databases & Cache", icon: Database },
  { key: "ai-realtime", label: "AI & Real-Time", icon: Cpu },
  { key: "cloud", label: "Cloud & DevOps", icon: Cloud },
];

export function TechStackSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");

  const filteredItems =
    activeCategory === "all"
      ? techItems
      : techItems.filter((item) => item.category === activeCategory);

  return (
    <section id="tech-stack" className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container>
        <div className="space-y-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Technical Arsenal
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              Technologies I <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">work with</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              A battle-tested stack of modern frameworks, distributed databases, real-time telephony protocols, and cloud toolchains.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;

              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-indigo-500/25 shadow-md scale-105"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-indigo-500/40 hover:bg-accent/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-accent text-muted-foreground"
                    }`}
                  >
                    {cat.key === "all"
                      ? techItems.length
                      : techItems.filter((i) => i.category === cat.key).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tech Cards Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((tech) => (
                <motion.div
                  layout
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-3xl bg-card border border-border hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 p-6 flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  {/* Card Header: Icon & Level Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-accent/70 border border-border/70 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {tech.icon}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${tech.badgeBg}`}
                    >
                      {tech.level}
                    </span>
                  </div>

                  {/* Card Title & Description */}
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-bold text-base text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                  </div>

                  {/* Bottom Verification Indicator */}
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                    <span className="capitalize">{tech.category.replace("-", " ")}</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Production
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Bottom Live Stack Banner (Theme Synchronized: Light & Dark) */}
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-card dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-card dark:border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-md">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                <Workflow className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Continuous Engineering & Innovation
              </div>
              <h4 className="text-lg md:text-xl font-black text-foreground">
                Need a tailored technology stack for your startup or enterprise?
              </h4>
              <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                I evaluate architectural trade-offs to select the optimal frameworks, databases, and deployment strategies for your project.
              </p>
            </div>

            <a
              href="#featured-projects"
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all whitespace-nowrap active:scale-95 shrink-0"
            >
              See Tech in Action
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
