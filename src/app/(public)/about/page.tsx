import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { Container } from "@/components/Container";
import { SkillsSection } from "@/components/public/SkillsSection";
import Image from "next/image";
import { ISiteSettings } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import AboutSection from "@/components/public/AboutSection";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Origin & Vision | Aditya Kumar",
  description: "Explore the journey of Aditya Kumar — Backend Engineer and System Architect focused on scalable scrapers and robust engineering.",
  keywords: ["Aditya Kumar", "Backend Engineer", "Software Architect", "Web Scraper Expert", "NestJS", "BullMQ"],
};

export default async function AboutPage() {
  await connectDB();
  const settingsRaw = await SiteSettings.findOne().lean();
  const settings = JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings;

  const name = settings?.ownerName || "Aditya Kumar";
  const avatar = settings?.avatarUrl || "/images/aditya_profile.png";

  return (
    <main className="pt-32 pb-20 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <Container>
       

        <AboutSection settings={settings} />
        <SkillsSection settings={settings} />

        {/* Dynamic Philosophy Section */}
        <section className="mt-32 relative py-24 rounded-[4rem] overflow-hidden border border-border bg-card shadow-sm backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
          <Container >
            <div className="max-w-3xl mx-auto text-center space-y-12">
              <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Engineering Philosophy</h2>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="p-8 bg-accent/30 border border-border rounded-3xl">
                  <h3 className="text-xl font-bold text-foreground mb-4">Code as Craft</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">I believe every line of code should be intentional. Clean architecture isn&apos;t a luxury; it&apos;s a prerequisite for sustainable growth.</p>
                </div>
                <div className="p-8 bg-accent/30 border border-border rounded-3xl">
                  <h3 className="text-xl font-bold text-foreground mb-4">Scalability First</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Anticipating growth is part of the design process. I build with load balancing, caching, and distribution in mind from day one.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="mt-32 py-32 text-center group">
          <h2 className="text-6xl md:text-8xl font-black text-border group-hover:text-primary/10 transition-colors duration-1000 mb-12">NEXT STEP</h2>
          <div className="space-y-8 relative z-10 -mt-24 md:-mt-32">
            <h3 className="text-3xl md:text-5xl font-bold text-foreground mt-12 md:mt-24">Have a vision?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed mb-12">
               I love transforming abstract ideas into high-performance digital engines.
            </p>
            <Link href="/contact" className="inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-110 transition-all">
              Initiate Project
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
