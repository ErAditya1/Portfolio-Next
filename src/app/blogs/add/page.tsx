// app/(admin)/blogs/new/page.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'
import { Container } from '@/components/Container'
import { NeonHeading } from '@/components/NeonHeading'

/* shadcn UI components - adapt paths if your project differs */
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

type FormValues = {
  title: string
  slug: string
  excerpt: string
  imgFile?: FileList
  tags: string
  content: string
  date?: string
}

function makeSlug(s = '') {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function estimateReadTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const wpm = 200
  return Math.max(1, Math.ceil(words / wpm))
}

/* Small TagInput UI (comma separated + chips) */
function TagInput({ value = '', onChange }: { value?: string; onChange: (v: string) => void }) {
  const [input, setInput] = useState('')
  const tags = value ? value.split(',').map((t) => t.trim()).filter(Boolean) : []

  function addTagFromInput() {
    const t = input.trim()
    if (!t) return
    const newTags = [...tags, ...t.split(',').map(x => x.trim()).filter(Boolean)]
    onChange(Array.from(new Set(newTags)).join(', '))
    setInput('')
  }

  function removeTag(idx: number) {
    const newTags = tags.filter((_, i) => i !== idx)
    onChange(newTags.join(', '))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t, i) => (
          <div key={t + i} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 text-white text-sm">
            <span>{t}</span>
            <button type="button" onClick={() => removeTag(i)} className="text-xs opacity-80 hover:opacity-100">✕</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTagFromInput()
            }
          }}
          className="flex-1 rounded-md px-3 py-2 bg-white/6 border border-white/8 text-white placeholder:text-white/60"
          placeholder="Type tag and press Enter (e.g. Next.js)"
        />
        <Button type="button" onClick={addTagFromInput} className="bg-gradient-to-r from-cyan-400 to-indigo-600 text-black">
          Add
        </Button>
      </div>
    </div>
  )
}

