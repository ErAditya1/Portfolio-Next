"use client";

import Link from "next/link";
import { ExternalLink, Github, Eye, Star } from "lucide-react";
import { IProject } from "@/types";

export function ProjectCard({ project }: { project: IProject }) {
  const p = project;
  return (
    <div className="group bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Preview Image */}
      <div className="relative aspect-video bg-gray-800 overflow-hidden">
        {p.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-700">{p.title[0]}</span>
          </div>
        )}
        {p.featured && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full backdrop-blur-sm">
              <Star className="w-3 h-3" fill="currentColor" /> Featured
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-8 h-8 bg-gray-900/80 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white backdrop-blur-sm">
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-8 h-8 bg-gray-900/80 border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white backdrop-blur-sm">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors">{p.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">{p.description}</p>

        {/* Tech Stack */}
        {p.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {p.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full">
                {tech}
              </span>
            ))}
            {p.techStack.length > 4 && <span className="text-xs text-gray-500">+{p.techStack.length - 4}</span>}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <span className="text-gray-600 text-xs flex items-center gap-1"><Eye className="w-3 h-3" />{p.views}</span>
          <Link href={`/projects/${p.slug}`} className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
