"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  skills: string[];
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
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");

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
    const trimmed = skillInput.trim();
    if (trimmed && !settings.skills.includes(trimmed)) {
      setSettings((s) => ({ ...s, skills: [...s.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSettings((s) => ({ ...s, skills: s.skills.filter((sk) => sk !== skill) }));
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

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-white font-semibold">Skills</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="e.g. TypeScript"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button type="button" onClick={addSkill} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.skills.map((s) => (
                <span key={s} onClick={() => removeSkill(s)} className="cursor-pointer text-xs px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20 transition-colors">
                  {s} ×
                </span>
              ))}
            </div>
          </div>
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
