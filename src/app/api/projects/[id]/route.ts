import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const project = await Project.findById(id).lean();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // Ensure coverImage is always synced with images
    if (Array.isArray(body.images) && body.images.length > 0) {
      if (!body.coverImage || !body.images.includes(body.coverImage)) {
        body.coverImage = body.images[0];
      }
    }

    const project = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Instantly invalidate caches so changes reflect immediately across the entire site
    revalidatePath("/");
    revalidatePath("/projects");
    if (project.slug) {
      revalidatePath(`/projects/${project.slug}`);
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidatePath("/");
    revalidatePath("/projects");
    if (project.slug) {
      revalidatePath(`/projects/${project.slug}`);
    }

    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

