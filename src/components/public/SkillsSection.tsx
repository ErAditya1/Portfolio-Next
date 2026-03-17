"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { ISiteSettings } from "@/types";

export function SkillsSection({ settings }: { settings: ISiteSettings }) {
  const skills = settings?.skills || [];

  // Group skills by category
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <section id="skills" className="py-24 overflow-hidden">
      <Container>
        <NeonHeading>Professional Toolkit</NeonHeading>
        
        <div className="mt-16 space-y-12">
          {categories.map((cat, groupIdx) => (
            <div key={cat} className="space-y-6">
              <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-4">{cat}</h3>
              <div className="flex flex-wrap gap-4">
                {skills.filter(s => s.category === cat).map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, backgroundColor: "var(--accent)" }}
                    className="group relative px-6 py-4 bg-card border border-border rounded-2xl cursor-default transition-all hover:border-primary/50 flex flex-col items-center min-w-[120px] shadow-sm"
                  >
                    <span className="text-foreground font-bold group-hover:text-primary transition-colors">{skill.name}</span>
                    <div className="mt-2 w-full h-1 bg-accent rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: groupIdx * 0.2 }}
                        className="h-full bg-gradient-to-r from-purple-600 to-primary dark:from-purple-500 dark:to-pink-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recently Learned / Emerging Expertise Section */}
        <div className="mt-24 grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-card border border-border rounded-3xl shadow-sm"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-primary dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent mb-6">Recently Learned</h3>
            <ul className="space-y-4">
              {(settings?.recentlyLearned || []).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-muted-foreground text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-card border border-primary/10 rounded-3xl shadow-sm"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-primary dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6">Emerging Expertise</h3>
            <ul className="space-y-4">
              {(settings?.emergingExpertise || []).map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
