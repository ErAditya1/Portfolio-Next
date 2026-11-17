"use client";

/**
 * Generative UI for AG-UI tool calls: each tool the agent calls is rendered as
 * a rich, interactive card instead of raw JSON. `onAsk` lets a card send a
 * follow-up question into the conversation (e.g. "Tell me more about X").
 */
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Images,
  Layers,
  Loader2,
  Mail,
  MapPin,
  MessageCircleQuestion,
  Rocket,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { Interrupt } from "@ag-ui/client";
import SmoothTab from "@/components/kokonutui/smooth-tab";
import LightboxGrid from "@/components/kokonutui/lightbox-grid";

// ─── Types ───────────────────────────────────────────────────────────────────

type Project = {
  title: string;
  slug: string;
  description: string;
  content?: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  images?: string[];
  status?: string;
  category?: string;
  featured?: boolean;
};
type Experience = {
  _id?: string;
  company: string;
  role: string;
  period: string;
  description?: string;
  points?: string[];
  location?: string;
  type?: string;
  isCurrent?: boolean;
  skills?: string[];
};
type Blog = { title: string; slug: string; excerpt: string; coverImage?: string; tags?: string[]; readTime?: number; createdAt?: string };
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
type Ask = (question: string) => void;

const TOOL_LABELS: Record<string, string> = {
  get_profile: "Reading Aditya's profile",
  list_projects: "Fetching projects",
  get_project: "Opening project",
  list_experience: "Loading experience",
  search_blogs: "Searching blog posts",
  get_blog: "Reading blog post",
  request_contact: "Preparing your message",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function parseToolResult<T>(raw: string | undefined): T | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    // Card tools wrap their payload as { displayedToVisitor, data }.
    return (v && typeof v === "object" && "displayedToVisitor" in v ? v.data : v) as T;
  } catch {
    return null;
  }
}

const STATUS_STYLE: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  building: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "in-progress": "bg-sky-500/15 text-sky-600 dark:text-sky-400",
};

function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  const cls = `inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
    active
      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
      : "bg-foreground/[0.06] text-muted-foreground" + (onClick ? " hover:bg-foreground/10 hover:text-foreground" : "")
  }`;
  return onClick ? (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  ) : (
    <span className={cls}>{children}</span>
  );
}

function AskButton({ onAsk, question, label = "Ask about this" }: { onAsk?: Ask; question: string; label?: string }) {
  if (!onAsk) return null;
  return (
    <button
      type="button"
      onClick={() => onAsk(question)}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-500/10 dark:text-indigo-400"
    >
      <MessageCircleQuestion className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function Cover({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${className}`} />
  ) : (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/25 via-violet-500/15 to-transparent ${className}`}>
      <Code2 className="h-8 w-8 text-indigo-500/60" />
    </div>
  );
}

function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
      <Link href={`/projects/${p.slug}`} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-white transition hover:bg-indigo-500">
        Case study <ArrowUpRight className="h-3 w-3" />
      </Link>
      {p.liveUrl && (
        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-foreground/80 transition hover:border-indigo-500/40 hover:text-foreground">
          <Rocket className="h-3 w-3" /> Live
        </a>
      )}
      {p.githubUrl && (
        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-foreground/80 transition hover:border-indigo-500/40 hover:text-foreground">
          <Github className="h-3 w-3" /> Code
        </a>
      )}
    </div>
  );
}

// ─── Projects: featured card + filterable rail ───────────────────────────────

