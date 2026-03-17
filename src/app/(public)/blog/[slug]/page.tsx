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
    title: blog.seoTitle || `${blog.title} | Blog`,
    description: blog.seoDescription || blog.excerpt,
    keywords: [...(blog.tags || []), "Aditya Kumar Blog", "Developer Insights", "Full-Stack Development", "Tech Articles"],
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
      type: "article",
      authors: ["Aditya Kumar"],
      publishedTime: blog.createdAt.toString(),
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
    <main className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />

      <ViewTracker type="blog" slug={slug} />
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Header Section */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-full uppercase tracking-widest font-bold">
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[1px]">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    <img src="/images/aditya_profile.png" alt="Aditya" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-sm font-bold text-white">Aditya Kumar</span>
             </div>
             <div className="flex items-center gap-4 text-xs font-medium text-gray-500 border-l border-gray-800 pl-6">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{blog.readTime} min read</span>
                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{blog.views} views</span>
                <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
             </div>
          </div>
        </div>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl mb-16">
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Content */}
        <article className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-headings:font-black tracking-tight
            prose-p:text-gray-400 prose-p:leading-[1.8]
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-pink-300 prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
            prose-pre:bg-gray-900/80 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl prose-pre:p-6
            prose-blockquote:border-purple-500 prose-blockquote:bg-purple-500/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-gray-300 prose-blockquote:font-medium
            prose-img:rounded-3xl prose-img:border prose-img:border-white/5 prose-img:shadow-xl"
          >
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </article>
      </div>
    </main>
  );
}
