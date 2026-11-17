"use client";

/** The conversation view (messages, tool activity, cards) and the composer. */
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, Brain, Briefcase, ChevronDown, FolderGit2, Mail, Sparkles, User } from "lucide-react";
import type { AssistantMessage, Interrupt, Message } from "@ag-ui/client";
import AI_Prompt, { type PromptCommand } from "@/components/kokonutui/ai-prompt";
import AITextLoading from "@/components/kokonutui/ai-text-loading";
import AIToolCalls, { type ToolCallItem } from "@/components/kokonutui/ai-tool-calls";
import { ToolCallView } from "./ToolCards";
import { useAgent } from "./AgentProvider";

export const SUGGESTIONS = [
  "Show me Aditya's best Next.js projects",
  "What's his work experience?",
  "Which skills is he strongest in?",
  "I want to hire Aditya for a website",
];

const COMMAND_PROMPTS: Record<string, string> = {
  projects: "Show me Aditya's best projects",
  experience: "Walk me through Aditya's work experience",
  skills: "What are Aditya's strongest skills?",
  blogs: "What has Aditya written about recently?",
  hire: "I want to hire Aditya",
};

const COMMANDS: PromptCommand[] = [
  { id: "projects", label: "Projects", description: "His best work", icon: <FolderGit2 className="size-4" /> },
  { id: "experience", label: "Experience", description: "Career timeline", icon: <Briefcase className="size-4" /> },
  { id: "skills", label: "Skills", description: "Strongest technologies", icon: <User className="size-4" /> },
  { id: "blogs", label: "Blogs", description: "Recent writing", icon: <BookOpen className="size-4" /> },
  { id: "hire", label: "Hire Aditya", description: "Send him a message", icon: <Mail className="size-4" /> },
];

const LOADING_TEXTS = ["Thinking…", "Checking Aditya's portfolio…", "Putting it together…"];

const TOOL_META: Record<string, { running: string; done: string }> = {
  get_profile: { running: "Reading profile", done: "Read profile" },
  list_projects: { running: "Fetching projects", done: "Fetched projects" },
  get_project: { running: "Opening project", done: "Opened project" },
  list_experience: { running: "Loading experience", done: "Loaded experience" },
  search_blogs: { running: "Searching blogs", done: "Searched blogs" },
  request_contact: { running: "Drafting your message", done: "Drafted message" },
};

function textOf(content: Message["content"]): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((p) => ("text" in p ? p.text : "")).join("");
  return "";
}

function unwrap(raw?: string): unknown {
  if (!raw) return undefined;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" && "displayedToVisitor" in v ? v.data : v;
  } catch {
    return undefined;
  }
}

function toToolItem(
  tc: NonNullable<AssistantMessage["toolCalls"]>[number],
  result: string | undefined,
  interrupt: Interrupt | undefined,
  running: boolean
): ToolCallItem {
  const meta = TOOL_META[tc.function.name] ?? { running: tc.function.name, done: tc.function.name };
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(tc.function.arguments || "{}");
  } catch {}
  const data = unwrap(result);
  const detail = [args.tech, args.category, args.query, args.tag, args.slug, args.type]
    .filter((v) => typeof v === "string" && v)
    .join(" · ");

  let state: ToolCallItem["state"] = "output-available";
  let summary: string | undefined = Array.isArray(data) ? `${data.length} found` : result ? "Done" : undefined;
  if (tc.function.name === "request_contact") {
    const status = (data as { status?: string } | undefined)?.status;
    if (interrupt) {
      state = "approval-requested";
      summary = "Waiting for your approval";
    } else if (status === "sent") summary = "Sent";
    else if (result || !running) {
      state = "output-denied";
      summary = "Not sent";
    } else state = "input-available";
  } else if (!result) {
    state = running ? "input-available" : "output-error";
    summary = running ? undefined : "Stopped";
  }
  return { id: tc.id, tool: tc.function.name, running: meta.running, done: meta.done, detail: detail || undefined, result: summary, state };
}

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: (p) => <p className="mb-3 last:mb-0 leading-7" {...p} />,
        a: ({ href, ...p }) => (
          <a href={href} target={href?.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer" className="font-semibold text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400" {...p} />
        ),
        ul: (p) => <ul className="mb-3 list-disc space-y-1 pl-5" {...p} />,
        ol: (p) => <ol className="mb-3 list-decimal space-y-1 pl-5" {...p} />,
        strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
        code: (p) => <code className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.85em]" {...p} />,
        h3: (p) => <h3 className="mb-1 mt-4 font-bold text-foreground" {...p} />,
        table: (p) => (
          <div className="my-3 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs" {...p} />
          </div>
        ),
        th: (p) => <th className="border-b border-border bg-foreground/5 px-3 py-2 font-bold" {...p} />,
        td: (p) => <td className="border-b border-border px-3 py-2 align-top" {...p} />,
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
        {live ? "Thinking" : "Thought process"}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="mt-1 whitespace-pre-wrap border-l-2 border-violet-500/30 pl-3 italic leading-relaxed text-muted-foreground">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AgentEmptyState({ compact = false }: { compact?: boolean }) {
  const { send } = useAgent();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col items-center justify-center px-2 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className={`${compact ? "text-lg" : "text-2xl md:text-3xl"} font-black text-foreground`}>What would you like to know?</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Ask about Aditya&apos;s projects, skills, experience or blogs. I answer from his live portfolio data. Type <kbd className="rounded border border-border px-1 font-mono text-[11px]">/</kbd> for shortcuts.
      </p>
      <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => void send(s)}
            className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-left text-sm font-medium text-foreground/80 transition hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/** Scrollable conversation. */
