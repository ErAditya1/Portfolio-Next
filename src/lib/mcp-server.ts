import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import * as tools from "@/lib/portfolio-tools";

/** Wrap any JSON result (or a not-found message) as MCP tool output. */
function json(data: unknown, notFound = "Not found.") {
  if (data === null || data === undefined) {
    return { content: [{ type: "text" as const, text: notFound }], isError: true };
  }
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

const readOnly = { readOnlyHint: true, openWorldHint: false } as const;

/** Read-only tools anyone can call: profile, projects, experience, blogs. */
export function registerPublicTools(server: McpServer) {
  server.registerTool(
    "get_profile",
    {
      title: "Get Aditya's profile",
      description:
        "Aditya Kumar's profile: name, title, bio, contact links, location, resume URL, skills (with level and category) and what he is currently learning.",
      inputSchema: z.object({}),
      annotations: readOnly,
    },
    async () => json(await tools.getProfile())
  );

  server.registerTool(
    "list_projects",
    {
      title: "List projects",
      description:
        "List Aditya's portfolio projects with tech stack, GitHub and live links. Filter by category, technology (e.g. 'Next.js', 'MongoDB') or featured.",
      inputSchema: z.object({
        category: z.enum(["flagship", "major", "minor", "client"]).optional(),
        tech: z.string().max(50).optional().describe("Technology name to filter by, case-insensitive"),
        featured: z.boolean().optional(),
        limit: z.number().int().min(1).max(50).optional(),
      }),
      annotations: readOnly,
    },
    async (args) => json(await tools.listProjects(args))
  );

  server.registerTool(
    "get_project",
    {
      title: "Get project details",
      description: "Full details of one project, including the long write-up, by its slug (from list_projects).",
      inputSchema: z.object({ slug: z.string().min(1).max(120) }),
      annotations: readOnly,
    },
    async ({ slug }) => json(await tools.getProject(slug), `No project with slug "${slug}".`)
  );

  server.registerTool(
    "list_experience",
    {
      title: "List work experience",
      description: "Aditya's work experience and education timeline: company, role, period, highlights and skills.",
      inputSchema: z.object({
        type: z.enum(["job", "trainee", "freelance", "education"]).optional(),
      }),
      annotations: readOnly,
    },
    async (args) => json(await tools.listExperience(args))
  );

  server.registerTool(
    "search_blogs",
    {
      title: "Search blog posts",
      description: "Search Aditya's published blog posts by text or tag. Returns title, excerpt, tags and URL.",
      inputSchema: z.object({
        query: z.string().max(100).optional(),
        tag: z.string().max(50).optional(),
        limit: z.number().int().min(1).max(30).optional(),
      }),
      annotations: readOnly,
    },
    async (args) => json(await tools.searchBlogs(args))
  );

  server.registerTool(
    "get_blog",
    {
      title: "Read a blog post",
      description: "Full markdown content of a published blog post, by slug (from search_blogs).",
      inputSchema: z.object({ slug: z.string().min(1).max(120) }),
      annotations: readOnly,
    },
    async ({ slug }) => json(await tools.getBlog(slug), `No published post with slug "${slug}".`)
  );
}

/** Tools for the site owner only. Mounted behind a bearer token. */
export function registerAdminTools(server: McpServer) {
  server.registerTool(
    "get_stats",
    {
      title: "Portfolio stats",
      description: "Counts of projects, experiences, published/draft blogs and unread/total enquiries.",
      inputSchema: z.object({}),
      annotations: readOnly,
    },
    async () => json(await tools.getStats())
  );

  server.registerTool(
    "list_enquiries",
    {
      title: "List contact enquiries",
      description: "Contact-form enquiries, newest first. Filter by status.",
      inputSchema: z.object({
        status: z.enum(["unread", "read", "replied"]).optional(),
        limit: z.number().int().min(1).max(100).optional(),
      }),
      annotations: readOnly,
    },
    async (args) => json(await tools.listEnquiries(args))
  );

  server.registerTool(
    "update_enquiry_status",
    {
      title: "Mark enquiry status",
      description: "Set an enquiry's status to unread, read or replied.",
      inputSchema: z.object({
        id: z.string().regex(/^[a-f0-9]{24}$/i, "Must be a 24-char Mongo id"),
        status: z.enum(["unread", "read", "replied"]),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    async ({ id, status }) => json(await tools.updateEnquiryStatus(id, status), `No enquiry with id ${id}.`)
  );

  server.registerTool(
    "create_blog_draft",
    {
      title: "Create blog draft",
      description:
        "Create a new UNPUBLISHED blog post (draft). Content is markdown. Review and publish it from the admin panel.",
      inputSchema: z.object({
        title: z.string().min(3).max(200),
        excerpt: z.string().min(10).max(500),
        content: z.string().min(20),
        tags: z.array(z.string().max(40)).max(10).optional(),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
    },
    async (args) => json(await tools.createBlogDraft(args))
  );
}
