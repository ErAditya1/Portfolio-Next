import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import SiteSettings from "@/models/SiteSettings";
import AIChatSession from "@/models/AIChatSession";

export const maxDuration = 60;

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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    console.error("DELETE Chat Error:", error);
    return NextResponse.json({ success: false });
  }
}

// POST /api/chat -> Stream Google Gemini LLM response & save to MongoDB
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

    // Fetch dynamic context from MongoDB
    let projectContext = "";
    let experienceContext = "";
    let ownerInfo = {
      name: "Aditya Kumar",
      title: "Full Stack Developer & AI Systems Engineer",
      email: "mradityaji2@gmail.com",
      phone: "+91 9473774390",
      location: "Barabanki / Lucknow, Uttar Pradesh, India",
      github: "https://github.com/ErAditya1",
      linkedin: "https://linkedin.com/in/eraditya1",
    };

    let geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    let activeModel = "gemini-2.0-flash";

    try {
      const [projects, experiences, settings] = await Promise.all([
        Project.find({ status: "completed" }).select("title description techStack liveUrl githubUrl category"),
        Experience.find().sort({ order: 1 }).select("company role period description points skills type isCurrent"),
        SiteSettings.findOne(),
      ]);

      if (settings) {
        if (settings.geminiApiKey) geminiApiKey = settings.geminiApiKey;
        else if (settings.aiApiKey) geminiApiKey = settings.aiApiKey;

        if (settings.aiModel && settings.aiModel.includes("gemini")) {
          activeModel = settings.aiModel;
        } else if (process.env.GEMINI_MODEL) {
          activeModel = process.env.GEMINI_MODEL;
        }

        if (settings.ownerName) ownerInfo.name = settings.ownerName;
        if (settings.ownerTitle) ownerInfo.title = settings.ownerTitle;
        if (settings.ownerEmail) ownerInfo.email = settings.ownerEmail;
        if (settings.ownerPhone) ownerInfo.phone = settings.ownerPhone;
        if (settings.ownerLocation) ownerInfo.location = settings.ownerLocation;
        if (settings.githubUrl) ownerInfo.github = settings.githubUrl;
        if (settings.linkedinUrl) ownerInfo.linkedin = settings.linkedinUrl;
      }

      if (projects && projects.length > 0) {
        projectContext = projects
          .map(
            (p) =>
              `• ${p.title} [${p.category || "Full-Stack"}]: ${p.description}\n  - Tech Stack: ${(p.techStack || []).join(", ")}\n  - Live URL: ${p.liveUrl || "N/A"} | GitHub: ${p.githubUrl || "N/A"}`
          )
          .join("\n\n");
      }

      if (experiences && experiences.length > 0) {
        experienceContext = experiences
          .map(
            (e) =>
              `• ${e.role} at ${e.company} (${e.period})${e.isCurrent ? " [CURRENT ROLE]" : ""}\n  - Details: ${e.description}\n  - Key Skills: ${(e.skills || []).join(", ")}`
          )
          .join("\n\n");
      }
    } catch (dbErr) {
      console.warn("DB Context Fetch Warning:", dbErr);
    }

    // Prepare Comprehensive System Prompt for Aditya Kumar
    const systemPrompt = `You are the official AI Assistant for Aditya Kumar's personal developer portfolio website.
Your objective is to represent Aditya, answer questions from recruiters, clients, and visitors, and provide accurate, high-impact insights into his skills, production projects, engineering experience, and availability.

=== 👤 ABOUT ADITYA KUMAR ===
• Name: ${ownerInfo.name}
• Professional Title: ${ownerInfo.title}
• Location: ${ownerInfo.location}
• Direct Email: ${ownerInfo.email}
• WhatsApp / Phone: ${ownerInfo.phone}
• GitHub: ${ownerInfo.github}
• LinkedIn: ${ownerInfo.linkedin}

=== 🚀 CORE TECHNICAL EXPERTISE ===
• Frontend: Next.js 15 (App Router), React 19, TypeScript, JavaScript (ES6+), Tailwind CSS v4, Framer Motion, Shadcn UI, Zustand, Redux Toolkit, TanStack React Query.
• Backend & APIs: Node.js, Express.js, NestJS, Python, FastAPI, Django, RESTful APIs, WebSockets (Socket.io), BullMQ queue scheduling.
• AI, Voice & Automations: Conversational Voice AI (ElevenLabs), Speech-To-Text (Deepgram), Meta WhatsApp Cloud API, OpenAI GPT-4, Google Gemini integration, Prompt Engineering.
• Databases & Storage: MongoDB (Atlas / Mongoose), PostgreSQL (Prisma ORM), MySQL, Redis, Cloudinary CDN.
• DevOps & Infrastructure: Docker, Docker Compose, Linux VPS management, Vercel, Git/GitHub CI/CD, Nginx.

=== 💼 WORK EXPERIENCE & TRACK RECORD ===
${experienceContext || "• Full Stack Developer at Feeding Trends (Current): Building AI Voice calling platform (Callio AI), Influencer marketing SaaS (Amplibuzz), and security intelligence tools (Observiq/Trubetix)."}

=== 🌟 PRODUCTION PROJECTS SHOWCASE ===
${projectContext || "• Callio AI (AI Outbound Calling Platform)\n• WAutomator (WhatsApp Cloud API Automation SaaS)\n• Amplibuzz (Influencer Escrow Platform)\n• BrightVeil (Enterprise LMS)\n• Super Tasky (Real-time Task Manager)\n• Observiq (Social Intelligence & AI Security)"}

=== 🛠️ SERVICES & HIRING DETAILS ===
1. Full-Stack Web App Development (Modern Next.js / MERN / Python platforms)
2. AI Voice Telephony & Agent Pipelines (<300ms audio streaming, ElevenLabs, Deepgram)
3. WhatsApp Cloud API Marketing & Automation Engines
4. Scalable Microservices, Background Queues & RESTful APIs
5. Performance Optimization & Modern Responsive UI/UX
• Pricing: Custom portfolios and landing pages start around $499. Full-stack SaaS and custom enterprise systems are quoted based on milestones and scope.
• Availability: Open for Full-Time Roles, Contract Engagements, and Freelance Consulting.

=== 🎯 CONVERSATIONAL GUIDELINES ===
- Adopt a warm, professional, confident, and knowledgeable tone.
- Speak in natural first/third person representing Aditya ("Aditya is...", "He built...", "You can contact him directly...").
- Keep replies concise, clean, and well-formatted with markdown bullet points where helpful.
- Whenever someone asks to contact or hire him, provide his direct WhatsApp (${ownerInfo.phone}) or Email (${ownerInfo.email}) and invite them to schedule a call.
- If asked technical questions about code or architecture, explain his practical approach clearly and accurately based on modern software engineering standards.`;

    // If Gemini API Key is not configured, return a polite, structured fallback
    if (!geminiApiKey) {
      const fallbackMsg = `Hello! 👋 I am Aditya's Portfolio Assistant. 

Aditya is a **Full Stack Developer & AI Systems Engineer** specialized in:
• **Full Stack & Modern Web:** Next.js 15, React 19, TypeScript, Node.js, NestJS, Python & Tailwind CSS.
• **AI Voice & Telephony:** Real-time conversational calling systems (ElevenLabs + WebSockets).
• **Enterprise Automation:** WhatsApp Cloud API SaaS, BullMQ queues, and scalable microservices.

*(Note: To enable live generative streaming, please configure your Gemini API Key in the Admin Dashboard or \`.env\` file).*

Feel free to connect directly with Aditya:
📱 **WhatsApp:** [${ownerInfo.phone}](https://wa.me/${ownerInfo.phone.replace(/[^0-9]/g, "")})
✉️ **Email:** [${ownerInfo.email}](mailto:${ownerInfo.email})`;

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(fallbackMsg));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
        },
      });
    }

    // Format conversation history for Gemini API
    const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];

    // Map recent messages
    const recentMessages = session.messages.slice(-8);
    for (const msg of recentMessages) {
      if (msg.role === "user") {
        contents.push({ role: "user", parts: [{ text: msg.content }] });
      } else if (msg.role === "assistant") {
        contents.push({ role: "model", parts: [{ text: msg.content }] });
      }
    }

    // Ensure the last message in contents is the current user request
    if (contents.length === 0 || contents[contents.length - 1].role !== "user") {
      contents.push({ role: "user", parts: [{ text: userContent }] });
    }

    // Normalize Gemini model name
    let cleanModelName = activeModel.trim();
    if (!cleanModelName.startsWith("gemini")) {
      cleanModelName = "gemini-2.0-flash";
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModelName}:streamGenerateContent?alt=sse&key=${geminiApiKey}`;

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiResponse.ok || !geminiResponse.body) {
      const errText = await geminiResponse.text();
      console.error("Gemini API Stream Error:", errText);

      // Attempt fallback to non-streaming or standard response
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModelName}:generateContent?key=${geminiApiKey}`;
      const nonStreamRes = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload),
      });

      if (nonStreamRes.ok) {
        const nonStreamData = await nonStreamRes.json();
        const replyText =
          nonStreamData?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I'm here to help! Please feel free to ask about Aditya's projects, experience, or hiring details.";

        // Save generated message to session
        const currentSession = await AIChatSession.findOne({ deviceId });
        if (currentSession) {
          currentSession.messages.push({
            id: `bot-${Date.now()}`,
            role: "assistant",
            content: replyText,
            timestamp: new Date(),
          });
          currentSession.lastActiveAt = new Date();
          await currentSession.save();
        }

        const encoder = new TextEncoder();
        return new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(replyText));
              controller.close();
            },
          }),
          {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
            },
          }
        );
      }

      throw new Error(`Gemini Error (${geminiResponse.status}): ${errText}`);
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = geminiResponse.body.getReader();

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
              if (!trimmed) continue;

              if (trimmed.startsWith("data: ")) {
                const jsonStr = trimmed.slice(6).trim();
                if (jsonStr === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(jsonStr);
                  const chunkText =
                    parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  if (chunkText) {
                    fullContent += chunkText;
                    controller.enqueue(encoder.encode(chunkText));
                  }
                } catch {
                  // Skip non-JSON SSE lines
                }
              }
            }
          }

          if (buffer.trim() && buffer.trim().startsWith("data: ")) {
            try {
              const parsed = JSON.parse(buffer.trim().slice(6));
              const chunkText =
                parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (chunkText) {
                fullContent += chunkText;
                controller.enqueue(encoder.encode(chunkText));
              }
            } catch {}
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
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("POST Stream Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to stream chat response: " + errorMsg },
      { status: 500 }
    );
  }
}
