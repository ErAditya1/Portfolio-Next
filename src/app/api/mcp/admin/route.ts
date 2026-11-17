/**
 * Admin MCP server — public tools + owner-only tools (enquiries, blog drafts, stats).
 * Requires header:  Authorization: Bearer <MCP_ADMIN_TOKEN>
 * Endpoint:         https://<your-site>/api/mcp/admin
 */
import { timingSafeEqual } from "crypto";
import { createMcpHandler } from "mcp-handler";
import { registerAdminTools, registerPublicTools } from "@/lib/mcp-server";

export const runtime = "nodejs";
export const maxDuration = 60;

const mcp = createMcpHandler(
  (server) => {
    registerPublicTools(server);
    registerAdminTools(server);
  },
  {
    serverInfo: { name: "aditya-portfolio-admin", version: "1.0.0" },
    instructions:
      "Owner tools for Aditya's portfolio. In addition to the public tools you can read stats, manage contact enquiries and create unpublished blog drafts.",
  }
);

function isAuthorized(req: Request): boolean {
  const expected = process.env.MCP_ADMIN_TOKEN;
  if (!expected || expected.length < 24) return false; // disabled unless a strong token is set
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function handler(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json", "www-authenticate": 'Bearer realm="mcp-admin"' },
    });
  }
  return mcp(req);
}

export { handler as GET, handler as POST, handler as DELETE };
