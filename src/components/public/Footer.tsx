"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ExternalLink, Heart } from "lucide-react";
import { ISiteSettings } from "@/types";

export function Footer({ settings }: { settings?: ISiteSettings }) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Experience", href: "/experience" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Gallery", href: "/gallery" },
  ];

  const socialLinks = (settings?.socialLinks && settings.socialLinks.length > 0)
    ? settings.socialLinks
    : [
      { platform: "Github", url: settings?.githubUrl || "https://github.com/ErAditya1" },
      { platform: "Linkedin", url: settings?.linkedinUrl || "https://linkedin.com/in/eraditya1" },
      { platform: "Twitter", url: settings?.twitterUrl || "https://x.com/Excited_Adi" },
      { platform: "Mail", url: `mailto:${settings?.ownerEmail || "mradityaji2@gmail.com"}` },
    ];

  return (
    <footer className="py-16 border-t border-border/50 bg-card/30 backdrop-blur-md relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t from-indigo-500/5 to-transparent -z-10" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand section */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="text-2xl font-black text-foreground tracking-tighter hover:text-indigo-500 transition-colors">
              ADITYA KUMAR<span className="text-indigo-500">.</span>
            </Link>
            <p className="text-muted-foreground text-xs md:text-sm max-w-sm leading-relaxed">
              Top Full Stack MERN Developer & System Engineer based in Barabanki / Lucknow, Uttar Pradesh. Transforming complex engineering challenges into elegant digital experiences.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.platform.toLowerCase().includes("github") ? Github :
                  social.platform.toLowerCase().includes("linkedin") ? Linkedin :
                    social.platform.toLowerCase().includes("twitter") || social.platform.toLowerCase().includes("x") ? Twitter :
                      social.platform.toLowerCase().includes("mail") ? Mail : Github;

                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:border-indigo-500/40 transition-all group shadow-sm"
                    aria-label={social.platform}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Navigation</h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-indigo-500 transition-colors text-xs font-semibold flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/30 group-hover:bg-indigo-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Expertise SEO Block */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Location & Expertise</h4>
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                <strong>Aditya Kumar</strong> — Full Stack MERN Developer, Next.js & Python Engineer serving clients in Barabanki, Lucknow, Uttar Pradesh & remotely worldwide.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:gap-2 transition-all">
                Hire Aditya Kumar <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-muted-foreground">
          <p>© {currentYear} Aditya Kumar. All rights reserved. Barabanki, Uttar Pradesh, India.</p>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" /> using Next.js, React & Tailwind CSS
          </div>
        </div>
      </Container>
    </footer>
  );
}
