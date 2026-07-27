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
  Eye
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
  popularTopics: { name: string; count: number }[];
}

export function BlogPageClient({ initialBlogs, popularTopics }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [suggestTopicModal, setSuggestTopicModal] = useState(false);
  const [suggestedTopic, setSuggestedTopic] = useState("");
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  // Extract all unique categories/tags from dynamic blogs
  const dynamicCategories = ["All", ...Array.from(new Set(initialBlogs.flatMap(b => b.tags || [])))];

  const featuredArticle = initialBlogs.length > 0 ? initialBlogs[0] : null;
  const articlesList = initialBlogs.length > 0 ? initialBlogs : [];

  // Filter articles based on category and search input
  const filteredArticles = articlesList.filter((art) => {
    const matchesCategory = activeCategory === "All" || 
      art.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase());
    const matchesSearch = searchQuery === "" || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmailInput("");
    }
  };

  const handleSuggestTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestedTopic.trim()) {
      setSuggestSuccess(true);
      setTimeout(() => {
        setSuggestSuccess(false);
        setSuggestTopicModal(false);
        setSuggestedTopic("");
      }, 2500);
    }
  };

  return (
    <main className="pt-24 pb-20 overflow-hidden bg-background">
      <Container>
        {/* ================= HERO BANNER ================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900/10 via-background to-purple-900/10 border border-border p-8 md:p-12 mb-12 overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest inline-block">
                MY BLOG
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                Sharing Knowledge, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Building Solutions
                </span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
                Thoughts on web development, system design, tools, career growth and everything in between.
              </p>

              {/* Stats Counters */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-card border border-border shadow-sm">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <div>
                    <div className="text-lg font-black text-foreground">{initialBlogs.length}+</div>
                    <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Articles</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-card border border-border shadow-sm">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-lg font-black text-foreground">5K+</div>
                    <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Readers</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-card border border-border shadow-sm">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="text-lg font-black text-foreground">2+</div>
                    <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Years Blogging</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 3D Code Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent p-6 flex flex-col items-center justify-center border border-indigo-500/20 shadow-xl">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl mb-4">
                  <Code2 className="w-10 h-10" />
                </div>
                <div className="w-full bg-card/90 backdrop-blur-md rounded-2xl border border-border p-4 shadow-lg space-y-2">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-[11px] font-mono text-muted-foreground ml-2">Dynamic Database Engine</span>
                  </div>
                  <pre className="text-xs font-mono text-indigo-500 overflow-x-auto p-2 rounded-lg bg-accent/50">
                    <code>{`// MongoDB Live Query
const posts = await Blog.find({
  published: true
}).sort({ createdAt: -1 });`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CATEGORIES FILTER & SEARCH ================= */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {dynamicCategories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap capitalize ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* ================= MAIN 2-COLUMN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* LEFT COLUMN: Featured + Latest Articles */}
          <div className="lg:col-span-8 space-y-12">
            {/* Featured Article Card */}
            {featuredArticle && !searchQuery && activeCategory === "All" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-widest">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Featured Article
                </div>

                <div className="group rounded-3xl bg-card border border-border p-6 md:p-8 hover:border-indigo-500/40 transition-all shadow-sm">
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 relative aspect-video rounded-2xl overflow-hidden bg-accent">
                      {featuredArticle.coverImage ? (
                        <img
                          src={featuredArticle.coverImage}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-900/40 text-white font-bold text-lg p-4 text-center">
                          {featuredArticle.tags?.[0] || "Featured"}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-7 space-y-4">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider">
                        FEATURED
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-indigo-500/20 relative">
                            <Image src="/images/aditya_profile.png" alt="Aditya" fill className="object-cover" />
                          </div>
                          <span className="text-xs font-bold text-foreground">Aditya Kumar</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(featuredArticle.createdAt).toLocaleDateString()} • {featuredArticle.readTime || 5} min read
                        </span>
                      </div>

                      <div>
                        <Link
                          href={`/blog/${featuredArticle.slug}`}
                          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-3 transition-all"
                        >
                          Read Article <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  Articles List
                </h2>
                <span className="text-xs text-muted-foreground font-semibold">
                  Showing {filteredArticles.length} articles
                </span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
                  <p className="text-muted-foreground text-sm">No articles found in the database.</p>
                  <button
                    onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                    className="text-xs font-bold text-indigo-500 hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Link
                      key={article._id}
                      href={`/blog/${article.slug}`}
                      className="group block p-6 rounded-3xl bg-card border border-border hover:border-indigo-500/40 transition-all shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden bg-accent shrink-0 relative">
                          {article.coverImage ? (
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs p-2 text-center">
                              {article.title}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 font-bold text-[10px] capitalize">
                              {article.tags?.[0] || "Article"}
                            </span>
                            <span>•</span>
                            <span>{article.readTime || 5} min read</span>
                          </div>

                          <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            {/* About the Author Card */}
            <div className="p-6 rounded-3xl bg-card border border-border text-center space-y-4 shadow-sm">
              <div className="relative w-20 h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-indigo-500 to-purple-500">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image src="/images/aditya_profile.png" alt="Aditya" fill className="object-cover" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Aditya Kumar</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Full Stack Developer passionate about building digital solutions and sharing knowledge with the developer community.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2 border-t border-border">
                <a href="https://github.com/ErAditya1" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-accent text-muted-foreground hover:text-indigo-500 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-accent text-muted-foreground hover:text-indigo-500 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-accent text-muted-foreground hover:text-indigo-500 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="mailto:mradityaji2@gmail.com" className="p-2 rounded-xl bg-accent text-muted-foreground hover:text-indigo-500 transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Popular Topics from Database */}
            <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-500" />
                Popular Topics
              </h3>
              <div className="space-y-2">
                {popularTopics.map((top) => (
                  <button
                    key={top.name}
                    onClick={() => { setSearchQuery(top.name); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-accent transition-colors text-xs text-left"
                  >
                    <span className="font-semibold text-foreground capitalize">{top.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-[10px]">
                      {top.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Articles */}
            <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Popular Articles
              </h3>
              <div className="space-y-3">
                {initialBlogs.slice(0, 4).map((art) => (
                  <Link
                    key={art._id}
                    href={`/blog/${art.slug}`}
                    className="block p-3 rounded-2xl hover:bg-accent transition-colors space-y-1 group"
                  >
                    <h4 className="text-xs font-bold text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground block">
                      {new Date(art.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 via-card to-card border border-indigo-500/20 space-y-4 shadow-sm">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  Newsletter
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Get the latest articles and updates delivered to your inbox.
                </p>
              </div>

              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    Subscribe <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
              <p className="text-[10px] text-muted-foreground italic text-center">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM TOPIC SUGGESTION BANNER ================= */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-200 block">Share Your Ideas</span>
              <h2 className="text-2xl md:text-3xl font-black">Have a topic in mind?</h2>
              <p className="text-indigo-200 text-xs md:text-sm">I&apos;m always open to suggestions.</p>
            </div>
          </div>

          <button
            onClick={() => setSuggestTopicModal(true)}
            className="z-10 px-8 py-4 rounded-2xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            Suggest a Topic <Lightbulb className="w-4 h-4 text-amber-500" />
          </button>
        </div>

        {/* Suggest Topic Modal */}
        {suggestTopicModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Suggest a Topic</h3>
                <p className="text-xs text-muted-foreground">What topic or tech stack would you like me to write about?</p>
              </div>

              {suggestSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Thank you! Your topic suggestion was received.
                </div>
              ) : (
                <form onSubmit={handleSuggestTopic} className="space-y-4">
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. Building microservices with NestJS or WebSocket rate limiting..."
                    value={suggestedTopic}
                    onChange={(e) => setSuggestedTopic(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-accent border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setSuggestTopicModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md"
                    >
                      Submit Idea
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
