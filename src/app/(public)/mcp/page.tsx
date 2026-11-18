import type { Metadata } from "next";
import McpConnectClient from "@/components/public/McpConnectClient";

export const metadata: Metadata = {
  title: "Connect your AI (MCP)",
  description:
    "Connect Claude, ChatGPT, Cursor, VS Code or Gemini CLI to Aditya Kumar's portfolio over MCP, with a one-click install, a CLI command or a copy-paste prompt.",
  alternates: { canonical: "/mcp" },
  openGraph: { url: "/mcp", title: "Connect your AI to Aditya Kumar's portfolio (MCP)", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

export default function McpPage() {
  const baseUrl = (process.env.NEXTAUTH_URL || "https://eraditya.vercel.app").replace(/\/$/, "");
  return <McpConnectClient endpoint={`${baseUrl}/api/mcp`} />;
}
