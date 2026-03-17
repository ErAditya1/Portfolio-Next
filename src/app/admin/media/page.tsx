"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Upload, Copy, Trash2, FileText, Search, Image as ImageIcon, Filter, ExternalLink } from "lucide-react";

interface MediaItem {
  _id: string;
  url: string;
  publicId: string;
  filename: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchMedia = async () => {
    try {
      const type = typeFilter === "all" ? "" : typeFilter;
      const res = await fetch(`/api/media?search=${search}&type=${type}`);
      const data = await res.json();
      setMedia(data || []);
    } catch (error) {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);

    for (const file of files) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onloadend = async () => {
          try {
            const res = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                file: reader.result, 
                folder: file.type.includes('pdf') ? "portfolio/documents" : "portfolio/media" 
              }),
            });
            const data = await res.json();
            if (data._id) {
              setMedia((prev) => [data, ...prev]);
            }
          } catch (error) {
            toast.error(`Failed to upload ${file.name}`);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setUploading(false);
    toast.success("Upload complete!");
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const removeMedia = async (item: MediaItem) => {
    if (!confirm("Permanently delete this item?")) return;
    
    try {
      const res = await fetch(`/api/media?id=${item._id}&publicId=${item.publicId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m._id !== item._id));
        toast.success("Deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Library</h1>
          <p className="text-gray-400 mt-1">Manage images and documents centrally</p>
        </div>
        <label className={`flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all cursor-pointer ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}>
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Media"}
          <input type="file" accept="image/*,.pdf" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
          <button onClick={() => setTypeFilter("all")} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${typeFilter === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            All
          </button>
          <button onClick={() => setTypeFilter("image")} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${typeFilter === 'image' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            Images
          </button>
          <button onClick={() => setTypeFilter("raw")} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${typeFilter === 'raw' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            Files
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="aspect-square bg-gray-900 animate-pulse rounded-xl border border-gray-800" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-2xl p-20 text-center">
            <ImageIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No media items found</p>
            <p className="text-gray-600 text-sm mt-1">Upload assets to use them anywhere on your site</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item._id} className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden aspect-square hover:border-purple-500/50 transition-all flex flex-col">
              <div className="flex-1 relative flex items-center justify-center bg-black/20 overflow-hidden">
                {item.resourceType === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12 text-purple-400" />
                    <span className="text-[10px] text-gray-500 uppercase font-black">{item.format}</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(item.url)} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors" title="Copy URL">
                    <Copy className="w-4 h-4" />
                  </button>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors" title="View Full">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => removeMedia(item)} className="w-9 h-9 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center text-red-400 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2.5 bg-gray-900/80 border-t border-gray-800">
                <p className="text-white text-[10px] font-bold truncate">{item.filename}</p>
                <div className="flex justify-between items-center mt-1">
                   <span className="text-[9px] text-gray-500">{formatSize(item.bytes)}</span>
                   {item.width && <span className="text-[9px] text-gray-500">{item.width}x{item.height}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