export function AgentMessages({ className = "", contentClassName = "" }: { className?: string; contentClassName?: string }) {
  const { ready, messages, interrupts, running, error, respond } = useAgent();
  const scrollRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of messages) if (m.role === "tool") map.set(m.toolCallId, textOf(m.content));
    return map;
  }, [messages]);
  const interruptByToolCall = useMemo(() => {
    const map = new Map<string, Interrupt>();
    for (const i of interrupts) if (i.toolCallId) map.set(i.toolCallId, i);
    return map;
  }, [interrupts]);

  const visible = messages.filter((m) => m.role === "user" || m.role === "assistant" || m.role === "reasoning");
  const last = visible[visible.length - 1];
  const waiting = running && (!last || last.role === "user");

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, running, interrupts]);

  return (
    <div ref={scrollRef} className={`overflow-y-auto overscroll-contain ${className}`} aria-live="polite">
      <div className={`mx-auto flex min-h-full flex-col gap-6 ${contentClassName}`}>
        {ready && visible.length === 0 && <AgentEmptyState />}

        {visible.map((m, idx) => {
          if (m.role === "user") {
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-lg bg-indigo-600 px-4 py-2.5 text-[15px] text-white shadow-md shadow-indigo-500/20">
                  {textOf(m.content)}
                </div>
              </motion.div>
            );
          }
          if (m.role === "reasoning") {
            return <Thinking key={m.id} text={textOf(m.content)} live={running && idx === visible.length - 1} />;
          }
          const a = m as AssistantMessage;
          const calls = a.toolCalls ?? [];
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-3">
              {calls.length > 0 && (
                <AIToolCalls
                  className="max-w-full"
                  calls={calls.map((tc) => toToolItem(tc, results.get(tc.id), interruptByToolCall.get(tc.id), running))}
                />
              )}
              {calls.map((tc) => (
                <ToolCallView
                  key={tc.id}
                  name={tc.function.name}
                  argsJson={tc.function.arguments}
                  resultJson={results.get(tc.id)}
                  interrupt={interruptByToolCall.get(tc.id)}
                  busy={running}
                  onRespond={respond}
                  hideRunning
                />
              ))}
              {a.content && (
                <div className="w-full text-[15px] text-foreground/90">
                  <Markdown>{a.content}</Markdown>
                </div>
              )}
            </motion.div>
          );
        })}

        {waiting && <AITextLoading texts={LOADING_TEXTS} interval={1800} className="justify-start text-sm font-semibold text-muted-foreground" />}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</div>
        )}
      </div>
    </div>
  );
}

/** Kokonut UI prompt box wired to the agent, with "/" shortcuts. */
export function AgentComposer({ className = "" }: { className?: string }) {
  const { send, stop, interrupts } = useAgent();
  return (
    <div className={className}>
      <AI_Prompt
        className="w-full max-w-none"
        headerText=""
        models={[{ name: "gpt-oss-120b", description: "OpenAI open-weight model, served by Groq" }]}
        defaultModel="gpt-oss-120b"
        placeholder={interrupts.length ? "Or type a new message (cancels the open form)…" : "Ask about projects, skills, hiring…"}
        commands={COMMANDS}
        onStop={stop}
        onSubmit={(value, _model, { command }) => {
          const base = command ? COMMAND_PROMPTS[command.id] ?? command.label : "";
          const text = base && value.trim() ? `${base}: ${value.trim()}` : base || value;
          return send(text);
        }}
      />
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        AI can make mistakes. Nothing is sent to Aditya without your approval.
      </p>
    </div>
  );
}
