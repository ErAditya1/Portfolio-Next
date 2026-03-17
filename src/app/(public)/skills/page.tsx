import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { SkillsSection } from "@/components/public/SkillsSection";
import { ISiteSettings } from "@/types";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Skills & Expertise | Aditya Kumar",
  description: "Detailed overview of my technical stack, including backend engineering, system architecture, and emerging expertise.",
  keywords: ["Skills", "Tech Stack", "Backend", "System Design", "Node.js", "MongoDB", "BullMQ"],
};

export default async function SkillsPage() {
  await connectDB();
  const settingsRaw = await SiteSettings.findOne().lean();
  const settings = JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings;

  return (
    <main className="pt-32 pb-20 relative overflow-hidden min-h-screen">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <Container>
        <div className="text-center mb-20 space-y-4">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.4em]">Efficiency & Logic</span>
          <NeonHeading>My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">Technical</span> Universe</NeonHeading>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            A comprehensive breakdown of the tools and technologies I use to architect high-performance digital systems.
          </p>
        </div>


        {/* Specialized Focus Section */}
        <section className="mt-32 grid md:grid-cols-3 gap-8">
           <div className="p-8 bg-card border border-border rounded-3xl backdrop-blur-sm shadow-sm hover:border-blue-500/50 transition-colors group">
             <div className="text-blue-500 font-black text-4xl mb-4 group-hover:-translate-y-1 transition-transform">01.</div>
             <h3 className="text-foreground font-bold text-xl mb-4">Distributed Systems</h3>
             <p className="text-muted-foreground text-sm leading-relaxed">Handling tasks across multiple nodes with BullMQ and Redis for maximum throughput and reliability.</p>
           </div>
           <div className="p-8 bg-card border border-border rounded-3xl backdrop-blur-sm shadow-sm hover:border-purple-500/50 transition-colors group">
             <div className="text-purple-500 font-black text-4xl mb-4 group-hover:-translate-y-1 transition-transform">02.</div>
             <h3 className="text-foreground font-bold text-xl mb-4">Data Scraping</h3>
             <p className="text-muted-foreground text-sm leading-relaxed">Extracting insights from complex social platforms while navigating rate limits and headless browser challenges.</p>
           </div>
           <div className="p-8 bg-card border border-border rounded-3xl backdrop-blur-sm shadow-sm hover:border-pink-500/50 transition-colors group">
             <div className="text-pink-500 font-black text-4xl mb-4 group-hover:-translate-y-1 transition-transform">03.</div>
             <h3 className="text-foreground font-bold text-xl mb-4">API Architecture</h3>
             <p className="text-muted-foreground text-sm leading-relaxed">Designing RESTful and GraphQL endpoints that are secure, documented, and easy to consume.</p>
           </div>
        </section>
        <SkillsSection settings={settings} />
      </Container>
    </main>
  );
}
