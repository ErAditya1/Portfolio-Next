"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  Check,
  Copy,
  ExternalLink,
  FolderGit2,
  Lock,
  MessageSquareText,
  MousePointerClick,
  Plug,
  Search,
  Sparkles,
  Terminal,
  User,
  Wand2,
  Zap,
} from "lucide-react";

const SERVER_NAME = "aditya-portfolio";

// ─── Copy helper ────────────────────────────────────────────────────────────

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
  };
  return { copied, copy };
}

function CopyButton({
  id,
  text,
  copied,
  onCopy,
  label = "Copy",
  className = "",
}: {
  id: string;
  text: string;
  copied: string | null;
  onCopy: (id: string, text: string) => void;
  label?: string;
  className?: string;
}) {
  const done = copied === id;
  return (
    <button
      type="button"
      onClick={() => onCopy(id, text)}
      aria-label={done ? "Copied" : label}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
        done
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
      } ${className}`}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </button>
  );
}

function CodeBlock({
  id,
  code,
  lang,
  copied,
  onCopy,
}: {
  id: string;
  code: string;
  lang: string;
  copied: string | null;
  onCopy: (id: string, text: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-slate-950 text-slate-100 shadow-inner">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">{lang}</span>
        <button
          type="button"
          onClick={() => onCopy(id, code)}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
            copied === id ? "text-emerald-400" : "text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          {copied === id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied === id ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Provider definitions ───────────────────────────────────────────────────

type Step = { text: string; code?: { lang: string; value: string } };
type Provider = {
  id: string;
  name: string;
  badge: string;
  icon: typeof Bot;
  oneClick?: { label: string; href: string };
  steps: Step[];
  tip?: string;
};

function buildProviders(endpoint: string): Provider[] {
  // btoa is global in both browsers and Node 16+, so SSR and client markup match.
  const cursorConfig = btoa(JSON.stringify({ url: endpoint }));
  const vscodeConfig = encodeURIComponent(
    JSON.stringify({ name: SERVER_NAME, type: "http", url: endpoint })
  );

  return [
    {
      id: "claude",
      name: "Claude.ai",
      badge: "Web, Desktop & Mobile",
      icon: Sparkles,
      steps: [
        { text: "Open Claude → Settings → Connectors." },
        { text: 'Click "Add custom connector".' },
        { text: `Name it "Aditya Portfolio" and paste this URL:`, code: { lang: "url", value: endpoint } },
        { text: 'Click Add. In a new chat, enable it from the "Search and tools" menu.' },
      ],
      tip: "Custom connectors added on claude.ai also show up in Claude Desktop and the mobile apps.",
    },
    {
      id: "claude-code",
      name: "Claude Code",
      badge: "CLI",
      icon: Terminal,
      steps: [
        {
          text: "Run this in your terminal:",
          code: { lang: "bash", value: `claude mcp add --transport http ${SERVER_NAME} ${endpoint}` },
        },
        { text: "Start claude and type /mcp to confirm it's connected." },
      ],
      tip: "Add --scope user to make it available in every project.",
    },
    {
      id: "chatgpt",
      name: "ChatGPT",
      badge: "Developer mode",
      icon: MessageSquareText,
      steps: [
        { text: "Open ChatGPT → Settings → Apps & Connectors → Advanced settings and turn on Developer mode." },
        { text: 'Back in Apps & Connectors, click "Create".' },
        { text: "Name it \"Aditya Portfolio\", set Authentication to \"No authentication\", and paste:", code: { lang: "url", value: endpoint } },
        { text: "In a new chat, pick Developer mode from the + menu and enable the connector." },
      ],
      tip: "Available on Plus, Pro, Business and Enterprise plans.",
    },
    {
      id: "cursor",
      name: "Cursor",
      badge: "One-click",
      icon: MousePointerClick,
      oneClick: {
        label: "Add to Cursor",
        href: `cursor://anysphere.cursor-deeplink/mcp/install?name=${SERVER_NAME}&config=${encodeURIComponent(cursorConfig)}`,
      },
      steps: [
        { text: "Click \"Add to Cursor\" above, or add this to ~/.cursor/mcp.json:", code: { lang: "json", value: JSON.stringify({ mcpServers: { [SERVER_NAME]: { url: endpoint } } }, null, 2) } },
        { text: "Open Cursor Settings → MCP and make sure the server is on (green dot)." },
      ],
    },
    {
      id: "vscode",
      name: "VS Code",
      badge: "One-click",
      icon: FolderGit2,
      oneClick: { label: "Install in VS Code", href: `vscode:mcp/install?${vscodeConfig}` },
      steps: [
        { text: "Click \"Install in VS Code\" above, or create .vscode/mcp.json:", code: { lang: "json", value: JSON.stringify({ servers: { [SERVER_NAME]: { type: "http", url: endpoint } } }, null, 2) } },
        { text: "Open Copilot Chat in Agent mode. The tools appear under the 🛠 tools picker." },
      ],
    },
    {
      id: "gemini",
      name: "Gemini CLI",
      badge: "CLI",
      icon: Terminal,
      steps: [
        { text: "Run:", code: { lang: "bash", value: `gemini mcp add --transport http ${SERVER_NAME} ${endpoint}` } },
        { text: "Start gemini and type /mcp to see the tools." },
      ],
    },
    {
      id: "codex",
      name: "Codex CLI",
      badge: "CLI",
      icon: Terminal,
      steps: [
        { text: "Run:", code: { lang: "bash", value: `codex mcp add ${SERVER_NAME} --url ${endpoint}` } },
        { text: "Start codex and type /mcp to confirm." },
      ],
    },
    {
      id: "windsurf",
      name: "Windsurf",
      badge: "Config",
      icon: Wand2,
      steps: [
        { text: "Open Cascade → MCP servers → View raw config (~/.codeium/windsurf/mcp_config.json) and add:", code: { lang: "json", value: JSON.stringify({ mcpServers: { [SERVER_NAME]: { serverUrl: endpoint } } }, null, 2) } },
        { text: "Press Refresh in the MCP panel." },
      ],
    },
    {
      id: "other",
      name: "Any other client",
      badge: "stdio bridge",
      icon: Plug,
      steps: [
        { text: "If your client supports remote (Streamable HTTP) servers, just give it the URL:", code: { lang: "url", value: endpoint } },
        { text: "For stdio-only clients (e.g. older Claude Desktop configs), bridge it with mcp-remote:", code: { lang: "json", value: JSON.stringify({ mcpServers: { [SERVER_NAME]: { command: "npx", args: ["-y", "mcp-remote", endpoint] } } }, null, 2) } },
      ],
    },
  ];
}

