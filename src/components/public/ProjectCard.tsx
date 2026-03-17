"use client";

import Link from "next/link";
import { ExternalLink, Github, Eye, Star, Layers, Activity } from "lucide-react";
import { IProject } from "@/types";
import { motion } from "framer-motion";

export function ProjectCard({ project }: { project: IProject }) {
  const p = project;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 flex flex-col h-full shadow-md hover:shadow-primary/10"
    >
      {/* Preview Image */}
      <div className="relative aspect-video bg-accent/20 overflow-hidden">
        {p.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent/20">
            <Layers className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {p.featured && (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-md backdrop-blur-md">
              <Star className="w-3 h-3" fill="currentColor" /> Featured
            </span>
          )}
          {p.status === "in-progress" && (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md backdrop-blur-md">
              <Activity className="w-3 h-3 animate-pulse" /> Building
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Github className="w-5 h-5" />
            </a>
          )}
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-foreground font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">{p.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1 mb-4">{p.description}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {p.techStack?.slice(0, 3).map((tech) => (
            <span key={tech} className="text-[10px] px-2 py-1 bg-accent/50 text-muted-foreground border border-border rounded-md uppercase tracking-wider font-bold group-hover:border-primary/20 transition-colors">
              {tech}
            </span>
          ))}
          {p.techStack.length > 3 && <span className="text-[10px] text-muted-foreground/60 self-center">+{p.techStack.length - 3}</span>}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
             <span className="text-muted-foreground/60 text-[10px] flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{p.views} views</span>
          </div>
          <Link href={`/projects/${p.slug}`} className="text-xs font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1 group/btn">
            Full Case Study <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
);
