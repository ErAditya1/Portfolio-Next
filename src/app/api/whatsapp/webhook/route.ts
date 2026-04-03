import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { WhatsAppConversation } from "@/models/WhatsAppConversation";
import { WhatsAppMessage } from "@/models/WhatsAppMessage";
import { whatsappService } from "@/services/whatsappService";
import { autoReplyLogic } from "@/services/autoReplyLogic";

// Webhook Verification (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const verify_token = process.env.VERIFY_TOKEN;

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      // console.log("WEBHOOK_VERIFIED");
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return new NextResponse("Missing parameters", { status: 400 });
}

// Incoming Messages (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        await connectDB();

        const value = body.entry[0].changes[0].value;
        const msg = value.messages[0];
        const contact = value.contacts[0];

        const phone = msg.from;
        const messageId = msg.id;
        const type = msg.type;
        const timestamp = new Date(msg.timestamp * 1000);
        let content = "";

        if (type === "text") {
          content = msg.text.body;
        } else if (type === "button") {
          content = msg.button.text;
        } else if (type === "interactive") {
          content = msg.interactive.button_reply
            ? msg.interactive.button_reply.title
            : msg.interactive.list_reply.title;
        }

        // console.log(`Received message from ${phone}: ${content}`);

        // 1. Mark as read (async fire and forget)
        whatsappService.markAsRead(messageId).catch(console.error);

        // 2. Save Conversation
        let conversation = await WhatsAppConversation.findOne({ phone });
        if (!conversation) {
          conversation = await WhatsAppConversation.create({
            phone,
            name: contact ? contact.profile.name : "",
            status: "bot_handling",
            unreadCount: 1,
            lastMessage: content,
            lastActivityAt: timestamp,
          });
        } else {
          conversation.lastMessage = content;
          conversation.name = contact
            ? contact.profile.name
            : conversation.name;
          conversation.unreadCount += 1;
          conversation.lastActivityAt = timestamp;
          if (conversation.status === "archived") {
            conversation.status = "bot_handling";
          }
          await conversation.save();
        }

        // 3. Save Message
        // Prevent duplicate processing based on Meta's retry behavior
        const existingMsg = await WhatsAppMessage.findOne({ messageId });
        if (!existingMsg) {
          await WhatsAppMessage.create({
            conversationId: conversation._id,
            messageId,
            content,
            type,
            direction: "incoming",
            status: "received",
            timestamp,
          });

          // 4. Auto Reply Logic
          // We don't block the response to Meta, so run it asynchronously
          autoReplyLogic
            .handleIncomingMessage(conversation, content)
            .catch((err) => {
              console.error("Error in auto reply:", err);
            });
        }

        return new NextResponse("EVENT_RECEIVED", { status: 200 });
      } else if (body.entry?.[0]?.changes?.[0]?.value?.statuses?.[0]) {
        // Handle message status updates (sent, delivered, read)
        await connectDB();
        const statusObj = body.entry[0].changes[0].value.statuses[0];
        const messageId = statusObj.id;
        const status = statusObj.status;

        await WhatsAppMessage.findOneAndUpdate({ messageId }, { status });
        return new NextResponse("EVENT_RECEIVED", { status: 200 });
      } else {
        return new NextResponse("EVENT_RECEIVED", { status: 200 });
      }
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