export default function NewBlogPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      tags: '',
      content: '',
      date: new Date().toISOString().slice(0, 10)
    }
  })

  // watch individual fields
  const title = watch('title') || ''
  const excerpt = watch('excerpt') || ''
  const tags = watch('tags') || ''
  const slug = watch('slug') || ''
  const content = watch('content') || ''
  const date = watch('date') || new Date().toISOString().slice(0, 10)

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [slugLocked, setSlugLocked] = useState(false)

  // textarea ref: we need the underlying DOM element for caret insertion
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Register content while also keeping a handle to its ref so we can
  // attach textareaRef. This pattern extracts ref and other handlers.
  const contentReg = register('content', { required: true })
  const { ref: contentRef, ...contentProps } = contentReg

  // Load draft
  useEffect(() => {
    const d = localStorage.getItem('blog:draft')
    if (d) {
      try {
        const obj = JSON.parse(d)
        if (obj) {
          setValue('title', obj.title || '')
          setValue('excerpt', obj.excerpt || '')
          setValue('slug', obj.slug || '')
          setValue('tags', obj.tags || '')
          setValue('content', obj.content || '')
        }
      } catch (err) {
        // ignore parse errors
        console.warn('Could not load draft', err)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // autosave draft (debounced) — depend on actual fields
  useEffect(() => {
    const id = setTimeout(() => {
      const draft = {
        title,
        excerpt,
        slug,
        tags,
        content
      }
      try {
        localStorage.setItem('blog:draft', JSON.stringify(draft))
      } catch {
        // ignore storage errors (e.g., quota)
      }
    }, 1000)
    return () => clearTimeout(id)
  }, [title, excerpt, slug, tags, content])

  // auto-slug from title unless locked
  useEffect(() => {
    if (!slugLocked) {
      setValue('slug', makeSlug(title || ''))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slugLocked])

  // keyboard shortcut: Cmd/Ctrl+S to publish
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        const btn = document.getElementById('publish-btn') as HTMLButtonElement | null
        if (btn) btn.click()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function insertAtCaret(snippet: string) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const before = el.value.substring(0, start)
    const after = el.value.substring(end)
    const v = before + snippet + after
    setValue('content', v)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + snippet.length
      el.setSelectionRange(pos, pos)
    })
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const reader = new FileReader()
    reader.onload = () => setPreviewImage(String(reader.result))
    reader.readAsDataURL(file)
    // optionally call uploadToCloudinary(file) and set returned url as image
  }

  async function uploadToCloudinary(file: File) {
    setUploading(true)
    try {
      // Example unsigned upload (replace with your config if you want real uploads)
      // const data = new FormData()
      // data.append('file', file)
      // data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!)
      // const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', { method: 'POST', body: data })
      // const j = await res.json()
      // return j.secure_url
      await new Promise((r) => setTimeout(r, 800))
      return previewImage
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(data: FormValues) {
    try {
      let imageUrl: string | null = null
      const files = (document.getElementById('imgFile') as HTMLInputElement | null)?.files
      if (files && files.length > 0) {
        imageUrl = await uploadToCloudinary(files[0])
      }

      const payload = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        img: imageUrl || previewImage || '/images/blog/default.jpg',
        date: data.date || new Date().toISOString().slice(0, 10),
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
        content: data.content,
        author: {
          name: 'Aditya Kumar',
          avatar: '/images/authors/aditya.jpg'
        }
      }

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Save failed')
      localStorage.removeItem('blog:draft')
      const json = await res.json()
      router.push(json.url || `/blog/${payload.slug}`)
    } catch (err) {
      console.error(err)
      alert('Could not publish — check the console for details.')
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const readTime = estimateReadTime(content)

  return (
    <main className="pt-24 pb-20 bg-gradient-to-b from-transparent to-white/2 min-h-screen">
      <Container>
        <div className="mb-6">
          <NeonHeading>Create article</NeonHeading>
          <p className="text-gray-300 mt-2 max-w-2xl">Create a new blog post — the editor supports Markdown content, live preview, and autosaves drafts locally.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-3 ">
          {/* Left column */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1 space-y-4">
            <Card className="p-4 bg-white/5 border border-white/8 text-white">
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input {...register('title', { required: true })} placeholder="Post title" className="bg-white/3 text-white" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label>Slug</Label>
                    <Input {...register('slug', { required: true })} placeholder="auto-generated slug" className="bg-white/3 text-white" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-400">Lock</span>
                    <Switch checked={slugLocked} onCheckedChange={(v: any) => setSlugLocked(Boolean(v))} />
                  </div>
                </div>

                <div>
                  <Label>Excerpt</Label>
                  <Textarea {...register('excerpt', { required: true })} placeholder="Short summary shown on listing" rows={3} className="bg-white/3 text-white" />
                </div>

                <div>
                  <Label>Tags</Label>
                  <TagInput value={tags} onChange={(v) => setValue('tags', v)} />
                </div>

                <div>
                  <Label>Date</Label>
                  <Input type="date" {...register('date')} className="bg-white/3 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 border border-white/8 text-white">
              <Label>Hero image</Label>
              <input id="imgFile" type="file" accept="image/*" onChange={handleImageSelect} className="mt-2 text-sm text-gray-300" />
              {previewImage && (
                <div className="mt-3 rounded overflow-hidden w-full h-36 relative border border-white/6">
                  {/* preview */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewImage} alt="preview" className="object-cover w-full h-full" />
                </div>
              )}
              <div className="mt-3 text-xs text-gray-400">
                Upload or paste an image URL inside the content using markdown: <code>![alt](https://...)</code>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 border border-white/8 text-white">
              <Label>Editor tools</Label>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Button type="button" onClick={() => insertAtCaret('# ')} className="text-sm">H1</Button>
                <Button type="button" onClick={() => insertAtCaret('## ')} className="text-sm">H2</Button>
                <Button type="button" onClick={() => insertAtCaret('### ')} className="text-sm">H3</Button>
                <Button type="button" onClick={() => insertAtCaret('**bold**')} className="text-sm">Bold</Button>
                <Button type="button" onClick={() => insertAtCaret('`code`')} className="text-sm">Code</Button>
                <Button type="button" onClick={() => insertAtCaret('- ')} className="text-sm">List</Button>
                <Button type="button" onClick={() => insertAtCaret('![alt text](https://)')} className="text-sm">Image</Button>
                <Button type="button" onClick={() => insertAtCaret('[link text](https://)')} className="text-sm">Link</Button>
                <Button type="button" onClick={() => {
                  const lang = prompt('Language (e.g. js, ts,py,json)', 'js') || 'text'
                  insertAtCaret(`\`\`\`${lang}\n// your code here\n\`\`\`\n\n`)
                }} className="text-sm">Code block</Button>
              </div>

              <Separator className="my-3" />

              <div className="text-sm text-gray-300">
                <div>Words: <strong className="text-white">{wordCount}</strong></div>
                <div>Est. read time: <strong className="text-white">{readTime} min</strong></div>
                <div className="mt-2 text-xs text-gray-400">Tip: Press <kbd className="px-1 py-0.5 rounded bg-white/6">Ctrl/Cmd + S</kbd> to publish.</div>
              </div>
            </Card>
          </motion.div>

          {/* Right column - editor & preview */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2 space-y-4">
            <Card className="p-4 bg-white/6 border border-white/8">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-300">Content (Markdown)</div>
                  <div className="text-xs text-gray-400">Write your post in Markdown. Live preview updates as you type.</div>
                </div>
                <div className="text-xs text-gray-400">Preview sync • safe rendering</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Textarea
                    {...contentProps}
                    ref={(el) => {
                      // attach RHF ref and our textareaRef for caret insertion
                      if (typeof contentRef === 'function') contentRef(el)
                      else if (contentRef) (contentRef as any).current = el
                      textareaRef.current = el
                    }}
                    placeholder="Write your markdown content here..."
                    className="min-h-[520px] resize-none bg-black/30 text-white"
                  />
                </div>

                <div className="prose prose-invert max-w-none bg-black/30 text-white p-4 rounded min-h-[520px] overflow-auto">
                  {content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <div className="text-gray-400">Live preview will appear here as you type…</div>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-300">Draft autosaved to local storage.</div>
                <div className="flex items-center gap-2">
                  <Button id="publish-btn" type="submit" onClick={handleSubmit(onSubmit)} className="bg-gradient-to-r from-cyan-400 to-indigo-600 text-black" disabled={uploading}>
                    {uploading ? 'Publishing…' : 'Publish'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => { localStorage.removeItem('blog:draft'); alert('Draft cleared'); }}>
                    Clear draft
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </form>
      </Container>
    </main>
  )
}
