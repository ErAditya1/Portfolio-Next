"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IGallery } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from "lucide-react";

export function GalleryGrid({ items }: { items: IGallery[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
  };

  const selectedImage = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <div className="space-y-6">
      {/* Gallery Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item._id ? item._id.toString() : index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-border shadow-sm bg-card hover:border-indigo-500/50 transition-all duration-300"
            onClick={() => setSelectedIndex(index)}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-900/30 text-white font-bold text-xs p-2 text-center">
                {item.title}
              </div>
            )}

            {/* Hover overlay with zoom icon & category */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center pointer-events-none">
              <ZoomIn className="w-6 h-6 text-white mb-1" />
              <h4 className="text-white font-bold text-xs line-clamp-1">{item.title}</h4>
              <span className="mt-1.5 px-2 py-0.5 bg-indigo-600 text-white font-bold text-[9px] rounded-full uppercase tracking-wider shadow-sm">
                {item.category || "General"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Carousel Navigation Arrows */}
            {items.length > 1 && (
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

            {/* Image Preview Box */}
            <div
              className="relative w-full h-full max-w-4xl flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full flex-1 max-h-[70vh]"
              >
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </motion.div>

              {/* Caption Bar */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-4 text-center bg-card/90 border border-border px-6 py-4 rounded-2xl backdrop-blur-md max-w-xl w-full shadow-2xl"
              >
                <h3 className="text-lg font-bold text-foreground">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{selectedImage.description}</p>
                )}
                <div className="mt-3 flex items-center justify-center gap-3">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold rounded-full uppercase border border-indigo-500/20">
                    {selectedImage.category}
                  </span>
                  <span className="text-muted-foreground text-[10px] font-mono">
                    {selectedIndex + 1} / {items.length}
                  </span>
                  {selectedImage.externalUrl && (
                    <a
                      href={selectedImage.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-500 hover:underline flex items-center gap-1 font-bold"
                    >
                      View External <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
