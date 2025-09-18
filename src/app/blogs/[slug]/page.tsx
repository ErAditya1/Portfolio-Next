// app/blog/[slug]/page.tsx
import React from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Container } from '@/components/Container'
import 'highlight.js/styles/github-dark.css' // add to globals.css if you prefer
import { BLOGS } from '@/Data'

type Props = { params: { slug: string } }

function extractHeadings(markdown: string) {
  const re = /^###?\s+(.*)$/gm
  const headings: { text: string; id: string; level: number }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(markdown)) !== null) {
    const full = m[0]
    const text = m[1].trim()
    const level = full.startsWith('###') ? 3 : 2
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    headings.push({ text, id, level })
  }
  return headings
}

export default async function BlogPage({ params }: Props) {
  const { slug } = params
  

  const post = BLOGS.find((b) => b.slug === slug)
  if (!post) {
    return (
      <Container>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="mt-4 text-gray-500">We couldn't find the post you requested.</p>
        </div>
      </Container>
    )
  }

  const headings = extractHeadings(post.content)

  return (
    <main className="pt-20">
      <Container>
        <article className="max-w-5xl mx-auto">
          <header className="space-y-4 mb-8">
            <div className="text-sm text-gray-400">{new Date(post.date).toLocaleDateString()}</div>
            <h1 className="text-4xl font-extrabold leading-tight">{post.title}</h1>
            <p className="text-lg text-gray-300">{post.excerpt}</p>

            <div className="flex items-center gap-4 mt-4">
              {post.author?.avatar && (
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image src={post.author.avatar} alt={post.author.name} height={1000} width={1000}  className="object-cover" />
                </div>
              )}
              <div>
                <div className="font-medium">{post.author?.name}</div>
                <div className="text-sm text-gray-400">{post.author?.bio}</div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                {post.tags.map((t:string) => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-slate-700/40">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {post.img && (
              <div className="mt-6 rounded-xl overflow-hidden h-72 relative">
                <Image src={post.img} alt={post.title} fill className="object-cover" />
              </div>
            )}
          </header>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Article Body */}
            <div className="md:col-span-3 prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeHighlight]}
                components={{
                  code({ node, className, children, ...props }) {
                    return (
                      <code className={className ? String(className) : ''} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Sidebar */}
            <aside className="md:col-span-1 sticky top-24 space-y-6">
              <div className="p-4 bg-white/5 rounded-lg border border-white/8">
                <h4 className="font-semibold">On this page</h4>
                <nav className="mt-3 space-y-2 text-sm text-gray-300">
                  {headings.map((h) => (
                    <a key={h.id} href={`#${h.id}`} className="block hover:text-white">
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/8">
                <h4 className="font-semibold">Share</h4>
                <div className="mt-3 flex gap-2">
                  <a className="px-3 py-2 bg-blue-600 rounded text-white" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(post.url || '')}`} target="_blank" rel="noreferrer">Twitter</a>
                  <a className="px-3 py-2 bg-sky-700 rounded text-white" href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(post.url || '')}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer">LinkedIn</a>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/8">
                <h4 className="font-semibold">Recommended</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {/* Recommend other posts from BLOGS */}
                  {BLOGS.filter((b) => b.slug !== post.slug).slice(0, 3).map((b) => (
                    <li key={b.slug}>
                      <a href={`/blog/${b.slug}`} className="hover:underline">{b.title}</a>
                      <div className="text-xs text-gray-400">{new Date(b.date).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </article>
      </Container>
    </main>
  )
}
