// app/blogs/page.tsx
'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Container } from '@/components/Container'
import { NeonHeading } from '@/components/NeonHeading'
import { BlogPost, BLOGS } from '@/Data'

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

export default function BlogsPage() {
  const allPosts: BlogPost[] = BLOGS
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort] = useState<'new' | 'old'>('new')
  const [visibleCount, setVisibleCount] = useState(6)

  const allTags = useMemo(() => {
    const s = new Set<string>()
    allPosts.forEach((p) => p.tags?.forEach((t) => s.add(t)))
    return Array.from(s).sort()
  }, [allPosts])

  const filtered = useMemo(() => {
    let list = allPosts.slice()
    if (activeTag) list = list.filter((p) => p.tags?.includes(activeTag))
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt || '').toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      )
    }
    list.sort((a, b) => {
      const da = new Date(a.date).getTime()
      const db = new Date(b.date).getTime()
      return sort === 'new' ? db - da : da - db
    })
    return list
  }, [allPosts, query, activeTag, sort])

  const visiblePosts = filtered.slice(0, visibleCount)

  return (
    <main className="pt-24 pb-20 bg-gradient-to-b from-transparent to-white/2">
      <Container>
        <div className="mb-8">
          <NeonHeading>Articles & Posts</NeonHeading>
          <p className="mt-2 text-gray-300 max-w-3xl">
            Collection of tutorials, case studies and technical deep dives — filtered & searchable. Click any card to open the full article.
          </p>
        </div>

        {/* Controls */}
        <div className="grid gap-4 md:grid-cols-3 items-center mb-6">
          <div className="md:col-span-2 flex gap-3 items-center">
            <label htmlFor="search" className="sr-only">Search articles</label>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, excerpt, or tags..."
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/3 border border-white/6 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setQuery('')
                setActiveTag(null)
                setSort('new')
                setVisibleCount(6)
              }}
              className="px-3 py-2 rounded-md bg-white/6 border border-white/8 text-sm text-white hover:bg-white/8"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center justify-end gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'new' | 'old')}
              className="rounded-md border border-white/8 px-3 py-2 bg-white/6 text-white text-sm"
            >
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
            </select>
            <div className="text-sm text-white/70 hidden sm:block">{filtered.length} result(s)</div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1.5 rounded-md text-sm ${activeTag === null ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-black' : 'bg-white/6 text-white'}`}
              onClick={() => setActiveTag(null)}
            >
              All
            </button>

            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag((prev) => (prev === t ? null : t))}
                className={`px-3 py-1.5 rounded-md text-sm ${activeTag === t ? 'bg-gradient-to-r from-cyan-400 to-indigo-600 text-black' : 'bg-white/6 text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        <section aria-labelledby="posts-heading">
          <h2 id="posts-heading" className="sr-only">Posts</h2>

          {filtered.length === 0 ? (
            <div className="rounded-md p-6 bg-white/6 border border-white/8 text-center text-gray-200">
              No posts found — try another search or tag.
            </div>
          ) : (
            <>
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePosts.map((post, i) => (
                  <motion.article key={post.slug} variants={fadeUp} whileHover={{ y: -6 }} className="rounded-2xl overflow-hidden border border-white/8 shadow-sm bg-white/5">
                    <Link href={post.url || `/blog/${post.slug}`} className="group block">
                      <div className="relative w-full h-48 bg-white/3">
                        {post.img ? (
                          <Image src={post.img} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
                        )}
                        <div className="absolute left-3 bottom-3 bg-black/60 px-2 py-0.5 rounded-md text-xs text-white font-semibold">
                          {post.tags?.[0] ?? 'Article'}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white line-clamp-2">{post.title}</h3>
                        <p className="mt-2 text-sm text-gray-300 line-clamp-3">{post.excerpt}</p>

                        <div className="mt-4 flex items-center justify-between text-xs text-gray-300">
                          <div className="flex items-center gap-3">
                            {post.author?.avatar && (
                              <div className="w-8 h-8 relative rounded-full overflow-hidden">
                                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm text-white font-medium">{post.author?.name ?? 'Author'}</div>
                              <div className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString()}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {post.tags?.slice(0, 2).map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded bg-white/6 text-white text-xs">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>

              {visibleCount < filtered.length && (
                <div className="mt-8 flex justify-center">
                  <button onClick={() => setVisibleCount((v) => v + 6)} className="px-5 py-2 rounded-md bg-gradient-to-r from-cyan-400 to-indigo-600 text-black font-semibold">
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </Container>
    </main>
  )
}
