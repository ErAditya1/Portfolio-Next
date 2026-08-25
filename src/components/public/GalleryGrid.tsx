"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IGallery } from "@/types";
import {
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Camera,
  Layers,
  Award,
  Calendar,
  Eye,
  SlidersHorizontal
} from "lucide-react";

export function GalleryGrid({ items }: { items: IGallery[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  // Extract unique categories from items
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const itemsPerPage = 3; // Show 3 cards per slide view on desktop
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  // Reset page to 0 when category changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(0);
    setDirection(0);
  };

  const handleNextSlide = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevSlide = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const startIndex = currentPage * itemsPerPage;
  const visibleItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredItems.length]);

  const handleNextLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredItems.length);
  };

  const handlePrevLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const selectedImage = selectedIndex !== null ? filteredItems[selectedIndex] : null;

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
      {/* Top Carousel Navigation & Category Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/40">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = cat === "All" ? items.length : items.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-indigo-500/25 shadow-md scale-105"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-indigo-500/40 hover:bg-accent/60"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-accent text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Carousel Slider Controls & Progress */}
        <div className="flex items-center gap-3">
          {/* Progress Indicators */}
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
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handlePrevSlide}
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-90"
            title="Previous Gallery Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextSlide}
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-90"
            title="Next Gallery Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Animated 3-Card Gallery Carousel Slider */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {visibleItems.map((item, index) => {
              const actualGlobalIdx = startIndex + index;
              const hasImage = Boolean(item.imageUrl);

              return (
                <motion.div
                  key={item._id ? item._id.toString() : actualGlobalIdx}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedIndex(actualGlobalIdx)}
                  className="group rounded-[2.2rem] bg-card border border-border hover:border-indigo-500/60 transition-all duration-500 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-indigo-500/15 cursor-pointer relative aspect-[4/3] flex items-center justify-center"
                >
                  {/* Card Background: Visual Image OR Styled Canvas */}
                  {hasImage ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/80 via-purple-950/50 to-black p-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <Camera className="w-8 h-8" />
                      </div>
                      <span className="text-xs font-semibold text-indigo-400/80 uppercase tracking-widest mt-2">
                        {item.category || "Moment"}
                      </span>
                    </div>
                  )}

                  {/* Top Static Badge (Discreet) */}
                  <div className="absolute top-4 left-4 z-10 opacity-70 group-hover:opacity-0 transition-opacity duration-300">
                    <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] font-bold text-foreground border border-border shadow-sm uppercase tracking-wider">
                      {item.category || "Moment"}
                    </span>
                  </div>

                  {/* ================= TEXT SHOWN ONLY ON HOVER ================= */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-400 p-6 md:p-8 flex flex-col justify-between backdrop-blur-[2px] z-20">
                    {/* Top Row inside hover */}
                    <div className="flex items-center justify-between transform -translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="px-3.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                        {item.category || "Moment"}
                      </span>

                      <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-md shadow-md">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom Details sliding up on hover */}
                    <div className="space-y-2 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <h3 className="font-black text-lg md:text-xl text-white tracking-tight leading-tight line-clamp-2">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="pt-2 flex items-center gap-2 text-indigo-300 text-xs font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Click to expand high-res</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {selectedIndex !== null && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Top Bar: Close Button & Counter */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-[120]">
              <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-2 border border-white/10">
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {String(selectedIndex + 1).padStart(2, "0")} / {String(filteredItems.length).padStart(2, "0")}
                </span>
              </div>

              <button
                className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10 active:scale-90"
                onClick={() => setSelectedIndex(null)}
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Arrows */}
            {filteredItems.length > 1 && (
              <>
                <button
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-indigo-600 transition-all z-[120] border border-white/10 active:scale-90"
                  onClick={handlePrevLightbox}
                  title="Previous Image (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-indigo-600 transition-all z-[120] border border-white/10 active:scale-90"
                  onClick={handleNextLightbox}
                  title="Next Image (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Lightbox Content Container */}
            <div
              className="relative w-full h-full max-w-4xl flex flex-col items-center justify-center pt-12"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedIndex}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="relative w-full flex-1 max-h-[65vh] flex items-center justify-center"
              >
                {selectedImage.imageUrl ? (
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div className="w-full max-w-lg aspect-video rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-black border border-indigo-500/30 flex flex-col items-center justify-center p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-3 shadow-inner">
                      <Camera className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-black text-white">{selectedImage.title}</h4>
                    <p className="text-xs text-indigo-400 font-semibold mt-1 uppercase tracking-wider">
                      {selectedImage.category || "Moment"}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Caption & Metadata Bar */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-6 text-center bg-card/95 border border-border px-8 py-5 rounded-3xl backdrop-blur-xl max-w-2xl w-full shadow-2xl space-y-3"
              >
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-indigo-500/20">
                    {selectedImage.category || "Moment"}
                  </span>
                  {selectedImage.featured && (
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-amber-500/20">
                      Featured
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-black text-foreground">
                    {selectedImage.title}
                  </h3>
                  {selectedImage.description && (
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {selectedImage.description}
                    </p>
                  )}
                </div>

                {selectedImage.externalUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedImage.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Visit External Link <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
