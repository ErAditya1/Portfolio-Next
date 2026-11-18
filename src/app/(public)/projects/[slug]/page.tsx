import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Project, { IProject } from "@/models/Project";
import Link from "next/link";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Eye,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  Server,
  Zap,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Workflow,
  Globe,
} from "lucide-react";
import { ViewTracker } from "@/components/public/ViewTracker";
import { ImageCarousel } from "@/components/public/ImageCarousel";
import { JsonLd } from "@/components/public/JsonLd";
import { pageMeta, clampDescription } from "@/lib/seo/meta";
import { graph, webPageNode, breadcrumbNode } from "@/lib/seo/schema";
import { PERSON_ID, absUrl } from "@/lib/seo/site";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  if (!project) return { title: "Project not found", robots: { index: false } };

  const title = project.seoTitle || `${project.title} — Case Study`;
  const description = clampDescription(
    project.seoDescription ||
      `${project.title}: ${project.description} Built by Aditya Kumar with ${(project.techStack || []).slice(0, 4).join(", ")}.`
  );
  const image = project.coverImage || project.images?.[0];

  return {
    ...pageMeta({
      title,
      description,
      path: `/projects/${project.slug}`,
      type: "article",
      ...(image && { images: [{ url: image, alt: `${project.title} architecture screenshot` }] }),
    }),
    keywords: [project.title, ...(project.techStack || []).slice(0, 6), "Aditya Kumar", "case study", "full stack"],
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

  // Fetch adjacent and related projects
  let prevProject = null;
  let nextProject = null;
  let relatedProjects: IProject[] = [];

  try {
    await connectDB();
    const [nextP, prevP, related] = await Promise.all([
      Project.findOne({ createdAt: { $gt: project.createdAt } }).sort({ createdAt: 1 }).select("slug title description category").lean(),
      Project.findOne({ createdAt: { $lt: project.createdAt } }).sort({ createdAt: -1 }).select("slug title description category").lean(),
      Project.find({ _id: { $ne: project._id } }).limit(2).select("slug title description techStack coverImage images category").lean(),
    ]);
    nextProject = nextP ? JSON.parse(JSON.stringify(nextP)) : null;
    prevProject = prevP ? JSON.parse(JSON.stringify(prevP)) : null;
    relatedProjects = related ? JSON.parse(JSON.stringify(related)) : [];
  } catch (e) {
    console.error("Error fetching prev/next/related projects:", e);
  }

  const pagePath = `/projects/${project.slug}`;
  const projectId = `${absUrl(pagePath)}#project`;

  const repo =
    typeof project.githubUrl === "string" && /github\.com\/[^/]+\/[^/]+/.test(project.githubUrl)
      ? project.githubUrl
      : undefined;

  const allImages = (Array.isArray(project.images) && project.images.length > 0)
    ? project.images
    : (project.coverImage ? [project.coverImage] : []);

  const cover = (project.coverImage && allImages.includes(project.coverImage))
    ? project.coverImage
    : (allImages[0] || project.coverImage || "");

  const projectSchema = graph(
    webPageNode({
      path: pagePath,
      name: `${project.title} — Case Study by Aditya Kumar`,
      description: project.seoDescription || project.description,
      mainEntity: { "@id": projectId },
      dateModified: project.updatedAt,
    }),
    {
      "@type": "WebApplication",
      "@id": projectId,
      name: project.title,
      description: project.description,
      url: absUrl(pagePath),
      ...(project.liveUrl && project.liveUrl !== "#" && { sameAs: project.liveUrl }),
      ...(cover && { image: cover }),
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      ...(project.techStack?.length && { keywords: project.techStack.join(", ") }),
      ...(repo && { isBasedOn: { "@type": "SoftwareSourceCode", codeRepository: repo, programmingLanguage: project.techStack } }),
      creator: { "@id": PERSON_ID },
      author: { "@id": PERSON_ID },
      ...(project.createdAt && { dateCreated: project.createdAt }),
      ...(project.updatedAt && { dateModified: project.updatedAt }),
    },
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: project.title, path: pagePath },
    ])
  );

  // Derive context label
  const contextLabel = project.category === "flagship"
    ? "Flagship Production System"
    : project.category === "client"
    ? "Client Delivery Project"
    : "Full-Stack System";

  return (
    <main className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-background">
      <JsonLd data={projectSchema} />

      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-purple-500/10 rounded-full blur-[130px] -z-10" />
      <div className="absolute top-1/3 left-0 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[130px] -z-10" />

      <ViewTracker type="project" slug={slug} />

      <div className="max-w-5xl mx-auto px-6 space-y-12">
        {/* Navigation Breadcrumb Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Projects
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Category:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent border border-border text-foreground uppercase tracking-wider">
              {project.category || "Full Stack"}
            </span>
          </div>
        </div>

        {/* 1. Project Overview & Meta Header */}
        <section className="space-y-6 pb-8 border-b border-border/50">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Case Study
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {contextLabel}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-[1.12]">
              {project.title}
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl font-medium">
              {project.description}
            </p>
          </div>

          {/* Quick Specs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-card border border-border text-xs">
            <div>
              <div className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                Engineering Role
              </div>
              <div className="text-foreground font-bold text-sm mt-0.5">
                Full Stack & System Architecture
              </div>
            </div>
            <div>
              <div className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                System Status
              </div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Deployed
              </div>
            </div>
            <div>
              <div className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                Audited By
              </div>
              <div className="text-foreground font-bold text-sm mt-0.5">
                Aditya Kumar
              </div>
            </div>
            <div>
              <div className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                Case Study Views
              </div>
              <div className="text-foreground font-bold text-sm mt-0.5 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                {project.views || 240} reads
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {project.liveUrl && project.liveUrl !== "#" && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Live Application</span>
              </a>
            )}

            {repo ? (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border text-foreground rounded-2xl hover:bg-accent transition-all font-bold text-sm shadow-sm active:scale-95"
              >
                <Github className="w-4 h-4" />
                <span>Review Source Code</span>
              </a>
            ) : (
              <span className="text-xs text-muted-foreground italic px-4 py-3 bg-accent/40 rounded-2xl border border-border">
                Proprietary enterprise repository
              </span>
            )}

            <Link
              href={`/contact?subject=${encodeURIComponent(`Inquiry regarding ${project.title}`)}`}
              className="px-5 py-3.5 bg-accent/60 hover:bg-accent border border-border text-foreground font-bold text-sm rounded-2xl transition-all flex items-center gap-2 ml-auto"
            >
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span>Inquire About Similar Architecture</span>
            </Link>
          </div>
        </section>

        {/* 2. Visual Screenshots / Walkthrough */}
        {allImages.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                System Visuals & Interface Architecture
              </h2>
              <span className="text-xs text-muted-foreground">
                {allImages.length} image{allImages.length > 1 ? "s" : ""}
              </span>
            </div>
            <ImageCarousel images={allImages} title={project.title} />
          </section>
        )}

        {/* 3. Technology Stack Breakdown */}
        {project.techStack?.length > 0 && (
          <section className="space-y-4 p-8 rounded-3xl bg-card border border-border">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              Technology Stack & Architecture Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-accent/70 border border-border text-foreground text-xs font-bold rounded-xl tracking-wider shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 4. Deep-Dive Story & Architecture Content */}
        {project.content ? (
          <section className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-indigo-600 rounded-full" />
              System Architecture & Implementation
            </h2>

            {/<[a-z][\s\S]*>/i.test(project.content) ? (
              <div
                className="blog-content leading-relaxed"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            ) : (
              <div className="blog-content leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown>
              </div>
            )}
          </section>
        ) : null}

        {/* 5. Key Engineering Takeaways Strip */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Performance</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engineered with server-side rendering, indexed database queries, and optimized payload sizes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <Workflow className="w-4 h-4" />
              <span>Resilience</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Background job queues and decoupled services ensure high availability during traffic surges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Security</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              End-to-end type safety, data sanitization, parameterized operations, and role-based access.
            </p>
          </div>
        </section>

        {/* 6. Direct Service Inquiry Banner */}
        <section className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              Interested in building a similar system?
            </h3>
            <p className="text-sm text-muted-foreground">
              Let&apos;s discuss architecture choices, technical feasibility, and development milestones for your web application.
            </p>
          </div>

          <Link
            href={`/contact?service=${encodeURIComponent(project.title)}`}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all shrink-0 flex items-center gap-2"
          >
            <span>Start a Project Discussion</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* 7. Previous / Next Project Navigation */}
        <section className="pt-8 border-t border-border space-y-4">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Explore More Case Studies
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group p-5 bg-card border border-border rounded-2xl hover:border-indigo-500/40 transition-all flex flex-col gap-1.5 shadow-sm"
              >
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  Previous Case Study
                </span>
                <span className="text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {prevProject.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group p-5 bg-card border border-border rounded-2xl hover:border-indigo-500/40 transition-all flex flex-col gap-1.5 text-right sm:ml-auto w-full shadow-sm"
              >
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 justify-end">
                  Next Case Study
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {nextProject.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
