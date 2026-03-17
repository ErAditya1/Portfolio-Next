import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import Media from "@/models/Media";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadData = await uploadImage(body.file, body.folder || "portfolio");

    // Save to database
    const media = await Media.create(uploadData);

    return NextResponse.json(media);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
