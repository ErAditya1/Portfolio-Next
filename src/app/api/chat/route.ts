import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import SiteSettings from "@/models/SiteSettings";
import { WhatsAppConversation } from "@/models/WhatsAppConversation";
import { WhatsAppMessage } from "@/models/WhatsAppMessage";
import crypto from "crypto";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, phone } = await req.json();

  await connectDB();

  // Fetch true live portfolio context
  const projects = await Project.find({ status: "completed" }).select("title description liveUrl techStack");
  const settings = await SiteSettings.findOne();

  const projectContext = projects.map(p => `- ${p.title}: ${p.description} (Tech: ${p.techStack.join(", ")}) [Live: ${p.liveUrl}]`).join("\n");
  
  const systemPrompt = `You are the AI assistant for Aditya Kumar's portfolio website. 
You exist as a floating chat widget available 24/7 to answer questions from visitors about Aditya.
Aditya is a full-stack developer specializing in Next.js, Node.js, and modern web application architectures.

Here is Aditya's real-time live portfolio data:
**Projects:**
${projectContext}

**Site Settings / Contact:**
- Email: ${settings?.contactEmail || "N/A"}
- GitHub / LinkedIn etc are visible on the platform.

Key Information:
- Pricing: Custom portfolio websites start at $499. Application development depends on the scope.
- Contact: Visitors can reach him via WhatsApp at +919473774390 or by using the contact form in the 'Enquiries' section.
- Tone: Be helpful, concise, professional yet conversational. 

Your goal is to guide clients to view his projects, read his blogs, or get in touch for custom development quotes.
Keep responses concise, usually 1-3 sentences. Do not use emojis excessively.`;

  // Check if we need to log this conversation to WhatsApp
  let conversationId: string | null = null;
  const userMessage = messages[messages.length - 1]; // Current incoming

  if (phone) {
    let conversation = await WhatsAppConversation.findOne({ phone });
    if (!conversation) {
      conversation = await WhatsAppConversation.create({
        phone,
        status: "bot_handling",
        lastActivityAt: new Date(),
        lastMessage: userMessage.content,
      });
    } else {
      conversation.lastMessage = userMessage.content;
      conversation.lastActivityAt = new Date();
      await conversation.save();
    }
    conversationId = conversation._id;

    // Save incoming user message
    await WhatsAppMessage.create({
      conversationId,
      messageId: `web_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      content: userMessage.content,
      type: "text",
      direction: "incoming",
      status: "received",
    });
  }

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages,
    onFinish: async ({ text }) => {
      // Background async save the AI assistant's reply
      if (phone && conversationId) {
        await WhatsAppMessage.create({
          conversationId,
          messageId: `web_reply_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
          content: text,
          type: "text",
          direction: "outgoing",
          status: "sent",
        });
      }
    }
  }); 

  return result.toTextStreamResponse();
}
