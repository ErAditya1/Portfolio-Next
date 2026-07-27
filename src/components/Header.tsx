"use client";

import Image from "next/image";
import { Container } from "./Container";
import { NAME, RESUME, ROLE } from "@/Data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => setOpen(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/experience", label: "Experience" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo + Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all bg-indigo-500/10 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-lg">
              AK
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-foreground leading-tight">{NAME}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{ROLE}</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = link.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition-all ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-muted-foreground hover:text-foreground font-medium"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/contact"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-indigo-500/20"
              >
                Hire Me
              </Link>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="flex items-center gap-3 md:hidden">
              <ThemeToggle />
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-foreground hover:bg-accent rounded-xl transition-colors">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background border-border p-0 w-72">
                  <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-base shrink-0">
                          AK
                        </div>
                        <div>
                          <div className="font-bold text-base text-foreground leading-tight">{NAME}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{ROLE}</div>
                        </div>
                      </div>
                    </div>
                    
                    <nav className="flex flex-col gap-2">
                      {navLinks.map((link) => {
                        const isActive = link.href === "/" 
                          ? pathname === "/" 
                          : pathname.startsWith(link.href);

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={handleClose}
                            className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                              isActive
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-border">
                      <a
                        href={RESUME}
                        download
                        onClick={handleClose}
                        className="flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-500/20"
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
