import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, Eye } from "lucide-react";
import { ViewTracker } from "@/components/public/ViewTracker";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  const project = await Project.findOne({ slug }).lean();
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.description,
    openGraph: {
      title: project.seoTitle || project.title,
      description: project.seoDescription || project.description,
      images: project.images?.[0] ? [{ url: project.images[0] }] : [],
    },
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

  return (
    <main className="min-h-screen pt-24 pb-16">
      <ViewTracker type="project" slug={slug} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h1>
              <p className="text-gray-400 text-lg leading-relaxed">{project.description}</p>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <Eye className="w-4 h-4" />
              {project.views} views
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-3 mb-8">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-800 text-white rounded-lg hover:border-gray-700 transition-all text-sm font-medium">
              <Github className="w-4 h-4" /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all text-sm font-medium">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
        </div>

        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-semibold mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="text-sm px-3 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {project.images?.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.images.map((img: string, i: number) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img} alt={`${project.title} screenshot ${i + 1}`} className="rounded-xl w-full aspect-video object-cover border border-gray-800" />
            ))}
          </div>
        )}

        {/* Content */}
        {project.content && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">About This Project</h2>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">{project.content}</div>
          </div>
        )}
      </div>
    </main>
  );
}
