"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  Code2,
  GraduationCap,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Zap,
  Activity,
  ChevronRight,
  Flame,
  Radio
} from "lucide-react";
import { Container } from "@/components/Container";

export interface TimelineExperienceItem {
  id?: string;
  role: string;
  company: string;
  companyLogo?: string;
  period: string;
  location?: string;
  description: string;
  points?: string[];
  skills?: string[];
  isCurrent?: boolean;
  type?: string;
}

interface ExperienceTimelineProps {
  experiences?: TimelineExperienceItem[];
}

const defaultTimelineItems: TimelineExperienceItem[] = [
  {
    role: "Full Stack Developer",
    company: "Feeding Trends",
    companyLogo: "https://images.yourstory.com/cs/images/companies/1673542379000-1680580688969.jpg",
    period: "Feb 2026 – Present",
    location: "Lucknow, Uttar Pradesh — India",
    description:
      "Engineering scalable web applications, real-time AI voice calling solutions, and robust SaaS products with Next.js, Node.js, and Django.",
    points: [
      "Architecting AI-powered voice calling agents using ElevenLabs, Deepgram STT, and WebSockets.",
      "Developing high-throughput REST APIs and scalable full-stack applications with MERN / Next.js.",
      "Integrated third-party payment gateways, media streaming CDNs, and automated notification systems.",
    ],
    skills: ["Next.js", "Node.js", "AI Agents", "WebSockets", "MongoDB", "Docker"],
    isCurrent: true,
    type: "Full-Time Role",
  },
  {
    role: "MERN Stack Developer (Internship)",
    company: "Softpro India",
    period: "Jul 2025 – Feb 2026",
    location: "Lucknow — India",
    description:
      "Developed responsive web applications, REST APIs, and database models using the MERN stack with modern UI practices.",
    points: [
      "Built full-stack web applications with React.js, Express.js, Node.js, and MongoDB Atlas.",
      "Implemented responsive user interfaces with Tailwind CSS and state management using Redux Toolkit.",
      "Designed secure JWT authentication flows and optimized database queries.",
    ],
    skills: ["React.js", "Express.js", "Node.js", "MongoDB", "Redux", "Tailwind CSS"],
    isCurrent: false,
    type: "Internship",
  },
  {
    role: "Python / Django Trainee",
    company: "Softpro India",
    period: "May 2024 – Jul 2024",
    location: "Lucknow — India",
    description:
      "Completed intensive hands-on training in Python, Django REST Framework, relational databases, and MVC web architecture.",
    points: [
      "Built dynamic web applications with Django and PostgreSQL database integration.",
      "Implemented user authorization, secure forms, and template rendering pipelines.",
    ],
    skills: ["Python", "Django", "PostgreSQL", "REST APIs", "Bootstrap"],
    isCurrent: false,
    type: "Technical Training",
  },
  {
    role: "Freelance Full-Stack Developer",
    company: "Global Clients & Personal Builds",
    period: "2023 – 2024",
    location: "Remote",
    description:
      "Engineered custom websites, landing portals, and full-stack solutions for businesses and independent creators.",
    points: [
      "Delivered production-ready web apps with React.js, Next.js, and Firebase.",
      "Optimized Core Web Vitals, SEO performance, and responsive mobile layouts.",
    ],
    skills: ["Next.js", "React", "Firebase", "Tailwind CSS", "SEO"],
    isCurrent: false,
    type: "Freelance / Contract",
  },
];

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const items = experiences && experiences.length > 0 ? experiences : defaultTimelineItems;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "spotlight">("timeline");
  const [selectedSpotlight, setSelectedSpotlight] = useState<number>(0);

  const activeItem = items[selectedSpotlight] || items[0];

  return (
    <section id="experience-timeline" className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Ambient Glow & Light Particles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <Container>
        <div className="space-y-12">
          {/* ================= 1. SECTION HEADER ================= */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border/40">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Engineering Journey
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Work <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Experience</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                A verified chronicle of full-time roles, internships, production architectures, and technical milestones.
              </p>
            </div>

            {/* View Mode Toggle Switch (Timeline vs Spotlight) & Full Page Link */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center p-1 rounded-2xl bg-card border border-border shadow-sm">
                <button
                  onClick={() => setViewMode("timeline")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === "timeline"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </button>
                <button
                  onClick={() => setViewMode("spotlight")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === "spotlight"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Spotlight</span>
                </button>
              </div>

              <Link
                href="/experience"
                className="hidden sm:flex group px-4 py-2.5 rounded-2xl bg-card border border-border hover:border-indigo-500/40 text-foreground text-xs font-bold items-center gap-2 transition-all shadow-sm hover:bg-accent"
              >
                All Roles
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-indigo-500" />
              </Link>
            </div>
          </div>

          {/* ================= 2. VIEW MODE A: INTERACTIVE LASER TIMELINE ================= */}
          {viewMode === "timeline" && (
            <div className="relative max-w-4xl mx-auto pt-6">
              {/* Central Vertical Spine (Static Track) */}
              <div className="absolute top-0 bottom-0 left-4 sm:left-8 md:left-1/2 -translate-x-1/2 w-1 bg-border/60 rounded-full" />

              {/* Animated Continuous Laser Light Pulse traveling down the spine */}
              <motion.div
                animate={{
                  y: ["0%", "100%"],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-4 sm:left-8 md:left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-indigo-500 to-purple-400 rounded-full shadow-[0_0_15px_#6366f1] pointer-events-none z-10"
              />

              <div className="space-y-12">
                {items.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  const isHovered = hoveredIdx === idx;

                  return (
                    <motion.div
                      key={item.id || idx}
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 26,
                        delay: idx * 0.1,
                      }}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={`relative flex flex-col md:flex-row items-start ${
                        isEven ? "md:flex-row-reverse" : ""
                      } gap-6 md:gap-12 pl-12 sm:pl-16 md:pl-0`}
                    >
                      {/* Interactive Animated Node Beacon */}
                      <div className="absolute left-4 sm:left-8 md:left-1/2 -translate-x-1/2 top-4 z-20 flex items-center justify-center">
                        <motion.div
                          animate={{
                            scale: isHovered ? 1.25 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                          className="relative"
                        >
                          {/* Current role live radar waves */}
                          {item.isCurrent && (
                            <>
                              <span className="animate-ping absolute -inset-2 rounded-full bg-indigo-500 opacity-60" />
                              <span className="animate-pulse absolute -inset-1 rounded-full bg-purple-500 opacity-40" />
                            </>
                          )}

                          <div
                            className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center shadow-xl backdrop-blur-md transition-colors duration-300 ${
                              item.isCurrent
                                ? "bg-indigo-600 border-white text-white shadow-indigo-500/50"
                                : isHovered
                                ? "bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/30"
                                : "bg-card border-border text-muted-foreground"
                            }`}
                          >
                            <span className="text-[11px] font-black font-mono">
                              0{idx + 1}
                            </span>
                          </div>
                        </motion.div>
                      </div>

                      {/* Timeline Content Card */}
                      <div className="w-full md:w-1/2">
                        <motion.div
                          whileHover={{ y: -6, scale: 1.01 }}
                          transition={{ duration: 0.25 }}
                          className={`p-6 sm:p-7 rounded-[2rem] bg-card/90 backdrop-blur-sm border transition-all duration-500 shadow-md hover:shadow-2xl space-y-4 relative overflow-hidden ${
                            item.isCurrent
                              ? "border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-indigo-500/10"
                              : isHovered
                              ? "border-indigo-500/50 shadow-indigo-500/10"
                              : "border-border hover:border-indigo-500/40"
                          }`}
                        >
                          {/* Top Highlight Bar */}
                          {item.isCurrent ? (
                            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
                          ) : (
                            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}

                          {/* Metadata Row: Period & Type */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">
                              <Calendar className="w-3.5 h-3.5" />
                              {item.period}
                            </span>

                            {item.isCurrent ? (
                              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                Active & Shipping
                              </span>
                            ) : (
                              item.type && (
                                <span className="px-3 py-1 rounded-full bg-accent/70 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                                  {item.type}
                                </span>
                              )
                            )}
                          </div>

                          {/* Role & Company Header */}
                          <div className="space-y-1">
                            <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                              {item.role}
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
                                {item.companyLogo ? (
                                  <img
                                    src={item.companyLogo}
                                    alt={item.company}
                                    className="w-4 h-4 object-contain rounded-sm"
                                  />
                                ) : (
                                  <Building2 className="w-4 h-4 text-indigo-500" />
                                )}
                                {item.company}
                              </span>

                              {item.location && (
                                <span className="flex items-center gap-1 text-muted-foreground/80">
                                  <MapPin className="w-3 h-3 text-indigo-400" />
                                  {item.location}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Role Description */}
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>

                          {/* Accomplishments Checklist */}
                          {item.points && item.points.length > 0 && (
                            <div className="space-y-2 pt-3 border-t border-border/40">
                              <ul className="space-y-1.5">
                                {item.points.map((pt, pIdx) => (
                                  <li
                                    key={pIdx}
                                    className="flex items-start gap-2 text-xs text-muted-foreground font-medium"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Skills Pills */}
                          {item.skills && item.skills.length > 0 && (
                            <div className="pt-2 flex flex-wrap gap-1.5">
                              {item.skills.map((sk, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[10px] px-2.5 py-1 rounded-xl bg-accent/70 border border-border/60 text-foreground font-semibold"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= 3. VIEW MODE B: COMPANY SPOTLIGHT STAGE ================= */}
          {viewMode === "spotlight" && (
            <div className="grid lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
              {/* Left Selector List */}
              <div className="lg:col-span-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
                  Select Organization:
                </div>
                {items.map((it, idx) => {
                  const isSelected = selectedSpotlight === idx;

                  return (
                    <button
                      key={it.id || idx}
                      onClick={() => setSelectedSpotlight(idx)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 shadow-sm ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/25 shadow-lg scale-[1.02]"
                          : "bg-card border-border text-foreground hover:bg-accent/60 hover:border-indigo-500/30"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-sm line-clamp-1">{it.company}</div>
                        <div
                          className={`text-xs ${
                            isSelected ? "text-indigo-200" : "text-muted-foreground"
                          }`}
                        >
                          {it.role}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? "translate-x-1" : ""
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right Active Spotlight Detailed Display */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedSpotlight}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 md:p-10 rounded-3xl bg-card border border-border shadow-xl space-y-6 relative overflow-hidden"
                  >
                    {/* Glowing Top Ribbon */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {activeItem.period}
                      </span>

                      {activeItem.isCurrent ? (
                        <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          Currently Employed
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-accent text-muted-foreground text-xs font-bold uppercase">
                          {activeItem.type || "Completed"}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black text-foreground">
                        {activeItem.role}
                      </h3>
                      <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        <Building2 className="w-4 h-4" />
                        <span>{activeItem.company}</span>
                        {activeItem.location && (
                          <span className="text-muted-foreground font-normal text-xs flex items-center gap-1 ml-2">
                            <MapPin className="w-3 h-3 text-indigo-400" />
                            {activeItem.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {activeItem.description}
                    </p>

                    {activeItem.points && (
                      <div className="space-y-3 pt-4 border-t border-border/40">
                        <div className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Key Responsibilities & Deliverables:
                        </div>
                        <ul className="space-y-2">
                          {activeItem.points.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeItem.skills && (
                      <div className="space-y-3 pt-4 border-t border-border/40">
                        <div className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Technologies Used:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeItem.skills.map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-3 py-1 rounded-xl bg-accent/70 border border-border/70 text-foreground font-semibold"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
