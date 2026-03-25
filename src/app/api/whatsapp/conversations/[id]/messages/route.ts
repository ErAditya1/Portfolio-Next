import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { WhatsAppMessage } from "@/models/WhatsAppMessage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const messages = await WhatsAppMessage.find({ conversationId: id })
      .sort({ timestamp: 1 })
      .lean();

    return NextResponse.json(messages);
  } catch (error) {
    console.error("WhatsApp Messages GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
