"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  BookOpen,
  MessageSquare,
  Eye,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";

interface Analytics {
  overview: {
    totalProjects: number;
    totalBlogs: number;
    totalEnquiries: number;
    unreadEnquiries: number;
    featuredProjects: number;
    publishedBlogs: number;
  };
  recentEnquiries: Array<{
    _id: string;
    name: string;
    email: string;
    message: string;
    status: string;
    createdAt: string;
  }>;
  topProjects: Array<{ _id: string; title: string; views: number; slug: string }>;
  topBlogs: Array<{ _id: string; title: string; views: number; slug: string; readTime: number }>;
}

const statCards = (data: Analytics["overview"]) => [
  {
    label: "Total Projects",
    value: data.totalProjects,
    sub: `${data.featuredProjects} featured`,
    icon: FolderKanban,
    color: "from-purple-500 to-violet-600",
    href: "/admin/projects",
  },
  {
    label: "Total Blogs",
    value: data.totalBlogs,
    sub: `${data.publishedBlogs} published`,
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    href: "/admin/blogs",
  },
  {
    label: "Enquiries",
    value: data.totalEnquiries,
    sub: `${data.unreadEnquiries} unread`,
    icon: MessageSquare,
    color: "from-emerald-500 to-teal-500",
    href: "/admin/enquiries",
  },
];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Your portfolio at a glance</p>
      </div>

      {/* Stat Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {statCards(analytics.overview).map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.label} href={card.href}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
                  <p className="text-gray-400 text-sm font-medium">{card.label}</p>
                  <p className="text-gray-600 text-xs mt-1">{card.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Recent Enquiries
            </h2>
            <Link href="/admin/enquiries" className="text-xs text-purple-400 hover:text-purple-300">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {analytics?.recentEnquiries.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-6">No enquiries yet</p>
            )}
            {analytics?.recentEnquiries.map((e) => (
              <div
                key={e._id}
                className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {e.name[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium">{e.name}</p>
                    {e.status === "unread" && (
                      <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-400 text-xs truncate">{e.message}</p>
                  <p className="text-gray-600 text-xs mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Traffic */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h2 className="text-white font-semibold">Top Traffic</h2>
          </div>
          <div className="space-y-2">
            {analytics?.topProjects.map((p, i) => (
              <div
                key={p._id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <span className="text-gray-600 text-xs w-5 text-right">{i + 1}</span>
                <FolderKanban className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm flex-1 truncate">{p.title}</span>
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {p.views}
                </span>
              </div>
            ))}
            {analytics?.topBlogs.map((b, i) => (
              <div
                key={b._id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <span className="text-gray-600 text-xs w-5 text-right">
                  {(analytics.topProjects.length || 0) + i + 1}
                </span>
                <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm flex-1 truncate">{b.title}</span>
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {b.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
