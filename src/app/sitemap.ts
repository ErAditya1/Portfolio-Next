import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import SiteSettings from "@/models/SiteSettings";
import Experience from "@/models/Experience";
import Gallery from "@/models/Gallery";
import { SITE_URL } from "@/lib/seo/site";

export const revalidate = 3600;

type Dated = { slug?: string; updatedAt?: Date | string; createdAt?: Date | string; coverImage?: string; images?: string[] };
const latest = (items: Dated[]) =>
  items.reduce<Date | undefined>((acc, i) => {
    const d = new Date(i.updatedAt || i.createdAt || 0);
    return !acc || d > acc ? d : acc;
  }, undefined);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: Dated[] = [];
  let blogs: Dated[] = [];
  let settingsAt: Date | undefined;
  let experienceAt: Date | undefined;
  let galleryAt: Date | undefined;

  try {
    await connectDB();
    const [p, b, s, e, g] = await Promise.all([
      Project.find({}, "slug updatedAt createdAt coverImage images").lean<Dated[]>(),
      Blog.find({ published: true }, "slug updatedAt createdAt coverImage").lean<Dated[]>(),
      SiteSettings.findOne({}, "updatedAt").lean<Dated>(),
      Experience.find({}, "updatedAt createdAt").lean<Dated[]>(),
      Gallery.find({}, "updatedAt createdAt").lean<Dated[]>(),
    ]);
    projects = p;
    blogs = b;
    settingsAt = s?.updatedAt ? new Date(s.updatedAt) : undefined;
    experienceAt = latest(e);
    galleryAt = latest(g);
  } catch (e) {
    console.error("Error generating dynamic sitemap:", e);
  }

  const projectsAt = latest(projects);
  const blogsAt = latest(blogs);
  const newest = [settingsAt, projectsAt, blogsAt, experienceAt].filter(Boolean).sort((a, b) => +b! - +a!)[0];

  const page = (path: string, lastModified: Date | undefined, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    ...(lastModified && { lastModified }),
    priority,
  });

  return [
    page("/", newest, 1.0),
    page("/about", settingsAt, 0.9),
    page("/projects", projectsAt, 0.9),
    page("/experience", experienceAt, 0.8),
    page("/blog", blogsAt, 0.8),
    page("/contact", settingsAt, 0.7),
    page("/gallery", galleryAt, 0.5),
    page("/mcp", undefined, 0.5),
    page("/whatsapp-assistant", undefined, 0.4),
    ...projects.map((p) => ({
      ...page(`/projects/${p.slug}`, new Date(p.updatedAt || p.createdAt || Date.now()), 0.8),
      ...((p.coverImage || p.images?.[0]) && { images: [p.coverImage || p.images![0]] }),
    })),
    ...blogs.map((b) => ({
      ...page(`/blog/${b.slug}`, new Date(b.updatedAt || b.createdAt || Date.now()), 0.7),
      ...(b.coverImage && { images: [b.coverImage] }),
    })),
  ];
}
