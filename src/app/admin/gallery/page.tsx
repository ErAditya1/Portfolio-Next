"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Star, Search, Image as ImageIcon, ExternalLink } from "lucide-react";

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  order: number;
  externalUrl?: string;
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch(`/api/gallery?search=${search}`);
    const data = await res.json();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image from gallery?")) return;
    setDeleting(id);
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Item removed");
      setItems((prev) => prev.filter((i) => i._id !== id));
    } else {
      toast.error("Failed to delete");
    }
    setDeleting(null);
  };

  const toggleFeatured = async (item: GalleryItem) => {
    const res = await fetch(`/api/gallery/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });
    if (res.ok) {
      toast.success(item.featured ? "Unfeatured" : "Marked as featured");
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, featured: !i.featured } : i))
      );
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Visual Gallery</h1>
          <p className="text-gray-400 mt-1">{items.length} total items in your gallery</p>
        </div>
        <Link
          href="/admin/gallery/create"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </Link>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search gallery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
             <div key={n} className="aspect-square bg-gray-900/50 animate-pulse rounded-xl border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.length === 0 && (
            <div className="col-span-full py-16 text-center bg-gray-900 border border-gray-800 rounded-2xl">
              <ImageIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No gallery items found.</p>
            </div>
          )}
          {items.map((item) => (
            <div key={item._id} className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden aspect-square hover:border-purple-500/50 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                  <button onClick={() => toggleFeatured(item)} className={`${item.featured ? "text-yellow-400" : "text-white/40 hover:text-white"}`}>
                    <Star className="w-5 h-5" fill={item.featured ? "currentColor" : "none"} />
                  </button>
                  <div className="flex gap-2">
                    <Link href={`/admin/gallery/edit/${item._id}`} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    {item.externalUrl && (
                      <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-bold truncate">{item.title}</p>
                  <p className="text-white/60 text-[10px] uppercase tracking-wider">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
