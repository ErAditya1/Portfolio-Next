"use client";

import { Mail, Phone, MapPin, Github, Linkedin, Twitter, MessageSquare, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { ISiteSettings } from "@/types";

export function ContactInfo({ settings }: { settings?: ISiteSettings }) {
  const socialLinks = [
    { icon: Github, href: settings?.githubUrl || "https://github.com/ErAditya1", label: "GitHub" },
    { icon: Linkedin, href: settings?.linkedinUrl || "https://linkedin.com/in/er-aditya", label: "LinkedIn" },
    { icon: Twitter, href: settings?.twitterUrl || "https://x.com/Excited_Adi", label: "Twitter" },
    { icon: Instagram, href: settings?.socialLinks?.find((link) => link.platform === "Instagram")?.url || "https://instagram.com/excited_adi", label: "Instagram" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-4 space-y-10"
    >
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-primary" />
          Contact Info
        </h2>
        
        <div className="space-y-6">
          <div className="group flex items-center gap-5 p-4 rounded-2xl border border-border hover:border-primary/30 bg-card shadow-sm transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Email Me</p>
              <p className="text-foreground font-medium">{settings?.ownerEmail || "aditya@example.com"}</p>
            </div>
          </div>

          {settings?.ownerPhone && (
            <div className="group flex items-center gap-5 p-4 rounded-2xl border border-border hover:border-blue-500/30 bg-card shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Phone className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Call Me</p>
                <p className="text-foreground font-medium">{settings.ownerPhone}</p>
              </div>
            </div>
          )}

          <div className="group flex items-center gap-5 p-4 rounded-2xl border border-border hover:border-emerald-500/30 bg-card shadow-sm transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Location</p>
              <p className="text-foreground font-medium">{settings?.ownerLocation || "India"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Connect Digitally</h3>
        <div className="flex gap-4">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm shadow-primary/5"
              aria-label={label}
            >
              <Icon className="w-6 h-6" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
