"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Mail, MailOpen, Clock, Phone, MessageSquare } from "lucide-react";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

const statusColors: Record<string, string> = {
  unread: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  read: "bg-gray-800 text-gray-400 border-gray-700",
  replied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const q = filter !== "all" ? `?status=${filter}` : "";
    fetch(`/api/enquiries${q}&limit=100`)
      .then((r) => r.json())
      .then((d) => setEnquiries(d.enquiries || []))
      .finally(() => setLoading(false));
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: status as Enquiry["status"] } : e))
      );
      toast.success("Status updated");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
      toast.success("Enquiry deleted");
    }
  };

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Enquiries</h1>
          <p className="text-gray-400 mt-1">{enquiries.filter(e => e.status === "unread").length} unread messages</p>
        </div>
        {/* Filter */}
        <div className="flex gap-2">
          {["all", "unread", "read", "replied"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-colors ${filter === s ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-gray-900 text-gray-400 border-gray-800 hover:text-gray-300"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
              <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No enquiries found</p>
            </div>
          )}
          {filtered.map((e) => (
            <div
              key={e._id}
              className={`bg-gray-900 border rounded-xl transition-all ${e.status === "unread" ? "border-emerald-500/30" : "border-gray-800"}`}
            >
              <div
                className="flex items-start gap-4 p-5 cursor-pointer"
                onClick={() => {
                  setExpanded(expanded === e._id ? null : e._id);
                  if (e.status === "unread") updateStatus(e._id, "read");
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {e.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-medium flex items-center gap-2">
                        {e.name}
                        {e.status === "unread" && <span className="w-2 h-2 bg-emerald-400 rounded-full" />}
                      </p>
                      <p className="text-gray-400 text-sm">{e.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize flex-shrink-0 ${statusColors[e.status]}`}>
                      {e.status}
                    </span>
                  </div>
                  {e.subject && <p className="text-gray-300 text-sm mt-1 font-medium">{e.subject}</p>}
                  <p className="text-gray-500 text-sm mt-1 truncate">{e.message}</p>
                  <p className="text-gray-600 text-xs mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{new Date(e.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Expanded */}
              {expanded === e._id && (
                <div className="border-t border-gray-800 px-5 py-4 space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{e.message}</p>
                  {e.phone && (
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4" />{e.phone}
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`mailto:${e.email}?subject=Re: ${e.subject || "Your enquiry"}`}
                      className="flex items-center gap-2 text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> Reply via Email
                    </a>
                    {e.status !== "replied" && (
                      <button onClick={() => updateStatus(e._id, "replied")} className="flex items-center gap-2 text-xs px-3 py-1.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:text-gray-300 transition-colors">
                        <MailOpen className="w-3.5 h-3.5" /> Mark Replied
                      </button>
                    )}
                    <button onClick={() => handleDelete(e._id)} className="flex items-center gap-2 text-xs px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors ml-auto">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
