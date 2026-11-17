/**
 * Public MCP server — read-only portfolio tools.
 * Connect any MCP client to: https://<your-site>/api/mcp
 */
import { createMcpHandler } from "mcp-handler";
import { registerPublicTools } from "@/lib/mcp-server";

export const runtime = "nodejs";
export const maxDuration = 60;

const handler = createMcpHandler(
  (server) => {
    registerPublicTools(server);
  },
  {
    serverInfo: { name: "aditya-portfolio", version: "1.0.0" },
    instructions:
      "Tools for Aditya Kumar's developer portfolio (eraditya.vercel.app). Use get_profile for who he is and how to contact him, list_projects / get_project for his work, list_experience for his career, and search_blogs / get_blog for his writing.",
  }
);

export { handler as GET, handler as POST, handler as DELETE };
