import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { Container } from "@/components/Container";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import Image from "next/image";
import { ISiteSettings } from "@/types";
import { Metadata } from "next";
import Link from "next/link";

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
        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-16 items-center mb-32">
          <div className="lg:col-span-5 relative group order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-all duration-700" />
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
              {avatar && (
                <Image 
                  src={avatar} 
                  alt={name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  priority
                />
              )}
            </div>
            {/* Experience badge */}
            <div className="absolute bottom-6 -right-6 bg-card border border-border backdrop-blur-md p-6 rounded-2xl shadow-lg hidden md:block">
               <div className="text-3xl font-black text-foreground leading-tight">15+</div>
               <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Projects Built</div>
            </div>
          </div>
          
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Story of a Builder</span>
              <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500">Scalable</span> Realities
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
              {settings?.ownerBio || "I am a dedicated developer focused on building professional grade digital solutions."}
            </p>
            
            <div className="prose prose-slate dark:prose-invert prose-p:text-muted-foreground prose-p:text-lg prose-p:leading-relaxed">
              <p>
                Driven by curiosity and a passion for engineering excellence, I specialize in architecting systems that are not just functional, but also scalable and secure. My journey in technology is defined by constant learning and a commitment to creating value through code.
              </p>
              <p>
                From building complex distributed scrapers to designing elegant frontend interfaces, I enjoy bridging the gap between hardware constraints and user expectations.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="/cv.pdf" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-transform shadow-md shadow-primary/20 flex items-center gap-2">
                Download CV
              </a>
              <a href="/contact" className="px-8 py-4 bg-card border border-border text-foreground font-bold rounded-2xl hover:bg-accent transition-all shadow-sm">
                Let&apos;s Connect
              </a>
            </div>
          </div>
        </div>

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
