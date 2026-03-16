"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Upload, Copy, Trash2, Image as ImageIcon } from "lucide-react";

interface UploadedImage {
  url: string;
  publicId: string;
}

export default function AdminMedia() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);

    for (const file of files) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onloadend = async () => {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: reader.result, folder: "portfolio/media" }),
          });
          const data = await res.json();
          if (data.url) {
            setImages((prev) => [{ url: data.url, publicId: data.publicId }, ...prev]);
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
    toast.success("URL copied!");
  };

  const removeImage = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Library</h1>
          <p className="text-gray-400 mt-1">Upload and manage your images</p>
        </div>
        <label className={`flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all cursor-pointer ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}>
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Images"}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="bg-gray-900 border-2 border-dashed border-gray-800 rounded-2xl p-16 text-center">
          <ImageIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No images uploaded yet</p>
          <p className="text-gray-600 text-sm mt-1">Upload images to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.publicId} className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden aspect-square hover:border-purple-500/50 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(img.url)} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors" title="Copy URL">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => removeImage(img.publicId)} className="w-9 h-9 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center text-red-400 transition-colors" title="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
