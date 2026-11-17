"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUp, Brain, ChevronDown, RotateCcw, Sparkles, Square } from "lucide-react";
import type { AssistantMessage, Message } from "@ag-ui/client";
import { usePortfolioAgent } from "./usePortfolioAgent";
import { ToolCallView } from "./ToolCards";

const SUGGESTIONS = [
  "Show me Aditya's best Next.js projects",
  "What's his work experience?",
  "Which skills is he strongest in?",
  "I want to hire Aditya for a website",
];

function textOf(content: Message["content"]): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((p) => ("text" in p ? p.text : "")).join("");
  return "";
}

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: (p) => <p className="mb-2 last:mb-0 leading-relaxed" {...p} />,
        a: ({ href, ...p }) => (
          <a href={href} target={href?.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer" className="font-semibold text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400" {...p} />
        ),
        ul: (p) => <ul className="mb-2 list-disc space-y-1 pl-5" {...p} />,
        ol: (p) => <ol className="mb-2 list-decimal space-y-1 pl-5" {...p} />,
        strong: (p) => <strong className="font-bold text-foreground" {...p} />,
        code: (p) => <code className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.85em]" {...p} />,
        h3: (p) => <h3 className="mb-1 mt-3 font-bold text-foreground" {...p} />,
        table: (p) => (
          <div className="my-2 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs" {...p} />
          </div>
        ),
        th: (p) => <th className="border-b border-border bg-foreground/5 px-3 py-2 font-bold" {...p} />,
        td: (p) => <td className="border-b border-border px-3 py-2 align-top last:border-0" {...p} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

function Thinking({ text, live }: { text: string; live: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-semibold text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
      >
        <Brain className={`h-3.5 w-3.5 ${live ? "animate-pulse text-violet-500" : ""}`} />
        {live ? "Thinking…" : "Thought process"}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-1 whitespace-pre-wrap border-l-2 border-violet-500/30 pl-3 italic leading-relaxed text-muted-foreground">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-2" aria-label="Agent is working">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-indigo-500/70"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function AgentChat({ className = "" }: { className?: string }) {
  const { ready, messages, interrupts, running, error, send, respond, stop, reset } = usePortfolioAgent();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // tool results keyed by toolCallId
  const results = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of messages) if (m.role === "tool") map.set(m.toolCallId, textOf(m.content));
    return map;
  }, [messages]);

  const interruptByToolCall = useMemo(() => {
    const map = new Map<string, (typeof interrupts)[number]>();
    for (const i of interrupts) if (i.toolCallId) map.set(i.toolCallId, i);
    return map;
  }, [interrupts]);

  const visible = messages.filter((m) => m.role === "user" || m.role === "assistant" || m.role === "reasoning");
  const last = visible[visible.length - 1];
  const showTyping = running && (!last || last.role === "user");

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, running, interrupts]);

  const submit = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || running) return;
    send(value);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className={`flex h-[640px] max-h-[80vh] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-indigo-500/5 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
          <Sparkles className="h-5 w-5" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-black text-foreground">Aditya&apos;s AI Agent</div>
          <div className="truncate text-[11px] font-medium text-muted-foreground">
            {running ? "Working…" : "AG-UI · gpt-oss-120b on Groq"}
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            title="New chat"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> New chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5" aria-live="polite">
        {ready && visible.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Sparkles className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-black text-foreground">Ask me anything about Aditya</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              I can pull up his projects, experience and blogs live, and help you get in touch.
            </p>
            <div className="mt-6 grid w-full max-w-md gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-2xl border border-border bg-background/60 px-3 py-2.5 text-left text-xs font-medium text-foreground/80 transition hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {visible.map((m, idx) => {
          if (m.role === "user") {
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-sm text-white shadow-md shadow-indigo-500/20">
                  {textOf(m.content)}
                </div>
              </motion.div>
            );
          }
          if (m.role === "reasoning") {
            const isLive = running && idx === visible.length - 1;
            return <Thinking key={m.id} text={textOf(m.content)} live={isLive} />;
          }
          const a = m as AssistantMessage;
          const text = a.content ?? "";
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-3">
              {(a.toolCalls ?? []).map((tc) => (
                <ToolCallView
                  key={tc.id}
                  name={tc.function.name}
                  argsJson={tc.function.arguments}
                  resultJson={results.get(tc.id)}
                  interrupt={interruptByToolCall.get(tc.id)}
                  busy={running}
                  onRespond={respond}
                />
              ))}
              {text && (
                <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-foreground/[0.04] px-4 py-3 text-sm text-foreground/90">
                  <Markdown>{text}</Markdown>
                </div>
              )}
            </motion.div>
          );
        })}

        {showTyping && <TypingDots />}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="border-t border-border p-3 sm:p-4"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={2000}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={interrupts.length ? "Or type a new message (cancels the open form)…" : "Ask about projects, skills, hiring…"}
            aria-label="Message the AI agent"
            className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {running ? (
            <button type="button" onClick={stop} aria-label="Stop" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/10 text-foreground transition hover:bg-foreground/15">
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-500 disabled:opacity-40 disabled:shadow-none"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          AI can make mistakes. Nothing is sent to Aditya without your approval.
        </p>
      </form>
    </div>
  );
}
