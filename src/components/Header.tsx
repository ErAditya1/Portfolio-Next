import Image from "next/image";
import { Container } from "./Container";
import { NAME, RESUME, ROLE } from "@/Data";

export function Header() {
  
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#06101a] backdrop-blur-md border-b border-white/6">
      <Container>
        <div className="flex items-center justify-between h-16">
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
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-white">{NAME}</div>
              <div className="text-xs text-gray-300">{ROLE}</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-200">
            <a href="/" className="hover:text-cyan-300 transition">
              Home
            </a>
            <a href="/about" className="hover:text-cyan-300 transition">
              About
            </a>
            <a href="/skills" className="hover:text-cyan-300 transition">
              Skills
            </a>
            <a href="/projects" className="hover:text-cyan-300 transition">
              Projects
            </a>
            <a href="/contact" className="hover:text-cyan-300 transition">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 px-3 py-1 text-sm text-black font-semibold shadow"
              href={RESUME}
              download
            >
              Download CV
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
