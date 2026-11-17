"use client";

/** ChatGPT-style full-screen chat, opened from anywhere on the public site. */
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minimize2, Plug, RotateCcw, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useAgent } from "./AgentProvider";
import { AgentComposer, AgentMessages } from "./AgentThread";

export default function AgentFullscreen() {
  const { fullscreen, closeAgent, reset, messages, running } = useAgent();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock page scroll, close on Escape, and move focus into the dialog.
  useEffect(() => {
    if (!fullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAgent();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus(), 50);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [fullscreen, closeAgent]);

  return (
    <AnimatePresence>
      {fullscreen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Aditya's AI agent"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex flex-col bg-background"
        >
          {/* Top bar */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <Sparkles className="h-4.5 w-4.5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-foreground">Aditya&apos;s AI Agent</div>
              <div className="truncate text-[11px] text-muted-foreground">{running ? "Working…" : "AG-UI · live portfolio data"}</div>
            </div>
            <Link
              href="/mcp"
              onClick={closeAgent}
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground sm:inline-flex"
            >
              <Plug className="h-3.5 w-3.5" /> Use in Claude / Cursor
            </Link>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> <span className="hidden sm:inline">New chat</span>
              </button>
            )}
            <button
              type="button"
              onClick={closeAgent}
              aria-label="Exit full screen"
              title="Exit full screen (Esc)"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
            >
              <span className="hidden sm:block"><Minimize2 className="h-4 w-4" /></span>
              <span className="sm:hidden"><X className="h-5 w-5" /></span>
            </button>
          </div>

          {/* Conversation, centred like ChatGPT */}
          <AgentMessages className="flex-1" contentClassName="w-full max-w-3xl px-4 py-8 sm:px-6" />

          {/* Composer */}
          <div className="border-t border-border/60 bg-background/80 px-4 pb-4 pt-3 backdrop-blur sm:px-6">
            <AgentComposer className="mx-auto w-full max-w-3xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
