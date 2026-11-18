import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

const PRIVATE = ["/admin", "/admin/", "/api/", "/login"];
// Public MCP and agent endpoints stay crawlable so AI tools can discover them via llms.txt.
const PUBLIC_API = ["/api/mcp"];

// Search + answer engines (citations) and training crawlers. Personal brand goal = maximum discoverability,
// so both are allowed. To opt out of training only, move the second group to `disallow: "/"`.
const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "DuckAssistBot",
];
const AI_TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Meta-ExternalAgent"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: ["/", ...PUBLIC_API], disallow: PRIVATE },
      { userAgent: AI_SEARCH_BOTS, allow: ["/", ...PUBLIC_API], disallow: PRIVATE },
      { userAgent: AI_TRAINING_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
