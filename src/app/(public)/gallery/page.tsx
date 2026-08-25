import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Gallery from "@/models/Gallery";
import { GalleryPageClient, GalleryCardItem } from "@/components/public/GalleryPageClient";

export const revalidate = 60; // Dynamic ISR revalidation every 60 seconds

export const metadata: Metadata = {
  title: "Moments That Tell My Journey | Aditya Kumar",
  description: "A visual showcase of projects, designs, milestones and memories that reflect my passion and growth as a developer.",
};

export default async function GalleryPage() {
  let dbGallery: GalleryCardItem[] = [];

  try {
    await connectDB();
    const galleryRaw = await Gallery.find().sort({ order: 1 }).lean();

    if (galleryRaw && galleryRaw.length > 0) {
      dbGallery = JSON.parse(JSON.stringify(galleryRaw)).map((g: Record<string, unknown>) => ({
        id: String(g._id || g.title),
        title: String(g.title || ""),
        category: String(g.category || "Projects"),
        imageUrl: String(g.imageUrl || ""),
        description: g.description ? String(g.description) : undefined,
        badgeIcon: "📷",
        badgeLabel: String(g.title || "Gallery Item"),
      }));
    }
  } catch (e) {
    console.error("MongoDB fetching error on Gallery Page:", e);
  }

  return <GalleryPageClient initialItems={dbGallery} />;
}
