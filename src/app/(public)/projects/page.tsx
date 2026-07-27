import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { ProjectsPageClient, ProjectCardData } from "@/components/public/ProjectsPageClient";

export const revalidate = 60; // Dynamic ISR revalidation every 60 seconds

export const metadata: Metadata = {
  title: "Projects That Solve Real Problems | Aditya Kumar - Full Stack Developer",
  description: "Explore Aditya Kumar's showcase of full-stack projects, LMS platforms, open source repos, SaaS applications, and real-time systems.",
};

export default async function ProjectsPage() {
  let dbProjects: ProjectCardData[] = [];

  try {
    await connectDB();
    const projectsRaw = await Project.find({ status: "completed" })
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    if (projectsRaw && projectsRaw.length > 0) {
      dbProjects = JSON.parse(JSON.stringify(projectsRaw)).map((p: Record<string, unknown>) => ({
        _id: String(p._id || p.slug),
        title: String(p.title || ""),
        slug: String(p.slug || ""),
        description: String(p.description || ""),
        coverImage: String(p.coverImage || (Array.isArray(p.images) && p.images[0]) || "/images/projects/Bright_Veil.png"),
        techStack: Array.isArray(p.techStack) ? p.techStack : ["Full Stack"],
        liveUrl: String(p.liveUrl || "#"),
        githubUrl: p.githubUrl ? String(p.githubUrl) : undefined,
        featured: Boolean(p.featured),
        category: String(p.category || "Web Applications"),
      }));
    }
  } catch (e) {
    console.error("MongoDB fetching error on Projects Page:", e);
  }

  return <ProjectsPageClient initialProjects={dbProjects} />;
}
