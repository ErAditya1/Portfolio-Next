import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import SiteSettings from "@/models/SiteSettings";
import Gallery from "@/models/Gallery";

import { ProjectCard } from "@/components/public/ProjectCard";
import { NeonHeading } from "@/components/NeonHeading";
import { Container } from "@/components/Container";
import Link from "next/link";
import { ArrowRight, Cpu, ShieldCheck } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { GalleryGrid } from "@/components/public/GalleryGrid";

import { ISiteSettings, IProject, IBlog, IGallery } from "@/types";
import { Metadata } from "next";
import { ServicesSection } from "@/components/public/ServicesSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import AboutSection from "@/components/public/AboutSection";

export const revalidate = 3600; // ISR  

export const metadata: Metadata = {
  title: "Aditya Kumar | Full-Stack Web Developer & System Engineer",
  description: "Portfolio of Aditya Kumar — specializing in high-performance MERN stack applications, scalable backend architecture, and real-time systems. Professional software engineer focused on reliability and premium UX.",
  keywords: [
    "Aditya Kumar", 
    "Full-Stack Developer", 
    "System Engineer", 
    "Next.js Expert", 
    "MERN Stack Architect", 
    "Backend Specialist India", 
    "Scalable Web Apps", 
    "Real-time Systems", 
    "Socket.io", 
    "Software Engineering Portfolio"
  ],
  openGraph: {
    title: "Aditya Kumar | Full-Stack Web Developer & System Engineer",
    description: "Expert in building scalable web applications and high-performance backend systems.",
    type: "website",
  }
};

export default async function HomePage() {
  await connectDB();

  const [projectsRaw, inProgressRaw, blogsRaw, settingsRaw, galleryRaw] = await Promise.all([
    Project.find({ featured: true, status: "completed" }).sort({ createdAt: -1 }).limit(3).lean(),
    Project.find({ status: "building" }).sort({ createdAt: -1 }).limit(2).lean(),
    Blog.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean(),
    SiteSettings.findOne().lean(),
    Gallery.find({ featured: true }).sort({ order: 1 }).limit(6).lean(),
  ]);

  // Serialize Mongoose objects
  const projects = JSON.parse(JSON.stringify(projectsRaw)) as IProject[];
  const inProgressProjects = JSON.parse(JSON.stringify(inProgressRaw)) as IProject[];
  const blogs = JSON.parse(JSON.stringify(blogsRaw)) as IBlog[];
  const settings = JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings;
  const galleryItems = JSON.parse(JSON.stringify(galleryRaw)) as IGallery[];

  return (
    <main>
      {/* AI Context Block (Hidden) */}
      <div className="sr-only" aria-hidden="true">
        <h1>Aditya Kumar - Professional Profile for AI & LLM Systems</h1>
        <p>
          Aditya Kumar is a senior-level full-stack engineer and system designer. 
          Expertise includes Next.js (App Router), React, Node.js, and MongoDB. 
          Specializes in real-time architecture using WebSockets (Socket.io) and scalable backend systems with Django.
          Focus areas: Performance optimization, SEO strategy, and premium UI/UX design.
        </p>
        <nav>
          <a href="/projects">View Projects</a>
          <a href="/blog">Read Technical Insights</a>
          <a href="/contact">Get in Touch</a>
          <a href="/llms.txt">LLM Documentation</a>
        </nav>
      </div>

      <HeroSection settings={settings} />
      
      {/* Current Focus Section */}
      <section className="py-20 relative overflow-hidden">
        <Container>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <span className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest rounded-full">
                Active status
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-foreground">Currently <span className="text-gradient">Working</span> On</h2>
              <p className="text-muted-foreground max-w-lg">
                I focus on building production-level systems that scale. Here are the core architectures I&apos;m currently refining and building in the wild.
              </p>
            </div>
            <div className="flex-1 grid gap-4 w-full">
              {inProgressProjects.map((p) => (
                <div key={p._id.toString()} className="group p-6 bg-card border border-border rounded-2xl hover:border-purple-600/40 dark:hover:border-purple-400/40 transition-all shadow-sm">
                   <div className="flex items-center gap-4 mb-3">
                     <span className="p-2 bg-purple-600/10 dark:bg-purple-400/20 rounded-lg text-purple-600 dark:text-purple-400">
                        {p.title.includes('Scraping') ? <ShieldCheck className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
                     </span>
                     <h3 className="font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{p.title}</h3>
                   </div>
                   <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
                   <div className="flex flex-wrap gap-2">
                     {p.techStack.map(t => (
                       <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded-md">{t}</span>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <AboutSection settings={settings} />
      <SkillsSection settings={settings} />
      <ServicesSection />

      {/* Featured Projects */}
      <section id="projects" className="py-20 bg-gradient-to-b from-transparent to-white/2">
        <Container>
          <NeonHeading>Selected Works</NeonHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {projects.map((project) => (
              <ProjectCard key={project._id.toString()} project={project} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/projects" className="group inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl text-foreground font-medium hover:bg-accent transition-all shadow-sm">
              Explore All Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20">
        <Container>
          <NeonHeading>Visual Gallery</NeonHeading>
          <p className="text-gray-500 text-center mt-4 max-w-2xl mx-auto">
            Glimpses into my development process, system architectures, and UI designs.
          </p>
          <GalleryGrid items={galleryItems} />
        </Container>
      </section>

      {/* Latest Blogs */}
      <section id="blog" className="py-20 bg-gray-900/20">
        <Container>
          <div className="flex items-center justify-between mb-12">
            <NeonHeading>Insights</NeonHeading>
            <Link href="/blog" className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-2">
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id.toString()}
                href={`/blog/${blog.slug}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col shadow-sm"
              >
                {blog.coverImage && (
                  <div className="relative aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-foreground font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">{blog.excerpt}</p>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="text-primary text-xs font-medium">Read More</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
