"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IGallery } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item._id.toString()}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-border shadow-sm bg-card"
            onClick={() => setSelectedIndex(index)}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 dark:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center pointer-events-none">
              <ZoomIn className="w-8 h-8 text-white mb-2" />
              <h3 className="text-white font-bold">{item.title}</h3>
              <p className="text-gray-200 text-xs mt-1">{item.description}</p>
              <span className="mt-2 px-2 py-1 bg-primary text-primary-foreground font-bold text-[10px] rounded-full uppercase tracking-wider shadow-sm">
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox / Carousel Modal */}
      <AnimatePresence>
        {selectedIndex !== null && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>
            
            {items.length > 1 && (
              <>
                <button
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all z-[110]"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all z-[110]"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="relative w-full h-full max-w-5xl flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.div 
                key={selectedIndex}
                initial={{ scale: 0.9, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.9, opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full flex-1"
              >
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-4 text-center bg-black/60 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/10"
              >
                <h2 className="text-2xl font-bold text-white">{selectedImage.title}</h2>
                <p className="text-gray-300 mt-2">{selectedImage.description}</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                   <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full uppercase border border-primary/30">
                     {selectedImage.category}
                   </span>
                   <span className="text-gray-500 text-[10px] font-mono">
                     {selectedIndex + 1} / {items.length}
                   </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

