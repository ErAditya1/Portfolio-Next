"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  PenTool, 
  Award, 
  Calendar, 
  Camera, 
  User, 
  X, 
  ZoomIn, 
  ChevronLeft, 
  ChevronRight,
  Folder
} from "lucide-react";

export interface GalleryCardItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  badgeIcon?: string;
  badgeLabel?: string;
}

interface GalleryPageClientProps {
  initialItems: GalleryCardItem[];
}

export function GalleryPageClient({ initialItems }: GalleryPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const categories = [
    { name: "All", icon: Layers },
    { name: "Projects", icon: Folder },
    { name: "UI/UX Design", icon: PenTool },
    { name: "Certificates", icon: Award },
    { name: "Events", icon: Calendar },
    { name: "Behind The Scenes", icon: Camera },
    { name: "Life", icon: User },
  ];

  // Default gallery items matching reference image
  const defaultGalleryCards: GalleryCardItem[] = [
    {
      id: "g-bv",
      title: "Bright Veil Dashboard",
      category: "Projects",
      imageUrl: "",
      description: "Full-stack LMS portal dashboard with student progress analytics.",
      badgeIcon: "📁",
      badgeLabel: "Bright Veil Dashboard",
    },
    {
      id: "g-bg",
      title: "Born Goat App",
      category: "UI/UX Design",
      imageUrl: "",
      description: "Mobile app interface layout and brand experience design.",
      badgeIcon: "📱",
      badgeLabel: "Born Goat App",
    },
    {
      id: "g-ai",
      title: "AI Calling Platform",
      category: "Projects",
      imageUrl: "",
      description: "AI-powered voice agent system code structure and STT listener.",
      badgeIcon: "</>",
      badgeLabel: "AI Calling Platform",
    },
    {
      id: "g-clg",
      title: "College Management System",
      category: "Projects",
      imageUrl: "",
      description: "College portal management dashboard for marksheet and attendance.",
      badgeIcon: "⚙️",
      badgeLabel: "College Management System",
    },
    {
      id: "g-cert",
      title: "Certifications",
      category: "Certificates",
      imageUrl: "",
      description: "Official web development diploma certificate and technical awards.",
      badgeIcon: "🏆",
      badgeLabel: "Certifications",
    },
    {
      id: "g-bsides",
      title: "Hackathon Event",
      category: "Events",
      imageUrl: "",
      description: "Speaker session and hackathon presentation at technical event.",
      badgeIcon: "📅",
      badgeLabel: "Hackathon Event",
    },
    {
      id: "g-bts",
      title: "Behind The Scenes",
      category: "Behind The Scenes",
      imageUrl: "",
      description: "Workspace notes and continuous learning journey log.",
      badgeIcon: "📷",
      badgeLabel: "Behind The Scenes",
    },
    {
      id: "g-life",
      title: "Life Beyond Code",
      category: "Life",
      imageUrl: "",
      description: "Mountain views, travel memories, and life outside engineering.",
      badgeIcon: "👤",
      badgeLabel: "Life Beyond Code",
    },
  ];

  const galleryItems = initialItems.length > 0 ? initialItems : defaultGalleryCards;

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === "All") return true;
    return item.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredItems.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const selectedImage = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <main className="pt-24 pb-20 overflow-hidden bg-background">
      <Container>
        {/* ================= 1. HERO SECTION ================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900/10 via-background to-purple-900/10 border border-border p-8 md:p-12 mb-12 overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest inline-block">
                MY GALLERY
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                Moments That <br />
                <span className="text-indigo-600 dark:text-indigo-400">Tell My Journey</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
                A collection of projects, designs, milestones and memories that reflect my passion and growth as a developer.
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    🖼️
                  </div>
                  <div>
                    <div className="text-base font-black text-foreground">50+</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">Images</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                    📁
                  </div>
                  <div>
                    <div className="text-base font-black text-foreground">15+</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">Projects</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    🏆
                  </div>
                  <div>
                    <div className="text-base font-black text-foreground">5+</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">Events</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold">
                    💖
                  </div>
                  <div>
                    <div className="text-base font-black text-foreground">100%</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">Passion</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Workspace Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border border-border bg-card shadow-2xl p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                <div className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-indigo-950/70 via-purple-950/50 to-black/80">
                  {galleryItems?.[0]?.imageUrl ? (
                    <img
                      src={galleryItems[0].imageUrl}
                      alt="Gallery Showcase Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-inner">
                        <Camera className="w-7 h-7" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">Visual Journey & Moments</h4>
                      <p className="text-xs text-muted-foreground max-w-xs">Milestones, architecture diagrams, and development life</p>
                    </div>
                  )}

                  {/* Bottom Right Badge Overlay */}
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-card/90 backdrop-blur-md border border-border text-[10px] font-bold text-foreground flex items-center gap-2 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <div>
                      <div className="font-bold">Building Ideas</div>
                      <div className="text-muted-foreground text-[9px]">Creating Impact</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. CATEGORY TABS & VIEW ALL ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none scrollbar-hide no-scrollbar">
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

          <button
            onClick={() => setActiveCategory("All")}
            className="text-xs font-bold text-muted-foreground hover:text-indigo-600 flex items-center gap-1 shrink-0"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ================= 3. GALLERY MASONRY/GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setSelectedIndex(idx)}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:border-indigo-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-end"
            >
              {/* Image Background or Gradient Card */}
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-slate-950 p-6 text-center">
                  <span className="text-4xl mb-3">{item.badgeIcon || "📷"}</span>
                  <span className="text-sm font-bold text-foreground mb-1">{item.title}</span>
                  <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">{item.category}</span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Bottom Card Title & Badge Overlay */}
              <div className="relative p-5 z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold shadow-md">
                  <span>{item.badgeIcon || "📷"}</span>
                  <span>{item.badgeLabel || item.title}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Interactive Modal */}
        <AnimatePresence>
          {selectedIndex !== null && selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
              onClick={() => setSelectedIndex(null)}
            >
              <button
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20"
                onClick={() => setSelectedIndex(null)}
              >
                <X className="w-6 h-6" />
              </button>

              {filteredItems.length > 1 && (
                <>
                  <button
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-indigo-600 transition-all z-[110]"
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-indigo-600 transition-all z-[110]"
                    onClick={handleNext}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div
                className="relative w-full h-full max-w-4xl flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  key={selectedIndex}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full flex-1 max-h-[70vh] flex items-center justify-center"
                >
                  {selectedImage.imageUrl ? (
                    <img
                      src={selectedImage.imageUrl}
                      alt={selectedImage.title}
                      className="w-full h-full object-contain rounded-2xl"
                    />
                  ) : (
                    <div className="w-full max-w-lg aspect-video rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-border flex flex-col items-center justify-center p-8 text-center">
                      <span className="text-6xl mb-4">{selectedImage.badgeIcon || "📷"}</span>
                      <h4 className="text-xl font-bold text-foreground">{selectedImage.title}</h4>
                      <p className="text-xs text-indigo-400 font-semibold mt-1">{selectedImage.category}</p>
                    </div>
                  )}
                </motion.div>

                <div className="mt-4 text-center bg-card/90 border border-border px-6 py-4 rounded-2xl backdrop-blur-md max-w-xl w-full shadow-2xl">
                  <h3 className="text-lg font-bold text-foreground">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{selectedImage.description}</p>
                  )}
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold rounded-full uppercase border border-indigo-500/20">
                      {selectedImage.category}
                    </span>
                    <span className="text-muted-foreground text-[10px] font-mono">
                      {selectedIndex + 1} / {filteredItems.length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= 4. MORE THAN CODE, IT'S A JOURNEY CTA BANNER ================= */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black">More Than Code, It&apos;s a Journey</h2>
              <p className="text-indigo-200 text-xs md:text-sm">
                Every image tells a story of learning, building and growing.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveCategory("All")}
            className="z-10 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            View All Images <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Container>
    </main>
  );
}
