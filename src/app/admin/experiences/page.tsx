"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  GraduationCap,
  Code2,
  Layers,
  Building2,
  RefreshCw,
} from "lucide-react";

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
  type?: "job" | "trainee" | "freelance" | "education";
  order?: number;
  featured?: boolean;
  isCurrent?: boolean;
}

const DEFAULT_SEED_ITEMS: Omit<IExpItem, "_id">[] = [
  {
    role: "Full Stack Developer",
    company: "Feeding Trends",
    companyLogo: "https://images.yourstory.com/cs/images/companies/1673542379000-1680580688969.jpg",
    period: "Feb 2026 – Present",
    location: "Lucknow, Uttar Pradesh — India",
    description: "Engineering scalable web applications, real-time AI voice calling solutions, and robust SaaS products with Next.js, Node.js, and Django.",
    points: [
      "Architecting AI-powered voice calling agents using ElevenLabs, Deepgram STT, and WebSockets.",
      "Developing high-throughput REST APIs and scalable full-stack applications with MERN / Next.js.",
      "Integrated third-party payment gateways, media streaming CDNs, and automated notification systems.",
    ],
    skills: ["Next.js", "Node.js", "AI Agents", "WebSockets", "MongoDB", "Docker"],
    type: "job",
    isCurrent: true,
    order: 1,
    featured: true,
  },
  {
    role: "MERN Stack Developer (Internship)",
    company: "Softpro India",
    companyLogo: "/images/companies/softpro_india.svg",
    period: "Jul 2025 – Feb 2026",
    location: "Lucknow — India",
    description: "Developed responsive web applications, REST APIs, and database models using the MERN stack with modern UI practices.",
    points: [
      "Built full-stack web applications with React.js, Express.js, Node.js, and MongoDB Atlas.",
      "Implemented responsive user interfaces with Tailwind CSS and state management using Redux Toolkit.",
      "Designed secure JWT authentication flows and optimized database queries.",
    ],
    skills: ["React.js", "Express.js", "Node.js", "MongoDB", "Redux", "Tailwind CSS"],
    type: "trainee",
    isCurrent: false,
    order: 2,
    featured: true,
  },
  {
    role: "Python / Django Trainee",
    company: "Softpro India",
    companyLogo: "/images/companies/softpro_india.svg",
    period: "May 2024 – Jul 2024",
    location: "Lucknow — India",
    description: "Completed intensive hands-on training in Python, Django REST Framework, relational databases, and MVC web architecture.",
    points: [
      "Built dynamic web applications with Django and PostgreSQL database integration.",
      "Implemented user authorization, secure forms, and template rendering pipelines.",
    ],
    skills: ["Python", "Django", "PostgreSQL", "REST APIs", "Bootstrap"],
    type: "trainee",
    isCurrent: false,
    order: 3,
    featured: true,
  },
  {
    role: "Freelance Full-Stack Developer",
    company: "Multiple Global Clients",
    companyLogo: "/images/companies/global_clients.svg",
    period: "2023 – 2024",
    location: "Remote",
    description: "Engineered custom websites, landing portals, and full-stack solutions for businesses and independent creators.",
    points: [
      "Delivered production-ready web apps with React.js, Next.js, and Firebase.",
      "Optimized Core Web Vitals, SEO performance, and responsive mobile layouts.",
    ],
    skills: ["Next.js", "React", "Firebase", "Tailwind CSS", "SEO"],
    type: "freelance",
    isCurrent: false,
    order: 4,
    featured: true,
  },
];

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<IExpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "job" | "education">("all");
  const [skillsInput, setSkillsInput] = useState("");
  const [seeding, setSeeding] = useState(false);

  // Form State
  const [formData, setFormData] = useState<IExpItem>({
    role: "",
    company: "",
    companyLogo: "",
    period: "Feb 2026 – Present",
    location: "Lucknow — India",
    description: "",
    points: [""],
    skills: ["Next.js", "React"],
    type: "job",
    isCurrent: false,
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

  // Upload a company logo to Cloudinary
  const [logoUploading, setLogoUploading] = useState(false);
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return alert("Logo must be under 5 MB.");
    setLogoUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(r.error);
        r.readAsDataURL(file);
      });
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: dataUrl,
          folder: "portfolio/companies",
          title: `${formData.company || "company"} logo`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
      setFormData((f) => ({ ...f, companyLogo: data.url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLogoUploading(false);
    }
  };

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
      type: exp.type || "job",
      isCurrent: Boolean(exp.isCurrent),
      order: exp.order || 1,
      featured: exp.featured ?? true,
    });
    setSkillsInput((exp.skills || []).join(", "));
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
      points: ["Developed full stack web applications and scalable APIs."],
      skills: ["Next.js", "React", "Node.js"],
      type: "job",
      isCurrent: true,
      order: experiences.length + 1,
      featured: true,
    });
    setSkillsInput("Next.js, React, Node.js");
  };

  // Add / remove bullet points
  const handleAddPoint = () => {
    setFormData((f) => ({ ...f, points: [...(f.points || []), ""] }));
  };

  const handlePointChange = (idx: number, val: string) => {
    setFormData((f) => {
      const updated = [...(f.points || [])];
      updated[idx] = val;
      return { ...f, points: updated };
    });
  };

  const handleRemovePoint = (idx: number) => {
    setFormData((f) => ({
      ...f,
      points: (f.points || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    if (!formData.company.trim() || !formData.role.trim()) {
      return alert("Company/Institution name and Role/Degree title are required.");
    }

    try {
      const url = editingId ? `/api/experiences/${editingId}` : "/api/experiences";
      const method = editingId ? "PUT" : "POST";

      const cleanedSkills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const cleanedPoints = (formData.points || []).map((p) => p.trim()).filter(Boolean);

      const payload = {
        ...formData,
        skills: cleanedSkills,
        points: cleanedPoints.length > 0 ? cleanedPoints : [formData.description],
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const handleSeedDefaults = async () => {
    if (!confirm("Load verified career entries into MongoDB? This ensures all entries are editable.")) return;
    setSeeding(true);
    try {
      for (const item of DEFAULT_SEED_ITEMS) {
        await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
      fetchExperiences();
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setSeeding(false);
    }
  };

  const filteredExperiences = experiences.filter((exp) => {
    if (activeTab === "all") return true;
    if (activeTab === "education") return exp.type === "education";
    return exp.type !== "education";
  });

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Experience & Career Manager</h1>
          <p className="text-muted-foreground text-xs">
            Manage company logos, roles, time periods, highlights, and organizations shown on your public portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {experiences.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="px-4 py-2.5 rounded-2xl border border-border bg-card text-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-accent transition-all shadow-sm"
              title="Populate authentic default experiences"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
              {seeding ? "Loading..." : "Load Default Entries"}
            </button>
          )}
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Experience Entry
          </button>
        </div>
      </div>

      {/* Editor Modal / Panel */}
      {(isCreating || editingId) && (
        <div className="p-6 rounded-3xl bg-card border border-indigo-500/40 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-bold text-lg text-foreground">
                {editingId ? "Edit Experience Entry" : "Create New Experience Entry"}
              </h2>
              <p className="text-xs text-muted-foreground">
                All details and logos updated here appear live in the career timeline and Companies & Collaborations carousel.
              </p>
            </div>
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
              <label className="font-bold text-foreground block mb-1">Role Title / Degree</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Company / Institution Name</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Feeding Trends or Softpro India"
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            {/* Logo field with full tile fill preview */}
            <div className="md:col-span-2">
              <label className="font-bold text-foreground block mb-1">Company / Institution Logo</label>
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white dark:bg-zinc-900 shadow-sm">
                  {formData.companyLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.companyLogo} alt="Logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-muted-foreground">
                      {(formData.company || "?").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </span>
                <input
                  type="text"
                  value={formData.companyLogo || ""}
                  onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                  placeholder="Paste a logo image URL, or upload from device →"
                  className="min-w-0 flex-1 px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
                />
                <label
                  className={`shrink-0 cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 ${
                    logoUploading ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  {logoUploading ? "Uploading…" : "Upload Logo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={logoUploading} />
                </label>
                {formData.companyLogo && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, companyLogo: "" })}
                    className="shrink-0 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    title="Remove logo"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Logo will automatically fill the full space in the Companies & Collaborations card.
              </p>
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Entry Category / Type</label>
              <select
                value={formData.type || "job"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "job" | "trainee" | "freelance" | "education",
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              >
                <option value="job">💼 Full-Time Role / Job</option>
                <option value="trainee">🎓 Internship / Technical Training</option>
                <option value="freelance">🌐 Freelance / Contract Builds</option>
                <option value="education">🏛️ Academic Education / Degree</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Time Period</label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. Feb 2026 – Present or 2024 – 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Lucknow, Uttar Pradesh — India"
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

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isCurrentCheck"
                checked={Boolean(formData.isCurrent)}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isCurrentCheck" className="font-bold text-foreground cursor-pointer select-none">
                Currently Active / Ongoing (Present)
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-foreground block mb-1">Key Skills & Tech Stack (comma-separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Next.js, Node.js, AI Voice, WebSockets, MongoDB"
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-foreground block mb-1">Short Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summary of responsibilities and technical engineering contributions..."
                className="w-full px-4 py-2.5 rounded-xl bg-accent border border-border text-foreground font-medium"
              />
            </div>

            {/* Bullet Points / Highlights List */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-foreground">Detailed Achievement Highlights</label>
                <button
                  type="button"
                  onClick={handleAddPoint}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Point
                </button>
              </div>
              {(formData.points || []).map((point, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-bold">#{pIdx + 1}</span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handlePointChange(pIdx, e.target.value)}
                    placeholder="e.g. Architected low-latency AI voice calling agents..."
                    className="flex-1 px-4 py-2 rounded-xl bg-accent border border-border text-foreground text-xs font-medium"
                  />
                  {(formData.points || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(pIdx)}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                      title="Remove highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
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
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Check className="w-4 h-4" /> Save Experience Entry
            </button>
          </div>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-accent text-muted-foreground hover:text-foreground"
          }`}
        >
          All Entries ({experiences.length})
        </button>
        <button
          onClick={() => setActiveTab("job")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "job"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-accent text-muted-foreground hover:text-foreground"
          }`}
        >
          💼 Jobs & Work ({experiences.filter((e) => e.type !== "education").length})
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "education"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-accent text-muted-foreground hover:text-foreground"
          }`}
        >
          🏛️ Education & Degrees ({experiences.filter((e) => e.type === "education").length})
        </button>
      </div>

      {/* List of Experiences */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs">Loading experience entries...</div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-3xl text-muted-foreground text-xs space-y-3">
            <p>No experiences found matching this filter.</p>
            {experiences.length === 0 && (
              <button
                onClick={handleSeedDefaults}
                disabled={seeding}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
                Load Verified Default Experiences
              </button>
            )}
          </div>
        ) : (
          filteredExperiences.map((exp) => (
            <div
              key={exp._id}
              className="p-6 rounded-3xl bg-card border border-border hover:border-indigo-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Logo Tile with full space fill */}
                <div className="relative w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-border/80 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {exp.companyLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={exp.companyLogo} alt={exp.company} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {(exp.company || "?").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{exp.role}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                      {exp.period}
                    </span>
                    {exp.isCurrent && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Current
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold">
                      {exp.type === "education"
                        ? "Education"
                        : exp.type === "trainee"
                        ? "Internship / Training"
                        : exp.type === "freelance"
                        ? "Freelance"
                        : "Job / Full-Time"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-medium">
                    {exp.company} {exp.location ? `— ${exp.location}` : ""}
                  </p>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {exp.description}
                  </p>

                  {/* Skills tags */}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-accent text-[10px] font-medium text-foreground/80"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
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
