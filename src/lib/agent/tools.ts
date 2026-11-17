/**
 * Tools the AG-UI portfolio agent can call. Read tools run on the server.
 * `request_contact` has no execute(): it pauses the run with an AG-UI interrupt
 * so the visitor can review and approve the enquiry before it's saved.
 */
import { tool } from "ai";
import { z } from "zod";
import * as data from "@/lib/portfolio-tools";

export const CONTACT_TOOL = "request_contact";

/** Wrap results the UI shows as cards, so the model summarises instead of re-listing them. */
function shown<T>(data: T) {
  return {
    displayedToVisitor:
      "Already shown to the visitor as visual cards. Do not repeat these items as a list or table; write a brief 2-4 sentence takeaway.",
    data,
  };
}

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(3000),
});
export type ContactPayload = z.infer<typeof contactSchema>;

export const agentTools = {
  get_profile: tool({
    description:
      "Aditya's profile: bio, title, location, contact/social links, resume URL, skills with levels, and what he's learning.",
    inputSchema: z.object({}),
    execute: async () => shown(await data.getProfile()),
  }),
  list_projects: tool({
    description:
      "List Aditya's portfolio projects (title, slug, description, techStack, links). Filter by category, technology or featured.",
    inputSchema: z.object({
      category: z.enum(["flagship", "major", "minor", "client"]).optional(),
      tech: z.string().max(50).optional().describe("Technology to filter by, e.g. 'Next.js'"),
      featured: z.boolean().optional(),
      limit: z.number().int().min(1).max(12).optional(),
    }),
    execute: async (args) => shown(await data.listProjects({ ...args, limit: args.limit ?? 6 })),
  }),
  get_project: tool({
    description: "Full details and write-up of one project, by slug (from list_projects).",
    inputSchema: z.object({ slug: z.string().min(1).max(120) }),
    execute: async ({ slug }) => {
      const p = await data.getProject(slug);
      return p ? shown(p) : { error: `No project "${slug}"` };
    },
  }),
  list_experience: tool({
    description: "Aditya's work experience and education timeline.",
    inputSchema: z.object({ type: z.enum(["job", "trainee", "freelance", "education"]).optional() }),
    execute: async (args) => shown(await data.listExperience(args)),
  }),
  search_blogs: tool({
    description: "Search Aditya's published blog posts by text or tag.",
    inputSchema: z.object({
      query: z.string().max(100).optional(),
      tag: z.string().max(50).optional(),
      limit: z.number().int().min(1).max(10).optional(),
    }),
    execute: async (args) => shown(await data.searchBlogs({ ...args, limit: args.limit ?? 5 })),
  }),
  [CONTACT_TOOL]: tool({
    description:
      "Send Aditya a contact/hiring enquiry on the visitor's behalf. The visitor will see a form pre-filled with these values and must approve it before anything is sent. Only call this when the visitor wants to contact or hire Aditya. Fill in what you know; ask for name and email if missing.",
    inputSchema: z.object({
      name: z.string().max(100).optional(),
      email: z.string().max(200).optional(),
      subject: z.string().max(200).optional(),
      message: z.string().max(3000).optional(),
    }),
    // no execute → human-in-the-loop interrupt
  }),
};

export type AgentToolName = keyof typeof agentTools;
