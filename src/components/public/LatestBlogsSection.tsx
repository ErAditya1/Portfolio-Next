"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Eye,
  Tag,
  Flame,
  Terminal,
  Cpu,
  Layers
} from "lucide-react";
import { Container } from "@/components/Container";

export interface BlogPreviewItem {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  date: string;
  readTime: string;
  tag: string;
}

interface LatestBlogsSectionProps {
  blogs: BlogPreviewItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 26,
    },
  },
};

const popularTopics = [
  "Next.js 15 App Router",
  "Realtime WebSockets",
  "AI Voice Telephony",
  "System Architecture",
  "Docker & DevOps",
  "MongoDB Aggregations"
];

export function LatestBlogsSection({ blogs }: LatestBlogsSectionProps) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section id="latest-blogs" className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container>
        <div className="space-y-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/40">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Technical Publications
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Sharing knowledge &{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  deep insights
                </span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                In-depth engineering articles on full-stack web architectures, real-time audio telephony pipelines, and scalable backend design.
              </p>
            </div>

            <Link
              href="/blog"
              className="group px-5 py-3 rounded-2xl bg-card border border-border hover:border-indigo-500/40 text-foreground text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0 hover:bg-accent active:scale-95"
            >
              View All Articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-500" />
            </Link>
          </div>

          {/* 3-Card Technical Publications Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {blogs.map((b, idx) => {
              const hasCover = Boolean(b.coverImage);

              return (
                <motion.div
                  key={b.slug || idx}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className="group rounded-[2.2rem] bg-card border border-border hover:border-indigo-500/50 transition-all duration-500 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between relative"
                >
                  <Link href={`/blog/${b.slug}`} className="block flex-1 flex flex-col">
                    {/* Thumbnail Section */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-accent/40 border-b border-border/40">
                      {hasCover ? (
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/70 via-purple-950/40 to-black/80 text-indigo-400 p-6 text-center relative overflow-hidden">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <BookOpen className="w-7 h-7" />
                          </div>
                          <span className="text-base font-black text-foreground line-clamp-1">
                            {b.title}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mt-1">
                            {b.tag || "Engineering Note"}
                          </span>
                        </div>
                      )}

                      {/* Gradient Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Floating Category Pill */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-background/85 backdrop-blur-md text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-border shadow-md uppercase tracking-wider">
                          {b.tag || "Technical"}
                        </span>
                      </div>

                      {/* Floating Read Time on Top Right */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-background/85 backdrop-blur-md text-[10px] font-bold text-muted-foreground border border-border shadow-md flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          {b.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Article Content Details */}
                    <div className="p-6 md:p-7 flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-2.5">
                        {/* Date Meta Row */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{b.date}</span>
                        </div>

                        {/* Title with Hover Gradient Transition */}
                        <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight tracking-tight">
                          {b.title}
                        </h3>

                        {/* Excerpt */}
                        {b.excerpt && (
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2 font-normal">
                            {b.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Bottom Read Action Link */}
                      <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 flex items-center gap-1.5 transition-colors">
                          Read Full Article
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>

                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-accent text-muted-foreground font-mono">
                          Deep Dive
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Popular Discussion Topics Strip */}
          <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
              <Tag className="w-4 h-4 text-indigo-500" />
              <span>Core Topics:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {popularTopics.map((topic, idx) => (
                <Link
                  key={idx}
                  href={`/blog?tag=${encodeURIComponent(topic.split(" ")[0])}`}
                  className="px-3 py-1 rounded-xl bg-accent/70 hover:bg-indigo-600 hover:text-white border border-border text-[11px] font-semibold text-muted-foreground transition-all"
                >
                  #{topic}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
