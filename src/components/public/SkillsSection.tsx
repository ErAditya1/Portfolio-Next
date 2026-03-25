"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { ISiteSettings } from "@/types";
import { Code2, Cpu, Layout, Server, Sparkles, Terminal, Database, Cloud } from "lucide-react";
import type { ElementType } from "react";

const iconMap: Record<string, ElementType> = {
  "Frontend": Layout,
  "Backend": Server,
  "Database": Database,
  "Cloud": Cloud,
  "Tools": Terminal,
  "Core": Code2,
  "Other": Sparkles,
};

const categoryColors: Record<string, string> = {
  "Frontend": "text-sky-500 bg-sky-500/10 border-sky-500/20",
  "Backend": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  "Database": "text-purple-500 bg-purple-500/10 border-purple-500/20",
  "Cloud": "text-blue-500 bg-blue-500/10 border-blue-500/20",
  "Tools": "text-orange-500 bg-orange-500/10 border-orange-500/20",
  "Core": "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  "Other": "text-pink-500 bg-pink-500/10 border-pink-500/20",
};

export function SkillsSection({ settings }: { settings: ISiteSettings }) {
  const skills = settings?.skills || [];
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -z-10 animate-pulse" />

      <Container>
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <NeonHeading>Professional Expertise</NeonHeading>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium"
            >
              A comprehensive toolkit of modern technologies and frameworks I use to build scalable digital solutions.
            </motion.p>
          </div>

          <div className="space-y-20">
            {categories.map((cat, catIdx) => {
              const Icon = iconMap[cat] || Sparkles;
              const colorClass = categoryColors[cat] || "text-primary bg-primary/10 border-primary/20";
              const filteredSkills = skills.filter(s => s.category === cat);

              return (
                <div key={cat} className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-6"
                  >
                    <div className={`p-4 rounded-[20px] ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]} shadow-inner border ${colorClass.split(' ')[2]}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-black text-foreground tracking-tight">{cat}</h3>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em]">{filteredSkills.length} Technologies</p>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-border via-border/50 to-transparent ml-4" />
                  </motion.div>

                  <div 
                    className="flex gap-6 overflow-x-auto pb-10 pt-2 scrollbar-hide snap-x relative overflow-y-visible"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {filteredSkills.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.5, 
                          delay: (catIdx * 0.1) + (i * 0.05),
                          type: "spring",
                          damping: 15
                        }}
                        whileHover={{ 
                          y: -15,
                          scale: 1.02,
                        }}
                        className="group relative flex-none w-[170px] sm:w-[200px] p-6 glass rounded-[32px] transition-all shadow-lg hover:shadow-2xl hover:shadow-primary/10 flex flex-col items-center gap-6 text-center snap-center"
                      >
                        <div className={`w-16 h-16 rounded-2xl ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl border ${colorClass.split(' ')[2]} relative`}>
                            <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                            <Icon className="w-8 h-8 relative z-10" />
                        </div>

                        <div className="space-y-1">
                            <span className="text-foreground font-black tracking-tight text-base block group-hover:text-primary transition-colors">
                            {skill.name}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Core Stack</span>
                        </div>

                        <div className="w-full space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Proficiency</span>
                            <span className="text-sm font-black text-foreground">{skill.level}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-accent/20 rounded-full overflow-hidden p-[2px] border border-white/5 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ duration: 2, delay: 0.5 + (i * 0.1), ease: "circOut" }}
                              className="h-full bg-gradient-to-r from-emerald-500 via-primary to-sky-500 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recently Learned / Emerging Expertise Section */}
        <div className="mt-24 grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group p-10 glass rounded-[40px] shadow-sm hover:border-emerald-500/30 transition-all relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
            <h3 className="text-2xl font-black text-foreground mb-10 flex items-center gap-4">
              <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              Recently Learned
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(settings?.recentlyLearned || []).map((item, i) => (
                <li key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground text-sm font-bold hover:text-foreground hover:bg-white/10 transition-all">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group p-10 glass rounded-[40px] shadow-sm hover:border-sky-500/30 transition-all relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-all" />
            <h3 className="text-2xl font-black text-foreground mb-10 flex items-center gap-4">
              <div className="w-3 h-10 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
              Emerging Expertise
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(settings?.emergingExpertise || []).map((item, i) => (
                <li key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground text-sm font-bold hover:text-foreground hover:bg-white/10 transition-all">
                  <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
