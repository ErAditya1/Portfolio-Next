import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Link from "next/link";
import { Clock, Eye, Tag, ArrowRight } from "lucide-react";
import { SearchInput } from "@/components/public/SearchInput";
import { IBlog } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and thoughts on web development, programming, and technology.",
};

interface PageProps {
  searchParams: Promise<{ search?: string; tag?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { search = "", tag = "", page = "1" } = await searchParams;
  await connectDB();

  const query: Record<string, unknown> = { published: true };
  if (search) query.$text = { $search: search };
  if (tag) query.tags = tag;

  const currentPage = parseInt(page);
  const limit = 9;
  const skip = (currentPage - 1) * limit;

  const [blogsRaw, total, allTags] = await Promise.all([
    Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Blog.countDocuments(query),
    Blog.distinct("tags", { published: true }),
  ]);

  const blogs = JSON.parse(JSON.stringify(blogsRaw)) as IBlog[];

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Thoughts on code, design, and everything in between.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <SearchInput placeholder="Search articles..." defaultValue={search} />
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <Link href="/blog" className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!tag ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-gray-900 text-gray-400 border-gray-800 hover:text-gray-300"}`}>
              All
            </Link>
            {allTags.map((t: string) => (
              <Link
                key={t}
                href={`/blog?tag=${t}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${tag === t ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-gray-900 text-gray-400 border-gray-800 hover:text-gray-300"}`}
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        {/* Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id.toString()}
                href={`/blog/${blog.slug}`}
                className="group bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {blog.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={blog.coverImage} alt={blog.title} className="w-full aspect-video object-cover" />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {blog.tags.slice(0, 2).map((t: string) => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />{t}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-white font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">{blog.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">{blog.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 text-gray-600 text-xs">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/blog?page=${p}${search ? `&search=${search}` : ""}${tag ? `&tag=${tag}` : ""}`}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${p === currentPage ? "bg-blue-600 text-white" : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"}`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
