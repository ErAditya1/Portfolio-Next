"use client";

/**
 * Generative UI for AG-UI tool calls: each tool call the agent makes is
 * rendered as a rich card instead of raw JSON.
 */
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  Loader2,
  Mail,
  MapPin,
  Send,
  User,
  XCircle,
} from "lucide-react";
import type { Interrupt } from "@ag-ui/client";

type Project = {
  title: string;
  slug: string;
  description: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  status?: string;
  featured?: boolean;
  url?: string;
};
type Experience = {
  _id?: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  type?: string;
  isCurrent?: boolean;
  skills?: string[];
};
type Blog = { title: string; slug: string; excerpt: string; tags?: string[]; readTime?: number; url?: string };
type Profile = {
  ownerName?: string;
  ownerTitle?: string;
  ownerBio?: string;
  ownerLocation?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  skills?: { name: string; level?: number; category?: string }[];
  currentlyLearning?: string[];
};

const TOOL_LABELS: Record<string, { running: string; icon: typeof User }> = {
  get_profile: { running: "Reading Aditya's profile", icon: User },
  list_projects: { running: "Fetching projects", icon: Briefcase },
  get_project: { running: "Opening project", icon: Briefcase },
  list_experience: { running: "Loading experience", icon: Briefcase },
  search_blogs: { running: "Searching blog posts", icon: BookOpen },
  request_contact: { running: "Preparing your message", icon: Mail },
};

function parse<T>(raw: string | undefined): T | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    // Card tools wrap their payload as { displayedToVisitor, data }.
    return (v && typeof v === "object" && "displayedToVisitor" in v ? v.data : v) as T;
  } catch {
    return null;
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="w-full rounded-2xl border border-border bg-card/70 p-3 shadow-sm">{children}</div>;
}

