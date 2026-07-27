"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Check, X, Briefcase, MapPin, Calendar, Sparkles } from "lucide-react";

interface IExpItem {
  _id?: string;
  role: string;
  company: string;
  companyLogo?: string;
  period: string;
  location?: string;
  description: string;
  points?: string[];
  skills?: string[];
  order?: number;
  featured?: boolean;
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<IExpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<IExpItem>({
    role: "",
    company: "",
    companyLogo: "",
    period: "",
    location: "Lucknow — India",
    description: "",
    points: [""],
    skills: ["React", "Node.js"],
    order: 1,
    featured: true,
  });

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experiences");
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (e) {
      console.error("Failed to fetch experiences:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleEdit = (exp: IExpItem) => {
    setEditingId(exp._id || null);
    setIsCreating(false);
    setFormData({
      role: exp.role || "",
      company: exp.company || "",
      companyLogo: exp.companyLogo || "",
      period: exp.period || "",
      location: exp.location || "",
      description: exp.description || "",
      points: exp.points && exp.points.length > 0 ? exp.points : [exp.description || ""],
      skills: exp.skills || [],
      order: exp.order || 1,
      featured: exp.featured ?? true,
    });
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setIsCreating(true);
    setFormData({
      role: "",
      company: "",
      companyLogo: "",
      period: "Feb 2026 – Present",
      location: "Lucknow — India",
      description: "",
      points: ["Developed full stack web applications."],
      skills: ["Next.js", "MERN Stack"],
      order: experiences.length + 1,
      featured: true,
    });
  };

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/experiences/${editingId}` : "/api/experiences";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEditingId(null);
        setIsCreating(false);
        fetchExperiences();
      } else {
        alert("Failed to save experience entry");
      }
    } catch (e) {
      console.error("Error saving experience:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchExperiences();
      }
    } catch (e) {
      console.error("Error deleting experience:", e);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Experience Timeline Manager</h1>
          <p className="text-muted-foreground text-xs">
            Add, edit, reorder, or update company logos for career timeline entries.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Experience Entry
        </button>
      </div>

      {/* Editor Modal / Panel */}
      {(isCreating || editingId) && (
        <div className="p-6 rounded-3xl bg-card border border-indigo-500/40 space-y-6 shadow-lg">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-bold text-lg text-foreground">
              {editingId ? "Edit Experience Entry" : "Create New Experience Entry"}
            </h2>
            <button
              onClick={() => {
                setEditingId(null);
                setIsCreating(false);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-foreground block mb-1">Job Role Title</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. MERN Stack Developer (Internship)"
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Company Name</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Softpro India"
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Company Logo Path / URL</label>
              <input
                type="text"
                value={formData.companyLogo || ""}
                onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                placeholder="e.g. /images/companies/softpro_india.svg"
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Time Period</label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. Jul 2025 – Feb 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Lucknow — India"
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Display Order (1 = Top)</label>
              <input
                type="number"
                value={formData.order || 1}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-foreground block mb-1">Short Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Overview of duties and responsibilities..."
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={() => {
                setEditingId(null);
                setIsCreating(false);
              }}
              className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Experience
            </button>
          </div>
        </div>
      )}

      {/* List of Experiences */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs">Loading experience entries...</div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-3xl text-muted-foreground text-xs">
            No experiences found in MongoDB. Click "Add Experience Entry" or run `/api/setup/seed`!
          </div>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp._id}
              className="p-6 rounded-3xl bg-card border border-border hover:border-indigo-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                  {exp.companyLogo ? (
                    <img src={exp.companyLogo} alt={exp.company} className="w-7 h-7 object-contain" />
                  ) : (
                    <Briefcase className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{exp.role}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {exp.company} — {exp.location}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {exp.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => handleEdit(exp)}
                  className="px-3.5 py-2 rounded-xl bg-accent border border-border text-foreground hover:bg-indigo-500/10 hover:text-indigo-500 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => exp._id && handleDelete(exp._id)}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
