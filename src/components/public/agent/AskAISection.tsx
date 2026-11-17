"use client";

/** Homepage section right under the hero: the agent chat inline, with a full-screen button. */
import { Brain, Hand, LayoutGrid, Maximize2, RotateCcw, Sparkles } from "lucide-react";
import { useAgent } from "./AgentProvider";
import { AgentComposer, AgentMessages } from "./AgentThread";

const POINTS = [
  { icon: LayoutGrid, text: "Answers with real project cards & timelines" },
  { icon: Brain, text: "See its reasoning as it works" },
  { icon: Hand, text: "Drafts a message to me. You approve before it's sent" },
];

export function AskAISection() {
  const { openAgent, reset, messages, running } = useAgent();

  return (
    <section id="ask-ai" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.35fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              AI agent · Live
            </div>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
              Skip the scrolling. <span className="text-gradient">Just ask.</span>
            </h2>
            <p className="max-w-md text-muted-foreground">
              My AI agent reads my live portfolio and answers any question about my work, skills or availability.
            </p>
            <ul className="space-y-3">
              {POINTS.map((p) => (
                <li key={p.text} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
                    <p.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  {p.text}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => openAgent()}
              className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:opacity-90"
            >
              <Maximize2 className="h-4 w-4" /> Open full-screen chat
            </button>
          </div>

          {/* Inline chat card */}
          <div className="flex h-[620px] max-h-[85vh] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-indigo-500/5">
            <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
                <Sparkles className="h-4.5 w-4.5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-foreground">Aditya&apos;s AI Agent</div>
                <div className="truncate text-[11px] text-muted-foreground">{running ? "Working…" : "AG-UI · gpt-oss-120b"}</div>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  title="New chat"
                  aria-label="New chat"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => openAgent()}
                title="Full screen"
                aria-label="Open full screen"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
            <AgentMessages className="flex-1" contentClassName="px-4 py-5 sm:px-5" />
            <div className="border-t border-border p-3">
              <AgentComposer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
