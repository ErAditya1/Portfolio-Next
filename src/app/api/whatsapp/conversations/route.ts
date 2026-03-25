import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { WhatsAppConversation } from "@/models/WhatsAppConversation";

export async function GET() {
  try {
    await connectDB();

    const conversations = await WhatsAppConversation.find()
      .sort({ lastActivityAt: -1 })
      .lean();

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("WhatsApp Conversations GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
