import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import { SITE_URL, OWNER_NAME, getSiteProfile, headlineRole, profileUrls, currentRole } from "./site";

type P = { title: string; slug: string; description?: string; seoDescription?: string; techStack?: string[]; liveUrl?: string; content?: string; category?: string };
type B = { title: string; slug: string; excerpt?: string; seoDescription?: string; tags?: string[] };

const oneLine = (t = "") => t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

async function load() {
  const profile = await getSiteProfile();
  let projects: P[] = [];
  let blogs: B[] = [];
  try {
    await connectDB();
    [projects, blogs] = await Promise.all([
      Project.find({}).sort({ featured: -1, createdAt: -1 }).lean<P[]>(),
      Blog.find({ published: true }).sort({ createdAt: -1 }).lean<B[]>(),
    ]);
  } catch (e) {
    console.error("llms.txt data error:", e);
  }
  return { ...profile, projects, blogs };
}

/** /llms.txt — short, link-first summary following the llms.txt proposal. */
export async function buildLlmsTxt() {
  const { settings: s, experiences, projects, blogs } = await load();
  const job = currentRole(experiences);
  const role = headlineRole(s);
  const lines = [
    `# ${OWNER_NAME}`,
    "",
    `> ${OWNER_NAME} (GitHub: ErAditya1) is a ${role}${job ? ` at ${job.company}` : ""}, based in Barabanki and working in Lucknow, Uttar Pradesh, India. He builds web applications with Next.js, React, Node.js, NestJS, MongoDB and PostgreSQL, including AI voice-calling and WhatsApp automation products.`,
    "",
    "Facts on this site come from the portfolio's own database. For live, structured answers use the MCP server listed below.",
    "",
    "## Profile",
    `- [About ${OWNER_NAME}](${SITE_URL}/about): background, skills, availability`,
    `- [Experience](${SITE_URL}/experience): roles and dates`,
    `- [Contact / hire](${SITE_URL}/contact): email${s?.ownerPhone ? ", phone/WhatsApp" : ""} and enquiry form`,
    "",
    "## Projects",
    ...projects.map((p) => `- [${p.title}](${SITE_URL}/projects/${p.slug}): ${oneLine(p.seoDescription || p.description).slice(0, 220)}`),
    "",
    "## Writing",
    ...blogs.map((b) => `- [${b.title}](${SITE_URL}/blog/${b.slug}): ${oneLine(b.seoDescription || b.excerpt).slice(0, 200)}`),
    "",
    "## Profiles",
    ...profileUrls(s).map((u) => `- ${u}`),
    "",
    "## Machine-readable",
    `- [MCP server (public, read-only)](${SITE_URL}/api/mcp): tools get_profile, list_projects, get_project, list_experience, search_blogs, get_blog`,
    `- [How to connect an AI client](${SITE_URL}/mcp)`,
    `- [Full plain-text profile](${SITE_URL}/llms-full.txt)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  ];
  return lines.join("\n");
}

/** /llms-full.txt — the whole factual profile in one plain-text document. */
export async function buildLlmsFullTxt() {
  const { settings: s, experiences, projects, blogs } = await load();
  const role = headlineRole(s);
  const skillsByCat = new Map<string, string[]>();
  for (const k of s?.skills || []) skillsByCat.set(k.category, [...(skillsByCat.get(k.category) || []), k.name]);

  const out: string[] = [
    `# ${OWNER_NAME} — ${role}`,
    "",
    `Website: ${SITE_URL}`,
    `Location: Barabanki (home) and Lucknow (work), Uttar Pradesh, India. Open to remote work.`,
    ...(s?.ownerEmail ? [`Email: ${s.ownerEmail}`] : []),
    ...profileUrls(s).map((u) => `Profile: ${u}`),
    "",
    "## Summary",
    oneLine(s?.ownerBio),
    "",
    "## Experience",
  ];
  for (const e of experiences.filter((x) => x.type !== "education")) {
    out.push(`### ${e.role} — ${e.company} (${e.period}${e.location ? `, ${e.location}` : ""})`);
    const ex = e as typeof e & { description?: string; points?: string[] };
    if (ex.description) out.push(oneLine(ex.description));
    for (const pt of ex.points || []) out.push(`- ${oneLine(pt)}`);
    if (e.skills?.length) out.push(`Skills: ${e.skills.join(", ")}`);
    out.push("");
  }
  const edu = experiences.filter((x) => x.type === "education");
  if (edu.length) {
    out.push("## Education");
    for (const e of edu) out.push(`- ${e.role}, ${e.company} (${e.period})`);
    out.push("");
  }
  out.push("## Skills");
  for (const [cat, names] of skillsByCat) out.push(`- ${cat}: ${names.join(", ")}`);
  out.push("", "## Projects");
  for (const p of projects) {
    out.push(`### ${p.title}`, `URL: ${SITE_URL}/projects/${p.slug}`);
    if (p.liveUrl && p.liveUrl !== "#") out.push(`Live: ${p.liveUrl}`);
    if (p.techStack?.length) out.push(`Stack: ${p.techStack.join(", ")}`);
    out.push(oneLine(p.description), "");
  }
  out.push("## Articles");
  for (const b of blogs) out.push(`- ${b.title} — ${SITE_URL}/blog/${b.slug}${b.excerpt ? `: ${oneLine(b.excerpt)}` : ""}`);
  out.push("");
  return out.join("\n");
}

export const textResponse = (body: string) =>
  new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
