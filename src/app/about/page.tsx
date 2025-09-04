'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-500">
            About Me
          </h1>
          <p className="mt-3 text-gray-300 max-w-2xl">
            I’m Aditya Kumar, a passionate Web Developer with expertise in both front-end and back-end 
            development. I love building modern, scalable, and user-friendly applications.
          </p>
        </header>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-48 h-48 md:w-64 md:h-64 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-cyan-400 shadow-neon-lg"
          >
            <Image
              src="/image/aditya_profile.png"
              alt="Aditya Kumar"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-2 space-y-4 text-gray-300"
          >
            <p>
              I’m currently pursuing a <b>Diploma in Computer Science & Engineering (2022–2025)</b> 
              from <i>Government Polytechnic Aadampur, Tarabganj Gonda</i>.
            </p>
            <p>
              My expertise includes technologies like <b>HTML, CSS, JavaScript, React, Next.js, 
              Node.js, Express.js, MongoDB, and MySQL</b>. I also work with modern UI frameworks 
              like <b>TailwindCSS, Shadcn UI, and Aceternity UI</b>.
            </p>
            <p>
              I have built impactful projects including learning platforms, event management 
              systems, productivity apps, and college management solutions.
            </p>
            <p>
              Beyond coding, I’m a <b>fast learner, creative thinker, and collaborative team player</b>. 
              My goal is to contribute to innovative solutions, write clean maintainable code, and 
              create applications that make a real impact.
            </p>
          </motion.div>
        </div>

        {/* Skills Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-6">
            Skills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-glass border border-white/6 rounded-xl p-6 shadow-neon-lg"
            >
              <h3 className="font-semibold text-white mb-4">Technical Skills</h3>
              <ul className="space-y-2 text-gray-300">
                <li>HTML / CSS / TailwindCSS / Bootstrap</li>
                <li>JavaScript / React / Next.js</li>
                <li>Node.js / Express.js</li>
                <li>MongoDB / MySQL</li>
                <li>Python / Django</li>
              </ul>
            </motion.div>

            {/* Professional Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-glass border border-white/6 rounded-xl p-6 shadow-neon-lg"
            >
              <h3 className="font-semibold text-white mb-4">Professional Skills</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Teamwork & Collaboration</li>
                <li>Creativity & Problem Solving</li>
                <li>Project Management</li>
                <li>Effective Communication</li>
                <li>Continuous Learning</li>
              </ul>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
