import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Gallery from "@/models/Gallery";
import Experience from "@/models/Experience";
import SiteSettings from "@/models/SiteSettings";
import Media from "@/models/Media";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Remove synthetic / duplicate projects
    const syntheticSlugs = [
      "bright-veil-lms",
      "nou-elearning-platform",
      "born-goat",
      "college-management-system",
      "event-management-system",
      "ai-calling-agent-platform",
    ];

    await Project.deleteMany({ slug: { $in: syntheticSlugs } });

    // 2. Exact Cloudinary Media Mapping for all authentic Database Projects
    const projectMediaMap: Record<string, { coverImage: string; images: string[]; logoUrl?: string; featured?: boolean; category?: string }> = {
      "callio-ai-ai-calling-voice-ai-platform": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1785229494/portfolio/projects/iuadkznhx5ascizwmg6v.png",
        images: [
          "https://res.cloudinary.com/dlwgfajvo/image/upload/v1785229494/portfolio/projects/iuadkznhx5ascizwmg6v.png",
          "https://res.cloudinary.com/dlwgfajvo/image/upload/v1777004237/portfolio/media/vucm7x8x4mjte8kmjdmw.png",
        ],
        featured: true,
        category: "flagship",
      },
      "wautomator-enterprise-whatsapp-marketing-automation-platform": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1777005551/portfolio/media/om6ehbwxm9kuksriv1bl.png",
        images: [
          "https://res.cloudinary.com/dlwgfajvo/image/upload/v1777005551/portfolio/media/om6ehbwxm9kuksriv1bl.png",
          "https://res.cloudinary.com/dlwgfajvo/image/upload/v1777005325/portfolio/media/qdiglpaled50e7vxqp71.png",
        ],
        featured: true,
        category: "flagship",
      },
      "amplibuzz": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1785227275/portfolio/projects/p4lsf1acpl9nvrnj2khw.png",
        images: ["https://res.cloudinary.com/dlwgfajvo/image/upload/v1785227275/portfolio/projects/p4lsf1acpl9nvrnj2khw.png"],
        featured: true,
        category: "flagship",
      },
      "brightveil": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1785226396/portfolio/projects/oms6qypu6agkdrnv1fxp.png",
        images: ["https://res.cloudinary.com/dlwgfajvo/image/upload/v1785226396/portfolio/projects/oms6qypu6agkdrnv1fxp.png"],
        featured: true,
        category: "major",
      },
      "super-tasky-advanced-task-productivity-management-system": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1773792749/portfolio/media/u6z9lnnwa40jrpdaylkq.png",
        images: ["https://res.cloudinary.com/dlwgfajvo/image/upload/v1773792749/portfolio/media/u6z9lnnwa40jrpdaylkq.png"],
        featured: true,
        category: "major",
      },
      "cheetah-agi": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1785226876/portfolio/projects/gke4f8oaid2iv9fxlrvb.png",
        images: ["https://res.cloudinary.com/dlwgfajvo/image/upload/v1785226876/portfolio/projects/gke4f8oaid2iv9fxlrvb.png"],
        featured: true,
        category: "flagship",
      },
      "observiq-trubetix": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1775156467/portfolio/media/mndingkrnruzabychtqh.png",
        images: [
          "https://res.cloudinary.com/dlwgfajvo/image/upload/v1775156467/portfolio/media/mndingkrnruzabychtqh.png",
          "https://res.cloudinary.com/dlwgfajvo/image/upload/v1775156448/portfolio/media/rmf6dynowxzhaa6xq8mm.png",
        ],
        featured: false,
        category: "flagship",
      },
      "adarsh-inter-college": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1785227491/portfolio/projects/ebzeoanifkkm55yvdghh.png",
        images: ["https://res.cloudinary.com/dlwgfajvo/image/upload/v1785227491/portfolio/projects/ebzeoanifkkm55yvdghh.png"],
        featured: false,
        category: "major",
      },
      "geetapalace": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1785227460/portfolio/projects/fst7vrbaa17uvpklofer.png",
        images: ["https://res.cloudinary.com/dlwgfajvo/image/upload/v1785227460/portfolio/projects/fst7vrbaa17uvpklofer.png"],
        featured: false,
        category: "client",
      },
      "sagar-institute": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1773792397/portfolio/media/bg632ivps5zanwiihvsz.png",
        images: ["https://res.cloudinary.com/dlwgfajvo/image/upload/v1773792397/portfolio/media/bg632ivps5zanwiihvsz.png"],
        featured: false,
        category: "client",
      },
      "noteshub": {
        coverImage: "https://res.cloudinary.com/dlwgfajvo/image/upload/v1775156370/portfolio/media/p0hlkvc7g7uuszqvjzid.png",
        images: ["https://res.cloudinary.com/dlwgfajvo/image/upload/v1775156370/portfolio/media/p0hlkvc7g7uuszqvjzid.png"],
        featured: false,
        category: "major",
      },
    };

    // 3. Update all database projects to use authentic Cloudinary Media images
    const remainingProjects = await Project.find();
    for (const project of remainingProjects) {
      const match = projectMediaMap[project.slug];
      if (match) {
        project.coverImage = match.coverImage;
        project.images = match.images;
        if (match.featured !== undefined) project.featured = match.featured;
        if (match.category) project.category = match.category;
        await project.save();
      } else if (Array.isArray(project.images) && project.images.length > 0 && project.images[0].startsWith("http")) {
        project.coverImage = project.images[0];
        await project.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cleaned up synthetic projects. All authentic database projects linked with Cloudinary Media images!",
      remainingProjectsCount: remainingProjects.length,
      projects: remainingProjects.map(p => ({ title: p.title, slug: p.slug, coverImage: p.coverImage })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
