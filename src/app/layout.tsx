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

export const metadata: Metadata = {
  title: {
    default: "Aditya Kumar | Full-Stack Web Developer Portfolio",
    template: "%s | Aditya Kumar",
  },
  description:
    "Portfolio of Aditya Kumar — Full-Stack Web Developer skilled in React, Next.js, Node.js, Express.js, MongoDB, and MySQL. Explore my projects, skills, and experience.",
  keywords: [
    "Aditya Kumar",
    "Web Developer",
    "Full Stack Developer",
    "React Developer",
    "Next.js Portfolio",
    "MERN Stack",
    "JavaScript",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: "Aditya Kumar" }],
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "Aditya Kumar | Full-Stack Web Developer",
    description:
      "Explore my portfolio showcasing projects, skills, and experience in modern web development.",
    url: "https://eraditya.vercel.app/",
    siteName: "Aditya Kumar Portfolio",
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
    title: "Aditya Kumar | Full-Stack Web Developer",
    description:
      "Portfolio of Aditya Kumar — showcasing projects, skills, and experience in React, Next.js, and MERN stack.",
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
