import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { url, publicId } = await uploadImage(body.file, body.folder || "portfolio");

    return NextResponse.json({ url, publicId });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
