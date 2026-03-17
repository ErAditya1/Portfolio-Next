"use client";

import { motion } from "framer-motion";
import { IGallery } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

export function GalleryGrid({ items }: { items: IGallery[] }) {
  const [selectedImage, setSelectedImage] = useState<IGallery | null>(null);

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
            className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-white/10 glass"
            onClick={() => setSelectedImage(item)}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
              <ZoomIn className="w-8 h-8 text-white mb-2" />
              <h3 className="text-white font-bold">{item.title}</h3>
              <p className="text-gray-300 text-xs mt-1">{item.description}</p>
              <span className="mt-2 px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] rounded-full uppercase tracking-wider border border-purple-500/30">
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full max-w-5xl flex flex-col items-center justify-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full flex-1"
            >
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
            </motion.div>
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-white">{selectedImage.title}</h2>
              <p className="text-gray-400 mt-2">{selectedImage.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
