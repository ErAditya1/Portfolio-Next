import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { ProjectCard } from "@/components/public/ProjectCard";
import { SearchInput } from "@/components/public/SearchInput";
import { IProject } from "@/types";


export const revalidate = 3600; // ISR: revalidate every 1 hour

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse my portfolio of full-stack web development projects including React, Next.js, Node.js, and more.",
  keywords: ["Projects", "Portfolio", "Web Development", "React", "Next.js", "Node.js", "Full-Stack"],
};

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { search = "", page = "1" } = await searchParams;
  await connectDB();

  const query: Record<string, unknown> = {};
  if (search) query.$text = { $search: search };

  const currentPage = parseInt(page);
  const limit = 9;
  const skip = (currentPage - 1) * limit;

  const [projectsRaw, total] = await Promise.all([
    Project.find(query).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Project.countDocuments(query),
  ]);

  const projects = JSON.parse(JSON.stringify(projectsRaw)) as IProject[];

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A collection of things I&apos;ve built with love and passion.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <SearchInput placeholder="Search projects..." defaultValue={search} />
        </div>

        {/* Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id.toString()} project={project} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/projects?page=${p}${search ? `&search=${search}` : ""}`}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${p === currentPage
                    ? "bg-purple-600 dark:bg-purple-600 text-white"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
