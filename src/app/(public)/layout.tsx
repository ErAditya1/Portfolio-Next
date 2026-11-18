import { Header } from "@/components/Header";
import { Footer } from "@/components/public/Footer";
import { FloatingFeatures } from "@/components/public/FloatingFeatures";
import { JsonLd } from "@/components/public/JsonLd";
import { AgentProvider } from "@/components/public/agent/AgentProvider";
import { getSiteProfile } from "@/lib/seo/site";
import { siteGraph } from "@/lib/seo/schema";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const { settings, experiences } = await getSiteProfile();

    return (
        <>
            {/* Single entity graph (WebSite + Person) for every public page; pages reference it by @id. */}
            <JsonLd data={siteGraph(settings, experiences)} />
            <AgentProvider>
                <Header />
                {children}
                <FloatingFeatures />
                <Footer settings={settings} />
            </AgentProvider>
        </>
    );
}
