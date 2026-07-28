"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { 
  Search, 
  ExternalLink, 
  Github, 
  ArrowRight, 
  Star, 
  Layers, 
  Briefcase, 
  Globe, 
  Smartphone, 
  Cpu, 
  Sparkles, 
  Code2, 
  Rocket, 
  ChevronDown,
  Box
} from "lucide-react";

export interface ProjectCardData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  logoUrl?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  isMinor?: boolean;
  category?: string;
}

interface ProjectsPageClientProps {
  initialProjects: ProjectCardData[];
}

export function ProjectsPageClient({ initialProjects }: ProjectsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Latest");

  const categories = [
    { name: "All Projects", icon: Layers },
    { name: "Major Projects", icon: Sparkles },
    { name: "Minor Projects", icon: Code2 },
    { name: "Client Projects", icon: Briefcase },
    { name: "AI & ML", icon: Cpu },
    { name: "Web Applications", icon: Globe },
    { name: "SaaS", icon: Sparkles },
  ];


  // Default Featured Projects matching reference image
  const featuredProjects: ProjectCardData[] = [
    {
      _id: "p-bv",
      title: "Bright Veil (LMS)",
      slug: "bright-veil-lms",
      description: "A comprehensive Learning Management System with courses, quizzes, assignments, live classes and analytics.",
      coverImage: "/images/projects/Bright_Veil.png",
      techStack: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
      liveUrl: "https://brightveil.vercel.app/",
      githubUrl: "https://github.com/ErAditya1/BrightVeil-Next",
      featured: true,
      category: "Web Applications",
    },
    {
      _id: "p-nou",
      title: "NOU e-Learning Platform",
      slug: "nou-elearning-platform",
      description: "Educational platform for online learning, assessments, certificates and student progress tracking.",
      coverImage: "/images/projects/super_tasky.png",
      techStack: ["React", "Node.js", "Express", "MongoDB"],
      liveUrl: "https://brightveil.vercel.app/",
      githubUrl: "https://github.com/ErAditya1/Super-Tasky",
      featured: true,
      category: "Web Applications",
    },
    {
      _id: "p-bg",
      title: "Born Goat",
      slug: "born-goat",
      description: "Sports media platform and blog with news, player stats, articles and digital brand collaborations.",
      coverImage: "/images/projects/mint_slot.png",
      techStack: ["Next.js", "Strapi", "PostgreSQL", "Tailwind CSS"],
      liveUrl: "https://brightveil.vercel.app/",
      githubUrl: "https://github.com/ErAditya1",
      featured: true,
      category: "SaaS",
    },
  ];

  // All Projects dataset matching reference image
  const defaultAllProjects: ProjectCardData[] = [
    {
      _id: "p-clg",
      title: "College Management System",
      slug: "college-management-system",
      description: "Managing students, teachers, attendance, fees and exams for educational institutes.",
      coverImage: "/images/projects/Adarsh_inter_college.png",
      techStack: ["Django", "PostgreSQL", "Bootstrap", "JavaScript"],
      liveUrl: "https://clg-ms-django.onrender.com",
      githubUrl: "https://github.com/ErAditya1/adarsh-inter-college",
      category: "Web Applications",
    },
    {
      _id: "p-event",
      title: "Event Management System",
      slug: "event-management-system",
      description: "Organize and manage events, registrations, tickets, speakers and schedules.",
      coverImage: "/images/projects/white_swan_event.png",
      techStack: ["MERN Stack", "Redux", "Tailwind CSS"],
      liveUrl: "https://whiteswanevent.vercel.app/",
      githubUrl: "https://github.com/ErAditya1",
      category: "Web Applications",
    },
    {
      _id: "p-ecom",
      title: "E-Commerce Platform",
      slug: "e-commerce-platform",
      description: "Full featured e-commerce platform with cart, orders, payments and admin panel.",
      coverImage: "/images/projects/super_tasky.png",
      techStack: ["Next.js", "Strapi", "PostgreSQL", "Tailwind CSS"],
      liveUrl: "https://brightveil.vercel.app/",
      githubUrl: "https://github.com/ErAditya1",
      category: "Web Applications",
    },
    {
      _id: "p-task",
      title: "Task Management App",
      slug: "task-management-app",
      description: "Collaborative task management app with Kanban board, teams and real-time updates.",
      coverImage: "/images/projects/Bright_Veil.png",
      techStack: ["React", "Firebase", "Tailwind CSS"],
      liveUrl: "https://brightveil.vercel.app/",
      githubUrl: "https://github.com/ErAditya1/Super-Tasky",
      category: "SaaS",
    },
    {
      _id: "p-ai",
      title: "AI Calling Agent Platform",
      slug: "ai-calling-agent-platform",
      description: "AI-powered voice calling platform using WebSocket, STT, TTS and real-time interaction.",
      coverImage: "/images/projects/white_swan_event.png",
      techStack: ["Next.js", "Socket.io", "ElevenLabs", "Deepgram"],
      liveUrl: "https://brightveil.vercel.app/",
      githubUrl: "https://github.com/ErAditya1",
      category: "AI & ML",
    },
    {
      _id: "p-pv1",
      title: "Portfolio v1",
      slug: "portfolio-v1",
      description: "My first developer portfolio built with modern design and animations.",
      coverImage: "/images/aditya_profile.png",
      techStack: ["Next.js", "Framer Motion", "Tailwind CSS"],
      liveUrl: "https://brightveil.vercel.app/",
      githubUrl: "https://github.com/ErAditya1/Portfolio-Next",
      category: "Web Applications",
    },
  ];

  // Combine database projects with default items
  const dbOrFeatured = initialProjects.filter(p => p.featured).length > 0
    ? initialProjects.filter(p => p.featured)
    : featuredProjects;

  const dbOrAll = initialProjects.length > 0 ? initialProjects : defaultAllProjects;

  // Filter projects by active category & search query
  const filteredProjects = dbOrAll.filter((p) => {
    let matchesCategory = false;
    if (activeCategory === "All Projects") {
      matchesCategory = true;
    } else if (activeCategory === "Major Projects") {
      matchesCategory = !p.isMinor && p.category !== "minor";
    } else if (activeCategory === "Minor Projects") {
      matchesCategory = Boolean(p.isMinor || p.category === "minor");
    } else if (activeCategory === "Client Projects") {
      matchesCategory = p.category === "client";
    } else {
      matchesCategory = Boolean(p.category && p.category.toLowerCase().includes(activeCategory.toLowerCase()));
    }

    const matchesSearch = searchQuery === "" || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });


  return (
    <main className="pt-24 pb-20 overflow-hidden bg-background">
      <Container>
        {/* ================= 1. HERO SECTION ================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900/10 via-background to-purple-900/10 border border-border p-8 md:p-12 mb-12 overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest inline-block">
                MY WORK
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                Projects That Solve <br />
                <span className="text-indigo-600 dark:text-indigo-400">Real</span> Problems
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
                Here&apos;s a collection of projects I&apos;ve built for clients, companies, and personal ideas. Each project is a step in my journey of building scalable, user-focused products.
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    💼
                  </div>
                  <div>
                    <div className="text-base font-black text-foreground">20+</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">Projects Completed</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                    📊
                  </div>
                  <div>
                    <div className="text-base font-black text-foreground">15+</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">Technologies Used</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    🎯
                  </div>
                  <div>
                    <div className="text-base font-black text-foreground">100%</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Dashboard Preview Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-lg aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-card shadow-2xl p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src="/images/projects/Bright_Veil.png"
                    alt="Bright Veil Dashboard Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. CATEGORY TABS & SEARCH BAR ================= */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 scrollbar-none scrollbar-hide no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* ================= 3. FEATURED PROJECTS SECTION ================= */}
        {!searchQuery && activeCategory === "All Projects" && (
          <div className="space-y-6 mb-16">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="text-lg font-bold text-foreground">Featured Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dbOrFeatured.slice(0, 3).map((proj) => (
                <div
                  key={proj._id}
                  className="group rounded-3xl bg-card border border-border overflow-hidden hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-sm relative"
                >
                  {/* Card Header Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-accent">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-md">
                      Featured
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.techStack.map((t) => (
                        <span key={t} className="text-[10px] px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Links Footer */}
                    <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-muted-foreground">
                      <div className="flex items-center gap-4">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-500 transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-500 transition-colors flex items-center gap-1"
                          >
                            <Github className="w-3.5 h-3.5" /> GitHub
                          </a>
                        )}
                      </div>

                      <Link
                        href={`/projects/${proj.slug}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:gap-2 flex items-center gap-1 transition-all"
                      >
                        Case Study <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. ALL PROJECTS SECTION ================= */}
        <div className="space-y-6 mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-indigo-500" />
              <h2 className="text-lg font-bold text-foreground">All Projects</h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Sort by:</span>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-card border border-border font-bold text-foreground">
                {sortBy} <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj._id}
                className="group rounded-3xl bg-card border border-border overflow-hidden hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-sm"
              >
                {/* Image & Logo */}
                <div className="relative aspect-video overflow-hidden bg-accent">
                  <img
                    src={proj.coverImage || "/images/projects/Bright_Veil.png"}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {proj.logoUrl && (
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-xl overflow-hidden border-2 border-white/20 bg-background/80 backdrop-blur-md shadow-md">
                      <img src={proj.logoUrl} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {proj.isMinor && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-800/80 backdrop-blur-md text-slate-300 border border-slate-700 text-[9px] font-bold">
                      Minor
                    </span>
                  )}
                </div>


                {/* Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.techStack.map((t) => (
                      <span key={t} className="text-[10px] px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Footer Links */}
                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-500 transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-500 transition-colors flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" /> GitHub
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/projects/${proj.slug}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:gap-2 flex items-center gap-1 transition-all"
                    >
                      Case Study <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 5. HAVE AN IDEA IN MIND? CTA BANNER ================= */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <Rocket className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black">Have an idea in mind?</h2>
              <p className="text-indigo-200 text-xs md:text-sm">
                Let&apos;s build something amazing together and turn your ideas into reality.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="z-10 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            Let&apos;s Work Together <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
