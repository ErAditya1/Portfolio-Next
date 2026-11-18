"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Building2, GraduationCap, Home } from "lucide-react";

export interface CompanyCardItem {
  id: string;
  name: string;
  role: string;
  period: string;
  logo?: string;
  icon?: string;
}

export function CompanySlider({ companies }: { companies: CompanyCardItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, companies.length - itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const visibleCompanies = companies.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Where I Gained Experience & Grew
        </div>

        {/* Carousel Slider Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
            title="Previous Companies"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
            title="Next Companies"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {visibleCompanies.map((comp) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-3xl bg-card border border-border text-center space-y-4 hover:border-indigo-500/40 transition-all shadow-sm flex flex-col items-center justify-between"
            >
              {/* Logo / Icon - fully fills the logo tile */}
              <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-border/80 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 group-hover:border-indigo-500/50 transition-all duration-300">
                {comp.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={comp.logo}
                    alt={comp.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-base">
                    {comp.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">{comp.name}</h3>
                <p className="text-xs text-muted-foreground font-medium">{comp.role}</p>
              </div>

              {/* Period Tag */}
              <span className="px-3.5 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                {comp.period}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
