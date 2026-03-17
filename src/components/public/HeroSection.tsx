"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ISiteSettings } from "@/types";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export function HeroSection({ settings }: { settings: ISiteSettings }) {
  const name = settings?.ownerName || "Aditya Kumar";
  const title = settings?.ownerTitle || "Full Stack Developer";
  const bio = settings?.ownerBio || "I build high-performance web applications and secure digital experiences.";
  const avatar = settings?.avatarUrl || "/images/aditya_profile.png";

  return (
    <section id="home" className="min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[128px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[128px] -z-10 animate-pulse delay-700" />

      <Container>
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <motion.div initial="hidden" animate="show" variants={stagger} className="md:col-span-7 space-y-6">
            <motion.p variants={fadeUp} className="text-purple-400 font-semibold tracking-wider uppercase text-sm">
              Available for Hire
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight">
              Crafting <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">Digital</span> Excellence
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Hi, I&apos;m <span className="text-foreground font-semibold">{name}</span>, a <span className="text-foreground font-semibold">{title}</span>. {bio}
            </motion.p>

            <motion.div variants={fadeUp} className="flex gap-4 flex-wrap">
              <Link href="/projects" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-105 flex items-center gap-2">
                View My Work <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-card border border-border text-foreground font-bold rounded-xl hover:bg-accent transition-all flex items-center gap-2">
                Get in Touch
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-6 items-center text-sm text-gray-500 pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span>{settings?.ownerLocation || "India"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>{settings?.ownerEmail || "aditya@example.com"}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-5 relative hidden md:block"
          >
            <div className="relative z-10 w-full aspect-square max-w-[400px] mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 glass shadow-2xl">
                {avatar && (
                  <Image src={avatar} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>
            </div>
            {/* Floating metrics */}
            <div className="absolute -top-4 -right-4 bg-card/90 border border-border backdrop-blur-xl p-4 rounded-2xl shadow-xl z-20">
              <span className="text-2xl font-bold text-foreground">1+</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Years Experience</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card/90 border border-border backdrop-blur-xl p-4 rounded-2xl shadow-xl z-20">
              <span className="text-2xl font-bold text-foreground">15+</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Projects Done</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
