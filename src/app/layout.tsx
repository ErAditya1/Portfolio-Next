import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SITE_URL, OWNER_NAME, getSiteProfile, twitterHandle } from "@/lib/seo/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const DEFAULT_TITLE = "Aditya Kumar — Next.js & MERN Full Stack Developer, Lucknow";
const DEFAULT_DESCRIPTION =
  "Aditya Kumar is a Full Stack Developer in Lucknow, India, building Next.js, React, Node.js and NestJS apps, AI voice calling and WhatsApp automation.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteProfile();
  const creator = twitterHandle(settings?.twitterUrl);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: DEFAULT_TITLE,
      template: `%s · ${OWNER_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: `${OWNER_NAME} Portfolio`,
    authors: [{ name: OWNER_NAME, url: SITE_URL }],
    creator: OWNER_NAME,
    publisher: OWNER_NAME,
    category: "technology",
    openGraph: {
      siteName: OWNER_NAME,
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      ...(creator && { creator, site: creator }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "QZGHW3TKf81ROqgPri-jbIyHS7Ib79bAgcFPOOQiJfs",
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/favicon.ico",
      apple: "/images/aditya_profile.png",
    },
    alternates: {
      types: { "text/plain": [{ url: "/llms.txt", title: "LLM-readable profile" }] },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <div className="antialiased min-h-screen bg-[var(--bg-gradient)] text-foreground transition-colors duration-300">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
