"use client";

import Image from "next/image";
import { Container } from "./Container";
import { NAME, RESUME, ROLE } from "@/Data";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#06101a]/90 backdrop-blur-md border-b border-white/10">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-cyan-300/30">
              <Image
                src="/image/aditya_profile.png"
                alt="Aditya"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className=" sm:block">
              <div className="text-lg font-bold text-white">{NAME}</div>
              <div className="text-xs text-gray-300">{ROLE}</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-200">
            <Link href="/" className="hover:text-cyan-300 transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-cyan-300 transition">
              About
            </Link>
            <Link href="/skills" className="hover:text-cyan-300 transition">
              Skills
            </Link>
            <Link href="/projects" className="hover:text-cyan-300 transition">
              Projects
            </Link>
            <Link href="/blogs" className="hover:text-cyan-300 transition">
              Blogs
            </Link>
            <Link href="/contact" className="hover:text-cyan-300 transition">
              Contact
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <a
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 px-3 py-1 text-sm text-black font-semibold shadow"
              href={RESUME}
              download
            >
              Download CV
            </a>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-gray-200 hover:text-cyan-300">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#06101a] text-white border-l border-white/10">
                  <nav className="flex flex-col gap-4 mt-10 text-lg">
                    <Link href="/" onClick={handleClose} className="hover:text-cyan-300 transition">
                      Home
                    </Link>
                    <Link href="/about" onClick={handleClose} className="hover:text-cyan-300 transition">
                      About
                    </Link>
                    <Link href="/skills" onClick={handleClose} className="hover:text-cyan-300 transition">
                      Skills
                    </Link>
                    <Link href="/projects" onClick={handleClose} className="hover:text-cyan-300 transition">
                      Projects
                    </Link>
                    <Link href="/blogs" onClick={handleClose} className="hover:text-cyan-300 transition">
                      Blogs
                    </Link>
                    <Link href="/contact" onClick={handleClose} className="hover:text-cyan-300 transition">
                      Contact
                    </Link>
                    <a
                      href={RESUME}
                      download
                      onClick={handleClose}
                      className="mt-6 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-600 text-black font-semibold text-center shadow"
                    >
                      Download CV
                    </a>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
