"use client";

import Image from "next/image";
import { Container } from "./Container";
import { NAME, RESUME, ROLE } from "@/Data";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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
    { href: "/about", label: "About" },
    { href: "/skills", label: "Skills" },
    { href: "/projects", label: "Projects" },
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
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <Image
                src="/images/aditya_profile.png"
                alt="Aditya"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-foreground leading-tight">{NAME}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{ROLE}</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <a
                href={RESUME}
                download
                className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-primary/20"
              >
                Resume
              </a>
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
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                           <div className="w-6 h-6 rounded-md bg-primary" />
                        </div>
                        <span className="font-bold text-xl uppercase tracking-tighter">Menu</span>
                      </div>
                      <button onClick={handleClose} className="p-2 text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <nav className="flex flex-col gap-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleClose}
                          className="flex items-center px-4 py-3 rounded-xl text-lg font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-border">
                      <a
                        href={RESUME}
                        download
                        onClick={handleClose}
                        className="flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20"
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
