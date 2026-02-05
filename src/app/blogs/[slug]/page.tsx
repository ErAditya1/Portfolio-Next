// app/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Container } from "@/components/Container";
import "highlight.js/styles/github-dark.css";
import { BLOGS } from "@/Data";

/* ---------------- Utils ---------------- */

function extractHeadings(markdown: string) {
  const re = /^(##|###)\s+(.*)$/gm;
  const headings: { text: string; id: string; level: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    const level = match[1] === "###" ? 3 : 2;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    headings.push({ text, id, level });
  }

  return headings;
}

/* ---------------- Page ---------------- */

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const post = BLOGS.find((b) => b.slug === slug);

  if (!post) {
    return (
      <Container>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="mt-4 text-gray-500">
            We couldn&apos;t find the post you requested.
          </p>
        </div>
      </Container>
    );
  }

  const headings = extractHeadings(post.content);

  return (
    <main className="pt-20">
      <Container>
        <article className="max-w-5xl mx-auto">
          {/* ---------- Header ---------- */}
          <header className="space-y-4 mb-8">
            <div className="text-sm text-gray-400">
              {new Date(post.date).toLocaleDateString()}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-gray-300">{post.excerpt}</p>

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {post.author?.avatar && (
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              )}

              <div>
                <div className="font-medium">{post.author?.name}</div>
                <div className="text-sm text-gray-400">
                  {post.author?.bio}
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2 flex-wrap">
                {post.tags.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 rounded bg-slate-700/40"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {post.img && (
              <div className="mt-6 rounded-xl overflow-hidden h-72 relative">
                <Image
                  src={post.img}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}
          </header>

          {/* ---------- Content + Sidebar ---------- */}
          <div className="grid md:grid-cols-4 gap-8">
            {/* Article */}
            <div className="md:col-span-3 prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  rehypeAutolinkHeadings,
                  rehypeHighlight,
                ]}
                components={{
                  code({ className, children, ...props }) {
                    return (
                      <code
                        className={className ?? ""}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Sidebar */}
            <aside className="md:col-span-1 sticky top-24 space-y-6">
              {/* TOC */}
              {headings.length > 0 && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/8">
                  <h4 className="font-semibold">On this page</h4>
                  <nav className="mt-3 space-y-2 text-sm text-gray-300">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`block hover:text-white ${
                          h.level === 3 ? "ml-3 text-sm" : ""
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/8">
                <h4 className="font-semibold">Share</h4>
                <div className="mt-3 flex gap-2">
                  <a
                    className="px-3 py-2 bg-blue-600 rounded text-white"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      post.title,
                    )}&url=${encodeURIComponent(post.url || "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twitter
                  </a>
                  <a
                    className="px-3 py-2 bg-sky-700 rounded text-white"
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                      post.url || "",
                    )}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Recommended */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/8">
                <h4 className="font-semibold">Recommended</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {BLOGS.filter((b) => b.slug !== post.slug)
                    .slice(0, 3)
                    .map((b) => (
                      <li key={b.slug}>
                        <Link
                          href={`/blog/${b.slug}`}
                          className="hover:underline"
                        >
                          {b.title}
                        </Link>
                        <div className="text-xs text-gray-400">
                          {new Date(b.date).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </aside>
          </div>
        </article>
      </Container>
    </main>
  );
}
