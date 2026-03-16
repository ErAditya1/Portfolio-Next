"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Eye, Search, Tag, Clock } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  views: number;
  readTime: number;
  published: boolean;
  createdAt: string;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBlogs = async () => {
    const res = await fetch(`/api/blogs?limit=100${search ? `&search=${search}` : ""}`);
    const data = await res.json();
    setBlogs(data.blogs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post permanently?")) return;
    setDeleting(id);
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } else {
      toast.error("Failed to delete");
    }
    setDeleting(null);
  };

  const togglePublished = async (blog: Blog) => {
    const res = await fetch(`/api/blogs/${blog._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !blog.published }),
    });
    if (res.ok) {
      toast.success(blog.published ? "Unpublished" : "Published");
      setBlogs((prev) =>
        prev.map((b) => (b._id === blog._id ? { ...b, published: !b.published } : b))
      );
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 mt-1">{blogs.length} total posts</p>
        </div>
        <Link
          href="/admin/blogs/create"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Title</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Tags</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Stats</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Status</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-600 py-12">No blog posts found. Create one!</td>
                  </tr>
                )}
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{blog.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">/{blog.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />{tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && <span className="text-xs text-gray-500">+{blog.tags.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}m</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <button onClick={() => togglePublished(blog)} className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${blog.published ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-gray-800 text-gray-500 border-gray-700 hover:text-gray-400"}`}>
                        {blog.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blogs/edit/${blog._id}`} className="text-blue-400 hover:text-blue-300 transition-colors p-1">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(blog._id)} disabled={deleting === blog._id} className="text-red-400 hover:text-red-300 transition-colors p-1 disabled:opacity-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
