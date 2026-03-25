import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { WhatsAppConversation } from "@/models/WhatsAppConversation";
import { WhatsAppMessage } from "@/models/WhatsAppMessage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 });
    }

    await connectDB();

    const conversation = await WhatsAppConversation.findOne({ phone }).lean();

    if (!conversation) {
      // If no conversation exists, return empty history natively
      return NextResponse.json({ history: [] });
    }

    // Fetch messages
    const messages = await WhatsAppMessage.find({ conversationId: conversation._id })
      .sort({ timestamp: 1 })
      .limit(50) // only grab the last 50 to avoid massive payload
      .lean();

    // Map to Vercel AI SDK CoreMessage format
    const formattedHistory = messages.map((msg: { direction: string; content: string }) => ({
      role: msg.direction === "incoming" ? "user" : "assistant",
      content: msg.content,
    }));

    return NextResponse.json({ history: formattedHistory });
  } catch (error) {
    console.error("History Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
