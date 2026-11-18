import { Metadata } from "next";
import { pageMeta } from "@/lib/seo/meta";
import { JsonLd } from "@/components/public/JsonLd";
import { graph, webPageNode, itemListNode, breadcrumbNode } from "@/lib/seo/schema";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { ProjectsPageClient, ProjectCardData } from "@/components/public/ProjectsPageClient";

export const revalidate = 60; // Dynamic ISR revalidation every 60 seconds

export const metadata: Metadata = pageMeta({
  title: "Projects — Next.js, MERN & AI Case Studies",
  description:
    "Case studies of products Aditya Kumar has built: AI voice calling, WhatsApp automation, influencer marketing, LMS and client websites with Next.js, NestJS and MERN.",
  path: "/projects",
});

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
        coverImage: String(
          (Array.isArray(p.images) && p.images.length > 0 && p.coverImage && p.images.includes(p.coverImage))
            ? p.coverImage
            : ((Array.isArray(p.images) && p.images[0]) || p.coverImage || "")
        ),
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

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            type: "CollectionPage",
            path: "/projects",
            name: "Projects by Aditya Kumar",
            mainEntity: itemListNode(dbProjects.map((p) => ({ name: p.title, path: `/projects/${p.slug}` }))),
          }),
          breadcrumbNode([{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }])
        )}
      />
      <ProjectsPageClient initialProjects={dbProjects} />
    </>
  );
}
