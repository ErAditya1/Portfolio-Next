"use client";

/**
 * Career timeline.
 *
 * Desktop: a sticky summary on the left (current role, quick stats, top
 * skills) and a single-column timeline on the right with a scroll-linked
 * progress rail. Each role is a compact card; highlights and skills expand on
 * demand so the section stays short and scannable. Mobile: one column.
 */
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Briefcase, Building2, Calendar, Check, ChevronDown, Code2, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/Container";

export interface TimelineExperienceItem {
  id?: string;
  role: string;
  company: string;
  companyLogo?: string;
  period: string;
  location?: string;
  description: string;
  points?: string[];
  skills?: string[];
  isCurrent?: boolean;
  type?: string;
}

interface ExperienceTimelineProps {
  experiences?: TimelineExperienceItem[];
}

const defaultTimelineItems: TimelineExperienceItem[] = [
  {
    role: "Full Stack Developer",
    company: "Feeding Trends",
    period: "Feb 2026 – Present",
    location: "Lucknow, Uttar Pradesh — India",
    description: "Building AI voice & calling solutions, SaaS platforms and internal products.",
    skills: ["Next.js", "NestJS", "Node.js", "MongoDB", "PostgreSQL"],
    isCurrent: true,
    type: "Full-Time Role",
  },
];

/** A clear label for each role. The role title wins (e.g. "(Internship)"). */
function roleKind(item: TimelineExperienceItem): { label: string; icon: typeof Briefcase } {
  const role = item.role.toLowerCase();
  const type = (item.type ?? "").toLowerCase();
  if (/intern/.test(role)) return { label: "Internship", icon: Briefcase };
  if (/freelanc|contract/.test(role + type)) return { label: "Freelance", icon: Code2 };
  if (/train/.test(role + type)) return { label: "Training", icon: GraduationCap };
  if (/diploma|education|student|college/.test(role + type)) return { label: "Education", icon: GraduationCap };
  if (/full.?time|job/.test(role + type)) return { label: "Full-time", icon: Briefcase };
  return { label: item.type || "Role", icon: Briefcase };
}

/** Role title without the "(Internship)" / "(Full Time)" suffix the badge already shows. */
const cleanRole = (role: string) => role.replace(/\s*\((full[\s-]?time|internship)\)\s*$/i, "").trim();

