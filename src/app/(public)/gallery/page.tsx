import { Metadata } from "next";
import { pageMeta } from "@/lib/seo/meta";
import { connectDB } from "@/lib/db";
import Gallery from "@/models/Gallery";
import { GalleryPageClient, GalleryCardItem } from "@/components/public/GalleryPageClient";

export const revalidate = 60; // Dynamic ISR revalidation every 60 seconds

export const metadata: Metadata = pageMeta({
  title: "Gallery — Projects, Designs & Milestones",
  description:
    "Screenshots, architecture sketches and milestones from Aditya Kumar's work as a full stack developer: dashboards, system designs and product launches.",
  path: "/gallery",
});

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
