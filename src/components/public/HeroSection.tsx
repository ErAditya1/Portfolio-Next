"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { Mail, MapPin, ArrowRight, Github, Linkedin, Twitter, Sparkles, Code } from "lucide-react";
import Image from "next/image";
import { ISiteSettings } from "@/types";
import { useState, useEffect } from "react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export function HeroSection({ settings }: { settings: ISiteSettings }) {
  const name = settings?.ownerName || "Aditya Kumar";
  const title = settings?.ownerTitle || "Full Stack Developer";
  const bio = settings?.ownerBio || "I build high-performance web applications and secure digital experiences.";
  const avatar = settings?.avatarUrl || "/images/aditya_profile.png";

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const titles = ["Full Stack Developer", "Backend & System Engineer", "UI/UX Enthusiast", "Problem Solver", "Cloud Architect"];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % titles.length;
      const fullText = titles[i];

      setDisplayText(isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  return (
    <section id="home" className="min-h-screen flex items-center pt-20 pb-12 overflow-hidden relative">
      {/* Background blobs & patterns */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] -z-10 animate-pulse delay-700" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-20 opacity-20 dark:opacity-10" />

      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div initial="hidden" animate="show" variants={stagger} className="lg:col-span-7 space-y-8 relative">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary text-xs font-bold uppercase tracking-widest shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Available for Hire
            </motion.div>

            <div className="space-y-4">
              <motion.h1 variants={fadeUp} className="text-3xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
                Hi I&apos;m <span className="text-gradient drop-shadow-sm">{name}</span>
              </motion.h1>

              <motion.div variants={fadeUp} className="text-xl md:text-3xl text-muted-foreground flex items-center font-bold">
                <span className="text-foreground inline-flex items-center gap-2 bg-accent/30 py-2 px-4 rounded-2xl border border-border/50 backdrop-blur-sm shadow-inner group">
                  <span className="text-primary group-hover:scale-110 transition-transform">{'<'}</span>
                  <span className="text-gradient">
                    {displayText}
                  </span>
                  <span className="text-primary group-hover:scale-110 transition-transform">{'/>'}</span>
                  <span className="w-[3px] h-8 bg-primary animate-blink ml-1" />
                </span>
              </motion.div>
            </div>

            <motion.p variants={fadeUp} className="text-lg md:text-xl  max-w-xl leading-relaxed ">
              Building Scalable Web Applications with MERN Stack
              Full-stack developer creating fast, user-friendly, and real-world web solutions using modern technologies.
            </motion.p>

            <motion.div variants={fadeUp} className="flex gap-4 flex-wrap pt-4">
              <Link href="/projects" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/40 flex items-center gap-3">
                Watch My Work <ArrowRight className="w-5 h-5 animate-bounce-x" />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-background border border-border text-foreground font-bold rounded-2xl hover:bg-accent hover:border-primary/30 transition-all flex items-center gap-2 shadow-sm">
                Let&apos;s Talk
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-6 items-center text-sm font-semibold text-muted-foreground/60 pt-6 border-t border-border/50 w-fit">
              {settings?.socialLinks?.map((link, idx) => {
                const Icon = link.platform.toLowerCase().includes("github") ? Github :
                  link.platform.toLowerCase().includes("linkedin") ? Linkedin :
                    link.platform.toLowerCase().includes("twitter") || link.platform.toLowerCase().includes("x") ? Twitter :
                      link.platform.toLowerCase().includes("mail") ? Mail : Github; // Default to Github if no match

                return (
                  <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2 group" title={link.platform}>
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}

              {/* Fallback to legacy links if dynamic ones aren't set */}
              {(!settings?.socialLinks || settings.socialLinks.length === 0) && (
                <>
                  {settings?.githubUrl && (
                    <a href={settings.githubUrl} className="hover:text-primary transition-colors flex items-center gap-2 group">
                      <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {settings?.linkedinUrl && (
                    <a href={settings.linkedinUrl} className="hover:text-primary transition-colors flex items-center gap-2 group">
                      <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                </>
              )}

              <span className="h-4 w-[1px] bg-border mx-2" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                <span>{settings?.ownerLocation || "India"}</span>
              </div>
            </motion.div>
          </motion.div>

          <div className="w-full lg:col-span-4 space-y-8 relative flex justify-center  ">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Decorative rings */}
              <div className="absolute -inset-4 border-2 border-emerald-500/20 rounded-[40px] animate-float" />
              <div className="absolute -inset-8 border border-sky-500/10 rounded-[50px] animate-float shadow-2xl" style={{ animationDelay: '1s' }} />

              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border-4 border-white dark:border-gray-800 bg-emerald-500/5">
                <Image
                  src="/images/aditya_profile.png"
                  alt="Aditya Kumar"
                  fill
                  priority
                  className="object-cover scale-110 hover:scale-125 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Custom Styles for animations */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s infinite;
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}


