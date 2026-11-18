import { cache } from "react";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Experience from "@/models/Experience";
import type { ISiteSettings } from "@/types";

/** Canonical production origin. Never falls back to localhost so schema/OG URLs stay valid. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXTAUTH_URL && !/localhost|127\.0\.0\.1/.test(process.env.NEXTAUTH_URL) ? process.env.NEXTAUTH_URL : "") ||
  "https://eraditya.vercel.app"
).replace(/\/$/, "");

export const OWNER_NAME = "Aditya Kumar";
export const OWNER_HANDLE = "ErAditya1";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const absUrl = (path = "/") => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

export type ProfileExperience = {
  company: string;
  role: string;
  period: string;
  location?: string;
  type?: string;
  isCurrent?: boolean;
  skills?: string[];
};

export type SiteProfile = {
  settings?: ISiteSettings;
  experiences: ProfileExperience[];
};

/** One DB read per request, shared by metadata, JSON-LD and page components. */
export const getSiteProfile = cache(async (): Promise<SiteProfile> => {
  try {
    await connectDB();
    const [settingsRaw, exps] = await Promise.all([
      SiteSettings.findOne().lean(),
      Experience.find({}).sort({ order: 1, createdAt: -1 }).lean(),
    ]);
    return {
      settings: settingsRaw ? (JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings) : undefined,
      experiences: JSON.parse(JSON.stringify(exps)) as ProfileExperience[],
    };
  } catch (error) {
    console.error("getSiteProfile failed:", error);
    return { experiences: [] };
  }
});

/** "https://x.com/excited_adi" → "@excited_adi" */
export function twitterHandle(url?: string) {
  const m = url?.match(/(?:twitter|x)\.com\/(?:#!\/)?@?([A-Za-z0-9_]{1,15})/i);
  return m ? `@${m[1]}` : undefined;
}

/** All public profile URLs for this person, de-duplicated (used for sameAs and rel="me"). */
export function profileUrls(s?: ISiteSettings) {
  const urls = [
    s?.githubUrl,
    s?.linkedinUrl,
    s?.twitterUrl,
    ...(s?.socialLinks || []).map((l) => l.url),
    "https://www.npmjs.com/package/aditya-kumar",
  ].filter((u): u is string => !!u && /^https?:\/\//.test(u));
  const seen = new Set<string>();
  return urls.filter((u) => {
    const key = u.toLowerCase().replace(/\/$/, "").replace("://www.", "://");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Short role line used in titles: drops seniority qualifiers in parentheses and extra spaces. */
export function headlineRole(s?: ISiteSettings) {
  return (s?.ownerTitle || "Full Stack Developer").replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
}

export function currentRole(exps: ProfileExperience[]) {
  return exps.find((e) => e.isCurrent && e.type !== "education");
}
