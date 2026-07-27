"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Mail, Github, Linkedin, Twitter, Download, MessageSquare } from "lucide-react";
import Image from "next/image";
import { ISiteSettings } from "@/types";
import { RESUME, EMAIL } from "@/Data";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export function HeroSection({ settings }: { settings?: ISiteSettings }) {
  const name = settings?.ownerName || "Aditya Kumar";

  return (
    <section id="home" className="pt-28 pb-16 overflow-hidden relative">
      {/* Background radial gradient */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[128px] -z-10" />

      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <motion.div initial="hidden" animate="show" variants={stagger} className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm">
                👋 Welcome to my portfolio
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUp} className="space-y-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.15] tracking-tight">
                Hi, I&apos;m{" "}
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                  {name}
                </span>
                <br />
                Full Stack Developer
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={fadeUp} className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
              I build scalable web applications with modern technologies. Passionate about creating efficient, user-friendly solutions.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
              <a
                href={RESUME}
                download
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download CV
              </a>
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-card border border-border hover:bg-accent text-foreground font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" /> Let&apos;s Talk
              </Link>
            </motion.div>

            {/* Connect with me social links */}
            <motion.div variants={fadeUp} className="space-y-3 pt-4 border-t border-border/50">
              <span className="text-xs font-semibold text-muted-foreground block">Connect with me</span>
              <div className="flex gap-3 items-center">
                <a
                  href="https://github.com/ErAditya1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/40 transition-all"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/40 transition-all"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/40 transition-all"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/40 transition-all"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Profile Photo Card */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Background dot matrix graphics */}
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-48 h-48 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:12px_12px] -z-10" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl p-3 bg-gradient-to-b from-indigo-500/20 via-card to-card border border-indigo-500/20 shadow-2xl"
            >
              {/* Glowing purple dot top right */}
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-purple-500 border-2 border-background shadow-lg shadow-purple-500/50 animate-pulse z-20" />

              <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[400px] rounded-2xl overflow-hidden bg-card">
                <Image
                  src="/images/aditya_profile.png"
                  alt="Aditya Kumar"
                  fill
                  priority
                  className="object-cover object-top"
                />

                {/* Available for work bottom badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-md border border-border text-xs font-bold text-foreground flex items-center gap-2 whitespace-nowrap shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Available for work
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
