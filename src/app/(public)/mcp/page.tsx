import type { Metadata } from "next";
import McpConnectClient from "@/components/public/McpConnectClient";

export const metadata: Metadata = {
  title: "Connect your AI (MCP)",
  description:
    "Connect Claude, ChatGPT, Cursor, VS Code, Gemini CLI and other AI tools to Aditya Kumar's portfolio through the Model Context Protocol (MCP), using a one-click install, a CLI command or a copy-paste prompt.",
  alternates: { canonical: "/mcp" },
};

export default function McpPage() {
  const baseUrl = (process.env.NEXTAUTH_URL || "https://eraditya.vercel.app").replace(/\/$/, "");
  return <McpConnectClient endpoint={`${baseUrl}/api/mcp`} />;
}