// ─── Tools & example prompts ────────────────────────────────────────────────

const TOOLS = [
  { name: "get_profile", icon: User, desc: "Bio, skills, contact links and resume.", prompt: "Who is Aditya Kumar? Summarise his skills and how to contact him." },
  { name: "list_projects", icon: FolderGit2, desc: "Projects filtered by tech, category or featured.", prompt: "Which of Aditya's projects use Next.js and MongoDB? Include the live links." },
  { name: "get_project", icon: Search, desc: "The full write-up for one project.", prompt: "Explain the architecture of Aditya's BrightVeil project." },
  { name: "list_experience", icon: Briefcase, desc: "Work and education timeline.", prompt: "Walk me through Aditya's work experience, most recent first." },
  { name: "search_blogs", icon: BookOpen, desc: "Search published blog posts.", prompt: "Find Aditya's blog posts about React and summarise the top one." },
  { name: "get_blog", icon: BookOpen, desc: "Read a full blog post.", prompt: "Read Aditya's latest blog post and give me 3 key takeaways." },
];

const RECRUITER_PROMPT =
  "Using the aditya-portfolio tools, evaluate Aditya Kumar as a candidate for a Senior Full-Stack (Next.js + Node) role. Check his profile, experience and his 3 strongest projects, then give me strengths, gaps and 5 interview questions.";

// ─── Page ───────────────────────────────────────────────────────────────────

