import { Header } from "@/components/Header";
import { Footer } from "@/components/public/Footer";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { ISiteSettings } from "@/types";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    await connectDB();
    const settingsRaw = await SiteSettings.findOne().lean();
    const settings = settingsRaw ? JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings : undefined;

    return (
        <>
            <Header />
            {children}
            <Footer settings={settings} />
        </>
    );
}