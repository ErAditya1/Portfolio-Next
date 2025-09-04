'use client'

import React, { JSX, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Search, X } from 'lucide-react'
import { PROJECTS } from '@/Data'

/** Project type */
interface Project {
  id: string
  title: string
  tag: string
  desc: string
  live: string
  repo: string
  img: string
  year: number
  tech: string[]
}



/** motion variants */
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } }
}

const modalBackdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
const modalPanel = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.28 } }
}

export default function ProjectsPage(): JSX.Element {
  const [query, setQuery] = useState<string>('')
  const [activeTag, setActiveTag] = useState<string>('All')
  const [selected, setSelected] = useState<Project | null>(null)

  const tags = useMemo<string[]>(() => {
    const t = new Set(PROJECTS.map((p) => p.tag))
    return ['All', ...Array.from(t)]
  }, [])

  const filtered = useMemo<Project[]>(() => {
    const q = query.trim().toLowerCase()
    return PROJECTS.filter((p) => {
      if (activeTag !== 'All' && p.tag !== activeTag) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tech.join(' ').toLowerCase().includes(q)
      )
    })
  }, [query, activeTag])

  const openModal = (proj: Project) => setSelected(proj)
  const closeModal = () => setSelected(null)

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-500">
            Projects
          </h1>
          <p className="mt-2 text-gray-300 max-w-2xl">
            A curated list of projects I’ve built — filter by category, search by name or technology, and open any project for details.
          </p>
        </header>

        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-6">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-gray-400"><Search size={16} /></span>
              <input
                aria-label="Search projects"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, tech, descriptions..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#071018] border border-white/6 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <button
              onClick={() => { setQuery(''); setActiveTag('All') }}
              className="px-3 py-2 rounded-md text-sm bg-white/6 border border-white/8 text-gray-100 hover:scale-105 transition"
              aria-label="Reset filters"
            >
              Reset
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={`text-sm px-3 py-2 rounded-md transition ${
                  activeTag === t
                    ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-black font-semibold shadow'
                    : 'bg-white/6 text-gray-200 border border-white/8 hover:scale-105'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((p: Project) => (
              <motion.article
                key={p.id}
                layout
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={cardVariants}
                className="bg-glass neon-border rounded-2xl overflow-hidden border  border-white/6 shadow-neon-lg hover:scale-[1.02] transform transition"
              >
                <div className="relative h-44 w-full">
                  <Image src={p.img} alt={p.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs px-2 py-1 rounded-md bg-black/30 text-cyan-300 font-medium">{p.tag}</div>
                    <div className="text-xs text-gray-400">{p.year}</div>
                  </div>

                  <h3 className="mt-3 font-semibold text-white text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-gray-300 line-clamp-3">{p.desc}</p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {p.tech.slice(0, 3).map((t: string) => (
                        <span key={t} className="text-xs bg-white/6 px-2 py-1 rounded-md text-gray-200">{t}</span>
                      ))}
                      {p.tech.length > 3 && <span className="text-xs text-gray-400">+{p.tech.length - 3}</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <a href={p.live} target="_blank" rel="noreferrer" aria-label={`Open ${p.title} live`} className="p-2 rounded-md bg-white/6 hover:bg-white/8 transition">
                        <ExternalLink size={16} />
                      </a>
                      <a href={p.repo} target="_blank" rel="noreferrer" aria-label={`Open ${p.title} repository`} className="p-2 rounded-md bg-white/6 hover:bg-white/8 transition">
                        <Github size={16} />
                      </a>
                      <button onClick={() => openModal(p)} aria-label={`Open ${p.title} details`} className="p-2 rounded-md bg-gradient-to-r from-indigo-400 to-cyan-300 text-black font-semibold">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full text-center py-20 text-gray-400"
              >
                No projects matched your search/filter.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalBackdrop}
            onClick={closeModal}
            style={{ background: 'rgba(4,6,10,0.6)' }}
          >
            <motion.div
              className="max-w-4xl w-full bg-[#06101a] rounded-2xl p-6 neon-border border border-white/8 shadow-neon-lg"
              variants={modalPanel}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-28 h-20 relative rounded-md overflow-hidden bg-black/20">
                    <Image src={selected.img} alt={selected.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{selected.title}</h2>
                    <p className="text-sm text-gray-300 mt-1">{selected.tag} • {selected.year}</p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {selected.tech.map((t: string) => <span key={t} className="text-xs bg-white/6 px-2 py-1 rounded-md text-gray-200">{t}</span>)}
                    </div>
                  </div>
                </div>

                <button onClick={closeModal} className="p-2 rounded-md bg-white/6 hover:bg-white/8">
                  <X size={18} />
                </button>
              </div>

              <hr className="my-4 border-white/6" />
              <p className="text-gray-300">{selected.desc}</p>

              <div className="mt-4 flex items-center gap-3">
                <a href={selected.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-cyan-400 to-indigo-600 text-black font-semibold">
                  View Live <ExternalLink size={16} />
                </a>
                <a href={selected.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/8">
                  View Source <Github size={16} />
                </a>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                Tip: Use the project buttons to visit the live site or view the repository.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
