import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Project from "@/models/Project";
import Gallery from "@/models/Gallery";
import Blog from "@/models/Blog";
import Experience, { IExperience } from "@/models/Experience";
import Link from "next/link";
import { Container } from "@/components/Container";
import {
  ArrowRight,
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { TrustCredibilityStrip } from "@/components/public/TrustCredibilityStrip";
import { AskAISection } from "@/components/public/agent/AskAISection";
import { ProjectSlider, ProjectItem } from "@/components/public/ProjectSlider";
import { ServicesSection } from "@/components/public/ServicesSection";
import { TechStackSection } from "@/components/public/TechStackSection";
import { ExperienceTimeline, TimelineExperienceItem } from "@/components/public/ExperienceTimeline";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { LatestBlogsSection } from "@/components/public/LatestBlogsSection";
import { EngineeringPrinciplesSection } from "@/components/public/EngineeringPrinciplesSection";
import { FAQSection } from "@/components/public/FAQSection";
import { CallToActionSection } from "@/components/public/CallToActionSection";
import { ISiteSettings, IProject, IBlog, IGallery } from "@/types";
import { Metadata } from "next";
import { pageMeta } from "@/lib/seo/meta";
import { JsonLd } from "@/components/public/JsonLd";
import { graph, webPageNode } from "@/lib/seo/schema";
import { PERSON_ID } from "@/lib/seo/site";

export const revalidate = 60; // Dynamic revalidation every 60s for fresh database updates

export const metadata: Metadata = pageMeta({
  title: "Aditya Kumar | Full Stack Developer & SaaS Engineer",
  absolute: true,
  description:
    "Explore Aditya Kumar's portfolio, featuring full-stack development, Next.js, React, Node.js, Python, SaaS platforms, AI integrations and engineering projects.",
  path: "/",
});

export default async function HomePage() {
  let settings: ISiteSettings = {} as ISiteSettings;
  let dbProjects: IProject[] = [];
  let dbGallery: IGallery[] = [];
  let dbBlogs: IBlog[] = [];
  let dbExperiences: IExperience[] = [];

  try {
    await connectDB();
    const [settingsRaw, projectsRaw, galleryRaw, blogsRaw, experiencesRaw] = await Promise.all([
      SiteSettings.findOne().lean(),
      Project.find({ status: "completed" }).sort({ featured: -1, createdAt: -1 }).lean(),
      Gallery.find().sort({ order: 1 }).lean(),
      Blog.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean(),
      Experience.find().sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    settings = settingsRaw ? JSON.parse(JSON.stringify(settingsRaw)) : {};
    dbProjects = projectsRaw ? JSON.parse(JSON.stringify(projectsRaw)) : [];
    dbGallery = galleryRaw ? JSON.parse(JSON.stringify(galleryRaw)) : [];
    dbBlogs = blogsRaw ? JSON.parse(JSON.stringify(blogsRaw)) : [];
    dbExperiences = experiencesRaw ? JSON.parse(JSON.stringify(experiencesRaw)) : [];
  } catch (e) {
    console.error("DB connection error on homepage:", e);
  }

  // 1. Filter and map Featured DB Projects strictly for the Project Slider
  const featuredDbProjects = dbProjects.filter((p) => p.featured);
  const featuredList = featuredDbProjects.length > 0 ? featuredDbProjects : dbProjects;

  const projectsList: ProjectItem[] = featuredList.map((p) => ({
    id: String(p._id || p.slug),
    title: p.title,
    desc: p.description,
    live: p.liveUrl || "#",
    repo: p.githubUrl,
    img: (Array.isArray(p.images) && p.images.length > 0 && p.coverImage && p.images.includes(p.coverImage))
      ? p.coverImage
      : ((Array.isArray(p.images) && p.images[0]) || p.coverImage || ""),
    tech: p.techStack || ["Full Stack"],
    tag: p.featured ? "Featured" : "Project",
    slug: p.slug,
  }));

  // 2. Convert DB Gallery items with fallback
  const fallbackGallery: IGallery[] = [
    {
      _id: "g1",
      title: "BrightVeil LMS Portal",
      description: "Learning management system architecture.",
      imageUrl: "",
      category: "LMS",
      order: 1,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "g2",
      title: "SuperTasky Realtime App",
      description: "WebSocket connection state flow.",
      imageUrl: "",
      category: "Realtime",
      order: 2,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "g3",
      title: "Adarsh College Management",
      description: "Django administration dashboard.",
      imageUrl: "",
      category: "Portal",
      order: 3,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "g4",
      title: "White Swan Event Portal",
      description: "Event booking and ticket management.",
      imageUrl: "",
      category: "Event",
      order: 4,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "g5",
      title: "Developer Profile Workspace",
      description: "Development environment setup.",
      imageUrl: "",
      category: "Workspace",
      order: 5,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "g6",
      title: "MintSlot Tank Distillation",
      description: "Industrial slot listener calendar UI.",
      imageUrl: "",
      category: "Booking",
      order: 6,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const galleryList: IGallery[] = dbGallery.length > 0 ? dbGallery : fallbackGallery;

  // 3. Convert DB Blogs to Top 3 HomePage Blogs strictly from Database
  const latestBlogs = dbBlogs.slice(0, 3).map((b) => ({
    title: b.title,
    date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: `${b.readTime || 5} min read`,
    tag: b.tags?.[0] || "Web Development",
    slug: b.slug,
    excerpt: b.excerpt,
    coverImage: b.coverImage || "",
  }));

  // 4. Map DB Experiences for Timeline
  const mappedTimelineExperiences: TimelineExperienceItem[] = dbExperiences.map((exp, idx) => ({
    id: String(exp._id || idx),
    role: exp.role,
    company: exp.company,
    companyLogo: exp.companyLogo,
    period: exp.period,
    location: exp.location || "India",
    description: exp.description,
    points: exp.points && exp.points.length > 0 ? exp.points : [exp.description],
    skills: exp.skills || [],
    isCurrent: Boolean(exp.isCurrent || idx === 0),
    type:
      exp.type === "job"
        ? "Full-Time Role"
        : exp.type === "trainee"
        ? "Technical Training"
        : exp.type === "freelance"
        ? "Freelance"
        : "Internship",
  }));


  return (
    <main className="space-y-16 pb-20">
      <JsonLd
        data={graph(
          webPageNode({
            path: "/",
            name: "Aditya Kumar — Full Stack Developer",
            description: "Portfolio of Aditya Kumar: projects, experience, writing and contact.",
            mainEntity: { "@id": PERSON_ID },
          })
        )}
      />
      {/* 1. HERO SECTION */}
      <HeroSection settings={settings} />

      {/* 2. COMPACT TRUST & CREDIBILITY STRIP */}
      <TrustCredibilityStrip />

      {/* 2b. ASK MY AI AGENT (AG-UI, inline + full screen) */}
      <AskAISection />

      {/* 2. FEATURED PROJECTS SLIDER (DYNAMIC MONGO DB) */}
      <section id="featured-projects" className="py-12 md:py-20 relative overflow-hidden">
        {/* Subtle Ambient Background Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        <Container>
          <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Portfolio
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                  Projects that solve <span className="text-gradient">real problems</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                  Enterprise platforms, real-time AI voice agents, and full-stack architectures engineered for scale.
                </p>
              </div>

              <Link
                href="/projects"
                className="group px-5 py-3 rounded-2xl bg-card border border-border hover:border-indigo-500/40 text-foreground text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0 hover:bg-accent"
              >
                View all projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-500" />
              </Link>
            </div>

            {/* Custom Interactive Project Slider (3-Card Desktop Grid) */}
            <ProjectSlider projects={projectsList} />
          </div>
        </Container>
      </section>

      {/* 3. SERVICES SECTION */}
      <ServicesSection />

      {/* 4. TECH STACK SECTION */}
      <TechStackSection />

      {/* 5. EXPERIENCE TIMELINE SECTION */}
      <ExperienceTimeline experiences={mappedTimelineExperiences} />

      {/* 6. GALLERY PREVIEW (DYNAMIC MONGO DB) */}
      <section id="gallery-preview" className="py-12 md:py-20 relative overflow-hidden">
        {/* Ambient Background Light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        <Container>
          <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-b border-border/40">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  Visual Chronicle
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                  Moments & <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Memories</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  A visual archive of product milestones, system architectures, hackathon presentations, and engineering life.
                </p>
              </div>

              <Link
                href="/gallery"
                className="group px-5 py-3 rounded-2xl bg-card border border-border hover:border-indigo-500/40 text-foreground text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0 hover:bg-accent active:scale-95"
              >
                Explore Full Gallery
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-500" />
              </Link>
            </div>

            {/* Enhanced Interactive Gallery Grid */}
            <GalleryGrid items={galleryList} />
          </div>
        </Container>
      </section>

      {/* 7. LATEST BLOGS SECTION */}
      <LatestBlogsSection blogs={latestBlogs} />

      {/* 9. ENGINEERING PRINCIPLES & OUTCOMES */}
      <EngineeringPrinciplesSection />

      {/* 10. SEO & GEO TECHNICAL FAQS SECTION */}
      <FAQSection preset="home" />

      {/* 11. CALL TO ACTION SECTION */}
      <CallToActionSection />
    </main>
  );
}
