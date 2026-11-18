"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, X, Upload, Github, Globe, Star } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "./RichTextEditor";

interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  coverImage: string;
  images: string[];
  featured: boolean;
  status: string;
  seoTitle: string;
  seoDescription: string;
}

const emptyForm: ProjectFormData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  techStack: [],
  githubUrl: "",
  liveUrl: "",
  coverImage: "",
  images: [],
  featured: false,
  status: "completed",
  seoTitle: "",
  seoDescription: "",
};

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData> & { _id?: string };
  editId?: string;
}

export function ProjectForm({ initialData, editId }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>(() => {
    const merged = { ...emptyForm, ...initialData };
    if (!merged.coverImage && merged.images && merged.images.length > 0) {
      merged.coverImage = merged.images[0];
    }
    return merged;
  });
  const [techInput, setTechInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-").trim();

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: autoSlug(val) }));
  };

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !form.techStack.includes(trimmed)) {
      setForm((f) => ({ ...f, techStack: [...f.techStack, trimmed] }));
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setForm((f) => ({ ...f, techStack: f.techStack.filter((t) => t !== tech) }));
  };

  const addImage = () => {
    const trimmed = imageInput.trim();
    if (trimmed && !form.images.includes(trimmed)) {
      const nextImages = [...form.images, trimmed];
      setForm((f) => ({
        ...f,
        images: nextImages,
        coverImage: f.coverImage || nextImages[0] || "",
      }));
      setImageInput("");
    }
  };

  const removeImage = (img: string) => {
    const nextImages = form.images.filter((i) => i !== img);
    setForm((f) => ({
      ...f,
      images: nextImages,
      coverImage: f.coverImage === img ? (nextImages[0] || "") : f.coverImage,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reader.result, folder: "portfolio/projects" }),
      });
      const data = await res.json();
      if (data.url) {
        const nextImages = [...form.images, data.url];
        setForm((f) => ({
          ...f,
          images: nextImages,
          coverImage: f.coverImage || nextImages[0] || "",
        }));
        toast.success("Image uploaded!");
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

    const url = editId ? `/api/projects/${editId}` : "/api/projects";
    const method = editId ? "PUT" : "POST";

    const payload = {
      ...form,
      coverImage: form.coverImage || form.images[0] || "",
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      toast.success(editId ? "Project updated!" : "Project created!");
      router.push("/admin/projects");
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to save project");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {editId ? "Edit Project" : "New Project"}
          </h1>
          <p className="text-gray-400 mt-1">
            {editId ? "Update project details" : "Add a new project to your portfolio"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Basic Info</h2>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="My Awesome Project"
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
              <label className="text-sm text-gray-400 mb-1.5 block">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={3}
                placeholder="Short project description..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">
                Case Study <span className="text-gray-500">· shown as “The Story &amp; Architecture” on the project page</span>
              </label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                uploadFolder="portfolio/projects"
                placeholder="Tell the story: the problem, what you built, key decisions, challenges and results. Paste or drop screenshots anywhere."
                minHeight={380}
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Images</h2>
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
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {form.images.map((img) => {
                  const isCover = form.coverImage === img || (!form.coverImage && form.images[0] === img);
                  return (
                    <div
                      key={img}
                      className={`relative group rounded-xl overflow-hidden aspect-video bg-gray-800 border-2 transition-all ${
                        isCover ? "border-purple-500 shadow-md shadow-purple-500/20" : "border-gray-700/60"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />

                      {isCover && (
                        <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-white" /> Cover Image
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, coverImage: img }))}
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Set as Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(img)}
                          className="w-7 h-7 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
                          title="Delete image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                placeholder="Overrides default title in search results"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">SEO Description</label>
              <textarea
                value={form.seoDescription}
                onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                rows={2}
                placeholder="Overrides default description in search results"
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
              {saving ? "Saving..." : editId ? "Update Project" : "Create Project"}
            </button>
            <Link href="/admin/projects" className="block text-center text-sm text-gray-400 hover:text-gray-300 transition-colors py-1">
              Cancel
            </Link>
          </div>

          {/* Featured */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-white font-medium flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Featured
                </p>
                <p className="text-gray-500 text-xs mt-0.5">Show on homepage</p>
              </div>
              <div
                onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                className={`relative w-10 h-6 rounded-full transition-colors ${form.featured ? "bg-yellow-500" : "bg-gray-700"}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.featured ? "translate-x-4" : ""}`} />
              </div>
            </label>
          </div>

          {/* Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-medium">Project Status</h3>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="completed">Completed</option>
              <option value="building">Currently Building</option>
            </select>
            <p className="text-[10px] text-gray-500 italic">Changing to &apos;Building&apos; shows a special badge on the card.</p>
          </div>

          {/* Links */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-medium">Links</h3>
            <div>
              <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1">
                <Github className="w-3 h-3" /> GitHub URL
              </label>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                placeholder="https://github.com/..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1">
                <Globe className="w-3 h-3" /> Live URL
              </label>
              <input
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-white font-medium">Tech Stack</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                placeholder="e.g. React"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button type="button" onClick={addTech} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white p-2 rounded-lg">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.techStack.map((tech) => (
                <span key={tech} className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full">
                  {tech}
                  <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-400">
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
