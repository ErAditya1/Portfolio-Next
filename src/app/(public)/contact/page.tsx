import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { ContactForm } from "@/components/public/ContactForm";
import { ContactInfo } from "@/components/public/ContactInfo";
import { Metadata } from "next";
import { ISiteSettings } from "@/types";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const settings = await SiteSettings.findOne().lean();
  return {
    title: "Connect | Aditya Kumar",
    description: settings?.siteDescription || "Get in touch with Aditya Kumar for projects, collaborations, or system design inquiries.",
    keywords: ["Contact", "Hire Developer", "System Architect", "Aditya Kumar", "Freelance Developer"],
  };
}

export default async function ContactPage() {
  await connectDB();
  const settingsRaw = await SiteSettings.findOne().lean();
  const settings = settingsRaw ? JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings : undefined;

  return (
    <main className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 space-y-4">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.4em]">
              Get in Touch
            </span>
            <NeonHeading>Let&apos;s Build Something <span className="text-gradient">Legendary</span></NeonHeading>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Whether you have a specific project in mind or just want to explore possibilities, my inbox is always open.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <ContactInfo settings={settings} />
            <ContactForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