function ProjectsShowcase({ items, onAsk }: { items: Project[]; onAsk?: Ask }) {
  const [tech, setTech] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const topTech = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of items) for (const t of p.techStack ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([t]) => t);
  }, [items]);

  const shown = tech ? items.filter((p) => p.techStack?.includes(tech)) : items;
  const [featured, ...rest] = shown;
  const scroll = (dir: number) => railRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });

  if (!items.length) return null;
  return (
    <div className="w-full space-y-3">
      {topTech.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Filter</span>
          <Chip active={!tech} onClick={() => setTech(null)}>All {items.length}</Chip>
          {topTech.map((t) => (
            <Chip key={t} active={tech === t} onClick={() => setTech(tech === t ? null : t)}>
              {t}
            </Chip>
          ))}
        </div>
      )}

      <AnimatePresence mode="popLayout" initial={false}>
        {featured && (
          <motion.div
            key={featured.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
          >
            <div className="relative h-44 overflow-hidden sm:h-full sm:min-h-52">
              <Cover src={featured.coverImage} alt={featured.title} />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                <Sparkles className="h-3 w-3 text-amber-300" /> Top pick
              </span>
            </div>
            <div className="flex flex-col gap-2.5 p-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {featured.status && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${STATUS_STYLE[featured.status] ?? "bg-foreground/10"}`}>
                    {featured.status.replace("-", " ")}
                  </span>
                )}
                {featured.category && <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[10px] font-bold capitalize text-muted-foreground">{featured.category}</span>}
              </div>
              <h4 className="text-base font-black leading-snug text-foreground">{featured.title}</h4>
              <p className="line-clamp-3 text-sm text-muted-foreground">{featured.description}</p>
              <div className="flex flex-wrap gap-1">
                {featured.techStack?.slice(0, 7).map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                <ProjectLinks p={featured} />
                <AskButton onAsk={onAsk} question={`Tell me more about the ${featured.title} project: what problem it solves and how it's built.`} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {rest.length > 0 && (
        <div className="relative">
          <div ref={railRef} className="scrollbar-slim -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2">
            {rest.map((p) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex w-60 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="h-28 overflow-hidden">
                  <Cover src={p.coverImage} alt={p.title} />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <h4 className="line-clamp-1 text-sm font-bold text-foreground">{p.title}</h4>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.techStack?.slice(0, 3).map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <Link href={`/projects/${p.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                      Case study <ArrowUpRight className="h-3 w-3" />
                    </Link>
                    <AskButton onAsk={onAsk} label="Ask" question={`Tell me more about the ${p.title} project.`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {rest.length > 2 && (
            <div className="pointer-events-none absolute -top-11 right-0 hidden gap-1 sm:flex">
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-label={d < 0 ? "Scroll left" : "Scroll right"}
                  onClick={() => scroll(d)}
                  className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground"
                >
                  {d < 0 ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {shown.length === 0 && <p className="text-sm text-muted-foreground">No projects with {tech}.</p>}
    </div>
  );
}

// ─── One project: tabs (Kokonut smooth-tab) + screenshot lightbox ────────────

function ProjectDetail({ p, onAsk }: { p: Project; onAsk?: Ask }) {
  const gallery = [p.coverImage, ...(p.images ?? [])].filter((s, i, a): s is string => !!s && a.indexOf(s) === i).slice(0, 6);
  const excerpt = (p.content ?? "").replace(/<[^>]+>/g, "").trim();

  const tabs = [
    {
      id: "overview",
      title: "Overview",
      icon: FileText,
      content: (
        <div className="space-y-2 p-1 text-sm text-foreground/85">
          <p>{p.description}</p>
          {excerpt && (
            <div className="line-clamp-[10] text-[13px] leading-relaxed text-muted-foreground [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc">
              <ReactMarkdown>{excerpt.slice(0, 1400)}</ReactMarkdown>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "stack",
      title: "Tech stack",
      icon: Layers,
      content: (
        <div className="flex flex-wrap gap-1.5 p-1">
          {(p.techStack ?? []).map((t) => (
            <span key={t} className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground/85">
              {t}
            </span>
          ))}
        </div>
      ),
    },
    ...(gallery.length > 1
      ? [
          {
            id: "gallery",
            title: "Screens",
            icon: Images,
            content: (
              <LightboxGrid
                className="p-1"
                images={gallery.map((src, i) => ({ src, alt: `${p.title} screenshot ${i + 1}`, width: 1600, height: 900 }))}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="group relative h-40 overflow-hidden sm:h-52">
        <Cover src={p.coverImage} alt={p.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <div className="mb-1 flex gap-1.5">
            {p.status && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize backdrop-blur ${STATUS_STYLE[p.status] ?? "bg-white/20 text-white"}`}>
                {p.status.replace("-", " ")}
              </span>
            )}
          </div>
          <h4 className="text-lg font-black leading-tight text-white">{p.title}</h4>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <SmoothTab className="max-w-none" items={tabs} activeColor="bg-indigo-600" activeTextColor="text-white" label={`${p.title} details`} />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <ProjectLinks p={p} />
          <AskButton onAsk={onAsk} label="Can he build this for me?" question={`Could Aditya build something like ${p.title} for me? What would it involve?`} />
        </div>
      </div>
    </div>
  );
}

// ─── Profile: identity + grouped skill bars ──────────────────────────────────

function ProfileCard({ p, onAsk }: { p: Profile; onAsk?: Ask }) {
  const groups = useMemo(() => {
    const g = new Map<string, { name: string; level: number }[]>();
    for (const s of p.skills ?? []) {
      const key = s.category || "Skills";
      g.set(key, [...(g.get(key) ?? []), { name: s.name, level: Math.max(0, Math.min(100, s.level ?? 70)) }]);
    }
    return [...g.entries()].map(([k, v]) => [k, v.sort((a, b) => b.level - a.level).slice(0, 5)] as const).slice(0, 4);
  }, [p.skills]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent p-4">
        {p.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatarUrl} alt={p.ownerName ?? "Avatar"} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500/30" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-xl font-black text-indigo-600 dark:text-indigo-400">AK</div>
        )}
        <div className="min-w-0">
          <div className="text-lg font-black text-foreground">{p.ownerName ?? "Aditya Kumar"}</div>
          <div className="text-sm text-muted-foreground">{p.ownerTitle}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            {p.ownerLocation && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {p.ownerLocation}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Open to work
            </span>
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          {groups.map(([cat, skills]) => (
            <div key={cat}>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{cat}</div>
              <ul className="space-y-2">
                {skills.map((s, i) => (
                  <li key={s.name}>
                    <div className="mb-1 flex justify-between text-xs font-semibold">
                      <span className="text-foreground/85">{s.name}</span>
                      <span className="tabular-nums text-muted-foreground">{s.level}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${s.level}%` }}
                        transition={{ duration: 0.8, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {!!p.currentlyLearning?.length && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border px-4 py-3">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Learning now</span>
          {p.currentlyLearning.slice(0, 6).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3 text-xs font-semibold">
        {p.resumeUrl && (
          <a href={p.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-white hover:bg-indigo-500">
            <FileText className="h-3.5 w-3.5" /> Resume
          </a>
        )}
        {p.githubUrl && (
          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 hover:border-indigo-500/40">
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
        )}
        {p.linkedinUrl && (
          <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 hover:border-indigo-500/40">
            <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
          </a>
        )}
        <span className="ml-auto">
          <AskButton onAsk={onAsk} label="Hire Aditya" question="I'd like to hire Aditya. Can you help me send him a message?" />
        </span>
      </div>
    </div>
  );
}

// ─── Experience: expandable timeline ─────────────────────────────────────────

function ExperienceTimeline({ items, onAsk }: { items: Experience[]; onAsk?: Ask }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-sm">
      <ol className="relative space-y-1 before:absolute before:bottom-3 before:left-[15px] before:top-3 before:w-px before:bg-border">
        {items.slice(0, 8).map((e, i) => {
          const Icon = e.type === "education" ? GraduationCap : e.type === "freelance" ? Code2 : Briefcase;
          const expanded = open === i;
          const hasMore = !!(e.description || e.points?.length || e.skills?.length);
          return (
            <li key={e._id ?? i} className="relative">
              <button
                type="button"
                onClick={() => hasMore && setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="flex w-full items-start gap-3 rounded-xl p-1.5 text-left transition hover:bg-foreground/[0.03]"
              >
                <span
                  className={`relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border ${
                    e.isCurrent ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "border-border bg-card text-indigo-600 dark:text-indigo-400"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {e.isCurrent && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500/60" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2">
                    <span className="text-sm font-bold text-foreground">{e.role}</span>
                    {e.isCurrent && <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Now</span>}
                  </span>
                  <span className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400">{e.company}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {e.period}
                    {e.location ? ` · ${e.location}` : ""}
                  </span>
                </span>
                {hasMore && <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />}
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-2 pb-2 pl-12 pr-2 text-xs text-muted-foreground">
                      {e.description && <p className="leading-relaxed">{e.description}</p>}
                      {!!e.points?.length && (
                        <ul className="list-disc space-y-1 pl-4">
                          {e.points.slice(0, 5).map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>
                      )}
                      {!!e.skills?.length && (
                        <div className="flex flex-wrap gap-1">
                          {e.skills.slice(0, 8).map((s) => (
                            <Chip key={s}>{s}</Chip>
                          ))}
                        </div>
                      )}
                      <AskButton onAsk={onAsk} question={`What did Aditya work on as ${e.role} at ${e.company}?`} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─── Blogs ───────────────────────────────────────────────────────────────────

const BLOG_GRADIENTS = ["from-indigo-500/25 to-sky-500/10", "from-violet-500/25 to-fuchsia-500/10", "from-emerald-500/25 to-teal-500/10", "from-amber-500/25 to-orange-500/10"];

function BlogsGrid({ items, onAsk }: { items: Blog[]; onAsk?: Ask }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">No matching posts.</p>;
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {items.map((b, i) => (
        <div key={b.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg hover:shadow-indigo-500/5">
          <Link href={`/blog/${b.slug}`} className="relative block h-32 w-full overflow-hidden bg-muted">
            {b.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.coverImage}
                alt={b.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${BLOG_GRADIENTS[i % BLOG_GRADIENTS.length]}`}>
                <BookOpen className="h-7 w-7 text-foreground/40" />
              </div>
            )}
          </Link>
          <div className="flex flex-1 flex-col gap-1.5 p-3">
            <Link href={`/blog/${b.slug}`} className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {b.title}
            </Link>
            <p className="line-clamp-2 text-xs text-muted-foreground">{b.excerpt}</p>
            <div className="flex flex-wrap gap-1">
              {b.tags?.slice(0, 3).map((t) => (
                <Chip key={t}>#{t}</Chip>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-muted-foreground">
              {b.readTime ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {b.readTime} min read
                </span>
              ) : (
                <span />
              )}
              <AskButton onAsk={onAsk} label="Summarize" question={`Summarize the blog post "${b.title}" (slug: ${b.slug}).`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogLink({ b }: { b: Blog }) {
  return (
    <Link href={`/blog/${b.slug}`} className="group flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:border-indigo-500/40">
      {b.coverImage ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.coverImage} alt={b.title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
          <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-foreground">{b.title}</span>
        <span className="block text-[11px] text-muted-foreground">{b.readTime ? `${b.readTime} min read · ` : ""}Open the full post</span>
      </span>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
    </Link>
  );
}

// ─── Contact approval (human-in-the-loop) ────────────────────────────────────

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
      <div className="flex w-full items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <div className="text-sm font-bold text-foreground">Message sent to Aditya</div>
          <div className="text-xs text-muted-foreground">He usually replies by email within a day.</div>
        </div>
      </div>
    );
  }
  if (!interrupt) {
    if (!result) return null;
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground">
        <XCircle className="h-4 w-4" /> Message not sent.
      </div>
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
        {touched && !valid && <p className="text-xs font-medium text-red-500">Please add your name, a valid email and a message (10+ characters).</p>}
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

// ─── Dispatcher ──────────────────────────────────────────────────────────────

export function ToolRunning({ name }: { name: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      {TOOL_LABELS[name] ?? `Running ${name}`}…
    </div>
  );
}

/** Render one tool call as its card (or a loading pill while it runs). */
export function ToolCallView({
  name,
  argsJson,
  resultJson,
  interrupt,
  busy,
  onRespond,
  onAsk,
  hideRunning = false,
}: {
  name: string;
  argsJson: string;
  resultJson?: string;
  interrupt?: Interrupt;
  busy: boolean;
  onRespond?: (interruptId: string, status: "resolved" | "cancelled", payload?: unknown) => void;
  /** Send a follow-up question into the chat. */
  onAsk?: Ask;
  /** Skip the loading pill (when a tool-activity list already shows progress). */
  hideRunning?: boolean;
}) {
  if (name === "request_contact") {
    return (
      <ContactApproval
        args={parseToolResult<ContactArgs>(argsJson) ?? {}}
        interrupt={interrupt}
        result={parseToolResult<{ status?: string }>(resultJson)}
        busy={busy}
        onRespond={onRespond}
      />
    );
  }

  if (resultJson === undefined) return busy && !hideRunning ? <ToolRunning name={name} /> : null;

  switch (name) {
    case "list_projects": {
      const items = parseToolResult<Project[]>(resultJson) ?? [];
      return <ProjectsShowcase items={items} onAsk={onAsk} />;
    }
    case "get_project": {
      const p = parseToolResult<Project>(resultJson);
      return p?.slug ? <ProjectDetail p={p} onAsk={onAsk} /> : null;
    }
    case "get_profile": {
      const p = parseToolResult<Profile>(resultJson);
      return p ? <ProfileCard p={p} onAsk={onAsk} /> : null;
    }
    case "list_experience": {
      const items = parseToolResult<Experience[]>(resultJson) ?? [];
      return items.length ? <ExperienceTimeline items={items} onAsk={onAsk} /> : null;
    }
    case "search_blogs": {
      const items = parseToolResult<Blog[]>(resultJson) ?? [];
      return <BlogsGrid items={items} onAsk={onAsk} />;
    }
    case "get_blog": {
      const b = parseToolResult<Blog>(resultJson);
      return b?.slug ? <BlogLink b={b} /> : null;
    }
    default:
      return null;
  }
}
