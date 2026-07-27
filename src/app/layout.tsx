import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/public/JsonLd";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://eraditya.dev";
  
  let title = "Aditya Kumar | Top MERN & Full Stack Developer in Barabanki & Lucknow";
  let description = "Official Portfolio of Aditya Kumar — Top Full Stack MERN Stack Developer & System Engineer in Barabanki / Lucknow, Uttar Pradesh. Specializing in Next.js, React, Node.js, Python Django, and Scalable Web Applications.";

  return {
    title: {
      default: title,
      template: `%s | Aditya Kumar - Full Stack Developer`,
    },
    description: description,
    keywords: [
      "Aditya Kumar",
      "Aditya Kumar Barabanki",
      "Aditya Kumar Lucknow",
      "Aditya Kumar Developer",
      "Aditya Kumar MERN Stack Developer",
      "Aditya Kumar Full Stack Developer",
      "Aditya Portfolio",
      "Aditya Barabanki Developer",
      "Top Developer in Barabanki",
      "Best Full Stack Developer in Barabanki",
      "Best MERN Stack Developer in Lucknow",
      "Aditya Kumar Next.js Developer",
      "Aditya Kumar Python Django Developer",
      "Er Aditya Kumar",
      "ErAditya1",
      "Aditya Kumar Web Architecture",
      "Aditya Kumar Software Engineer Barabanki",
      "Aditya Kumar Portfolio Website",
      "Aditya Barabanki Full Stack",
      "Top Web Developer Uttar Pradesh",
      "Full Stack Developer India",
      "MERN Stack Architect Barabanki",
      "Freelance Web Developer Lucknow",
    ],
    authors: [{ name: "Aditya Kumar", url: baseUrl }],
    creator: "Aditya Kumar",
    publisher: "Aditya Kumar",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "Aditya Kumar | Top Full Stack MERN Developer in Barabanki & Lucknow",
      description: "Explore Aditya Kumar's portfolio, featured MERN stack projects, LMS portals, open source repositories, and full stack web architecture.",
      url: baseUrl,
      siteName: "Aditya Kumar Portfolio",
      images: [
        {
          url: "/images/aditya_profile.png",
          width: 1200,
          height: 630,
          alt: "Aditya Kumar - Top Full Stack MERN Developer in Barabanki",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Aditya Kumar | Top Full Stack MERN Developer in Barabanki",
      description: "Official Portfolio of Aditya Kumar — MERN Stack Developer & System Engineer in Barabanki & Lucknow, Uttar Pradesh.",
      images: ["/images/aditya_profile.png"],
      creator: "@eraditya1",
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

  // Hyper-Targeted JSON-LD Schema for Google Search & Knowledge Graph
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aditya Kumar",
    "alternateName": ["Er Aditya Kumar", "ErAditya1", "Aditya Kumar Developer Barabanki"],
    "url": baseUrl,
    "image": `${baseUrl}/images/aditya_profile.png`,
    "jobTitle": "Full Stack MERN Developer & System Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Feeding Trends"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Barabanki",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "India"
    },
    "alumniOf": "Government Polytechnic Aadanpur Tanda",
    "knowsAbout": [
      "Full Stack Web Development",
      "MERN Stack Architecture",
      "Next.js",
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "Django",
      "PostgreSQL",
      "Web Architecture Barabanki Lucknow"
    ],
    "sameAs": [
      "https://github.com/ErAditya1",
      "https://linkedin.com/in/eraditya1",
      "https://twitter.com/eraditya1"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Aditya Kumar - Web Development & Software Services",
    "image": `${baseUrl}/images/aditya_profile.png`,
    "url": baseUrl,
    "telephone": "+919473774390",
    "email": "mradityaji2@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Barabanki / Lucknow Highway",
      "addressLocality": "Barabanki",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "225001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.9272,
      "longitude": 81.1824
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "21:00"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aditya Kumar Portfolio",
    "url": baseUrl,
    "publisher": {
      "@type": "Person",
      "name": "Aditya Kumar"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/projects?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <JsonLd data={personSchema} />
        <JsonLd data={localBusinessSchema} />
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
