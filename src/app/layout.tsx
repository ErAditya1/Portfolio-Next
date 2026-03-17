import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  // Default values
  let title = "Aditya Kumar | Full-Stack Web Developer";
  let description = "Portfolio of Aditya Kumar — specializing in MERN stack, Next.js, and scalable backend architecture.";
  
  try {
    const res = await fetch(`${baseUrl}/api/settings`, { cache: 'no-store' });
    if (res.ok) {
      const settings = await res.json();
      title = settings.siteTitle || title;
      description = settings.siteDescription || description;
    }
  } catch (e) {
    console.error("Failed to fetch settings for metadata", e);
  }

  return {
    title: {
      default: title,
      template: `%s | ${title.split('|')[0].trim()}`,
    },
    description: description,
    keywords: [
      "Aditya Kumar",
      "Web Developer",
      "Full Stack Developer",
      "Backend Engineer",
      "Next.js Portfolio",
      "MERN Stack",
    ],
    authors: [{ name: "Aditya Kumar" }],
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: title,
      description: description,
      url: baseUrl,
      siteName: title,
      images: [
        {
          url: "/images/aditya_profile.png",
          width: 1200,
          height: 630,
          alt: "Aditya Kumar Portfolio",
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
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="QZGHW3TKf81ROqgPri-jbIyHS7Ib79bAgcFPOOQiJfs" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="antialiased text-white min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#12020A] via-[#250821] to-[#0b0710]">
          
            {children}
            
          </div>
        </Providers>
      </body>
    </html>
  );
}
