import { Header } from "@/components/Header";
import { Footer } from "@/components/public/Footer";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { ISiteSettings } from "@/types";
import { JsonLd } from "@/components/public/JsonLd";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    await connectDB();
    const settingsRaw = await SiteSettings.findOne().lean();
    const settings = settingsRaw ? JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings : undefined;

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": settings?.ownerName || "Aditya Kumar",
        "jobTitle": settings?.ownerTitle || "Full-Stack Web Developer",
        "url": baseUrl,
        "image": settings?.avatarUrl ? `${baseUrl}${settings.avatarUrl}` : undefined,
        "sameAs": [
            settings?.githubUrl,
            settings?.linkedinUrl,
            settings?.twitterUrl,
            ...(settings?.socialLinks?.map(link => link.url) || [])
        ].filter(Boolean),
        "knowsAbout": settings?.skills?.map(s => s.name) || [
            "Full-Stack Web Development",
            "Next.js",
            "MERN Stack",
            "Backend Engineering"
        ],
        "description": settings?.ownerBio || settings?.siteDescription
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": settings?.siteTitle || "Aditya Kumar Portfolio",
        "url": baseUrl,
        "description": settings?.siteDescription
    };

    return (
        <>
            <JsonLd data={personSchema} />
            <JsonLd data={websiteSchema} />
            <Header />
            {children}
            <Footer settings={settings} />
        </>
    );
}