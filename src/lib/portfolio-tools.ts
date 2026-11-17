/**
 * Shared portfolio data layer.
 *
 * Plain async functions over the mongoose models, returning JSON-safe data.
 * Used by the MCP server (src/app/api/mcp) and later by the AG-UI agent,
 * so the same logic is not written twice.
 *
 * Public functions never return secrets (API keys, unpublished blogs, enquiries).
 */
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Blog from "@/models/Blog";
import Enquiry from "@/models/Enquiry";
import SiteSettings from "@/models/SiteSettings";

const SITE_URL = (process.env.NEXTAUTH_URL || "https://eraditya.vercel.app").replace(/\/$/, "");

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Strip mongoose internals and make the result JSON-serialisable. */
function clean<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc, (key, value) => (key === "__v" ? undefined : value)));
}

// ─── Public ─────────────────────────────────────────────────────────────────

export async function getProfile() {
  await connectDB();
  const s = await SiteSettings.findOne()
    .select("-geminiApiKey -aiApiKey -aiModel -__v")
    .lean();
  if (!s) return { name: "Aditya Kumar", website: SITE_URL };
  return clean({ ...s, website: SITE_URL });
}

export async function listProjects(opts: {
  category?: "flagship" | "major" | "minor" | "client";
  tech?: string;
  featured?: boolean;
  limit?: number;
}) {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (opts.category) filter.category = opts.category;
  if (opts.featured !== undefined) filter.featured = opts.featured;
  if (opts.tech) filter.techStack = { $regex: escapeRegex(opts.tech), $options: "i" };

  const projects = await Project.find(filter)
    .select("title slug description techStack githubUrl liveUrl coverImage category status featured")
    .sort({ featured: -1, createdAt: -1 })
    .limit(opts.limit ?? 20)
    .lean();

  return clean(
    projects.map((p) => ({ ...p, url: `${SITE_URL}/projects/${(p as { slug: string }).slug}` }))
  );
}

export async function getProject(slug: string) {
  await connectDB();
  const p = await Project.findOne({ slug: slug.toLowerCase() })
    .select("-views -__v")
    .lean();
  if (!p) return null;
  return clean({ ...p, url: `${SITE_URL}/projects/${slug.toLowerCase()}` });
}

export async function listExperience(opts: { type?: "job" | "trainee" | "freelance" | "education" }) {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (opts.type) filter.type = opts.type;
  const items = await Experience.find(filter)
    .select("-__v -featured")
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return clean(items);
}

export async function searchBlogs(opts: { query?: string; tag?: string; limit?: number }) {
  await connectDB();
  const filter: Record<string, unknown> = { published: true };
  if (opts.tag) filter.tags = opts.tag.toLowerCase();
  if (opts.query) {
    const rx = { $regex: escapeRegex(opts.query), $options: "i" };
    filter.$or = [{ title: rx }, { excerpt: rx }, { tags: rx }];
  }
  const blogs = await Blog.find(filter)
    .select("title slug excerpt tags readTime coverImage createdAt")
    .sort({ createdAt: -1 })
    .limit(opts.limit ?? 10)
    .lean();
  return clean(
    blogs.map((b) => ({ ...b, url: `${SITE_URL}/blog/${(b as { slug: string }).slug}` }))
  );
}

export async function getBlog(slug: string) {
  await connectDB();
  const b = await Blog.findOne({ slug: slug.toLowerCase(), published: true })
    .select("title slug excerpt content tags readTime coverImage createdAt updatedAt")
    .lean();
  if (!b) return null;
  return clean({ ...b, url: `${SITE_URL}/blog/${slug.toLowerCase()}` });
}

/** Save a contact enquiry. Callers must have the visitor's explicit approval. */
export async function createEnquiry(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  await connectDB();
  const e = await Enquiry.create({ ...input, subject: input.subject || "Via AI agent" });
  return { id: String(e._id), status: "sent" as const };
}

// ─── Admin (token-protected callers only) ───────────────────────────────────

export async function listEnquiries(opts: { status?: "unread" | "read" | "replied"; limit?: number }) {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (opts.status) filter.status = opts.status;
  const items = await Enquiry.find(filter)
    .sort({ createdAt: -1 })
    .limit(opts.limit ?? 20)
    .lean();
  return clean(items);
}

export async function updateEnquiryStatus(id: string, status: "unread" | "read" | "replied") {
  await connectDB();
  const e = await Enquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();
  return e ? clean(e) : null;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function createBlogDraft(input: {
  title: string;
  excerpt: string;
  content: string;
  tags?: string[];
}) {
  await connectDB();
  let slug = slugify(input.title) || `post-${Date.now()}`;
  if (await Blog.exists({ slug })) slug = `${slug}-${Date.now().toString(36)}`;
  const words = input.content.split(/\s+/).filter(Boolean).length;
  const blog = await Blog.create({
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    tags: input.tags ?? [],
    readTime: Math.max(1, Math.round(words / 200)),
    published: false,
  });
  return { id: String(blog._id), slug, published: false, editUrl: `${SITE_URL}/admin/blogs` };
}

export async function getStats() {
  await connectDB();
  const [projects, experiences, blogsPublished, blogDrafts, enquiriesUnread, enquiriesTotal] =
    await Promise.all([
      Project.countDocuments(),
      Experience.countDocuments(),
      Blog.countDocuments({ published: true }),
      Blog.countDocuments({ published: false }),
      Enquiry.countDocuments({ status: "unread" }),
      Enquiry.countDocuments(),
    ]);
  return { projects, experiences, blogsPublished, blogDrafts, enquiriesUnread, enquiriesTotal };
}
