"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  rating?: number;
}

export function TestimonialsSlider({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isAutoPlaying, testimonials.length]);

  return (
    <div
      className="relative space-y-6 max-w-4xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs font-bold text-muted-foreground ml-2">Client Trust & Recommendations</span>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
            title="Previous Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
            title="Next Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Testimonial Card Display */}
      <div className="relative overflow-hidden min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="p-8 md:p-10 rounded-3xl bg-card border border-border space-y-6 shadow-md relative"
          >
            <Quote className="w-10 h-10 text-indigo-500/20 absolute top-6 right-8" />
            <p className="text-sm md:text-base text-foreground italic leading-relaxed font-medium">
              &quot;{testimonials[currentIndex].quote}&quot;
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                  {testimonials[currentIndex].name[0]}
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">{testimonials[currentIndex].name}</div>
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{testimonials[currentIndex].role}</div>
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentIndex ? "w-6 bg-indigo-600" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
