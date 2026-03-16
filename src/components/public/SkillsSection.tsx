"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { ISiteSettings } from "@/types";

export function SkillsSection({ settings }: { settings: ISiteSettings }) {
  const skills = settings?.skills || ["React", "Next.js", "Node.js", "MongoDB", "TypeScript", "TailwindCSS", "Python", "Django"];

  return (
    <section id="skills" className="py-24 overflow-hidden">
      <Container>
        <NeonHeading>My Arsenal</NeonHeading>
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {skills.map((skill: string, i: number) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
              className="px-6 py-3 bg-gray-900 border border-gray-800 rounded-2xl text-gray-300 font-medium cursor-default transition-all hover:text-white hover:border-purple-500/50"
            >
              {skill}
            </motion.div>
          ))}
        </div>

        {/* Soft skills / Categories visualized as an infinite slider or grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Frontend", percent: 95, color: "text-blue-400" },
            { label: "Backend", percent: 90, color: "text-purple-400" },
            { label: "Security", percent: 85, color: "text-emerald-400" },
            { label: "Mobile", percent: 80, color: "text-pink-400" },
          ].map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 bg-gray-900/60 border border-gray-800 rounded-3xl"
            >
              <div className={`text-3xl font-bold mb-1 ${cat.color}`}>{cat.percent}%</div>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{cat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
