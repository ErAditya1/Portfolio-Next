import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Hand, LayoutGrid, Plug, Radio, ShieldCheck } from "lucide-react";
import AgentChat from "@/components/public/agent/AgentChat";

export const metadata: Metadata = {
  title: "AI Agent",
  description:
    "Chat with Aditya Kumar's AI agent. It's built on the AG-UI protocol and pulls up his projects, experience and blogs live, then helps you get in touch.",
  alternates: { canonical: "/agent" },
};

const FEATURES = [
  { icon: Radio, title: "Streams live (AG-UI)", desc: "Every token, thought and tool call arrives as an AG-UI event over SSE." },
  { icon: LayoutGrid, title: "Generative UI", desc: "Tool results render as real project cards, timelines and blog lists, not raw text." },
  { icon: Hand, title: "Human-in-the-loop", desc: "Contact requests pause the agent with an AG-UI interrupt until you approve the form." },
  { icon: Brain, title: "Visible reasoning", desc: "Open the agent's thought process to see how it picked its answer." },
  { icon: ShieldCheck, title: "Grounded answers", desc: "Answers come from my live database through the same tools my MCP server exposes." },
  { icon: Plug, title: "Use it in your AI too", desc: "Prefer Claude or Cursor? Connect the same tools there with MCP." },
];

export default function AgentPage() {
  return (
    <main className="min-h-screen pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-stretch gap-10 py-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              AG-UI agent · Live
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground md:text-6xl">
              Talk to my <span className="text-gradient">AI agent</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              It doesn&apos;t just chat. It looks up my real projects, experience and writing, shows them as interactive
              cards, and can draft a message to me that you approve before it&apos;s sent.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/mcp"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 font-bold text-foreground transition hover:border-indigo-500/40"
              >
                <Plug className="h-4 w-4 text-indigo-500" /> Use these tools in Claude / Cursor
              </Link>
            </div>
          </div>
          <div className="w-full flex-1 lg:max-w-xl">
            <AgentChat />
          </div>
        </div>

        <section className="mt-16 border-t border-border pt-16">
          <h2 className="text-center text-3xl font-black text-foreground md:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Next.js 15 + the open AG-UI protocol + gpt-oss-120b on Groq, with tools over my MongoDB data.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="group rounded-3xl border border-border bg-card/50 p-6 transition-all hover:bg-card hover:shadow-xl hover:shadow-indigo-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 transition-transform group-hover:scale-110">
                  <f.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
