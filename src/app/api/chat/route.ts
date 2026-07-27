import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import SiteSettings from "@/models/SiteSettings";
import AIChatSession from "@/models/AIChatSession";

export const maxDuration = 30;

// GET /api/chat?deviceId=xxx -> Fetch chat history for this device
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json({ messages: [] });
    }

    await connectDB();
    const session = await AIChatSession.findOne({ deviceId });

    if (!session || !session.messages || session.messages.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: session.messages });
  } catch (error: any) {
    console.error("GET Chat Error:", error);
    return NextResponse.json({ messages: [] });
  }
}

// DELETE /api/chat?deviceId=xxx -> Reset chat history for this device
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");

    if (deviceId) {
      await connectDB();
      await AIChatSession.deleteOne({ deviceId });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Chat Error:", error);
    return NextResponse.json({ success: false });
  }
}

// POST /api/chat -> Stream LLM response & save to MongoDB
export async function POST(req: Request) {
  try {
    const { deviceId, message, messages: incomingMessages } = await req.json();

    if (!deviceId) {
      return NextResponse.json({ error: "Missing deviceId" }, { status: 400 });
    }

    await connectDB();

    let session = await AIChatSession.findOne({ deviceId });
    if (!session) {
      session = await AIChatSession.create({
        deviceId,
        messages: [
          {
            id: `init-${Date.now()}`,
            role: "assistant",
            content: "Hi there! 👋 I am Aditya's AI Assistant. Ask me anything about Aditya's skills, projects, experience, or custom development pricing!",
            timestamp: new Date(),
          },
        ],
      });
    }

    let userContent = message;
    if (!userContent && incomingMessages && incomingMessages.length > 0) {
      const lastMsg = incomingMessages[incomingMessages.length - 1];
      if (lastMsg.role === "user") {
        userContent = lastMsg.content;
      }
    }

    if (!userContent || !userContent.trim()) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    // Save user message to session
    const userMsgObj = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: userContent.trim(),
      timestamp: new Date(),
    };
    session.messages.push(userMsgObj);
    session.lastActiveAt = new Date();
    await session.save();

    // Fetch live portfolio data & active AI model from MongoDB
    let projectContext = "";
    let settingsContext = "";
    let activeModel = "qwen2.5";

    try {
      const projects = await Project.find({ status: "completed" }).select("title description liveUrl techStack");
      const settings = await SiteSettings.findOne();

      if (settings?.aiModel) {
        activeModel = settings.aiModel;
      } else if (process.env.LLM_MODEL) {
        activeModel = process.env.LLM_MODEL;
      }

      if (projects && projects.length > 0) {
        projectContext = projects
          .map(
            (p) =>
              `- ${p.title}: ${p.description} (Tech: ${(p.techStack || []).join(", ")}) ${
                p.liveUrl ? `[Live: ${p.liveUrl}]` : ""
              }`
          )
          .join("\n");
      }
      if (settings) {
        settingsContext = `Email: ${settings.ownerEmail || "mradityaji2@gmail.com"}, Phone: ${
          settings.ownerPhone || "+919473774390"
        }`;
      }
    } catch (dbErr) {
      console.warn("DB context fetch error:", dbErr);
    }

    const systemPrompt = `You are the official AI Assistant for Aditya Kumar's portfolio website.
Your role is to represent Aditya, answer questions from visitors, recruiters, and clients, and showcase his technical skills, services, and projects.

About Aditya Kumar:
- Title: Full Stack Web Developer & Software Engineer
- Core Expertise: Next.js, React.js, TypeScript, JavaScript, Node.js, Express.js, Python, C, Tailwind CSS, Material UI, Shadcn UI, MongoDB, PostgreSQL, MySQL, RESTful APIs, Docker, Git.
- Services Offered: Custom Web Applications, Portfolio Websites, Full-Stack Web Development, API Design & Integration, Database Architecture, Maintenance & VPS Setup.
- Services Pricing: Custom portfolio websites start at $499. Application development quotes depend on the project scope.
- Contact: Visitors can message Aditya on WhatsApp at +919473774390 or email at mradityaji2@gmail.com.

Live Portfolio Information:
${projectContext ? `**Featured Projects:**\n${projectContext}` : "- Various full-stack Next.js, Node.js, and React web applications."}
${settingsContext ? `**Contact Information:**\n${settingsContext}` : "- Email: mradityaji2@gmail.com | Phone/WhatsApp: +919473774390"}

Guidelines:
- Be friendly, professional, clear, and helpful.
- Keep answers concise (2-4 sentences max per reply).
- Guide clients towards viewing projects or contacting Aditya for custom project inquiries.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...session.messages.slice(-10).map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    let baseUrl = process.env.LLM_API_URL || "https://llm.cheetahagi.com/v1";
    baseUrl = baseUrl.replace(/\/$/, "");
    const llmUrl = baseUrl.endsWith("/v1") ? `${baseUrl}/chat/completions` : `${baseUrl}/v1/chat/completions`;

    const llmResponse = await fetch(llmUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: activeModel,
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!llmResponse.ok || !llmResponse.body) {
      const errText = await llmResponse.text();
      console.error("LLM Stream Error:", errText);
      throw new Error(`LLM Stream Error ${llmResponse.status}: ${errText}`);
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = llmResponse.body.getReader();

    let fullContent = "";

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === "data: [DONE]") continue;

              if (trimmed.startsWith("data: ")) {
                try {
                  const parsed = JSON.parse(trimmed.slice(6));
                  const delta = parsed.choices?.[0]?.delta?.content || "";
                  if (delta) {
                    fullContent += delta;
                    controller.enqueue(encoder.encode(delta));
                  }
                } catch (e) {
                  // Skip non-JSON SSE lines
                }
              }
            }
          }

          if (buffer.trim() && buffer.trim().startsWith("data: ")) {
            try {
              const parsed = JSON.parse(buffer.trim().slice(6));
              const delta = parsed.choices?.[0]?.delta?.content || "";
              if (delta) {
                fullContent += delta;
                controller.enqueue(encoder.encode(delta));
              }
            } catch (e) {}
          }

          // Save complete generated message to MongoDB session
          if (fullContent.trim()) {
            const currentSession = await AIChatSession.findOne({ deviceId });
            if (currentSession) {
              currentSession.messages.push({
                id: `bot-${Date.now()}`,
                role: "assistant",
                content: fullContent,
                timestamp: new Date(),
              });
              currentSession.lastActiveAt = new Date();
              await currentSession.save();
            }
          }

          controller.close();
        } catch (err) {
          console.error("Stream processing error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error: any) {
    console.error("POST Stream Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to stream chat response: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
