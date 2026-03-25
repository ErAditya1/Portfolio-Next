"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import Link from "next/link";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  images: string[];
  tags: string[];
  published: boolean;
  seoTitle: string;
  seoDescription: string;
}

const emptyForm: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  images: [],
  tags: [],
  published: false,
  seoTitle: "",
  seoDescription: "",
};

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  editId?: string;
}

export function BlogForm({ initialData, editId }: BlogFormProps) {
  const [form, setForm] = useState<BlogFormData>({ ...emptyForm, ...initialData });
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-").trim();

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: autoSlug(val) }));
  };

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((f) => ({ ...f, tags: [...f.tags, trimmed] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reader.result, folder: "portfolio/blogs" }),
      });
      const data = await res.json();
      if (data.url) {
        setForm((f) => ({ ...f, coverImage: data.url }));
        toast.success("Cover uploaded!");
      } else {
        toast.error("Upload failed");
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const addImage = () => {
    const trimmed = imageInput.trim();
    if (trimmed && !form.images.includes(trimmed)) {
      setForm((f) => ({ ...f, images: [...f.images, trimmed] }));
      setImageInput("");
    }
  };

  const removeImage = (img: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== img) }));
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reader.result, folder: "portfolio/blogs" }),
      });
      const data = await res.json();
      if (data.url) {
        setForm((f) => ({ ...f, images: [...f.images, data.url] }));
        toast.success("Image added to gallery!");
      } else {
        toast.error("Upload failed");
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = editId ? `/api/blogs/${editId}` : "/api/blogs";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      toast.success(editId ? "Blog updated!" : "Blog created!");
      router.push("/admin/blogs");
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to save blog");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">{editId ? "Edit Blog" : "New Blog Post"}</h1>
          <p className="text-gray-400 mt-1">{editId ? "Update your blog post" : "Write a new blog post"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Content</h2>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="My Blog Post Title"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Excerpt *</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                required
                rows={2}
                placeholder="Short description shown in listings..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Content (Markdown / HTML) *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                required
                rows={18}
                placeholder="# Heading&#10;&#10;Write your blog content in Markdown..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none font-mono text-sm"
              />
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Blog Gallery</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                placeholder="Paste image URL..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button type="button" onClick={addImage} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                Add URL
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className={`flex items-center gap-2 cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}>
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {form.images.map((img) => (
                  <div key={img} className="relative group rounded-lg overflow-hidden aspect-video bg-gray-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(img)} className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">SEO</h2>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">SEO Title</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                placeholder="Overrides default in search results"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">SEO Description</label>
              <textarea
                value={form.seoDescription}
                onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                rows={2}
                placeholder="Meta description for search engines"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-60"
            >
              {saving ? "Saving..." : editId ? "Update Post" : "Create Post"}
            </button>
            <Link href="/admin/blogs" className="block text-center text-sm text-gray-400 hover:text-gray-300 transition-colors py-1">
              Cancel
            </Link>
          </div>

          {/* Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-white font-medium">Published</p>
                <p className="text-gray-500 text-xs mt-0.5">Visible to the public</p>
              </div>
              <div
                onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${form.published ? "bg-emerald-500" : "bg-gray-700"}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.published ? "translate-x-4" : ""}`} />
              </div>
            </label>
          </div>

          {/* Cover Image */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-medium">Cover Image</h3>
            {form.coverImage && (
              <div className="relative rounded-lg overflow-hidden aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm((f) => ({ ...f, coverImage: "" }))} className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
              placeholder="Paste image URL..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
            />
            <label className={`flex items-center gap-2 cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors justify-center ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}>
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Cover"}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          {/* Tags */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-medium">Tags</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="e.g. react"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button type="button" onClick={addTag} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white p-2 rounded-lg">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
