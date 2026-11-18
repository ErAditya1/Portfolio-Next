import { Metadata } from "next";
import { pageMeta } from "@/lib/seo/meta";
import { JsonLd } from "@/components/public/JsonLd";
import { graph, webPageNode, itemListNode, breadcrumbNode } from "@/lib/seo/schema";
import { PERSON_ID } from "@/lib/seo/site";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { BlogPageClient, BlogItem } from "@/components/public/BlogPageClient";

export const revalidate = 60; // Dynamic revalidation every 60s for fresh database blogs

export const metadata: Metadata = pageMeta({
  title: "Blog — Next.js, Node.js & AI Engineering",
  description:
    "Articles by Aditya Kumar on Next.js, Node.js and NestJS backends, BullMQ job queues, web scraping, AI voice agents, MCP and the projects behind them.",
  path: "/blog",
});

export default async function BlogPage() {
  let dbBlogs: BlogItem[] = [];

  try {
    await connectDB();
    const rawBlogs = await Blog.find({ published: true }).sort({ createdAt: -1 }).lean();
    if (rawBlogs && rawBlogs.length > 0) {
      dbBlogs = JSON.parse(JSON.stringify(rawBlogs)).map((b: Record<string, unknown>) => ({
        _id: String(b._id || b.slug),
        title: String(b.title || ""),
        slug: String(b.slug || ""),
        excerpt: String(b.excerpt || ""),
        content: String(b.content || ""),
        coverImage: String(b.coverImage || b.img || ""),
        tags: Array.isArray(b.tags) ? b.tags : ["General"],
        views: Number(b.views || 0),
        readTime: Number(b.readTime || 5),
        published: Boolean(b.published),
        createdAt: b.createdAt
          ? new Date(String(b.createdAt)).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
        updatedAt: String(b.updatedAt || new Date().toISOString()),
      }));
    }
  } catch (error) {
    console.error("MongoDB dynamic query error on Blog Page:", error);
  }

  // Strictly use database blogs only (no static fallbacks)
  const blogs: BlogItem[] = dbBlogs;

  // Dynamically compute topic counts strictly from database blogs
  const topicMap: Record<string, number> = {};
  blogs.forEach((b) => {
    (b.tags || []).forEach((t) => {
      const normalized = t.trim();
      if (normalized) {
        topicMap[normalized] = (topicMap[normalized] || 0) + 1;
      }
    });
  });

  const popularTopics = Object.entries(topicMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            type: ["CollectionPage", "Blog"],
            path: "/blog",
            name: "Aditya Kumar's Blog",
            mainEntity: itemListNode(blogs.map((b) => ({ name: b.title, path: `/blog/${b.slug}` }))),
            extra: { author: { "@id": PERSON_ID }, publisher: { "@id": PERSON_ID } },
          }),
          breadcrumbNode([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])
        )}
      />
      <BlogPageClient initialBlogs={blogs} popularTopics={popularTopics} />
    </>
  );
}
