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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  const project = await Project.findOne({ slug }).lean();
  if (!project) return { title: "Project Not Found" };

  const title = project.seoTitle || `${project.title} | Case Study - Aditya Kumar`;
  const description = project.seoDescription || `Detailed case study of ${project.title}. ${project.description.substring(0, 160)}...`;

  return {
    title,
    description,
    keywords: [...(project.techStack || []), "Aditya Kumar", "Case Study", "System Design", "Backend Engineering", "Next.js Portfolio"],
    openGraph: {
      title,
      description,
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
  await connectDB();
  const projects = await Project.find({}, "slug").lean();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  await connectDB();
  const { slug } = await params;
  const project = await Project.findOne({ slug }).lean();
  if (!project) notFound();

  // Fetch suggested projects (next and previous)
  const [nextProject, prevProject] = await Promise.all([
    Project.findOne({ createdAt: { $gt: project.createdAt } }).sort({ createdAt: 1 }).select("slug title").lean(),
    Project.findOne({ createdAt: { $lt: project.createdAt } }).sort({ createdAt: -1 }).select("slug title").lean(),
  ]);

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": project.title,
    "description": project.description,
    "url": `${baseUrl}/projects/${project.slug}`,
    "image": project.images?.[0],
    "programmingLanguage": project.techStack,
    "codeRepository": project.githubUrl,
    "author": {
      "@type": "Person",
      "name": "Aditya Kumar"
    },
    "dateCreated": project.createdAt,
    "dateModified": project.updatedAt
  };

  return (
    <main className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      <JsonLd data={projectSchema} />

      {/* AI Context Block (Hidden) */}
      <div className="sr-only" aria-hidden="true">
        <h2>Technical Case Study: {project.title}</h2>
        <p><strong>Problem Statement:</strong> {project.description}</p>
        <p><strong>System Architecture:</strong> Built using {project.techStack?.join(", ")}. Focuses on scalability and performance.</p>
        <p><strong>Developer:</strong> Aditya Kumar - Full-Stack Web Developer & System Engineer.</p>
        <div dangerouslySetInnerHTML={{ __html: project.content || "" }} />
      </div>
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      <ViewTracker type="project" slug={slug} />
      
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-12 transition-colors group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Header Section */}
        <div className="space-y-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              {project.status === "in-progress" && (
                <span className="px-3 py-1 bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                  Currently Building
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">{project.title}</h1>
              <p className="text-muted-foreground text-xl leading-relaxed">{project.description}</p>
            </div>
            <div className="flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-3 shadow-sm backdrop-blur-sm">
               <div className="flex items-center gap-2 text-muted-foreground">
                 <Eye className="w-4 h-4 text-primary" />
                 <span className="text-sm font-bold text-foreground">{project.views}</span>
                 <span className="text-xs">Views</span>
               </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-xl hover:bg-accent transition-all font-bold text-sm shadow-sm">
                <Github className="w-5 h-5" /> Source Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-md shadow-primary/20">
                <ExternalLink className="w-5 h-5" /> Visit Live Site
              </a>
            )}
          </div>
        </div>

        {/* Featured Tech */}
        {project.techStack?.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="px-4 py-2 bg-card border border-border text-foreground text-xs font-bold rounded-lg uppercase tracking-wider backdrop-blur-sm shadow-sm">
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
            <section className="bg-card border border-border rounded-[32px] p-8 md:p-12 backdrop-blur-md shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary rounded-full" />
                The Story
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:text-foreground prose-strong:text-foreground whitespace-pre-line">
                {project.content}
              </div>
            </section>
          )}

          {/* Suggested Projects */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Suggested Projects</h3>
            <div className="grid grid-cols-2 gap-3">
              {prevProject ? (
                <Link href={`/projects/${prevProject.slug}`} className="group p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-all flex flex-col gap-1">
                  <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                    <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Previous
                  </span>
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{prevProject.title}</span>
                </Link>
              ) : <div />}
              
              {nextProject ? (
                <Link href={`/projects/${nextProject.slug}`} className="group p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-all flex flex-col gap-1 text-right">
                  <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1 justify-end">
                    Next <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{nextProject.title}</span>
                </Link>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

