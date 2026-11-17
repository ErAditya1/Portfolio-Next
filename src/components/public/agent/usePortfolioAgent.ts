"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HttpAgent, type Interrupt, type Message, type ResumeEntry } from "@ag-ui/client";

const STORAGE_KEY = "portfolio_agui_thread_v1";
const MAX_STORED = 60;

type Stored = { threadId: string; messages: Message[]; interrupts: Interrupt[] };

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function load(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function save(s: Stored) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...s, messages: s.messages.filter((m) => m.role !== "reasoning").slice(-MAX_STORED) })
    );
  } catch {}
}

function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e ?? "");
  if (/429|too many/i.test(msg)) return "You're sending messages too fast. Please wait a few minutes.";
  if (/503|not configured/i.test(msg)) return "The AI agent isn't configured right now.";
  if (/abort/i.test(msg)) return "";
  return "Couldn't reach the AI agent. Please try again.";
}

/**
 * React binding for the AG-UI HttpAgent that talks to /api/agent.
 * Exposes messages, open interrupts (human-in-the-loop), run state and actions.
 */
export function usePortfolioAgent() {
  const agentRef = useRef<HttpAgent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [interrupts, setInterrupts] = useState<Interrupt[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const persist = useCallback(() => {
    const a = agentRef.current;
    if (a) save({ threadId: a.threadId, messages: a.messages, interrupts: a.pendingInterrupts });
  }, []);

  useEffect(() => {
    const stored = load();
    const agent = new HttpAgent({
      url: "/api/agent",
      threadId: stored?.threadId ?? uid(),
      initialMessages: stored?.messages ?? [],
    });
    if (stored?.interrupts?.length) agent.pendingInterrupts = stored.interrupts;
    agentRef.current = agent;
    setMessages([...agent.messages]);
    setInterrupts([...agent.pendingInterrupts]);
    setReady(true);

    const sub = agent.subscribe({
      onMessagesChanged: ({ messages }) => setMessages([...messages]),
    });
    return () => {
      sub.unsubscribe();
      agent.abortRun();
    };
  }, []);

  const run = useCallback(
    async (resume?: ResumeEntry[]) => {
      const agent = agentRef.current;
      if (!agent || agent.isRunning) return;
      setRunning(true);
      setError(null);
      try {
        await agent.runAgent(resume?.length ? { resume } : {}, {
          onRunErrorEvent: ({ event }) => setError(event.message),
        });
      } catch (e) {
        const msg = friendlyError(e);
        if (msg) setError(msg);
      } finally {
        setRunning(false);
        setMessages([...agent.messages]);
        setInterrupts([...agent.pendingInterrupts]);
        persist();
      }
    },
    [persist]
  );

  /** Send a user message. Any open approval forms are cancelled (the protocol requires answering them). */
  const send = useCallback(
    (text: string) => {
      const agent = agentRef.current;
      const content = text.trim();
      if (!agent || !content || agent.isRunning) return;
      agent.addMessage({ id: uid(), role: "user", content });
      setMessages([...agent.messages]);
      const resume: ResumeEntry[] = agent.pendingInterrupts.map((i) => ({ interruptId: i.id, status: "cancelled" }));
      void run(resume);
    },
    [run]
  );

  /** Answer one interrupt (approve with payload, or cancel). Other open interrupts are cancelled. */
  const respond = useCallback(
    (interruptId: string, status: "resolved" | "cancelled", payload?: unknown) => {
      const agent = agentRef.current;
      if (!agent || agent.isRunning) return;
      const resume: ResumeEntry[] = agent.pendingInterrupts.map((i) =>
        i.id === interruptId ? { interruptId: i.id, status, payload } : { interruptId: i.id, status: "cancelled" }
      );
      void run(resume);
    },
    [run]
  );

  const stop = useCallback(() => agentRef.current?.abortRun(), []);

  const reset = useCallback(() => {
    const agent = agentRef.current;
    if (!agent) return;
    agent.abortRun();
    agent.setMessages([]);
    agent.pendingInterrupts = [];
    agent.threadId = uid();
    setMessages([]);
    setInterrupts([]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { ready, messages, interrupts, running, error, send, respond, stop, reset };
}
