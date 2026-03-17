import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Media from "@/models/Media";
import { deleteImage } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // image or raw (pdf)
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (type) query.resourceType = type;
    if (search) {
      query.filename = { $regex: search, $options: "i" };
    }

    const items = await Media.find(query).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const publicId = searchParams.get("publicId");

    if (!id || !publicId) {
      return NextResponse.json({ error: "Missing ID or publicId" }, { status: 400 });
    }

    await connectDB();
    
    // 1. Delete from Cloudinary
    await deleteImage(publicId);
    
    // 2. Delete from Database
    await Media.findByIdAndDelete(id);

    return NextResponse.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
