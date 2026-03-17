"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default function EditGalleryPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/gallery/${id}`)
      .then((r) => r.json())
      .then(setItem)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Gallery item not found</p>
      </div>
    );
  }

  return <GalleryForm initialData={item} editId={id} />;
}
