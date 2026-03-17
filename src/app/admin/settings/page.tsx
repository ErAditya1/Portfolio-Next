"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Skill {
  _id?: string;
  name: string;
  level: number;
  category: string;
}

interface Settings {
  ownerName: string;
  ownerTitle: string;
  ownerBio: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerLocation: string;
  avatarUrl: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  siteTitle: string;
  siteDescription: string;
  skills: Skill[];
  currentlyLearning: string[];
  recentlyLearned: string[];
  emergingExpertise: string[];
}

const defaultSettings: Settings = {
  ownerName: "",
  ownerTitle: "",
  ownerBio: "",
  ownerEmail: "",
  ownerPhone: "",
  ownerLocation: "",
  avatarUrl: "",
  resumeUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  siteTitle: "",
  siteDescription: "",
  skills: [],
  currentlyLearning: [],
  recentlyLearned: [],
  emergingExpertise: [],
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Skill Input State
  const [newSkill, setNewSkill] = useState<Skill>({ name: "", level: 80, category: "Backend" });
  
  // Array Input States
  const [learningInp, setLearningInp] = useState("");
  const [recentlyInp, setRecentlyInp] = useState("");
  const [emergingInp, setEmergingInp] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings({ ...defaultSettings, ...d }))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) toast.success("Settings saved!");
    else toast.error("Failed to save settings");
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setSettings((s) => ({ ...s, skills: [...s.skills, { ...newSkill, name: newSkill.name.trim() }] }));
      setNewSkill({ name: "", level: 80, category: "Backend" });
    }
  };

  const removeSkill = (index: number) => {
    setSettings((s) => ({ ...s, skills: s.skills.filter((_, i) => i !== index) }));
  };

  const addArrayItem = (key: keyof Settings, val: string, setInp: (v: string) => void) => {
    const trimmed = val.trim();
    if (trimmed) {
      setSettings((s) => ({ ...s, [key]: [...(s[key] as string[]), trimmed] }));
      setInp("");
    }
  };

  const removeArrayItem = (key: keyof Settings, val: string) => {
    setSettings((s) => ({ ...s, [key]: (s[key] as string[]).filter(v => v !== val) }));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <p className="text-gray-400 mt-1">Manage your portfolio profile and settings</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Profile</h2>
          {[
            { label: "Full Name", key: "ownerName", placeholder: "Aditya Kumar" },
            { label: "Title / Role", key: "ownerTitle", placeholder: "Full Stack Developer" },
            { label: "Email", key: "ownerEmail", placeholder: "you@example.com" },
            { label: "Phone", key: "ownerPhone", placeholder: "+91 98765 43210" },
            { label: "Location", key: "ownerLocation", placeholder: "India" },
            { label: "Avatar URL", key: "avatarUrl", placeholder: "https://..." },
            { label: "Resume URL", key: "resumeUrl", placeholder: "https://..." },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="text-sm text-gray-400 mb-1.5 block">{label}</label>
              <input
                type="text"
                value={settings[key as keyof Settings] as string}
                onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Bio</label>
            <textarea
              value={settings.ownerBio}
              onChange={(e) => setSettings((s) => ({ ...s, ownerBio: e.target.value }))}
              rows={4}
              placeholder="Short description about yourself..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm resize-none"
            />
          </div>
        </div>

        {/* Site & Social */}
        <div className="space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Site SEO</h2>
            {[
              { label: "Site Title", key: "siteTitle", placeholder: "My Portfolio" },
              { label: "Site Description", key: "siteDescription", placeholder: "Showcasing my work..." },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-sm text-gray-400 mb-1.5 block">{label}</label>
                <input
                  type="text"
                  value={settings[key as keyof Settings] as string}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Social Links</h2>
            {[
              { label: "GitHub", key: "githubUrl" },
              { label: "LinkedIn", key: "linkedinUrl" },
              { label: "Twitter / X", key: "twitterUrl" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-sm text-gray-400 mb-1.5 block">{label}</label>
                <input
                  type="url"
                  value={settings[key as keyof Settings] as string}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Skills Matrix</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Skill Name (e.g. NestJS)"
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
              />
              <select 
                value={newSkill.category}
                onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Tools">Tools</option>
              </select>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Level: {newSkill.level}%</span>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={newSkill.level}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                  className="flex-1 accent-purple-500"
                />
              </div>
              <button type="button" onClick={addSkill} className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold py-2">
                Add Skill
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {settings.skills.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-bold">{s.name}</span>
                    <span className="text-[10px] text-gray-500 uppercase">{s.category} • {s.level}%</span>
                  </div>
                  <button type="button" onClick={() => removeSkill(idx)} className="text-gray-500 hover:text-red-400">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Learning Sections */}
          {[
            { label: "Currently Working On", key: "currentlyLearning", val: learningInp, set: setLearningInp },
            { label: "Recently Learned", key: "recentlyLearned", val: recentlyInp, set: setRecentlyInp },
            { label: "Emerging Expertise", key: "emergingExpertise", val: emergingInp, set: setEmergingInp },
          ].map(({ label, key, val, set }) => (
            <div key={key} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
              <h2 className="text-white font-semibold text-sm">{label}</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem(key as keyof Settings, val, set))}
                  placeholder={`Add to ${label.toLowerCase()}...`}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                />
                <button type="button" onClick={() => addArrayItem(key as keyof Settings, val, set)} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(settings[key as keyof Settings] as string[]).map((item) => (
                  <span key={item} onClick={() => removeArrayItem(key as keyof Settings, item)} className="cursor-pointer text-[10px] px-2 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20 transition-colors">
                    {item} ×
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-8 py-2.5 rounded-lg transition-all disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
