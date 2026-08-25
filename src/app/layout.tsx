import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/public/JsonLd";
import { faqSchemaData } from "@/components/public/FAQSection";

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
  const baseUrl = process.env.NEXTAUTH_URL || "https://eraditya.vercel.app";
  
  let title = "Aditya Kumar | Full Stack Developer & AI Systems Engineer (Lucknow / Remote)";
  let description = "Official Portfolio of Aditya Kumar — Full Stack Developer & AI Systems Engineer in Barabanki / Lucknow, Uttar Pradesh, India. Specializing in Next.js 15, React 19, NestJS, Real-Time AI Voice Telephony (ElevenLabs), and WhatsApp Cloud API SaaS.";

  return {
    title: {
      default: title,
      template: `%s | Aditya Kumar - Full Stack & AI Systems Engineer`,
    },
    description: description,
    keywords: [
      "Aditya Kumar",
      "Aditya Kumar Developer",
      "Aditya Kumar Full Stack Developer",
      "Aditya Kumar AI Engineer",
      "Aditya Kumar Lucknow",
      "Aditya Kumar Barabanki",
      "Best Full Stack Developer Lucknow",
      "Top Next.js Developer Barabanki",
      "Full Stack Developer Uttar Pradesh",
      "MERN Stack Architect India",
      "AI Voice Telephony Developer",
      "ElevenLabs Voice AI Developer",
      "Callio AI Developer",
      "WAutomator WhatsApp Cloud API",
      "Amplibuzz Escrow SaaS",
      "Hire Next.js Developer India",
      "Remote Full Stack Engineer US UK",
      "Er Aditya Kumar",
      "ErAditya1",
      "npx aditya-kumar",
      "Full Stack Developer Portfolio",
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
      title: "Aditya Kumar | Full Stack Developer & AI Systems Engineer",
      description: "Explore Aditya Kumar's featured full-stack projects, real-time AI voice agents, WhatsApp automation SaaS platforms, and open source repositories.",
      url: baseUrl,
      siteName: "Aditya Kumar Portfolio",
      images: [
        {
          url: "/images/aditya_profile.png",
          width: 1200,
          height: 630,
          alt: "Aditya Kumar - Full Stack Developer & AI Systems Engineer",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Aditya Kumar | Full Stack Developer & AI Systems Engineer",
      description: "Official Portfolio of Aditya Kumar — Full Stack Developer & AI Systems Engineer in Barabanki & Lucknow, Uttar Pradesh, India.",
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
  const baseUrl = process.env.NEXTAUTH_URL || "https://eraditya.vercel.app";

  // Hyper-Targeted JSON-LD Schema for Google Search, SGE & Generative AI Knowledge Graphs
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aditya Kumar",
    "alternateName": ["Er Aditya Kumar", "ErAditya1", "Aditya Kumar Developer", "Aditya Kumar Barabanki"],
    "url": baseUrl,
    "image": `${baseUrl}/images/aditya_profile.png`,
    "jobTitle": "Full Stack Developer & AI Systems Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Feeding Trends",
      "url": "https://feedingtrends.com"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Barabanki",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "India"
    },
    "knowsLanguage": ["English", "Hindi"],
    "alumniOf": "Government Polytechnic Aadanpur Tanda",
    "knowsAbout": [
      "Full-Stack Web Development",
      "Next.js 15 App Router",
      "React 19",
      "TypeScript",
      "NestJS",
      "Node.js",
      "Python",
      "FastAPI",
      "Django",
      "Conversational Voice AI (ElevenLabs)",
      "Meta WhatsApp Cloud API",
      "PostgreSQL",
      "MongoDB Atlas",
      "Redis Caching & BullMQ Queues",
      "Docker & Linux VPS Architecture"
    ],
    "sameAs": [
      "https://github.com/ErAditya1",
      "https://linkedin.com/in/eraditya1",
      "https://twitter.com/eraditya1",
      "https://www.npmjs.com/package/aditya-kumar"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Aditya Kumar - Web & AI Engineering Services",
    "image": `${baseUrl}/images/aditya_profile.png`,
    "url": baseUrl,
    "telephone": "+919473774390",
    "email": "mradityaji2@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Barabanki / Lucknow Tech Corridor",
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
    "areaServed": [
      { "@type": "City", "name": "Lucknow" },
      { "@type": "City", "name": "Barabanki" },
      { "@type": "State", "name": "Uttar Pradesh" },
      { "@type": "Country", "name": "India" },
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "United Kingdom" }
    ],
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "22:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Engineering & Freelance Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Full-Stack Web Development & Next.js SaaS Architecture",
            "description": "End-to-end modern web applications with Next.js 15, React 19, TypeScript, PostgreSQL, and sub-second load times."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Real-Time AI Voice Agents & Cloud Telephony (ElevenLabs & Tata Smartflo)",
            "description": "Low-latency sub-300ms conversational voice telephony pipelines, barge-in speech interruption detection, and CRM telemetry."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Enterprise WhatsApp Cloud API Automation & Gemini AI Chatbots",
            "description": "Multi-tenant WhatsApp marketing platforms, automated broadcast campaigns, BullMQ job queues, and intelligent customer support bots."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "High-Throughput Backend Microservices & API Engineering",
            "description": "Fault-tolerant backend systems with NestJS, Node.js, Python (FastAPI/Django), Redis caching, and database query optimization."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Freelance Technical Consulting & Startup MVP Development",
            "description": "Rapid MVP prototyping, system design roadmaps, and dedicated contract engineering for startups and global businesses."
          }
        }
      ]
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
        <JsonLd data={faqSchemaData} />
        <Providers>
          <div className="antialiased min-h-screen bg-[var(--bg-gradient)] text-foreground transition-colors duration-300">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
