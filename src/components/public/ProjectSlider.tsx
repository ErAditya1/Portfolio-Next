"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
}

interface ProjectSliderProps {
  projects: ProjectItem[];
}

export function ProjectSlider({ projects }: ProjectSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 4; // Display 4 cards in a row on desktop
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, projects.length - itemsPerPage + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, projects.length - itemsPerPage) : prev - 1
    );
  };

  const visibleProjects = projects.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="space-y-6 relative">
      {/* Top Slider Navigation Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {projects.length} Real Database Projects
          </span>
        </div>

        {/* Carousel Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
            title="Previous Projects"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
            title="Next Projects"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slider Cards Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((proj, idx) => (
            <motion.div
              key={proj.id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group rounded-3xl bg-card border border-border overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl relative"
            >
              {/* Card Thumbnail Image */}
              <div className="relative aspect-video overflow-hidden bg-accent/40">
                <img
                  src={proj.img || "/images/projects/Bright_Veil.png"}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {proj.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-bold text-indigo-500 border border-border shadow-sm">
                    {proj.tag}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {proj.repo && (
                      <a
                        href={proj.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {proj.live && (
                      <a
                        href={proj.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-indigo-500 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                  {proj.desc}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 pt-4">
        {Array.from({ length: Math.min(6, projects.length) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all ${
              idx === currentIndex
                ? "w-6 h-2.5 rounded-full bg-indigo-600"
                : "w-2.5 h-2.5 rounded-full bg-border hover:bg-indigo-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
