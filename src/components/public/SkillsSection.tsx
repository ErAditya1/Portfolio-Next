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
              <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest border-l-2 border-purple-500 pl-4">{cat}</h3>
              <div className="flex flex-wrap gap-4">
                {skills.filter(s => s.category === cat).map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
                    className="group relative px-6 py-4 bg-gray-900 border border-gray-800 rounded-2xl cursor-default transition-all hover:border-purple-500/50 flex flex-col items-center min-w-[120px]"
                  >
                    <span className="text-gray-200 font-bold group-hover:text-purple-400 transition-colors">{skill.name}</span>
                    <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: groupIdx * 0.2 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
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
            className="p-8 bg-gray-900/60 border border-gray-800 rounded-3xl"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">Recently Learned</h3>
            <ul className="space-y-4">
              {(settings?.recentlyLearned || []).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-gray-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-gray-900/60 border border-gray-800 rounded-3xl border-purple-500/20"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">Emerging Expertise</h3>
            <ul className="space-y-4">
              {(settings?.emergingExpertise || []).map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
