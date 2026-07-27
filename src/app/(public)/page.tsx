import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Project from "@/models/Project";
import Gallery from "@/models/Gallery";
import Blog from "@/models/Blog";
import Link from "next/link";
import { Container } from "@/components/Container";
import {
  ArrowRight,
  Layout,
  Globe,
  Server,
  PenTool,
  Smartphone,
  Quote,
  MessageSquare,
  BookOpen,
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { ProjectSlider, ProjectItem } from "@/components/public/ProjectSlider";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { TestimonialsSlider } from "@/components/public/TestimonialsSlider";
import { ISiteSettings, IProject, IBlog, IGallery } from "@/types";
import { Metadata } from "next";
import { PROJECTS, BLOGS } from "@/Data";

export const revalidate = 60; // Dynamic revalidation every 60s for fresh database updates

export const metadata: Metadata = {
  title: "Aditya Kumar | Full Stack Developer",
  description: "Portfolio of Aditya Kumar — Full Stack Developer specializing in scalable web applications, modern UIs, and robust backend systems.",
};

export default async function HomePage() {
  let settings: ISiteSettings = {} as ISiteSettings;
  let dbProjects: IProject[] = [];
  let dbGallery: IGallery[] = [];
  let dbBlogs: IBlog[] = [];

  try {
    await connectDB();
    const [settingsRaw, projectsRaw, galleryRaw, blogsRaw] = await Promise.all([
      SiteSettings.findOne().lean(),
      Project.find({ status: "completed" }).sort({ createdAt: -1 }).lean(),
      Gallery.find().sort({ order: 1 }).lean(),
      Blog.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean(),
    ]);

    settings = settingsRaw ? JSON.parse(JSON.stringify(settingsRaw)) : {};
    dbProjects = projectsRaw ? JSON.parse(JSON.stringify(projectsRaw)) : [];
    dbGallery = galleryRaw ? JSON.parse(JSON.stringify(galleryRaw)) : [];
    dbBlogs = blogsRaw ? JSON.parse(JSON.stringify(blogsRaw)) : [];
  } catch (e) {
    console.error("DB connection error on homepage:", e);
  }

  // 1. Convert DB Projects to ProjectItem format with fallback to sample data
  const mappedDbProjects: ProjectItem[] = dbProjects.map((p) => ({
    id: String(p._id || p.slug),
    title: p.title,
    desc: p.description,
    live: p.liveUrl || "#",
    repo: p.githubUrl,
    img: p.coverImage || (p.images && p.images[0]) || "/images/projects/Bright_Veil.png",
    tech: p.techStack || ["Full Stack"],
    tag: p.featured ? "Featured" : "Project",
    slug: p.slug,
  }));

  const sampleProjects: ProjectItem[] = PROJECTS.map((p) => ({
    id: p.id,
    title: p.title,
    desc: p.desc,
    live: p.live,
    repo: p.repo,
    img: p.img,
    tech: p.tech,
    tag: p.tag,
    slug: p.id,
  }));

  const projectsList: ProjectItem[] = mappedDbProjects.length > 0 ? mappedDbProjects : sampleProjects;

  // 2. Convert DB Gallery items with fallback
  const fallbackGallery: IGallery[] = [
    {
      _id: "g1",
      title: "BrightVeil LMS Portal",
      description: "Learning management system architecture.",
      imageUrl: "/images/projects/Bright_Veil.png",
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
      imageUrl: "/images/projects/super_tasky.png",
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
      imageUrl: "/images/projects/Adarsh_inter_college.png",
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
      imageUrl: "/images/projects/white_swan_event.png",
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
      imageUrl: "/images/aditya_profile.png",
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
      imageUrl: "/images/projects/mint_slot.png",
      category: "Booking",
      order: 6,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const galleryList: IGallery[] = dbGallery.length > 0 ? dbGallery : fallbackGallery;

  // 3. Convert DB Blogs to Top 3 HomePage Blogs with fallback
  const mappedDbBlogs = dbBlogs.slice(0, 3).map((b) => ({
    title: b.title,
    date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime: `${b.readTime || 5} min read`,
    tag: b.tags?.[0] || "Web Development",
    slug: b.slug,
    excerpt: b.excerpt,
    coverImage: b.coverImage || "/images/projects/Bright_Veil.png",
  }));

  const sampleBlogs = BLOGS.slice(0, 3).map((b) => ({
    title: b.title,
    date: b.date || "May 2025",
    readTime: "5 min read",
    tag: b.tags?.[0] || "Web Development",
    slug: b.slug,
    excerpt: b.excerpt || "",
    coverImage: b.img || "/images/projects/Bright_Veil.png",
  }));

  const latestBlogs = (mappedDbBlogs.length > 0 ? mappedDbBlogs : sampleBlogs).slice(0, 3);

  // 4. Stats Highlights
  const highlights = [
    { value: `${projectsList.length}+` || "20+", label: "Projects Completed" },
    { value: "1+", label: "Years Experience" },
    { value: "15+", label: "Technologies" },
    { value: "100%", label: "Client Satisfaction" },
  ];

  // 5. Services
  const servicesList = [
    {
      title: "Web Development",
      desc: "Build responsive and scalable web applications.",
      icon: Layout,
    },
    {
      title: "Frontend Development",
      desc: "Modern UI with React, Next.js, Tailwind CSS and more.",
      icon: Globe,
    },
    {
      title: "Backend Development",
      desc: "Robust APIs and backend systems with Node.js, Express & databases.",
      icon: Server,
    },
    {
      title: "UI/UX Design",
      desc: "Design beautiful, intuitive interfaces with Figma.",
      icon: PenTool,
    },
    {
      title: "Deployment",
      desc: "Deploy and manage applications on cloud platforms.",
      icon: Smartphone,
    },
  ];

  // 6. Tech Stack
  const techStack = [
    { name: "TypeScript", icon: "TS" },
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "N" },
    { name: "Node.js", icon: "🟢" },
    { name: "Python", icon: "🐍" },
    { name: "Express.js", icon: "ex" },
    { name: "MongoDB", icon: "🍃" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Docker", icon: "🐳" },
  ];

  // 7. Experience Preview
  const experiencePreview = [
    {
      period: "Feb 2026 – Present",
      role: "Full Stack Developer",
      company: "Feeding Trends",
      desc: "Building AI voice solutions and SaaS platforms.",
    },
    {
      period: "Jul 2025 – Feb 2026",
      role: "MERN Stack Developer (Internship)",
      company: "Softpro India",
      desc: "Developed full stack web applications, REST APIs & UI components.",
    },
    {
      period: "May 2024 – Jul 2024",
      role: "Python / Django Trainee",
      company: "Softpro India",
      desc: "Intensive training on Python, Django & Web apps.",
    },
    {
      period: "2023 – 2024",
      role: "Freelance Developer",
      company: "Multiple Clients",
      desc: "Built websites, web apps and UI for global clients.",
    },
  ];

  // 8. Testimonials & Client Reviews
  const testimonials = [
    {
      quote: "Aditya delivered the Geeta Palace website with a stunning UI, smooth navigation, and seamless booking inquiry features. Highly professional developer!",
      name: "Management Team",
      role: "Geeta Palace Resort & Events",
    },
    {
      quote: "Working with Aditya on xstudio was an exceptional experience. Outstanding Next.js architecture, fast state management, and pixel-perfect design!",
      name: "Psy Tech Team",
      role: "xstudio Client Lead",
    },
    {
      quote: "Aditya initialized our SITM institute platform with impressive SEO schema, responsive shell layouts, and high performance.",
      name: "Sagar Educational Team",
      role: "SITM Institute",
    },
    {
      quote: "Aditya's full-stack expertise in building AI voice calling solutions and scalable web portals at Feeding Trends has been remarkable.",
      name: "Product & Engineering",
      role: "Feeding Trends",
    },
  ];

  return (
    <main className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <HeroSection settings={settings} />

      {/* 2. HIGHLIGHTS STATS BANNER */}
      <section className="py-6">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl bg-card border border-border shadow-sm">
            {highlights.map((h, idx) => (
              <div key={idx} className="text-center space-y-1">
                <div className="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {h.value}
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  {h.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. FEATURED PROJECTS SLIDER (DYNAMIC MONGO DB) */}
      <section id="featured-projects" className="py-6">
        <Container>
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 block mb-1">
                  FEATURED WORK
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-foreground">
                  Projects that solve real problems
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 flex items-center gap-1 transition-all"
              >
                View all projects <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Custom Interactive Project Slider */}
            <ProjectSlider projects={projectsList} />
          </div>
        </Container>
      </section>

      {/* 4. SERVICES */}
      <section id="services" className="py-6">
        <Container>
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 block">
                WHAT I DO
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                Services I offer
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {servicesList.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-card border border-border hover:border-indigo-500/40 transition-all space-y-3 shadow-sm group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. TECH STACK */}
      <section id="tech-stack" className="py-6">
        <Container>
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 block">
                MY TOOLKIT
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                Technologies I work with
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
              {techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="px-5 py-3 rounded-2xl bg-card border border-border text-foreground text-xs font-bold flex items-center gap-2 hover:border-indigo-500/40 transition-all shadow-sm"
                >
                  <span className="text-base">{tech.icon}</span>
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. EXPERIENCE PREVIEW */}
      <section id="experience-preview" className="py-6">
        <Container>
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 block mb-1">
                  CAREER TIMELINE
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-foreground">
                  My work experience
                </h2>
              </div>
              <Link
                href="/experience"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 flex items-center gap-1 transition-all"
              >
                View full experience <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {experiencePreview.map((exp, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-card border border-border space-y-3 hover:border-indigo-500/40 transition-all shadow-sm">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 inline-block">
                    {exp.period}
                  </span>
                  <h3 className="font-bold text-sm text-foreground">{exp.role}</h3>
                  <p className="text-xs font-semibold text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 7. GALLERY PREVIEW (DYNAMIC MONGO DB) */}
      <section id="gallery-preview" className="py-6">
        <Container>
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 block mb-1">
                  GALLERY PREVIEW
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-foreground">
                  Moments & memories
                </h2>
              </div>
              <Link
                href="/gallery"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 flex items-center gap-1 transition-all"
              >
                Explore full gallery <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Enhanced Dynamic Gallery Grid */}
            <GalleryGrid items={galleryList} />
          </div>
        </Container>
      </section>

      {/* 8. LATEST BLOGS - TOP 3 ONLY (DYNAMIC MONGO DB) */}
      <section id="latest-blogs" className="py-6">
        <Container>
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 block mb-1">
                  LATEST BLOGS
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-foreground">
                  Sharing knowledge & insights
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 flex items-center gap-1 transition-all"
              >
                View all articles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBlogs.map((b, idx) => (
                <Link
                  key={idx}
                  href={`/blog/${b.slug}`}
                  className="p-6 rounded-3xl bg-card border border-border hover:border-indigo-500/40 transition-all shadow-sm space-y-4 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {b.coverImage && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-accent">
                        <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-indigo-500" /> {b.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-500" /> {b.readTime}</span>
                    </div>

                    <h3 className="font-bold text-base text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {b.title}
                    </h3>

                    {b.excerpt && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {b.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-bold inline-block">
                      {b.tag}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 9. TESTIMONIALS SLIDER */}
      <section id="testimonials" className="py-6">
        <Container>
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 block">
                TESTIMONIALS
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                What people say about me
              </h2>
            </div>

            {/* Interactive Testimonials Carousel Slider */}
            <TestimonialsSlider testimonials={testimonials} />
          </div>
        </Container>
      </section>

      {/* 10. LET'S WORK TOGETHER CTA */}
      <section id="work-together-cta" className="py-6">
        <Container>
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left z-10">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest block">
                LET&apos;S WORK TOGETHER
              </span>
              <h2 className="text-3xl md:text-4xl font-black">
                Have an idea? Let&apos;s build it.
              </h2>
              <p className="text-indigo-200 text-xs md:text-sm max-w-lg">
                Available for full-time roles, freelance projects, and AI/Web application consulting.
              </p>
            </div>
            <Link
              href="/contact"
              className="z-10 px-8 py-4 rounded-2xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2 group whitespace-nowrap"
            >
              Get in Touch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