export function ToolRunning({ name }: { name: string }) {
  const meta = TOOL_LABELS[name] ?? { running: `Running ${name}`, icon: Loader2 };
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      {meta.running}…
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background/60 transition-all hover:border-indigo-500/40 hover:shadow-md">
      {p.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.coverImage} alt={p.title} loading="lazy" className="h-28 w-full object-cover" />
      ) : (
        <div className="h-28 w-full bg-gradient-to-br from-indigo-500/20 to-violet-500/10" />
      )}
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold leading-snug text-foreground">{p.title}</h4>
          {p.featured && (
            <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              Featured
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
        {!!p.techStack?.length && (
          <div className="mt-2 flex flex-wrap gap-1">
            {p.techStack.slice(0, 5).map((t) => (
              <span key={t} className="rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs font-semibold">
          <Link href={`/projects/${p.slug}`} className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400">
            Details <ArrowUpRight className="h-3 w-3" />
          </Link>
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              Live <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <Github className="h-3 w-3" /> Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ p }: { p: Profile }) {
  const top = (p.skills ?? []).slice().sort((a, b) => (b.level ?? 0) - (a.level ?? 0)).slice(0, 10);
  return (
    <Shell>
      <div className="flex items-center gap-3">
        {p.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatarUrl} alt={p.ownerName ?? "Avatar"} className="h-12 w-12 rounded-xl object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 font-black text-indigo-600 dark:text-indigo-400">AK</div>
        )}
        <div className="min-w-0">
          <div className="font-bold text-foreground">{p.ownerName ?? "Aditya Kumar"}</div>
          <div className="text-xs text-muted-foreground">{p.ownerTitle}</div>
          {p.ownerLocation && (
            <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" /> {p.ownerLocation}
            </div>
          )}
        </div>
      </div>
      {!!top.length && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {top.map((s) => (
            <span key={s.name} className="rounded-lg bg-indigo-500/10 px-2 py-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
              {s.name}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
        {p.resumeUrl && (
          <a href={p.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
            Resume ↗
          </a>
        )}
        {p.githubUrl && (
          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            GitHub ↗
          </a>
        )}
        {p.linkedinUrl && (
          <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            LinkedIn ↗
          </a>
        )}
      </div>
    </Shell>
  );
}

function ExperienceCard({ items }: { items: Experience[] }) {
  return (
    <Shell>
      <ol className="relative space-y-3 border-l border-border pl-4">
        {items.slice(0, 6).map((e, i) => (
          <li key={e._id ?? i} className="relative">
            <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${e.isCurrent ? "bg-emerald-500" : "bg-indigo-500"}`} />
            <div className="text-sm font-bold text-foreground">
              {e.role} <span className="font-medium text-muted-foreground">· {e.company}</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {e.period}
              {e.location ? ` · ${e.location}` : ""}
              {e.isCurrent ? " · Current" : ""}
            </div>
          </li>
        ))}
      </ol>
    </Shell>
  );
}

function BlogsCard({ items }: { items: Blog[] }) {
  if (!items.length) return null;
  return (
    <Shell>
      <ul className="divide-y divide-border">
        {items.map((b) => (
          <li key={b.slug}>
            <Link href={`/blog/${b.slug}`} className="group flex items-start gap-3 py-2">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{b.title}</div>
                <div className="line-clamp-1 text-xs text-muted-foreground">{b.excerpt}</div>
              </div>
              {b.readTime ? (
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {b.readTime}m
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

type ContactArgs = { name?: string; email?: string; subject?: string; message?: string };

function ContactApproval({
  args,
  interrupt,
  result,
  busy,
  onRespond,
}: {
  args: ContactArgs;
  interrupt?: Interrupt;
  result: { status?: string } | null;
  busy: boolean;
  onRespond?: (interruptId: string, status: "resolved" | "cancelled", payload?: unknown) => void;
}) {
  const [form, setForm] = useState({
    name: args.name ?? "",
    email: args.email ?? "",
    subject: args.subject ?? "",
    message: args.message ?? "",
  });
  const [touched, setTouched] = useState(false);

  if (result?.status === "sent") {
    return (
      <Shell>
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> Message sent to Aditya. He&apos;ll reply by email.
        </div>
      </Shell>
    );
  }
  if (!interrupt) {
    if (!result) return null;
    return (
      <Shell>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <XCircle className="h-4 w-4" /> Message not sent.
        </div>
      </Shell>
    );
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const valid = form.name.trim().length >= 2 && emailOk && form.message.trim().length >= 10;
  const field =
    "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 shadow-lg shadow-indigo-500/5">
      <div className="flex items-center gap-2 border-b border-indigo-500/20 px-4 py-3">
        <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span className="text-sm font-bold text-foreground">Review before sending</span>
        <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Needs approval
        </span>
      </div>
      <form
        className="space-y-2.5 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (valid) onRespond?.(interrupt.id, "resolved", { ...form, subject: form.subject || undefined });
        }}
      >
        <div className="grid gap-2.5 sm:grid-cols-2">
          <input className={field} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-label="Your name" />
          <input className={field} placeholder="you@email.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-label="Your email" />
        </div>
        <input className={field} placeholder="Subject (optional)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} aria-label="Subject" />
        <textarea className={`${field} min-h-24 resize-y`} placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-label="Message" />
        {touched && !valid && (
          <p className="text-xs font-medium text-red-500">Please add your name, a valid email and a message (10+ characters).</p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Approve &amp; send
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onRespond?.(interrupt.id, "cancelled")}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/** Render one tool call: a loading pill while running, then a rich card. */
export function ToolCallView({
  name,
  argsJson,
  resultJson,
  interrupt,
  busy,
  onRespond,
}: {
  name: string;
  argsJson: string;
  resultJson?: string;
  interrupt?: Interrupt;
  busy: boolean;
  onRespond?: (interruptId: string, status: "resolved" | "cancelled", payload?: unknown) => void;
}) {
  if (name === "request_contact") {
    return (
      <ContactApproval
        args={parse<ContactArgs>(argsJson) ?? {}}
        interrupt={interrupt}
        result={parse<{ status?: string }>(resultJson)}
        busy={busy}
        onRespond={onRespond}
      />
    );
  }

  if (resultJson === undefined) return busy ? <ToolRunning name={name} /> : null;

  switch (name) {
    case "list_projects": {
      const items = parse<Project[]>(resultJson) ?? [];
      if (!items.length) return null;
      return (
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {items.slice(0, 6).map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      );
    }
    case "get_project": {
      const p = parse<Project>(resultJson);
      return p?.slug ? <div className="w-full sm:max-w-sm"><ProjectCard p={p} /></div> : null;
    }
    case "get_profile": {
      const p = parse<Profile>(resultJson);
      return p ? <ProfileCard p={p} /> : null;
    }
    case "list_experience": {
      const items = parse<Experience[]>(resultJson) ?? [];
      return items.length ? <ExperienceCard items={items} /> : null;
    }
    case "search_blogs": {
      const items = parse<Blog[]>(resultJson) ?? [];
      return <BlogsCard items={items} />;
    }
    default:
      return null;
  }
}
