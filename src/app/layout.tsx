import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/public/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://eraditya.dev";
  
  // Default values
  let title = "Aditya Kumar | Full-Stack Web Developer & System Engineer";
  let description = "Official portfolio of Aditya Kumar. Expertise in Next.js, MERN stack, and building scalable, high-performance web systems.";
  
  try {
    const res = await fetch(`${baseUrl}/api/settings`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const settings = await res.json();
      title = `${settings.siteTitle} | Full-Stack Developer` || title;
      description = settings.siteDescription || description;
    }
  } catch (e) {
    console.error("Failed to fetch settings for metadata", e);
  }

  return {
    title: {
      default: title,
      template: `%s | Aditya Kumar`,
    },
    description: description,
    keywords: [
      "Aditya Kumar",
      "Full Stack Developer India",
      "System Engineer",
      "Next.js Portfolio",
      "MERN Stack Architect",
      "Backend Engineer",
      "Scalable Architecture",
      "Software Engineering",
      "Freelance Web Developer",
      "React Specialist",
    ],
    authors: [{ name: "Aditya Kumar" }],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: title,
      description: description,
      url: baseUrl,
      siteName: "Aditya Kumar Portfolio",
      images: [
        {
          url: "/images/aditya_profile.png",
          width: 1200,
          height: 630,
          alt: "Aditya Kumar - Full-Stack Web Developer",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/images/aditya_profile.png"],
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
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://eraditya.dev";
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aditya Kumar",
    "url": baseUrl,
    "image": `${baseUrl}/images/aditya_profile.png`,
    "jobTitle": "Full-Stack Web Developer & System Engineer",
    "sameAs": [
      "https://github.com/ErAditya1",
      "https://linkedin.com/in/eraditya1",
      "https://twitter.com/eraditya1"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aditya Kumar Portfolio",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/projects?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
        <Providers>
          <div className="antialiased min-h-screen bg-[var(--bg-gradient)] text-foreground transition-colors duration-300">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
