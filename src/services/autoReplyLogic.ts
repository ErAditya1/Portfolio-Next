import { whatsappService } from "./whatsappService";
import { WhatsAppConfig } from "@/models/WhatsAppConfig";
import { WhatsAppMessage } from "@/models/WhatsAppMessage";
import { IWhatsAppConversation } from "@/models/WhatsAppConversation";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import SiteSettings from "@/models/SiteSettings";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

class AutoReplyLogic {
  async handleIncomingMessage(
    conversation: IWhatsAppConversation,
    text: string
  ) {
    await connectDB();
    
    // 1. Check if auto-reply is enabled globally
    let config = await WhatsAppConfig.findOne();
    if (!config) {
      config = await WhatsAppConfig.create({});
    }

    // Increment stats
    config.totalMessagesCount += 1;
    await config.save();

    if (!config.autoReplyEnabled) {
      return; // Do nothing if disabled
    }

    if (conversation.status !== "bot_handling") {
      return; // If manual intervention, don't auto-reply
    }

    const phone = conversation.phone;

    // Fetch true live portfolio context
    const projects = await Project.find({ status: "completed" }).select("title description liveUrl techStack");
    const settings = await SiteSettings.findOne();

    const projectContext = projects.map(p => `- ${p.title}: ${p.description} (Tech: ${p.techStack.join(", ")}) [Live: ${p.liveUrl}]`).join("\n");
    
    const systemPrompt = `You are the AI WhatsApp assistant for Aditya Kumar's portfolio. 
Aditya is a full-stack developer specializing in Next.js, Node.js, and modern web application architectures.

Here is Aditya's real-time live portfolio data:
**Projects:**
${projectContext}

**Site Settings / Contact:**
- Email: ${settings?.contactEmail || "N/A"}

Key Information:
- Pricing: Custom websites start at $499.
- Contact: If they want to speak to him directly, let them know he'll reply to this WhatsApp thread shortly.
- Tone: Be extremely concise, helpful, and conversational. Limit responses to 1-3 short sentences max. It's WhatsApp, keep it brief!`;

    try {
      // Fetch conversation history
      const history = await WhatsAppMessage.find({ conversationId: conversation._id })
        .sort({ timestamp: 1 })
        .limit(20) // Only look at last 20 messages for context window
        .lean();

      const mappedMessages = history.map((msg) => ({
        role: (msg.direction === "incoming" ? "user" : "assistant") as "user" | "assistant",
        content: msg.content,
      }));

      const { text: replyText } = await generateText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt,
        messages: mappedMessages,
      });

      await this.sendReplyWithTracking(conversation._id.toString(), phone, replyText, config);
    } catch (err) {
      console.error("OpenAI Auto-Reply generation failed:", err);
      // Fallback
      const replyText = `Hey 👋 I'm currently busy, but my assistant is having some technical difficulties. I'll get back to you shortly!`;
      await this.sendReplyWithTracking(conversation._id.toString(), phone, replyText, config);
    }
  }

  async sendReplyWithTracking(
    conversationId: string,
    phone: string,
    text: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any
  ) {
    try {
      const responseData = await whatsappService.sendTextMessage(phone, text);
      const messageId = responseData.messages[0].id;

      await this.logOutgoingMessage(conversationId, messageId, text, "text");

      config.autoRepliesSentCount += 1;
      await config.save();
    } catch (error) {
      console.error("Failed to send auto-reply to", phone);
    }
  }

  async logOutgoingMessage(
    conversationId: string,
    messageId: string,
    content: string,
    type: string
  ) {
    try {
      await WhatsAppMessage.create({
        conversationId,
        messageId,
        content,
        type,
        direction: "outgoing",
        status: "sent",
      });
    } catch (e) {
      console.error("Failed to log outgoing message to MongoDB", e);
    }
  }
}

export const autoReplyLogic = new AutoReplyLogic();
