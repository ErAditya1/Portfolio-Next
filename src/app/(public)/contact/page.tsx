"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { NeonHeading } from "@/components/NeonHeading";
import { ISiteSettings } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<ISiteSettings | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Failed to fetch settings", err));
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitting(false);

    if (res.ok) {
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to send message");
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 space-y-4">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-purple-500 font-bold text-xs uppercase tracking-[0.4em]"
            >
              Get in Touch
            </motion.span>
            <NeonHeading>Let&apos;s Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Legendary</span></NeonHeading>
            <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
              Whether you have a specific project in mind or just want to explore possibilities, my inbox is always open.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 space-y-10"
            >
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-purple-500" />
                  Contact Info
                </h2>
                
                <div className="space-y-6">
                  <div className="group flex items-center gap-5 p-4 rounded-2xl border border-white/5 hover:border-purple-500/30 bg-gray-900/40 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Email Me</p>
                      <p className="text-white font-medium">{settings?.ownerEmail || "aditya@example.com"}</p>
                    </div>
                  </div>

                  {settings?.ownerPhone && (
                    <div className="group flex items-center gap-5 p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 bg-gray-900/40 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Phone className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Call Me</p>
                        <p className="text-white font-medium">{settings.ownerPhone}</p>
                      </div>
                    </div>
                  )}

                  <div className="group flex items-center gap-5 p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 bg-gray-900/40 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Location</p>
                      <p className="text-white font-medium">{settings?.ownerLocation || "India"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Connect Digitally</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Github, href: settings?.githubUrl || "https://github.com/ErAditya1", label: "GitHub" },
                    { icon: Linkedin, href: settings?.linkedinUrl || "https://linkedin.com/in/er-aditya", label: "LinkedIn" },
                    { icon: Twitter, href: settings?.twitterUrl || "https://x.com/Excited_Adi", label: "Twitter" },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl bg-gray-900/60 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/40 hover:bg-purple-500/5 transition-all shadow-xl"
                      aria-label={label}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-8"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      {...register("name")}
                      placeholder="e.g. John Doe"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                    {errors.name && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="e.g. john@example.com"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                    {errors.email && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone (Optional)</label>
                    <input
                      {...register("phone")}
                      placeholder="+91 00000 00000"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                    <input
                      {...register("subject")}
                      placeholder="e.g. Project Inquiry"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    placeholder="Describe your vision or inquiry..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.message.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group overflow-hidden bg-white text-black font-black py-5 rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                    {submitting ? "Processing..." : (
                      <>
                        Deploy Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </Container>
    </main>
  );
}
