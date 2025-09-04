// Portfolio Next.js page (app/page.jsx)
// Tailwind + Framer Motion + Aceternity-ready
'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react';
import { Container } from '@/components/Container';
import { NeonHeading } from '@/components/NeonHeading';
import { EMAIL, LOCATION, NAME, PHONE, PROJECTS, RESUME, SKILLS } from '@/Data';
// Optional: if you install Aceternity UI, uncomment and use the components
// import { Button, Card, Avatar } from 'aceternity'




// ---------- Motion variants ----------
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }





// ---------- Components ----------



function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 pb-12">
      <Container>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <motion.p variants={fadeUp} className="text-cyan-300 font-medium">Hello — I’m</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-extrabold text-white leading-tight">{NAME}</motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-gray-300 max-w-xl">I build secure, scalable, and user-friendly web applications. I work across React/Next.js, Node.js, Django, and modern UI systems. I’m passionate about education technology and developer tools.</motion.p>

            <motion.div variants={fadeUp} className="flex gap-3 flex-wrap">
              <a href={RESUME} download className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-600 text-black font-medium shadow hover:scale-105 transition">Resume</a>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-600 text-cyan-200 hover:bg-white/3 transition">Contact</a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-4 items-center text-sm text-gray-300">
              <div className="flex items-center gap-2">📍 <span>{LOCATION}</span></div>
              <div className="hidden sm:flex items-center gap-2"><Mail/> <span>{EMAIL}</span></div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="flex justify-center">
            <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-cyan-300/30">
              <Image src="/image/aditya_profile.png" alt="Aditya" fill sizes="320px" className="object-cover" />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-transparent to-white/2">
      <Container>
        <NeonHeading>About Me</NeonHeading>
        <div className="grid md:grid-cols-3 gap-8 items-start mt-8">
          <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/6">
            <h3 className="text-xl font-semibold text-white">Biography</h3>
            <p className="mt-3 text-gray-300 leading-relaxed">I’m Aditya Kumar — a Diploma holder in Computer Science & Engineering (2022–2025) from Government Polytechnic Aadampur. I build full‑stack apps and have built LMS, event management, and college portals. I also explore cybersecurity topics and practical research like phishing detection.</p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white">Education</h4>
                <p className="text-sm text-gray-300">Diploma in Computer Science & Engineering — Government Polytechnic Aadampur (BTEUP), 2025</p>
              </div>
              <div>
                <h4 className="font-medium text-white">Training</h4>
                <p className="text-sm text-gray-300">Python & Django training — Softpro India, Lucknow (45 days)</p>
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

function Skills() {
  return (
    <section id="skills" className="py-20">
      <Container>
        <NeonHeading>Skills & Competencies</NeonHeading>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/6">
            <h3 className="font-semibold text-white mb-4">Technical</h3>
            <div className="space-y-4">
              {SKILLS.map((s, i) => (
                <motion.div key={s.name} variants={fadeUp} className="">
                  <div className="flex justify-between text-sm text-gray-200 mb-1"> <span>{s.name}</span> <span>{s.level}%</span> </div>
                  <div className="w-full bg-white/6 rounded-full h-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} transition={{ duration: 1.2, delay: i * 0.06 }} className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 shadow"></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/6">
            <h3 className="font-semibold text-white mb-4">Professional</h3>
            <ul className="text-gray-300 space-y-2">
              <li>Teamwork — 90%</li>
              <li>Creativity — 80%</li>
              <li>Problem Solving — 85%</li>
              <li>Project Management — 65%</li>
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-transparent to-white/2">
      <Container>
        <NeonHeading>Selected Projects</NeonHeading>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {PROJECTS.slice(0,4).map((p:any, i:number) => (
            <motion.article key={p.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white/5 p-6 rounded-2xl border border-white/6 shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="relative w-28 h-20 rounded-md overflow-hidden ">
                  <Image src={p.img} alt={p.title} fill sizes="112px" className="object-cover" />
                </div>
                <div>
                  <div className="text-xs text-cyan-300 font-medium">{p.tag}</div>
                  <h3 className="font-semibold text-white mt-1">{p.title}</h3>
                  <p className="text-sm text-gray-300 mt-2">{p.desc}</p>
                  <div className="mt-3 flex gap-2">
                    <a href={p.live} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 rounded-md border border-white/10">Live</a>
                    <a href={p.repo} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 rounded-md bg-cyan-400 text-black">Source</a>
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

function References() {
  return (
    <section className="py-20">
      <Container>
        <NeonHeading>References</NeonHeading>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image src="/image/durgesh.png" alt="Durgesh" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <div className="font-semibold text-white">Durgesh Kumar</div>
                <div className="text-sm text-gray-300">Engineer • Senior</div>
              </div>
            </div>
            <p className="mt-3 text-gray-300">“Highly skilled and supportive — strong problem solving and mentoring.”</p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image src="/image/aditya_profile.png" alt="Aditya" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <div className="font-semibold text-white">Aditya Kumar</div>
                <div className="text-sm text-gray-300">Student • Developer</div>
              </div>
            </div>
            <p className="mt-3 text-gray-300">“Focused on building practical solutions, continuously learning, and sharing knowledge.”</p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image src="/image/Suraj.png.jpg" alt="Suraj" fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <div className="font-semibold text-white">Suraj Verma</div>
                <div className="text-sm text-gray-300">Peer</div>
              </div>
            </div>
            <p className="mt-3 text-gray-300">“A reliable teammate with strong technical fundamentals and great attitude.”</p>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-transparent to-white/2">
      <Container>
        <NeonHeading>Contact</NeonHeading>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/6">
            <h4 className="font-semibold text-white">Get in touch</h4>
            <p className="text-gray-300 mt-2">Open to internships, freelance work, and collaborations. Send a message and I’ll get back within a few days.</p>
            <ul className="mt-4 text-sm text-gray-300 space-y-2">
              <li><strong>Email:</strong> <a href={`mailto:${EMAIL}`} className="text-cyan-300">{EMAIL}</a></li>
              <li><strong>Phone:</strong> <a href={`tel:${PHONE}`} className="text-cyan-300">{PHONE}</a></li>
            </ul>
          </div>

          <motion.form initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/5 p-6 rounded-2xl border border-white/6 space-y-3" onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:${EMAIL}`; }}>
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



export default function Page() {
  return (
    
      <main className="pt-20">
        <Hero />
        <About />
        <Skills />
        <Projects />
        {/* <References /> */}
        <Contact />
      </main>
     
    
  )
}
