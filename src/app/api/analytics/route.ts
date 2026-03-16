import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Enquiry from "@/models/Enquiry";

// Analytics dashboard endpoint: returns traffic counts
export async function GET() {
  try {
    await connectDB();

    const [
      totalProjects,
      totalBlogs,
      totalEnquiries,
      unreadEnquiries,
      featuredProjects,
      publishedBlogs,
      recentEnquiries,
      topProjects,
      topBlogs,
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "unread" }),
      Project.countDocuments({ featured: true }),
      Blog.countDocuments({ published: true }),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      Project.find().sort({ views: -1 }).limit(5).select("title views slug").lean(),
      Blog.find().sort({ views: -1 }).limit(5).select("title views slug readTime").lean(),
    ]);

    return NextResponse.json({
      overview: {
        totalProjects,
        totalBlogs,
        totalEnquiries,
        unreadEnquiries,
        featuredProjects,
        publishedBlogs,
      },
      recentEnquiries,
      topProjects,
      topBlogs,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

// Track view for a project or blog
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { type, slug } = await req.json();

    if (type === "project") {
      await Project.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    } else if (type === "blog") {
      await Blog.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
