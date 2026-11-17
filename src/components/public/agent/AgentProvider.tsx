"use client";

/**
 * One AG-UI agent conversation shared by the whole public site: the inline
 * chat on the homepage, the full-screen chat, the header "Ask AI" button and
 * the floating bot button all read and drive the same thread.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePortfolioAgent } from "./usePortfolioAgent";
import AgentFullscreen from "./AgentFullscreen";

type AgentApi = ReturnType<typeof usePortfolioAgent>;
type AgentContextValue = AgentApi & {
  fullscreen: boolean;
  /** Open the full-screen chat, optionally sending a first message. */
  openAgent: (prompt?: string) => void;
  closeAgent: () => void;
};

const AgentContext = createContext<AgentContextValue | null>(null);

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used inside <AgentProvider>");
  return ctx;
}

export function AgentProvider({ children }: { children: ReactNode }) {
  const agent = usePortfolioAgent();
  const [fullscreen, setFullscreen] = useState(false);
  const { send } = agent;

  const openAgent = useCallback(
    (prompt?: string) => {
      setFullscreen(true);
      if (prompt) void send(prompt);
    },
    [send]
  );
  const closeAgent = useCallback(() => setFullscreen(false), []);

  // Deep links: /?chat=open (also where the old /agent page redirects).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("chat") === "open") {
      setFullscreen(true);
      params.delete("chat");
      const qs = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
    }
  }, []);

  const value = useMemo(
    () => ({ ...agent, fullscreen, openAgent, closeAgent }),
    [agent, fullscreen, openAgent, closeAgent]
  );

  return (
    <AgentContext.Provider value={value}>
      {children}
      <AgentFullscreen />
    </AgentContext.Provider>
  );
}
