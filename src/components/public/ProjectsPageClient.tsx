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
  ChevronDown,
  Box
} from "lucide-react";
import { CallToActionSection } from "@/components/public/CallToActionSection";

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


  // Strictly use database projects only
  const dbOrFeatured = initialProjects.filter((p) => p.featured);
  const featuredShowcase = dbOrFeatured.length > 0 ? dbOrFeatured : initialProjects.slice(0, 3);
  const dbOrAll = initialProjects;

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
        {/* ================= 1. HERO SECTION (ENHANCED) ================= */}
        <div className="relative rounded-[2.5rem] bg-card border border-border bg-gradient-to-br from-indigo-500/10 via-card to-purple-500/5 dark:from-indigo-950/70 dark:via-card dark:to-purple-950/40 p-8 sm:p-12 lg:p-14 mb-12 overflow-hidden shadow-2xl">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Production Architectures & Systems</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.12] tracking-tight">
                Crafted for Scale, Built for{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Real-World Impact.
                </span>
              </h1>

              <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
                An engineered showcase of full-stack web platforms, AI voice calling solutions, scalable distributed APIs, and enterprise SaaS systems built with precision.
              </p>

              {/* Engineering Highlights / Metrics */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card/80 border border-border/80 shadow-sm backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <div className="text-xs font-bold text-foreground">
                    <span>Active Production Builds</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card/80 border border-border/80 shadow-sm backdrop-blur-sm">
                  <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                  <div className="text-xs font-bold text-foreground">
                    <span>Full-Stack & Real-Time</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card/80 border border-border/80 shadow-sm backdrop-blur-sm">
                  <Cpu className="w-3.5 h-3.5 text-purple-500" />
                  <div className="text-xs font-bold text-foreground">
                    <span>AI & Distributed Services</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Live Browser / Architecture Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl bg-card/95 border border-border shadow-2xl overflow-hidden group hover:border-indigo-500/50 transition-all duration-500">
                {/* Browser Top Window Controls */}
                <div className="px-4 py-3 bg-accent/70 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>

                  <div className="px-3 py-0.5 rounded-lg bg-background/80 border border-border text-[10px] font-mono text-muted-foreground flex items-center gap-1.5 max-w-[200px] truncate">
                    <Globe className="w-3 h-3 text-indigo-500" />
                    <span>portfolio.aditya.dev/projects</span>
                  </div>

                  <div className="w-4" />
                </div>

                {/* Browser Content Frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-accent/30 flex items-center justify-center">
                  {dbOrFeatured?.[0]?.coverImage ? (
                    <img
                      src={dbOrFeatured[0].coverImage}
                      alt="Featured Project Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-indigo-950/80 via-purple-950/50 to-black relative">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <Globe className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-black text-white">Live System Showcase</h4>
                      <p className="text-xs text-indigo-300/80 mt-1 max-w-xs leading-relaxed">
                        Explore full-stack platforms, low-latency AI agents, and production APIs.
                      </p>
                    </div>
                  )}

                  {/* Gradient Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Floating Live Tag on Preview */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shadow-md">
                      {dbOrFeatured?.[0]?.title || "Featured Production Build"}
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
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

          {filteredProjects.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
              <p className="text-muted-foreground text-sm font-medium">
                {initialProjects.length === 0
                  ? "No projects found in the database yet. Add projects from the Admin Dashboard."
                  : "No projects found matching this filter."}
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All Projects");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-indigo-500 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj._id}
                className="group rounded-3xl bg-card border border-border overflow-hidden hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-sm"
              >
                {/* Image & Logo */}
                <div className="relative aspect-video overflow-hidden bg-accent/40">
                  {proj.coverImage ? (
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-pink-500/15 text-indigo-400 p-4">
                      <span className="text-3xl font-black tracking-wider opacity-80 mb-1">
                        {proj.title.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        {proj.category || "Web Application"}
                      </span>
                    </div>
                  )}
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
        )}
      </div>

      </Container>

      {/* ================= 5. CALL TO ACTION SECTION ================= */}
      <CallToActionSection />
    </main>
  );
}
