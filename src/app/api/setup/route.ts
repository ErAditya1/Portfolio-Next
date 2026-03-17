import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// One-time admin seed route (disable after first use in production!)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, email, password, secret } = body;

    // Guard with a setup secret
    if (secret !== process.env.NEXT_PUBLIC_SETUP_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role: "admin" });

    return NextResponse.json({ message: "Admin created", id: user._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
