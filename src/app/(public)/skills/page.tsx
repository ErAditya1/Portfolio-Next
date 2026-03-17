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
          <span className="text-purple-500 font-bold text-xs uppercase tracking-[0.4em]">Efficiency & Logic</span>
          <NeonHeading>My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Technical</span> Universe</NeonHeading>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            A comprehensive breakdown of the tools and technologies I use to architect high-performance digital systems.
          </p>
        </div>

        <SkillsSection settings={settings} />

        {/* Specialized Focus Section */}
        <section className="mt-32 grid md:grid-cols-3 gap-8">
           <div className="p-8 bg-gray-900/40 border border-white/5 rounded-3xl backdrop-blur-sm">
             <div className="text-purple-400 font-black text-4xl mb-4">01.</div>
             <h3 className="text-white font-bold text-xl mb-4">Distributed Systems</h3>
             <p className="text-gray-500 text-sm leading-relaxed">Handling tasks across multiple nodes with BullMQ and Redis for maximum throughput and reliability.</p>
           </div>
           <div className="p-8 bg-gray-900/40 border border-white/5 rounded-3xl backdrop-blur-sm">
             <div className="text-blue-400 font-black text-4xl mb-4">02.</div>
             <h3 className="text-white font-bold text-xl mb-4">Data Scraping</h3>
             <p className="text-gray-500 text-sm leading-relaxed">Extracting insights from complex social platforms while navigating rate limits and headless browser challenges.</p>
           </div>
           <div className="p-8 bg-gray-900/40 border border-white/5 rounded-3xl backdrop-blur-sm">
             <div className="text-pink-400 font-black text-4xl mb-4">03.</div>
             <h3 className="text-white font-bold text-xl mb-4">API Architecture</h3>
             <p className="text-gray-500 text-sm leading-relaxed">Designing RESTful and GraphQL endpoints that are secure, documented, and easy to consume.</p>
           </div>
        </section>
      </Container>
    </main>
  );
}
