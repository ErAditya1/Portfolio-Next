"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  ArrowUpRight
} from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  desc: string;
  live: string;
  repo?: string;
  img: string;
  year?: number;
  tag?: string;
  tech: string[];
  slug?: string;
}

interface ProjectSliderProps {
  projects: ProjectItem[];
}

export function ProjectSlider({ projects }: ProjectSliderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!projects || projects.length === 0) {
    return null;
  }

  const itemsPerPage = 3; // Show exactly 3 cards in desktop grid
  const totalPages = Math.max(1, Math.ceil(projects.length / itemsPerPage));

  const handleNext = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const startIndex = currentPage * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 350, damping: 32 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
        staggerChildren: 0.08,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring" as const, stiffness: 350, damping: 32 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="space-y-8 relative">
      {/* Top Slider Navigation & Counter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {projects.length} Featured Projects
          </div>
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
            Page {String(currentPage + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
        </div>

        {/* Carousel Arrow Buttons & Dots */}
        <div className="flex items-center gap-3">
          {/* Page Indicators */}
          <div className="flex items-center gap-1.5 mr-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentPage ? 1 : -1);
                  setCurrentPage(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentPage
                    ? "w-7 bg-indigo-600 shadow-sm shadow-indigo-500/30"
                    : "w-2 bg-border hover:bg-indigo-400"
                }`}
                title={`Go to page ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-90"
            title="Previous Projects"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-90"
            title="Next Projects"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3-Card Interactive Grid Slider */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {currentProjects.map((proj, idx) => {
              const projectLink = `/projects/${proj.slug || proj.id}`;

              return (
                <motion.div
                  key={proj.id || idx}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group rounded-[2rem] bg-card/90 backdrop-blur-sm border border-border/80 overflow-hidden hover:border-indigo-500/50 transition-all duration-500 flex flex-col justify-between shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 relative"
                >
                  {/* Card Thumbnail Section */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-accent/40 border-b border-border/50">
                    {proj.img ? (
                      <img
                        src={proj.img}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/70 via-purple-950/40 to-black/80 text-indigo-400 p-6 relative overflow-hidden">
                        {/* Subtle background ambient mesh */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 transition-transform duration-500">
                          <Code2 className="w-7 h-7" />
                        </div>
                        <span className="text-xl font-black tracking-wider text-foreground">
                          {proj.title.slice(0, 3).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mt-1">
                          {proj.tech?.[0] || "Full Stack Application"}
                        </span>
                      </div>
                    )}

                    {/* Gradient Top & Bottom Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Floating Category / Tag Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-full bg-background/80 backdrop-blur-md text-[11px] font-bold text-indigo-500 dark:text-indigo-300 border border-border shadow-md">
                        {proj.tag || "Featured Project"}
                      </span>
                    </div>

                    {/* Top Right Quick Actions */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                      {proj.repo && (
                        <a
                          href={proj.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-md"
                          title="View Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.live && proj.live !== "#" && (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-md"
                          title="Open Live App"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-6 md:p-7 flex flex-col flex-1 justify-between space-y-5">
                    <div className="space-y-2.5">
                      <Link href={projectLink} className="block group/link">
                        <h3 className="font-bold text-lg md:text-xl text-foreground group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors line-clamp-1 flex items-center justify-between gap-2">
                          <span>{proj.title}</span>
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all shrink-0" />
                        </h3>
                      </Link>

                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {proj.desc}
                      </p>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="space-y-4 pt-2 border-t border-border/40">
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tech.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] md:text-[11px] px-3 py-1 rounded-xl bg-accent/60 border border-border/60 text-muted-foreground font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                        {proj.tech.length > 3 && (
                          <span className="text-[10px] px-2 py-1 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold">
                            +{proj.tech.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Bottom Footer Action */}
                      <div className="flex items-center justify-between pt-1">
                        <Link
                          href={projectLink}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1.5 group/btn transition-colors"
                        >
                          Explore Case Study
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>

                        {proj.live && proj.live !== "#" && (
                          <a
                            href={proj.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
