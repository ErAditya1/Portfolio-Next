import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { ViewTracker } from "@/components/public/ViewTracker";
import { ImageCarousel } from "@/components/public/ImageCarousel";

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

  // Fetch suggested blogs (next and previous)
  const [nextBlog, prevBlog] = await Promise.all([
    Blog.findOne({ published: true, createdAt: { $gt: blog.createdAt } }).sort({ createdAt: 1 }).select("slug title").lean(),
    Blog.findOne({ published: true, createdAt: { $lt: blog.createdAt } }).sort({ createdAt: -1 }).select("slug title").lean(),
  ]);

  const allImages = blog.images?.length > 0 ? blog.images : (blog.coverImage ? [blog.coverImage] : []);

  return (
    <main className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />

      <ViewTracker type="blog" slug={slug} />
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition-colors group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Header Section */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="text-[10px] px-3 py-1 bg-card border border-border text-muted-foreground rounded-full uppercase tracking-widest font-bold shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-foreground leading-[1.1] tracking-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 p-[1px]">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/aditya_profile.png" alt="Aditya" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground">Aditya Kumar</span>
             </div>
             <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground border-l border-border pl-6">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{blog.readTime} min read</span>
                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{blog.views} views</span>
                <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
             </div>
          </div>
        </div>

        {/* Hero Image / Carousel */}
        {allImages.length > 0 && (
          <div className="mb-16">
            <ImageCarousel images={allImages} title={blog.title} />
          </div>
        )}

        {/* Content */}
        <article className="max-w-3xl mx-auto mb-20">
          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none 
            prose-headings:text-foreground prose-headings:font-black tracking-tight
            prose-p:text-muted-foreground prose-p:leading-[1.8]
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-code:text-pink-600 dark:prose-code:text-pink-300 prose-code:bg-accent prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
            prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-2xl prose-pre:p-6 prose-pre:shadow-sm
            prose-blockquote:border-primary prose-blockquote:bg-accent/50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-foreground prose-blockquote:font-medium
            prose-img:rounded-3xl prose-img:border prose-img:border-border prose-img:shadow-md"
          >
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </article>

        {/* Suggested Blogs */}
        <div className="pt-12 border-t border-border">
          <h3 className="text-xl font-bold text-foreground mb-8">Suggested Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevBlog ? (
              <Link href={`/blog/${prevBlog.slug}`} className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Previous Post
                </span>
                <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{prevBlog.title}</span>
              </Link>
            ) : <div />}
            
            {nextBlog ? (
              <Link href={`/blog/${nextBlog.slug}`} className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all flex flex-col gap-2 text-right">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 justify-end">
                  Next Post <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{nextBlog.title}</span>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>
    </main>
  );
}

