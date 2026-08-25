import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://eraditya.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/api/setup/seed"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Claude-Web", "ClaudeBot", "PerplexityBot", "CCBot"],
        allow: "/",
        disallow: ["/admin/", "/api/", "/api/setup/seed"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
