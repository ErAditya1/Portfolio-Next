import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import SiteSettings from "@/models/SiteSettings";

import { ProjectCard } from "@/components/public/ProjectCard";
import { NeonHeading } from "@/components/NeonHeading";
import { Container } from "@/components/Container";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { ServicesSection } from "@/components/public/ServicesSection";

import { ISiteSettings, IProject, IBlog } from "@/types";

export const revalidate = 3600; // ISR  

export default async function HomePage() {
  await connectDB();

  const [projectsRaw, blogsRaw, settingsRaw] = await Promise.all([
    Project.find({ featured: true }).sort({ createdAt: -1 }).limit(4).lean(),
    Blog.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean(),
    SiteSettings.findOne().lean(),
  ]);

  // Serialize Mongoose objects for Client Components
  const projects = JSON.parse(JSON.stringify(projectsRaw)) as IProject[];
  const blogs = JSON.parse(JSON.stringify(blogsRaw)) as IBlog[];
  const settings = JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings;

  return (
    <main>
      <HeroSection settings={settings} />
      <AboutSection settings={settings} />
      <SkillsSection settings={settings} />
      <ServicesSection />

      {/* Featured Projects */}
      <section id="projects" className="py-20 bg-gradient-to-b from-transparent to-white/2">
        <Container>
          <NeonHeading>Featured Projects</NeonHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {projects.map((project) => (
              <ProjectCard key={project._id.toString()} project={project} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/projects" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors group">
              View All Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Latest Blogs */}
      <section id="blog" className="py-20">
        <Container>
          <NeonHeading>Latest Articles</NeonHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {blogs.map((blog) => (
              <Link
                key={blog._id.toString()}
                href={`/blog/${blog.slug}`}
                className="group bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {blog.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={blog.coverImage} alt={blog.title} className="w-full aspect-video object-cover" />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">{blog.excerpt}</p>
                  <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-gray-600 text-xs">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="text-blue-400 text-xs font-medium">Read More →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group">
              Visit Blog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
