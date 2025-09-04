'use client'

import { motion } from 'framer-motion'

type Skill = {
  name: string
  level: number
  category: 'Frontend' | 'Backend' | 'Database' | 'Other'
}

const skills: Skill[] = [
  { name: 'HTML', level: 90, category: 'Frontend' },
  { name: 'CSS / TailwindCSS', level: 85, category: 'Frontend' },
  { name: 'JavaScript', level: 85, category: 'Frontend' },
  { name: 'React', level: 88, category: 'Frontend' },
  { name: 'Next.js', level: 85, category: 'Frontend' },
  { name: 'Node.js', level: 80, category: 'Backend' },
  { name: 'Express.js', level: 78, category: 'Backend' },
  { name: 'Python', level: 65, category: 'Backend' },
  { name: 'Django', level: 55, category: 'Backend' },
  { name: 'MongoDB', level: 75, category: 'Database' },
  { name: 'MySQL', level: 70, category: 'Database' },
  { name: 'Git / GitHub', level: 80, category: 'Other' },
  { name: 'Firebase', level: 70, category: 'Other' },
]

export default function SkillsPage() {
  const categories = ['Frontend', 'Backend', 'Database', 'Other'] as const

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-500">
            Skills & Competencies
          </h1>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
            A showcase of my technical expertise and professional strengths across frontend, backend,
            and database technologies.
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
              className="bg-glass border border-white/6 rounded-xl p-6 shadow-neon-lg"
            >
              <h2 className="text-xl font-semibold text-white mb-4">{cat}</h2>
              <div className="space-y-4">
                {skills
                  .filter((s) => s.category === cat)
                  .map((s, j) => (
                    <motion.div
                      key={s.name}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      transition={{ duration: 1.2, delay: j * 0.08 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>{s.name}</span>
                        <span>{s.level}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 shadow"
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
            className="bg-glass border border-white/6 rounded-xl p-6 shadow-neon-lg"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Professional Skills</h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-gray-300">
              <li>✅ Teamwork & Collaboration — 90%</li>
              <li>🎨 Creativity — 80%</li>
              <li>🧠 Problem Solving — 85%</li>
              <li>📊 Project Management — 65%</li>
              <li>💬 Communication — 75%</li>
              <li>🚀 Continuous Learning — 85%</li>
            </ul>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