const initials = (name: string) =>
  name
    .split(/[\s/&—-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

function CompanyMark({ item, size = "md" }: { item: TimelineExperienceItem; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-14 w-14 rounded-2xl text-base" : "h-11 w-11 rounded-xl text-sm";
  // Square-ish logos fill the tile edge to edge; wide/tall wordmarks are
  // fitted on a white tile so nothing gets cropped. Broken URLs fall back to initials.
  const [fit, setFit] = useState<"cover" | "contain">("cover");
  const [broken, setBroken] = useState(false);
  const showLogo = !!item.companyLogo && !broken;

  return (
    <span
      className={`relative flex ${box} shrink-0 items-center justify-center overflow-hidden font-black ${
        showLogo
          ? `ring-1 ${item.isCurrent ? "ring-indigo-500/50 shadow-lg shadow-indigo-500/30" : "ring-border"} ${fit === "contain" ? "bg-white" : "bg-card"}`
          : item.isCurrent
            ? "border border-indigo-500/40 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
            : "border border-border bg-card text-indigo-600 dark:text-indigo-400"
      }`}
    >
      {showLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.companyLogo}
          alt={`${item.company} logo`}
          loading="lazy"
          onLoad={(e) => {
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
            if (w && h) setFit(w / h > 1.3 || h / w > 1.3 ? "contain" : "cover");
          }}
          onError={() => setBroken(true)}
          className={`h-full w-full rounded-[inherit] ${fit === "cover" ? "object-cover" : "object-contain p-1"}`}
        />
      ) : (
        initials(item.company)
      )}
    </span>
  );
}

function TimelineCard({ item, index, defaultOpen }: { item: TimelineExperienceItem; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const kind = roleKind(item);
  // Skip highlights that only repeat the description.
  const points = (item.points ?? []).filter((p) => p.trim() && p.trim() !== item.description.trim());
  const hasDetails = points.length > 0 || (item.skills?.length ?? 0) > 0;
  const panelId = `exp-details-${index}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3), ease: [0.23, 1, 0.32, 1] }}
      className="relative grid grid-cols-[44px_1fr] gap-4 sm:gap-5"
    >
      {/* Marker on the rail */}
      <div className="relative z-10 flex flex-col items-center">
        <CompanyMark item={item} />
        {item.isCurrent && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
          </span>
        )}
      </div>

      {/* Card */}
      <article
        className={`group rounded-2xl border bg-card/80 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/5 sm:p-6 ${
          item.isCurrent ? "border-indigo-500/40 shadow-lg shadow-indigo-500/10" : "border-border hover:border-indigo-500/30"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/[0.05] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <kind.icon className="h-3 w-3" /> {kind.label}
              </span>
              {item.isCurrent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Current
                </span>
              )}
            </div>
            <h3 className="text-lg font-black leading-snug tracking-tight text-foreground sm:text-xl">{cleanRole(item.role)}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                <Building2 className="h-3.5 w-3.5" /> {item.company}
              </span>
              {item.location && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {item.location}
                </span>
              )}
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-muted-foreground">
            <Calendar className="h-3 w-3" /> {item.period}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

        {hasDetails && (
          <>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  {points.length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-border/60 pt-4">
                      {points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-sm text-foreground/80">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500/15">
                            <Check className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" />
                          </span>
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!!item.skills?.length && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.skills.map((sk) => (
                        <span key={sk} className="rounded-lg border border-border bg-background/60 px-2.5 py-1 text-[11px] font-semibold text-foreground/80">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={panelId}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 -ml-2 text-xs font-bold text-indigo-600 transition hover:bg-indigo-500/10 dark:text-indigo-400"
            >
              {open ? "Show less" : `Highlights & skills${item.skills?.length ? ` · ${item.skills.length}` : ""}`}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
          </>
        )}
      </article>
    </motion.li>
  );
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const items = experiences && experiences.length > 0 ? experiences : defaultTimelineItems;
  const current = items.find((i) => i.isCurrent) ?? items[0];

  const stats = useMemo(() => {
    const companies = new Set(items.map((i) => i.company)).size;
    const counts = new Map<string, number>();
    for (const i of items) for (const s of i.skills ?? []) counts.set(s, (counts.get(s) ?? 0) + 1);
    const topSkills = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([s]) => s);
    return { roles: items.length, companies, topSkills };
  }, [items]);

  // Scroll-linked progress along the rail.
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="experience-timeline" className="relative overflow-hidden py-12 md:py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-transparent blur-[150px]" />

      <Container>
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" /> Career journey
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">
              Work <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Experience</span>
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Roles, internships and training that shaped how I build software, most recent first.
            </p>
          </div>
          <Link
            href="/experience"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition hover:border-indigo-500/40"
          >
            Full experience
            <ArrowRight className="h-4 w-4 text-indigo-500 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* Sticky summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-sm backdrop-blur-sm">
              <div className="bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent p-5">
                <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Currently</div>
                <div className="flex items-center gap-3">
                  <CompanyMark item={current} size="lg" />
                  <div className="min-w-0">
                    <div className="truncate font-black text-foreground">{cleanRole(current.role)}</div>
                    <div className="truncate text-sm font-semibold text-indigo-600 dark:text-indigo-400">{current.company}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{current.period}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-border border-y border-border">
                <div className="p-4 text-center">
                  <div className="text-2xl font-black text-foreground">{stats.roles}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Roles</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-2xl font-black text-foreground">{stats.companies}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Organisations</div>
                </div>
              </div>
              {stats.topSkills.length > 0 && (
                <div className="p-5">
                  <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Most used</div>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.topSkills.map((s) => (
                      <span key={s} className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Timeline */}
          <div className="relative">
            <span aria-hidden className="absolute bottom-4 left-[21px] top-4 w-px bg-border" />
            <motion.span
              aria-hidden
              style={{ scaleY: progress }}
              className="absolute bottom-4 left-[20px] top-4 w-[3px] origin-top rounded-full bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
            />
            <ol ref={listRef} className="relative space-y-6">
              {items.map((item, idx) => (
                <TimelineCard key={item.id || `${item.company}-${idx}`} item={item} index={idx} defaultOpen={idx === 0} />
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
