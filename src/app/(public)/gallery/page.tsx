import { connectDB } from "@/lib/db";
import Gallery from "@/models/Gallery";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { IGallery } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Visual Gallery | Aditya Kumar",
  description: "A showcase of system architectures, UI designs, and the development process behind Aditya's engineering projects.",
  keywords: ["Gallery", "System Design", "UI Design", "Aditya Kumar", "Software Engineering Visuals"],
};

export default async function GalleryPage() {
  await connectDB();
  
  const galleryRaw = await Gallery.find().sort({ order: 1 }).lean();
  const items = JSON.parse(JSON.stringify(galleryRaw)) as IGallery[];

  return (
    <main className="pt-32 pb-20 relative overflow-hidden min-h-screen">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <Container>
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.4em]">Visual Storytelling</span>
          <NeonHeading>My <span className="text-gradient">Creative</span> Workspace</NeonHeading>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            A curated look at the blueprints, interfaces, and technical milestones that define my engineering journey.
          </p>
        </div>

        <GalleryGrid items={items} />

        {/* Dynamic CTA */}
        <section className="mt-24 p-12 bg-card border border-border rounded-[3rem] text-center backdrop-blur-md shadow-sm">
           <h3 className="text-2xl font-bold text-foreground mb-4">See something interesting?</h3>
           <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Most of these visuals represent deeper technical case studies. Explore the engineering behind them in my projects section.</p>
           <Link href="/projects" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
             View All Case Studies
           </Link>
        </section>
      </Container>
    </main>
  );
}
