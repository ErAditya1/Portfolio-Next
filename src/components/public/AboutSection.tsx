"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Code, ShieldCheck } from "lucide-react";
import { Container } from "@/components/Container";
import { ISiteSettings } from "@/types";

const AboutSection = ({ settings }: { settings: ISiteSettings }) => {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      
      <Container>
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-500/20 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              My Journey
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-foreground"
            >
              Passionate About <span className="text-gradient italic font-serif">Innovating</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl text-muted-foreground text-lg leading-relaxed font-medium "
            >
              I build bridges between complex backend architectures and intuitive frontend experiences, 
              driven by a pursuit of performance and clean code.
            </motion.p>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT — IMAGE & QUICK INFO */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-900 aspect-square max-w-md mx-auto group">
                <Image
                  src={settings?.avatarUrl || "/images/aditya_profile.png"}
                  alt={settings?.ownerName || "Aditya Kumar"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Floating Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-6 -right-6 lg:right-0 glass p-6 rounded-3xl shadow-2xl z-20 border border-emerald-500/20 flex flex-col items-center animate-float"
              >
                <span className="text-4xl font-black text-emerald-500">1+</span>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider text-center">Year<br/>Experience</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -top-6 -left-6 glass p-5 rounded-2xl shadow-2xl z-20 border border-sky-500/20 flex flex-col items-center animate-float" 
                style={{ animationDelay: '1.5s' }}
              >
                <span className="text-3xl font-black text-sky-500">30%</span>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Efficiency<br/>Boost</span>
              </motion.div>
            </motion.div>

            {/* RIGHT — DETAILED BIO */}
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                    <span className="w-12 h-[2px] bg-emerald-500 rounded-full" />
                    Who I Am
                  </h3>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed font-normal">
                    <strong className="text-foreground">Hello! I’m {settings?.ownerName || "Aditya Kumar"}</strong>, a results-driven {settings?.ownerTitle || "Software Developer"} specializing in 
                    <span className="text-gradient font-bold"> Modern Full-Stack Technologies</span>. 
                    I focus on architecting robust backend systems and crafting seamless user interfaces.
                  </p>

                  <p className="text-muted-foreground text-lg leading-relaxed font-normal italic">
                    {settings?.ownerBio || "My technical journey is rooted in a problem-solving mindset. From optimizing SQL queries to designing highly responsive components, I strive for excellence in every line of code."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-5 rounded-3xl bg-card border border-border shadow-sm hover:border-emerald-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <Code className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-foreground mb-1">Architecture</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Focused on Clean Principles & SOLID Design Patterns.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="p-5 rounded-3xl bg-card border border-border shadow-sm hover:border-sky-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-foreground mb-1">Security</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Implementing JWT, OAuth & Secure API Practices.</p>
                  </motion.div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold hover:gap-5 transition-all duration-300 shadow-xl shadow-foreground/10 hover:shadow-emerald-500/20"
                  >
                    Explore My Portfolio
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
