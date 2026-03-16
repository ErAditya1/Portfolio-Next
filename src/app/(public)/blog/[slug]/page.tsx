import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Tag } from "lucide-react";
import { ViewTracker } from "@/components/public/ViewTracker";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug, published: true }).lean();
  if (!blog) return { title: "Post Not Found" };

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt,
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export async function generateStaticParams() {
  await connectDB();
  const blogs = await Blog.find({ published: true }, "slug").lean();
  return blogs.map((b) => ({ slug: b.slug }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  await connectDB();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug, published: true }).lean();
  if (!blog) notFound();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <ViewTracker type="blog" slug={slug} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Cover Image */}
        {blog.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blog.coverImage} alt={blog.title} className="w-full aspect-video object-cover rounded-2xl mb-8 border border-gray-800" />
        )}

        {/* Header */}
        <div className="mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag: string) => (
              <Link key={tag} href={`/blog?tag=${tag}`} className="text-xs px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full flex items-center gap-1 hover:bg-blue-500/20 transition-colors">
                <Tag className="w-2.5 h-2.5" />#{tag}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{blog.title}</h1>
          <p className="text-gray-400 text-lg mb-4">{blog.excerpt}</p>

          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{blog.readTime} min read</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{blog.views} views</span>
            <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        <hr className="border-gray-800 mb-8" />

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-code:text-pink-300 prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-blockquote:border-purple-500 prose-blockquote:text-gray-400">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      </div>
    </main>
  );
}
