"use client";

import { skills } from "@/Data";
import { motion } from "framer-motion";

export default function SkillsPage() {
  const categories = ["Frontend", "Backend", "Database", "Other"] as const;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-500">
            Skills & Competencies
          </h1>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            A showcase of my technical expertise and professional strengths
            across frontend, backend, and database technologies.
          </p>
        </header>

        {/* Skill Categories */}
        <div className="grid md:grid-cols-2 gap-10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-glass border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/30 transition"
            >
              <h2 className="text-xl font-semibold text-white mb-4">{cat}</h2>
              <div className="space-y-4">
                {skills
                  .filter((s) => s.category === cat)
                  .map((s, j) => (
                    <motion.div
                      key={s.name}
                      initial={{ width: 0 }}
                      whileInView={{ width: `100%` }}
                      transition={{ duration: 1.2, delay: j * 0.08 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex justify-between text-xs md:text-sm text-gray-300 mb-1">
                        <span>{s.name}</span>
                        <span>{s.level}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 md:h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 shadow"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Professional Skills */}
        <section className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-glass border border-white/10 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              Professional Skills
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              <CircularSkill label="Teamwork" percent={90} icon="✅" />
              <CircularSkill label="Creativity" percent={80} icon="🎨" />
              <CircularSkill label="Problem Solving" percent={85} icon="🧠" />
              <CircularSkill label="Project Mgmt." percent={65} icon="📊" />
              <CircularSkill label="Communication" percent={75} icon="💬" />
              <CircularSkill label="Learning" percent={85} icon="🚀" />
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

function CircularSkill({
  label,
  percent,
  icon,
}: {
  label: string;
  percent: number;
  icon: string;
}) {
  const radius = 40;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center shadow-md hover:shadow-cyan-500/20 transition"
    >
      <div className="relative flex items-center justify-center">
        <svg width={100} height={100} className="rotate-[-90deg]">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="gray"
            strokeWidth={stroke}
            fill="transparent"
            className="opacity-20"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#grad)"
            strokeWidth={stroke}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2 }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute text-white text-sm font-bold">
          {percent}%
        </span>
      </div>
      <span className="mt-2 text-white font-medium text-sm flex items-center gap-1 text-center">
        {icon} {label}
      </span>
    </motion.div>
  );
}
