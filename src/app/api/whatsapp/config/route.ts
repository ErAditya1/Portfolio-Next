import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { WhatsAppConfig } from "@/models/WhatsAppConfig";
import { WhatsAppConversation } from "@/models/WhatsAppConversation";

export async function GET() {
  try {
    await connectDB();

    let config = await WhatsAppConfig.findOne();
    if (!config) {
      config = await WhatsAppConfig.create({});
    }

    // Update active conversations metric dynamically
    const activeCount = await WhatsAppConversation.countDocuments({
      status: { $ne: "archived" },
    });
    config.activeConversationsCount = activeCount;
    await config.save();

    return NextResponse.json(config);
  } catch (error) {
    console.error("WhatsApp Config GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { enabled } = await req.json();
    await connectDB();

    let config = await WhatsAppConfig.findOne();
    if (!config) {
      config = await WhatsAppConfig.create({ autoReplyEnabled: enabled });
    } else {
      config.autoReplyEnabled = enabled;
      await config.save();
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("WhatsApp Config POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
