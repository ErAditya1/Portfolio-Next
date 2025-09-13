// app/page.tsx
'use client'

import React, { JSX, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { Container } from '@/components/Container'
import { NeonHeading } from '@/components/NeonHeading'
import { EMAIL, LOCATION, NAME, PHONE, PROJECTS, RESUME, services, skills } from '@/Data'

/* -----------------------
   Types
   ----------------------- */
type Skill = {
  name: string
  level: number
  category: string
}

type Service = {
  title: string
  desc: string
  icon: string
}

type Project = {
  title: string
  tag?: string
  img: string
  desc?: string
  live?: string
  repo?: string
}

/* ---------- Motion variants ---------- */
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

/* ---------- Helpers ---------- */
function slugify(text = '') {
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

/* ---------- Reusable Circular Skill Component ---------- */
function CircularSkill({ label, percent, icon }: { label: string; percent: number; icon: string }) {
  const radius = 36
  const stroke = 6
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const gradId = `grad-${slugify(label)}`

  // count-up animation state
  const [value, setValue] = useState<number>(0)
  useEffect(() => {
    let raf: number | null = null
    const duration = 900
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeInOutQuad-ish
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setValue(Math.round(eased * percent))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setValue(percent)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [percent])

  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      className="bg-white/6 backdrop-blur-sm border border-white/8 rounded-xl p-3 flex flex-col items-center justify-center gap-2"
    >
      <div className="relative w-24 h-24">
        <svg width={96} height={96} className="rotate-[-90deg]">
          <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="transparent" />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke={`url(#${gradId})`}
            strokeWidth={stroke}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
          {value}%
        </div>
      </div>

      <div className="text-sm text-white font-medium flex items-center gap-2 text-center">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </div>
    </motion.div>
  )
}

/* ---------- Sections ---------- */

function Hero(): JSX.Element {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 pb-12">
      <Container>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <motion.p variants={fadeUp} className="text-cyan-300 font-medium">
              Hello — I’m
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              {NAME}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-md md:text-lg text-gray-300 max-w-xl">
              I build secure, scalable, and user-friendly applications — web, native apps, and backend systems. I work with React/Next.js,
              Node.js, Django, and .NET. Passionate about edtech and practical cybersecurity research.
            </motion.p>

            <motion.div variants={fadeUp} className="flex gap-3 flex-wrap">
              <a href={RESUME} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-600 text-black font-medium shadow hover:scale-105 transition">
                Resume
              </a>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-600 text-cyan-200 hover:bg-white/3 transition">
                Contact
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-4 items-center text-sm text-gray-300">
              <div className="flex items-center gap-2">📍 <span>{LOCATION}</span></div>
              <div className="hidden sm:flex items-center gap-2"><Mail /> <span>{EMAIL}</span></div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-cyan-300/20 transform-gpu hover:scale-105 transition">
              <Image src="/image/aditya_profile.png" alt="Aditya" fill sizes="320px" className="object-cover" />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-indigo-500 to-cyan-400 px-3 py-1 rounded-md text-xs font-semibold text-black">Web • Mobile • .NET</div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

function About(): JSX.Element {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-transparent to-white/2">
      <Container>
        <NeonHeading>About Me</NeonHeading>
        <div className="grid md:grid-cols-3 gap-8 items-start mt-8">
          <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/6">
            <h3 className="text-xl font-semibold text-white">Biography</h3>
            <p className="mt-3 text-gray-300 leading-relaxed">
              I’m Aditya Kumar — Diploma in Computer Science & Engineering (2022–2025). I build full-stack apps, native apps, and backend systems. My work spans LMS, event management,
              college portals and practical security research such as phishing detection.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white">Education</h4>
                <p className="text-sm text-gray-300">Diploma — Government Polytechnic Aadampur (BTEUP), 2025</p>
              </div>
              <div>
                <h4 className="font-medium text-white">Training</h4>
                <p className="text-sm text-gray-300">Python & Django — Softpro India, Lucknow (45 days)</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/6">
            <h4 className="font-semibold text-white">Contact</h4>
            <ul className="mt-3 text-sm text-gray-300 space-y-2">
              <li><strong>Email:</strong> <a href={`mailto:${EMAIL}`} className="text-cyan-300">{EMAIL}</a></li>
              <li><strong>Phone:</strong> <a href={`tel:${PHONE}`} className="text-cyan-300">{PHONE}</a></li>
              <li><strong>Location:</strong> {LOCATION}</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}

function SkillsSection(): JSX.Element {
  const grouped = (skills as Skill[]).reduce<Record<string, Skill[]>>((acc, s) => {
    ;(acc[s.category] = acc[s.category] || []).push(s)
    return acc
  }, {})

  return (
    <section id="skills" className="py-20">
      <Container>
        <NeonHeading>Skills & Competencies</NeonHeading>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/6">
            <h3 className="font-semibold text-white mb-4">Technical</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.keys(grouped).map((cat) => (
                <div key={cat}>
                  <div className="text-sm text-gray-300 font-medium mb-3">{cat}</div>
                  <div className="space-y-3">
                    {grouped[cat].map((s, i) => (
                      <motion.div key={s.name} variants={fadeUp} className="">
                        <div className="flex justify-between text-sm text-gray-200 mb-1">
                          <span>{s.name}</span>
                          <span>{s.level}%</span>
                        </div>
                        <div className="w-full bg-white/8 rounded-full h-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} transition={{ duration: 1.2, delay: i * 0.05 }} className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 shadow" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/6">
            <h3 className="font-semibold text-white mb-4">Professional</h3>
            <div className="text-gray-300 mb-3">Soft skills shown as animated circular progress.</div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <CircularSkill label="Teamwork" percent={90} icon="🤝" />
              <CircularSkill label="Creativity" percent={80} icon="🎨" />
              <CircularSkill label="Problem Solving" percent={85} icon="🧠" />
              <CircularSkill label="Project Mgmt." percent={65} icon="📊" />
              <CircularSkill label="Communication" percent={75} icon="💬" />
              <CircularSkill label="Learning" percent={85} icon="🚀" />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

function ServicesSection(): JSX.Element {
  const svc = services as Service[]
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-transparent to-white/2">
      <Container>
        <NeonHeading>Services</NeonHeading>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {svc.map((s, i) => (
            <motion.div key={s.title} variants={fadeUp} whileHover={{ translateY: -6 }} className="bg-gradient-to-br from-white/3 to-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/8 text-center shadow-lg transition-transform">
              <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-white/6 mb-4">{s.icon}</div>
              <h3 className="font-semibold text-white">{s.title}</h3>
              <p className="text-sm text-gray-300 mt-2">{s.desc}</p>
              <div className="mt-4">
                <a href="#contact" className="inline-block px-3 py-1 rounded-md text-sm border border-white/10 hover:bg-white/6 transition">Hire / Enquire</a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

function ProjectsSection(): JSX.Element {
  const projects = PROJECTS as Project[]
  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-transparent to-white/2">
      <Container>
        <NeonHeading>Selected Projects</NeonHeading>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {projects.slice(0, 4).map((p, i) => (
            <motion.article key={p.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="bg-white/5 p-6 rounded-2xl border border-white/6 shadow-sm hover:shadow-cyan-600/10 transition">
              <div className="flex gap-4 items-start">
                <div className="relative w-28 h-20 rounded-md overflow-hidden">
                  <Image src={p.img} alt={p.title} fill sizes="112px" className="object-cover" />
                </div>
                <div>
                  {p.tag && <div className="text-xs text-cyan-300 font-medium">{p.tag}</div>}
                  <h3 className="font-semibold text-white mt-1">{p.title}</h3>
                  {p.desc && <p className="text-sm text-gray-300 mt-2">{p.desc}</p>}
                  <div className="mt-3 flex gap-2">
                    {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 rounded-md border border-white/10">Live</a>}
                    {p.repo && <a href={p.repo} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 rounded-md bg-cyan-400 text-black">Source</a>}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Contact(): JSX.Element {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-transparent to-white/2">
      <Container>
        <NeonHeading>Contact</NeonHeading>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/6">
            <h4 className="font-semibold text-white">Get in touch</h4>
            <p className="text-gray-300 mt-2">Open to internships, freelance work, training sessions, and collaborations. Send a message and I’ll reply soon.</p>
            <ul className="mt-4 text-sm text-gray-300 space-y-2">
              <li><strong>Email:</strong> <a href={`mailto:${EMAIL}`} className="text-cyan-300">{EMAIL}</a></li>
              <li><strong>Phone:</strong> <a href={`tel:${PHONE}`} className="text-cyan-300">{PHONE}</a></li>
            </ul>
          </div>

          <motion.form initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/5 p-6 rounded-2xl border border-white/6 space-y-3" onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:${EMAIL}` }}>
            <input className="w-full border border-white/8 bg-transparent rounded-md px-3 py-2 text-white" placeholder="Your name" required />
            <input className="w-full border border-white/8 bg-transparent rounded-md px-3 py-2 text-white" type="email" placeholder="Email" required />
            <input className="w-full border border-white/8 bg-transparent rounded-md px-3 py-2 text-white" placeholder="Subject" />
            <textarea className="w-full border border-white/8 bg-transparent rounded-md px-3 py-2 text-white" rows={5} placeholder="Message" />
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold">Send message</button>
          </motion.form>
        </div>
      </Container>
    </section>
  )
}

/* ---------- Page (Default Export) ---------- */
export default function Page(): JSX.Element {
  return (
    <main className="pt-20">
      <Hero />
      <About />
      <SkillsSection />
      <ServicesSection />
      <ProjectsSection />
      <Contact />
    </main>
  )
}
