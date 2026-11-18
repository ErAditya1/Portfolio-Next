"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, CheckCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgent } from "@/components/public/agent/AgentProvider";

const WHATSAPP_NUMBER = "919473774390";

const QUICK_PROMPTS = [
  { label: "💼 Discuss a project", text: "Hi Aditya, I saw your portfolio and would like to discuss a project with you." },
  { label: "🤖 AI & WhatsApp SaaS", text: "Hi Aditya, I'm interested in your AI agents and WhatsApp Cloud API solutions." },
  { label: "👋 Schedule a call", text: "Hi Aditya, I'd like to schedule an introductory discovery call." },
];

function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function FloatingFeatures() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPill, setShowPill] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);
  const { fullscreen } = useAgent();

  useEffect(() => {
    setMounted(true);
    // Show polite greeting pill after 2.5s
    const timer = setTimeout(() => {
      setShowPill(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Esc key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!mounted || fullscreen) return null;

  const openWhatsApp = (message?: string) => {
    const text = encodeURIComponent(message || customMsg.trim() || "Hi Aditya, I visited your portfolio!");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setCustomMsg("");
  };

  return (
    <div ref={popupRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* WhatsApp Chat Card Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 w-[340px] max-w-[calc(100vw-32px)] overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl shadow-emerald-500/10"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner backdrop-blur-sm">
                  <WhatsAppIcon className="h-6 w-6 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#128C7E] bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-bold text-white text-sm">Aditya Kumar</span>
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/85">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span>Online · Typically replies in mins</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                  aria-label="Close WhatsApp chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="space-y-3 bg-zinc-50 p-4 dark:bg-zinc-900/60">
              {/* Message Bubble */}
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 text-xs leading-relaxed text-zinc-800 shadow-sm ring-1 ring-black/5 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/10">
                <p>
                  Hey there! 👋 Welcome to my portfolio. Have a question, project, or want to build an AI/full-stack product?
                </p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                  <span>Just now</span>
                  <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Quick Start:</p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => openWhatsApp(q.text)}
                      className="flex items-center justify-between rounded-xl border border-border/80 bg-card px-3 py-2 text-left text-xs font-medium text-foreground transition hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      <span>{q.label}</span>
                      <span className="text-[10px] text-muted-foreground">↗</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input & Direct Action Footer */}
            <div className="border-t border-border bg-card p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  openWhatsApp();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#25D366] text-white transition hover:bg-[#20ba59] active:scale-95 shadow-md shadow-emerald-500/20"
                  aria-label="Send WhatsApp message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <button
                type="button"
                onClick={() => openWhatsApp()}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-1.5 text-[11px] font-semibold text-emerald-600 transition hover:bg-emerald-500/20 dark:text-emerald-400"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                Open WhatsApp Web / App directly
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Row */}
      <div className="flex items-center gap-2.5">
        {/* Animated Greeting Pill */}
        <AnimatePresence>
          {showPill && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="flex items-center gap-2 rounded-full border border-border/80 bg-card/95 py-2 pl-3.5 pr-2.5 shadow-xl shadow-emerald-500/10 backdrop-blur-md"
            >
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-left"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-foreground">Chat on WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPill(false);
                }}
                className="ml-1 rounded-full p-1 text-muted-foreground/60 transition hover:bg-foreground/5 hover:text-foreground"
                aria-label="Dismiss greeting"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Main Floating Action Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setShowPill(false);
          }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#20ba59] to-[#25D366] text-white shadow-xl shadow-[#25D366]/35 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#25D366]/50 active:scale-95 border border-white/25"
          title="Chat with Aditya on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          {/* Beacon ping */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#20ba59] bg-emerald-400" />
          </span>

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6 stroke-[2.5]" />
              </motion.div>
            ) : (
              <motion.div
                key="wa"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <WhatsAppIcon className="h-7 w-7 text-white drop-shadow-sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
