"use client";

import { Container } from "@/components/Container";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ExternalLink, Heart, Sparkles } from "lucide-react";
import { ISiteSettings } from "@/types";

export function Footer({ settings }: { settings?: ISiteSettings }) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Home", href: "/#home" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = (settings?.socialLinks && settings.socialLinks.length > 0) 
    ? settings.socialLinks 
    : [
        { platform: "Github", url: settings?.githubUrl || "https://github.com" },
        { platform: "Linkedin", url: settings?.linkedinUrl || "https://linkedin.com" },
        { platform: "Twitter", url: settings?.twitterUrl || "https://twitter.com" },
        { platform: "Mail", url: `mailto:${settings?.ownerEmail || "hello@example.com"}` },
      ];

  return (
    <footer className="py-16 border-t border-border/50 bg-card/30 backdrop-blur-md relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t from-primary/5 to-transparent -z-10" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand section */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="text-2xl font-black text-foreground tracking-tighter hover:text-primary transition-colors">
              ADITYA<span className="text-primary">.</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Transforming complex engineering challenges into elegant digital experiences. Focused on scalable architectures and user-centric design.
            </p>
            <div className="flex gap-4">
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
                    className="w-10 h-10 rounded-xl bg-accent/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all group"
                    aria-label={social.platform}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Navigation</h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack / Interests */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Next Adventure</h4>
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <p className="text-xs text-muted-foreground font-medium italic">
                Currently exploring distributed systems and decentralized web technologies. Always open to high-impact collaborations.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:gap-3 transition-all">
                Let&apos;s start a conversation <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-muted-foreground/60">
          <p>© {currentYear} Aditya Kumar. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" /> using Next.js & Framer Motion
          </div>
        </div>
      </Container>
    </footer>
  );
}
