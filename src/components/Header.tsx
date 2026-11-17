"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, Images, Mail, Menu, Plug, Sparkles } from "lucide-react";
import { Container } from "./Container";
import { NAME, RESUME, ROLE } from "@/Data";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useAgent } from "@/components/public/agent/AgentProvider";
import { ThemeToggle } from "./ThemeToggle";

/** Primary sections, always visible on desktop. */
const PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
];

/** Secondary pages, tucked into "More" on desktop. */
const MORE = [
  { href: "/gallery", label: "Gallery", desc: "Photos & moments", icon: Images },
  { href: "/contact", label: "Contact", desc: "Send me a message", icon: Mail },
  { href: "/mcp", label: "Connect your AI", desc: "Use my MCP server", icon: Plug },
];

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

function AskAIButton({ compact = false, onClick }: { compact?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ask my AI agent"
      className={`group inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 font-bold text-indigo-600 transition hover:border-indigo-500/50 hover:bg-indigo-500/15 active:scale-95 dark:text-indigo-300 ${
        compact ? "h-10 w-10 justify-center" : "px-4 py-2 text-sm"
      }`}
    >
      <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
      {!compact && "Ask AI"}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { openAgent } = useAgent();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const moreActive = MORE.some((m) => isActive(pathname, m.href));
  const [hovered, setHovered] = useState<string | null>(null);

  const pill = (key: string, active: boolean) => (
    <>
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 -z-10 rounded-full bg-indigo-600 shadow-md shadow-indigo-500/30"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      {!active && hovered === key && (
        <motion.span
          layoutId="nav-hover"
          className="absolute inset-0 -z-10 rounded-full bg-foreground/[0.06]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
    </>
  );
  const itemClass = (active: boolean) =>
    `relative z-0 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 ${
      active ? "font-semibold text-white" : "font-medium text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border py-2.5 shadow-lg" : "bg-transparent py-4"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between gap-4">
          {/* Logo + Name */}
          <Link href="/" className="flex shrink-0 items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all bg-indigo-500/10 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-lg">
              AK
            </div>
            <div className="hidden sm:block lg:hidden xl:block">
              <div className="text-base font-bold text-foreground leading-tight">{NAME}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{ROLE}</div>
            </div>
          </Link>

          {/* Desktop nav: one glass pill with a sliding active indicator */}
          <nav
            aria-label="Main"
            onMouseLeave={() => setHovered(null)}
            className="hidden lg:flex items-center gap-0.5 rounded-full border border-border bg-background/60 p-1 shadow-sm backdrop-blur-md"
          >
            {PRIMARY.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setHovered(link.href)}
                  className={itemClass(active)}
                >
                  {pill(link.href, active)}
                  {link.label}
                </Link>
              );
            })}
            <DropdownMenu>
              <DropdownMenuTrigger onMouseEnter={() => setHovered("more")} className={itemClass(moreActive)}>
                {pill("more", moreActive)}
                More <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-2xl p-1.5">
                {MORE.map((m) => (
                  <DropdownMenuItem key={m.href} asChild className="rounded-xl p-2.5">
                    <Link href={m.href} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                        <m.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{m.label}</span>
                        <span className="block text-[11px] text-muted-foreground">{m.desc}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="hidden lg:flex items-center gap-3">
              <AskAIButton onClick={() => openAgent()} />
              <Link
                href="/contact"
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                Hire Me
              </Link>
            </div>

            {/* Mobile / tablet */}
            <div className="flex items-center gap-2 lg:hidden">
              <AskAIButton compact onClick={() => openAgent()} />
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button aria-label="Open menu" className="p-2 text-foreground hover:bg-accent rounded-xl transition-colors">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background border-border p-0 w-80">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-base shrink-0">
                        AK
                      </div>
                      <div>
                        <div className="font-bold text-base text-foreground leading-tight">{NAME}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{ROLE}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        openAgent();
                      }}
                      className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-left text-white shadow-lg shadow-indigo-500/25"
                    >
                      <Sparkles className="h-5 w-5 shrink-0" />
                      <span>
                        <span className="block text-sm font-bold">Ask my AI agent</span>
                        <span className="block text-xs text-white/80">Projects, skills, hiring: just ask</span>
                      </span>
                    </button>

                    <nav aria-label="Mobile" className="flex flex-col gap-1">
                      {[...PRIMARY, ...MORE].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center px-4 py-2.5 rounded-xl text-[15px] transition-all ${
                            isActive(pathname, link.href)
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent font-semibold"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-border">
                      <a
                        href={RESUME}
                        download
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center w-full px-6 py-3.5 rounded-2xl border border-border text-foreground font-bold"
                      >
                        Download CV
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
