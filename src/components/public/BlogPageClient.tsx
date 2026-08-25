"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import {
  Search,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Star,
  MessageSquare,
  Lightbulb,
  Send,
  Code2,
  CheckCircle2,
  Tag,
  Eye,
  Mic,
  Activity,
  Layers,
  ChevronDown,
  Globe,
  Radio,
  Share2,
  Check,
  Zap,
  Flame,
  FileText,
  SlidersHorizontal
} from "lucide-react";

export interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  views: number;
  readTime: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogPageClientProps {
  initialBlogs: BlogItem[];
  popularTopics?: { name: string; count: number }[];
}

export function BlogPageClient({ initialBlogs, popularTopics = [] }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Dynamic categories computed exclusively from DB blogs
  const dbTags = Array.from(new Set(initialBlogs.flatMap((b) => b.tags || []))).filter(Boolean);
  const categoryFilters = ["All", ...dbTags];

  // Strictly use DB blogs
  const allArticles = initialBlogs;

  // Identify Featured article (if any is marked or first article)
  const featuredArticle = allArticles.length > 0 ? allArticles[0] : null;

  // Articles for the Grid (all remaining or all articles)
  const gridArticles =
    allArticles.length > 1
      ? allArticles.filter((a) => a.slug !== featuredArticle?.slug)
      : allArticles;

  // Category & search filtering
  const filteredArticles = gridArticles.filter((art) => {
    if (activeCategory !== "All") {
      const catLower = activeCategory.toLowerCase();
      const hasTag = art.tags?.some(
        (t) =>
          t.toLowerCase().includes(catLower) ||
          catLower.includes(t.toLowerCase())
      );
      if (!hasTag) return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.excerpt.toLowerCase().includes(q) ||
      art.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const displayedArticles = filteredArticles.slice(0, visibleCount);

  // Recent Articles list for sidebar (top 5 from DB)
  const recentArticles = allArticles.slice(0, 5);

  // Compact Popular Topics from DB
  const topicsList = popularTopics.slice(0, 6);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmailInput("");
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <main className="pt-28 pb-24 relative bg-background">
      {/* Background Subtle Gradient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[650px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[140px]" />
      </div>

      <Container>
        <div className="space-y-16 md:space-y-20">
          {/* ================= 1. HERO SECTION ================= */}
          <div className="relative rounded-[2.5rem] bg-card border border-border/80 p-8 sm:p-12 lg:p-14 overflow-hidden shadow-sm">
            {/* Subtle Dot Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#80808018_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest shadow-sm">
                  <span>MY BLOG</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-foreground leading-[1.12] tracking-tight">
                  Insights, <br />
                  Ideas & <br />
                  <span className="text-[#3b5bf6] dark:text-indigo-400">
                    Real-World Builds
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
                  I write about Full Stack Development, AI systems, voice technologies, automation, and the lessons learned while building real products.
                </p>

                {/* 3 Metric Badges Row */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-foreground">{allArticles.length}</span>
                      <span className="text-xs text-muted-foreground ml-1.5 font-medium">Articles</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-foreground">5K+</span>
                      <span className="text-xs text-muted-foreground ml-1.5 font-medium">Readers</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-foreground">2+</span>
                      <span className="text-xs text-muted-foreground ml-1.5 font-medium">Years Writing</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 3D Code Window Mockup */}
              <div className="lg:col-span-5 flex justify-center relative">
                <div className="relative w-full max-w-md">
                  {/* Floating Stylus Pen */}
                  <div className="absolute -bottom-6 -right-4 w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl z-30 transform rotate-12">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  {/* Floating Top Right Tag */}
                  <div className="absolute -top-3 -right-3 px-3.5 py-1.5 rounded-2xl bg-indigo-600 text-white font-mono text-xs font-black shadow-xl z-30 flex items-center gap-1">
                    &lt;/&gt;
                  </div>

                  {/* Browser Code Window Card */}
                  <div className="rounded-3xl bg-card border border-border shadow-xl overflow-hidden p-6 space-y-4">
                    {/* Window Controls */}
                    <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                      <span className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-mono text-muted-foreground ml-2">Database Articles</span>
                    </div>

                    {/* Simulated Code Lines */}
                    <div className="space-y-3 font-mono text-xs">
                      <div className="h-2.5 w-32 bg-indigo-500/30 rounded-full" />
                      <div className="h-2.5 w-52 bg-purple-500/25 rounded-full" />
                      <div className="h-2.5 w-40 bg-blue-500/25 rounded-full" />
                      <div className="h-2.5 w-56 bg-accent rounded-full" />
                      <div className="h-2.5 w-44 bg-emerald-500/25 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 2. CATEGORY PILLS & SEARCH BAR ================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            {/* Category Filter Buttons */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {categoryFilters.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setVisibleCount(6);
                    }}
                    className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm capitalize ${
                      isActive
                        ? "bg-[#3b5bf6] text-white shadow-md shadow-blue-500/25 scale-105"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Trigger / Input */}
            <div className="flex items-center gap-2">
              {isSearchOpen ? (
                <div className="relative w-64">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-full bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  />
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition-all"
                  title="Search Articles"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ================= 3. FEATURED ARTICLE SPOTLIGHT CARD ================= */}
          {featuredArticle && activeCategory === "All" && !searchQuery && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Featured Article</span>
              </div>

              <div className="group rounded-[2.5rem] bg-card border border-border hover:border-indigo-500/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl p-7 sm:p-10">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  {/* Left Graphic Banner */}
                  <div className="lg:col-span-5 aspect-[16/10] rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1033] to-[#1a1c4b] p-7 flex flex-col justify-between relative shadow-inner border border-indigo-500/20">
                    {featuredArticle.coverImage ? (
                      <img
                        src={featuredArticle.coverImage}
                        alt={featuredArticle.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <>
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                            {featuredArticle.tags?.[0] || "Featured Article"}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            {featuredArticle.title}
                          </h3>
                        </div>

                        {/* Audio Wave & Mic Indicator */}
                        <div className="flex items-center justify-between pt-5 border-t border-white/10">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-4 bg-indigo-400 rounded-full animate-pulse" />
                            <span className="w-1.5 h-8 bg-purple-400 rounded-full animate-pulse" />
                            <span className="w-1.5 h-3.5 bg-pink-400 rounded-full animate-pulse" />
                            <span className="w-1.5 h-7 bg-indigo-400 rounded-full animate-pulse" />
                            <span className="w-1.5 h-5 bg-blue-400 rounded-full animate-pulse" />
                          </div>

                          <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
                            <Mic className="w-5 h-5" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Content */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
                        {featuredArticle.tags?.[0] || "ARTICLE"}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {featuredArticle.createdAt} • {featuredArticle.readTime || 5} min read
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground group-hover:text-[#3b5bf6] dark:group-hover:text-indigo-400 transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>

                    {/* Author & Action Link */}
                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden relative bg-indigo-500/20 ring-2 ring-indigo-500/20">
                          <Image src="/images/aditya_profile.png" alt="Aditya" fill className="object-cover" />
                        </div>
                        <span className="text-xs font-bold text-foreground">Aditya Kumar</span>
                      </div>

                      <Link
                        href={`/blog/${featuredArticle.slug}`}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#3b5bf6] dark:text-indigo-400 hover:gap-3 transition-all"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. MAIN 2-COLUMN SECTION ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT COLUMN: 8 Columns for Database Articles */}
            <div className="lg:col-span-8 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <span>Database Articles</span>
                </div>

                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="text-xs font-bold text-[#3b5bf6] dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                >
                  <span>Reset filters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Responsive Card Grid */}
              {displayedArticles.length === 0 ? (
                <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
                  <p className="text-muted-foreground text-sm font-medium">
                    {initialBlogs.length === 0
                      ? "No articles published in the database yet. Publish articles from the Admin Dashboard."
                      : "No articles found matching this filter."}
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    className="text-xs font-bold text-indigo-500 hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-7">
                  {displayedArticles.map((article) => {
                    const hasCover = Boolean(article.coverImage);

                    return (
                      <Link
                        key={article._id}
                        href={`/blog/${article.slug}`}
                        className="group rounded-[2rem] bg-card border border-border hover:border-indigo-500/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl flex flex-col justify-between"
                      >
                        {/* Thumbnail Top */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-accent/40 border-b border-border/40">
                          {hasCover ? (
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-950/80 via-purple-950/50 to-black text-center relative">
                              <Code2 className="w-7 h-7 text-indigo-400 mb-2" />
                              <span className="text-sm font-black text-white line-clamp-1">
                                {article.title}
                              </span>
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mt-1">
                                {article.tags?.[0] || "Article"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Article Info Body */}
                        <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                          <div className="space-y-2.5">
                            {/* Category & Date Row */}
                            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px]">
                                {article.tags?.[0] || "TECH"}
                              </span>
                              <span>{article.createdAt}</span>
                            </div>

                            <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-[#3b5bf6] dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                              {article.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                              {article.excerpt}
                            </p>
                          </div>

                          {/* Author Bottom Row */}
                          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-full overflow-hidden relative bg-indigo-500/20">
                                <Image src="/images/aditya_profile.png" alt="Aditya" fill className="object-cover" />
                              </div>
                              <span className="text-xs font-semibold text-foreground">Aditya Kumar</span>
                            </div>

                            <span className="text-[11px] font-medium text-muted-foreground">
                              {article.readTime || 5} min read
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Load More Articles Button */}
              {filteredArticles.length > visibleCount && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    className="px-7 py-3 rounded-2xl bg-card border border-border hover:border-indigo-500/50 hover:bg-accent text-foreground text-xs font-bold flex items-center gap-2 mx-auto transition-all shadow-sm active:scale-95"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Load More Articles</span>
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Sidebar (4 Columns) with sticky position */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
              {/* 1. About Me Widget */}
              <div className="p-6 rounded-[2rem] bg-card border border-border text-center space-y-4 shadow-sm">
                <h3 className="font-bold text-sm text-foreground text-left">About Me</h3>

                <div className="relative w-20 h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-indigo-500 to-purple-500">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image src="/images/aditya_profile.png" alt="Aditya" fill className="object-cover" />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed px-2">
                  I&apos;m Aditya Kumar, a Full Stack Developer & AI enthusiast. I love building scalable web applications, AI agents, and automation systems.
                </p>

                {/* Social Icon Pills */}
                <div className="flex justify-center gap-3 pt-3 border-t border-border/50">
                  <a
                    href="https://github.com/ErAditya1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-indigo-500/50 transition-colors shadow-sm"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/in/eraditya1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/50 transition-colors shadow-sm"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://twitter.com/Excited_Adi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-sky-500 hover:border-sky-500/50 transition-colors shadow-sm"
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:kumaraditya19747@gmail.com"
                    className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/50 transition-colors shadow-sm"
                    title="Direct Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* 2. Popular Topics Widget (Exclusively from DB) */}
              <div className="p-6 rounded-[2rem] bg-card border border-border space-y-3 shadow-sm">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#3b5bf6]" />
                  Popular Topics
                </h3>

                {topicsList.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-1">No topics yet.</p>
                ) : (
                  <div className="space-y-1">
                    {topicsList.map((topic) => (
                      <button
                        key={topic.name}
                        onClick={() => {
                          setActiveCategory(topic.name);
                          setVisibleCount(6);
                        }}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-accent transition-colors text-xs text-left group"
                      >
                        <span className="font-medium text-muted-foreground group-hover:text-foreground capitalize">
                          {topic.name}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-[#3b5bf6] dark:text-blue-400 font-bold text-[10px]">
                          {topic.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Recent Articles Widget (Exclusively from DB) */}
              <div className="p-6 rounded-[2rem] bg-card border border-border space-y-4 shadow-sm">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Recent Articles
                </h3>

                {recentArticles.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-1">No recent articles.</p>
                ) : (
                  <div className="space-y-3">
                    {recentArticles.map((art) => (
                      <Link
                        key={art._id}
                        href={`/blog/${art.slug}`}
                        className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-accent transition-colors group"
                      >
                        {/* Mini Thumbnail */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/60 flex items-center justify-center shrink-0 border border-border/50 text-[10px] font-bold text-indigo-400 overflow-hidden">
                          {art.coverImage ? (
                            <img src={art.coverImage} alt={art.title} className="w-full h-full object-cover" />
                          ) : (
                            <Code2 className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-foreground group-hover:text-[#3b5bf6] dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {art.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground block">
                            {art.createdAt}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= 5. STAY UPDATED NEWSLETTER CARD ================= */}
          <div className="rounded-[2.5rem] bg-card border border-border p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner">
                <Mail className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-foreground">Stay Updated</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                  Get the latest articles, tutorials, and insights straight to your inbox.
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto">
              {subscribed ? (
                <div className="px-7 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" /> Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-[28rem]">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-5 py-3.5 rounded-2xl bg-accent/60 border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3b5bf6]"
                  />
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-2xl bg-[#3b5bf6] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
              <span className="text-[11px] text-muted-foreground italic block mt-2 text-center md:text-left">
                No spam. Unsubscribe anytime.
              </span>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
