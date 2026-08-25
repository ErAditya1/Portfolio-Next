import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { ISiteSettings } from "@/types";
import { Metadata } from "next";
import { AboutPageClient } from "@/components/public/AboutPageClient";

export const revalidate = 60; // 60s dynamic revalidation

export const metadata: Metadata = {
  title: "About | Aditya Kumar — Full Stack & Real-Time System Engineer",
  description:
    "Learn about Aditya Kumar — Full Stack Developer & AI Engineer specializing in scalable web systems, low-latency audio telephony, and distributed microservices architectures.",
};

export default async function AboutPage() {
  let settings: ISiteSettings = {} as ISiteSettings;
  try {
    await connectDB();
    const settingsRaw = await SiteSettings.findOne().lean();
    settings = settingsRaw ? JSON.parse(JSON.stringify(settingsRaw)) : ({} as ISiteSettings);
  } catch (e) {
    console.error("DB connection error on About page:", e);
  }

  return <AboutPageClient settings={settings} />;
}
