"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Upload, X, Star } from "lucide-react";
import Link from "next/link";

interface GalleryFormData {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  order: number;
  featured: boolean;
}

const emptyForm: GalleryFormData = {
  title: "",
  description: "",
  imageUrl: "",
  category: "General",
  order: 0,
  featured: false,
};

interface GalleryFormProps {
  initialData?: Partial<GalleryFormData> & { _id?: string };
  editId?: string;
}

export function GalleryForm({ initialData, editId }: GalleryFormProps) {
  const [form, setForm] = useState<GalleryFormData>({ ...emptyForm, ...initialData });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reader.result, folder: "portfolio/gallery" }),
      });
      const data = await res.json();
      if (data.url) {
        setForm((f) => ({ ...f, imageUrl: data.url }));
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
    if (!form.imageUrl) return toast.error("Please upload an image");
    
    setSaving(true);
    const url = editId ? `/api/gallery/${editId}` : "/api/gallery";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      toast.success(editId ? "Gallery item updated!" : "Gallery item created!");
      router.push("/admin/gallery");
    } else {
      toast.error("Failed to save gallery item");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {editId ? "Edit Gallery Item" : "New Gallery Item"}
          </h1>
          <p className="text-gray-400 mt-1">
            {editId ? "Update image details" : "Add a new image to your visual gallery"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Metadata</h2>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                placeholder="Image Title"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Brief description of this image..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Image Upload</h2>
            {!form.imageUrl ? (
              <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-xl p-12 hover:border-purple-500/50 transition-colors cursor-pointer ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}>
                <Upload className="w-10 h-10 text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium">Click to upload image</p>
                <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP up to 5MB</p>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
              </label>
            ) : (
              <div className="relative group rounded-xl overflow-hidden aspect-video bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm(f => ({ ...f, imageUrl: "" }))} className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-60"
            >
              {saving ? "Saving..." : editId ? "Update Item" : "Create Item"}
            </button>
            <Link href="/admin/gallery" className="block text-center text-sm text-gray-400 hover:text-gray-300 transition-colors py-1">
              Cancel
            </Link>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm">Organize</h2>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="General">General</option>
                <option value="Architecture">Architecture</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Milestones">Milestones</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <label className="flex items-center justify-between cursor-pointer pt-2">
              <span className="text-sm text-white font-medium flex items-center gap-2">
                <Star className={`w-4 h-4 ${form.featured ? "text-yellow-400" : "text-gray-600"}`} fill={form.featured ? "currentColor" : "none"} />
                Featured
              </span>
              <div
                onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                className={`relative w-10 h-6 rounded-full transition-colors ${form.featured ? "bg-yellow-500" : "bg-gray-700"}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.featured ? "translate-x-4" : ""}`} />
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
