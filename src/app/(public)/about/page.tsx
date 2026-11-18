import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { ISiteSettings } from "@/types";
import { Metadata } from "next";
import { pageMeta } from "@/lib/seo/meta";
import { JsonLd } from "@/components/public/JsonLd";
import { graph, webPageNode } from "@/lib/seo/schema";
import { PERSON_ID } from "@/lib/seo/site";
import { AboutPageClient } from "@/components/public/AboutPageClient";

export const revalidate = 60; // 60s dynamic revalidation

export const metadata: Metadata = pageMeta({
  title: "About Aditya Kumar — Full Stack Developer, Lucknow",
  absolute: true,
  description:
    "Who Aditya Kumar is: a Full Stack Developer from Barabanki working in Lucknow, his background, the stack he uses and the products he has built.",
  path: "/about",
  type: "profile",
});

export default async function AboutPage() {
  let settings: ISiteSettings = {} as ISiteSettings;
  try {
    await connectDB();
    const settingsRaw = await SiteSettings.findOne().lean();
    settings = settingsRaw ? JSON.parse(JSON.stringify(settingsRaw)) : ({} as ISiteSettings);
  } catch (e) {
    console.error("DB connection error on About page:", e);
  }

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            type: "ProfilePage",
            path: "/about",
            name: "About Aditya Kumar",
            mainEntity: { "@id": PERSON_ID },
            dateModified: settings?.updatedAt,
            extra: { dateCreated: "2026-03-17T18:42:59.518Z" },
          })
        )}
      />
      <AboutPageClient settings={settings} />
    </>
  );
}
