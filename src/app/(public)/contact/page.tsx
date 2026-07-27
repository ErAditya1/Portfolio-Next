import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/public/ContactForm";
import { ContactInfo } from "@/components/public/ContactInfo";
import { Metadata } from "next";
import { ISiteSettings } from "@/types";
import { 
  Calendar, 
  HelpCircle, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Globe,
  Mail,
  Phone
} from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact & Book Meeting | Aditya Kumar",
  description: "Get in touch with Aditya Kumar for web development projects, freelance contracts, technical consulting, or booking a discovery meeting.",
};

export default async function ContactPage() {
  let settings: ISiteSettings | undefined;
  try {
    await connectDB();
    const settingsRaw = await SiteSettings.findOne().lean();
    settings = settingsRaw ? (JSON.parse(JSON.stringify(settingsRaw)) as ISiteSettings) : undefined;
  } catch (e) {
    console.error("DB connection error on contact page:", e);
  }

  const faqs = [
    {
      q: "What technologies do you specialize in?",
      a: "I specialize in modern full-stack web development using Next.js (App Router), React, Node.js, Express, MongoDB, Django, Python, WebSockets (Socket.io), and Tailwind CSS.",
    },
    {
      q: "What is your typical project delivery timeline?",
      a: "Timeline depends on project complexity. Standard landing pages or MVP applications take 1-2 weeks, while complex full-stack portals take 3-6 weeks with regular milestone updates.",
    },
    {
      q: "Are you open to remote contracts or full-time roles?",
      a: "Yes! I am available for full-time engineering positions, remote contract work, freelance projects, and technical consulting.",
    },
    {
      q: "How do we get started on a project?",
      a: "Simply send a message using the contact form below or email mradityaji2@gmail.com. I will reply within 24 hours to schedule an initial discovery call.",
    },
  ];

  return (
    <main className="pt-24 pb-20 overflow-hidden">
      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest inline-block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground">
            Let&apos;s Build Something <span className="text-indigo-600 dark:text-indigo-400">Great Together</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Have a project in mind, need technical consulting, or want to discuss full-stack engineering opportunities? Let&apos;s connect.
          </p>
        </div>

        {/* Availability Badge Banner */}
        <div className="max-w-4xl mx-auto mb-16 p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="text-sm font-bold text-foreground">Current Availability</div>
              <div className="text-xs text-muted-foreground">Accepting new projects & full-time engineering roles.</div>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-indigo-500">
            Response Time: &lt; 24 Hours
          </span>
        </div>

        {/* Contact Form & Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24 max-w-6xl mx-auto">
          <ContactInfo settings={settings} />
          <ContactForm />
        </div>

        {/* FAQ Section */}
        <div className="mb-24 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 block flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> FAQ
            </span>
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="text-xs text-muted-foreground">Quick answers to common questions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-card border border-border space-y-2 hover:border-indigo-500/30 transition-all shadow-sm">
                <h3 className="font-bold text-base text-foreground">{faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Book Meeting Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden max-w-6xl mx-auto">
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200 block flex items-center gap-1.5 justify-center md:justify-start">
              <Calendar className="w-4 h-4" /> Schedule Call
            </span>
            <h2 className="text-3xl md:text-4xl font-black">
              Book a 1-on-1 Discovery Call
            </h2>
            <p className="text-indigo-200 text-sm">
              Want to discuss your project requirements live? Pick a convenient time for a technical discussion.
            </p>
          </div>

          <a
            href="mailto:mradityaji2@gmail.com?subject=Schedule%20Discovery%20Call"
            className="z-10 px-8 py-4 rounded-2xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2 group whitespace-nowrap"
          >
            Book Meeting <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </Container>
    </main>
  );
}
