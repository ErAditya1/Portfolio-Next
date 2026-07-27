import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import { PROJECTS, BLOGS } from "@/Data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://eraditya.dev";

  let projectUrls: MetadataRoute.Sitemap = [];
  let blogUrls: MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    const [projects, blogs] = await Promise.all([
      Project.find({}, "slug updatedAt").lean(),
      Blog.find({ published: true }, "slug updatedAt").lean(),
    ]);

    if (projects && projects.length > 0) {
      projectUrls = projects.map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: new Date(p.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }

    if (blogs && blogs.length > 0) {
      blogUrls = blogs.map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: new Date(b.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }
  } catch (e) {
    console.error("Error generating dynamic sitemap:", e);
  }

  // Fallback static project & blog URLs if DB is empty
  if (projectUrls.length === 0) {
    projectUrls = PROJECTS.map((p) => ({
      url: `${baseUrl}/projects/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  if (blogUrls.length === 0) {
    blogUrls = BLOGS.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/experience`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  return [...staticRoutes, ...projectUrls, ...blogUrls];
}
