import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aditya Kumar | Full-Stack Web Developer Portfolio",
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
  openGraph: {
    title: "Aditya Kumar | Full-Stack Web Developer",
    description:
      "Explore my portfolio showcasing projects, skills, and experience in modern web development.",
    url: "https://eraditya.vercel.app/",
    siteName: "Aditya Kumar Portfolio",
    images: [
      {
        url: "/image/aditya_profile.png",
        width: 800,
        height: 600,
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
    images: ["/image/aditya_profile.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="QZGHW3TKf81ROqgPri-jbIyHS7Ib79bAgcFPOOQiJfs" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><div className="antialiased text-white min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#12020A] via-[#250821] to-[#0b0710]">
      <Header />
        {children}
         <Footer />
         </div>
      </body>
    </html>
  );
}
