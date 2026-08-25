import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, Eye, ChevronRight, ChevronLeft } from "lucide-react";
import { ViewTracker } from "@/components/public/ViewTracker";
import { ImageCarousel } from "@/components/public/ImageCarousel";
import { JsonLd } from "@/components/public/JsonLd";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProjectBySlug(rawSlug: string) {
  try {
    await connectDB();
    const slug = decodeURIComponent(rawSlug).trim();
    const dbProject = await Project.findOne({ 
      $or: [
        { slug: slug },
        { slug: slug.toLowerCase() },
        { slug: rawSlug }
      ]
    }).lean();

    if (dbProject) {
      return JSON.parse(JSON.stringify(dbProject));
    }
  } catch (e) {
    console.error("DB error fetching project detail:", e);
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const baseUrl = process.env.NEXTAUTH_URL || "https://eraditya.vercel.app";
  const title = project.seoTitle || `${project.title} — System Architecture & Case Study | Aditya Kumar`;
  const description = project.seoDescription || `Detailed system design, tech stack, and production case study of ${project.title} engineered by Aditya Kumar.`;

  return {
    title,
    description,
    keywords: [...(project.techStack || []), "Aditya Kumar", "Case Study", "System Design", "Backend Engineering", "Next.js Portfolio", "Software Architecture"],
    alternates: {
      canonical: `${baseUrl}/projects/${project.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/projects/${project.slug}`,
      images: project.images?.[0] ? [{ url: project.images[0] }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.images?.[0] ? [project.images[0]] : [],
    }
  };
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const projects = await Project.find({}, "slug").lean();
    return projects.map((p) => ({ slug: p.slug }));
  } catch (e) {
    console.error("Error generating static params:", e);
    return [];
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // Fetch suggested projects
  let prevProject = null;
  let nextProject = null;

  try {
    await connectDB();
    const [nextP, prevP] = await Promise.all([
      Project.findOne({ createdAt: { $gt: project.createdAt } }).sort({ createdAt: 1 }).select("slug title").lean(),
      Project.findOne({ createdAt: { $lt: project.createdAt } }).sort({ createdAt: -1 }).select("slug title").lean(),
    ]);
    nextProject = nextP ? JSON.parse(JSON.stringify(nextP)) : null;
    prevProject = prevP ? JSON.parse(JSON.stringify(prevP)) : null;
  } catch (e) {
    console.error("Error fetching prev/next project:", e);
  }

  const baseUrl = process.env.NEXTAUTH_URL || "https://eraditya.vercel.app";
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "SoftwareSourceCode"],
    "name": project.title,
    "description": project.description,
    "url": `${baseUrl}/projects/${project.slug}`,
    "image": project.images?.[0] || `${baseUrl}/images/aditya_profile.png`,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web, Cloud, Distributed Systems",
    "programmingLanguage": project.techStack || ["JavaScript", "TypeScript", "Next.js", "Node.js"],
    "codeRepository": project.githubUrl || "https://github.com/ErAditya1",
    "author": {
      "@type": "Person",
      "name": "Aditya Kumar",
      "url": baseUrl,
      "jobTitle": "Full Stack Developer & AI Systems Engineer"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "dateCreated": project.createdAt,
    "dateModified": project.updatedAt
  };

  return (
    <main className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-background">
      <JsonLd data={projectSchema} />

      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

      <ViewTracker type="project" slug={slug} />
      
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-12 transition-colors group text-xs font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Header Section */}
        <div className="space-y-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest inline-block">
                Case Study
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">{project.title}</h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">{project.description}</p>
            </div>
            <div className="flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-3 shadow-sm backdrop-blur-sm">
               <div className="flex items-center gap-2 text-muted-foreground">
                 <Eye className="w-4 h-4 text-indigo-500" />
                 <span className="text-sm font-bold text-foreground">{project.views || 185}</span>
                 <span className="text-xs">Views</span>
               </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border text-foreground rounded-2xl hover:bg-accent transition-all font-bold text-sm shadow-sm">
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-500/20">
                <ExternalLink className="w-4 h-4" /> Visit Live Site
              </a>
            )}
          </div>
        </div>

        {/* Featured Tech */}
        {project.techStack?.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="px-4 py-2 bg-card border border-border text-foreground text-xs font-bold rounded-xl uppercase tracking-wider shadow-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content & Visuals */}
        <div className="grid grid-cols-1 gap-12">
          {project.images?.length > 0 && (
            <div className="space-y-6">
              <ImageCarousel images={project.images} title={project.title} />
            </div>
          )}

          {project.content && (
            <section className="bg-card border border-border rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-sm">
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-indigo-600 rounded-full" />
                The Story & Architecture
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:text-foreground prose-strong:text-foreground whitespace-pre-line text-sm md:text-base">
                {project.content}
              </div>
            </section>
          )}

          {/* Suggested Projects */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-base font-bold text-foreground mb-4">Suggested Projects</h3>
            <div className="grid grid-cols-2 gap-4">
              {prevProject ? (
                <Link href={`/projects/${prevProject.slug}`} className="group p-4 bg-card border border-border rounded-2xl hover:border-indigo-500/40 transition-all flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Previous
                  </span>
                  <span className="text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{prevProject.title}</span>
                </Link>
              ) : <div />}
              
              {nextProject ? (
                <Link href={`/projects/${nextProject.slug}`} className="group p-4 bg-card border border-border rounded-2xl hover:border-indigo-500/40 transition-all flex flex-col gap-1 text-right">
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 justify-end">
                    Next <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{nextProject.title}</span>
                </Link>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
