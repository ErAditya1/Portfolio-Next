import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { Container } from "@/components/Container";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import Image from "next/image";
import { ISiteSettings } from "@/types";

export const revalidate = 3600;

export default async function AboutPage() {
  await connectDB();
  const settingsRaw = await SiteSettings.findOne().lean();
  const settings = JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings;

  const name = settings?.ownerName || "Aditya Kumar";
  const avatar = settings?.avatarUrl || "/images/aditya_profile.png";

  return (
    <main className="pt-24 pb-16">
      <Container>
        <div className="grid md:grid-cols-12 gap-12 items-center mb-20">
          <div className="md:col-span-5 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              {avatar && (
                <Image src={avatar} alt={name} fill className="object-cover" />
              )}
            </div>
          </div>
          <div className="md:col-span-7 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              The Mind Behind the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Code</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed font-light">
              {settings?.ownerBio || "I am a dedicated developer focused on building professional grade digital solutions."}
            </p>
            <div className="pt-4 space-y-4">
              <p className="text-gray-300">
                Driven by curiosity and a passion for engineering excellence, I specialize in architecting systems that are not just functional, but also scalable and secure. My journey in technology is defined by constant learning and a commitment to creating value through code.
              </p>
            </div>
          </div>
        </div>

        <AboutSection settings={settings} />
        <SkillsSection settings={settings} />

        {/* Vision / Call to action */}
        <section className="mt-20 py-20 bg-gray-900/40 border border-gray-800 rounded-[3rem] text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-6">Want to collaborate?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-10">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>
          <a href="/contact" className="px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all">
            Let&apos;s Talk
          </a>
        </section>
      </Container>
    </main>
  );
}