export default function McpConnectClient({ endpoint }: { endpoint: string }) {
  const { copied, copy } = useCopy();
  const [active, setActive] = useState("claude");

  const providers = useMemo(() => buildProviders(endpoint), [endpoint]);
  const provider = providers.find((p) => p.id === active) ?? providers[0];

  const agentPrompt = `Add a remote MCP server to my configuration so I can use it in this tool.

Name: ${SERVER_NAME}
Transport: Streamable HTTP (no authentication)
URL: ${endpoint}

Steps:
1. Work out which AI client/editor this is and where it stores MCP server config (or use its "mcp add" CLI command if it has one).
2. Add the server without removing any servers I already have.
3. Reload MCP servers if possible, then call the get_profile tool to verify it works and show me the result.`;

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* ── Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-10 text-center"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            Model Context Protocol · Live
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground md:text-6xl">
            Ask <span className="text-gradient">your own AI</span> about me
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            My portfolio runs an MCP server. Connect it to Claude, ChatGPT, Cursor or any other MCP client, and your
            assistant can read my projects, experience and blogs live, straight from my database.
          </p>

          {/* Endpoint bar */}
          <div className="mx-auto mt-8 flex max-w-2xl flex-col items-stretch gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-indigo-500/5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2">
              <Plug className="h-5 w-5 shrink-0 text-indigo-500" />
              <code className="truncate font-mono text-sm font-semibold text-foreground">{endpoint}</code>
            </div>
            <button
              type="button"
              onClick={() => copy("endpoint", endpoint)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500"
            >
              {copied === "endpoint" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied === "endpoint" ? "Copied!" : "Copy server URL"}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /> No sign-up or API key</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-emerald-500" /> Read-only &amp; public data only</span>
            <span className="inline-flex items-center gap-1.5"><Bot className="h-3.5 w-3.5 text-indigo-500" /> 6 tools · Streamable HTTP</span>
          </div>
        </motion.section>

        {/* ── Fastest way: let your AI do it ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-8 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent p-6 md:p-10"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="lg:w-2/5">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15">
                <Wand2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black text-foreground md:text-3xl">Fastest way: let your AI set it up</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Using an agent that can edit files or run commands, like <b>Claude Code</b>, <b>Cursor</b>,{" "}
                <b>Codex</b>, <b>Gemini CLI</b>, <b>Windsurf</b> or <b>VS Code Copilot</b>? Paste this prompt and it
                will add the server and test it for you.
              </p>
              <ol className="mt-5 space-y-2 text-sm text-muted-foreground">
                {["Copy the prompt", "Paste it into your agent", "Approve the config change"].map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="min-w-0 flex-1">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Setup prompt
                  </span>
                  <CopyButton id="agent" text={agentPrompt} copied={copied} onCopy={copy} label="Copy prompt" />
                </div>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap p-4 font-mono text-[13px] leading-relaxed text-foreground/90">
                  {agentPrompt}
                </pre>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Per-provider guides ── */}
        <section className="mt-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-foreground md:text-4xl">Connect step by step</h2>
            <p className="mt-3 text-muted-foreground">Pick your AI app. Each takes under a minute.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Tabs */}
            <div
              role="tablist"
              aria-label="AI clients"
              className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {providers.map((p) => {
                const Icon = p.icon;
                const isActive = p.id === active;
                return (
                  <button
                    key={p.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(p.id)}
                    className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? "border-indigo-500/40 bg-indigo-500/10 shadow-md shadow-indigo-500/10"
                        : "border-border bg-card/50 hover:bg-card"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isActive ? "bg-indigo-600 text-white" : "bg-foreground/5 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-sm font-bold ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                        {p.name}
                      </span>
                      <span className="block text-[11px] font-medium text-muted-foreground">{p.badge}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Panel */}
            <div role="tabpanel" className="min-w-0 rounded-3xl border border-border bg-card p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-2xl font-black text-foreground">{provider.name}</h3>
                    {provider.oneClick && (
                      <a
                        href={provider.oneClick.href}
                        className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500"
                      >
                        <Zap className="h-4 w-4" />
                        {provider.oneClick.label}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    )}
                  </div>

                  <ol className="space-y-6">
                    {provider.steps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-black text-indigo-600 dark:text-indigo-400">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1 space-y-3">
                          <p className="font-medium leading-relaxed text-foreground/90">{step.text}</p>
                          {step.code && (
                            <CodeBlock
                              id={`${provider.id}-${i}`}
                              code={step.code.value}
                              lang={step.code.lang}
                              copied={copied}
                              onCopy={copy}
                            />
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>

                  {provider.tip && (
                    <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-muted-foreground">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <span>{provider.tip}</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ── Tools + prompts ── */}
        <section className="mt-24">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-foreground md:text-4xl">Then just ask</h2>
            <p className="mt-3 text-muted-foreground">
              Your AI picks the right tool on its own. Copy a prompt to try it.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col rounded-3xl border border-border bg-card/50 p-6 transition-all hover:bg-card hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 transition-transform group-hover:scale-110">
                    <t.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  <code className="font-mono text-sm font-bold text-foreground">{t.name}</code>
                </div>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-4 flex-1 rounded-2xl bg-foreground/[0.03] p-4 text-sm italic leading-relaxed text-foreground/80">
                  “{t.prompt}”
                </div>
                <CopyButton id={`tool-${t.name}`} text={t.prompt} copied={copied} onCopy={copy} label="Copy prompt" className="mt-4 self-start" />
              </motion.div>
            ))}
          </div>

          {/* Recruiter prompt */}
          <div className="mt-8 flex flex-col items-start gap-5 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-indigo-500/5 p-6 md:flex-row md:items-center md:p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15">
              <Briefcase className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-black text-foreground">Hiring? Try the recruiter prompt</h3>
              <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">“{RECRUITER_PROMPT}”</p>
            </div>
            <CopyButton id="recruiter" text={RECRUITER_PROMPT} copied={copied} onCopy={copy} label="Copy prompt" />
          </div>
        </section>

        {/* ── Troubleshooting ── */}
        <section className="mt-24 grid gap-5 md:grid-cols-3">
          {[
            { q: "Tools not showing up?", a: "Restart or reload the app after adding the server, and check that it's switched on in the MCP / connectors panel." },
            { q: "Asked to sign in?", a: "No sign-in is needed. Choose \"No authentication\" if your client asks. The server is public and read-only." },
            { q: "Client only supports stdio?", a: "Use the mcp-remote bridge from the \"Any other client\" tab. It turns this URL into a local stdio server." },
          ].map((f) => (
            <div key={f.q} className="rounded-3xl border border-border bg-card/50 p-6">
              <h3 className="font-bold text-foreground">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </section>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          New to MCP?{" "}
          <a
            href="https://modelcontextprotocol.io/docs/getting-started/intro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Read the intro <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
    </main>
  );
}
