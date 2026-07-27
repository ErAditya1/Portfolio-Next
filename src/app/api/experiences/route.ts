import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("GET /api/experiences error:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const experience = await Experience.create(body);

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("POST /api/experiences error:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
