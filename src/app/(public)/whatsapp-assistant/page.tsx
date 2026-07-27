"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, Bot, Shield, CheckCircle2, ArrowRight, Sparkles, Cpu } from "lucide-react";
import AIChatWidget from "@/components/public/AIChatWidget";

export default function WhatsAppAssistantPublic() {
  const whatsappNumber = "919473774390"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Hero & Live Chat Section */}
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-12 py-8">
          
          {/* Left Column: Intro & Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 space-y-8 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live • Powered by Llama 3.2 & LLM API
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
              Meet my <span className="text-gradient">AI Assistant</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Experience my custom AI Assistant live right here! Powered by Llama 3.2 on my VPS infrastructure (`llm.cheetahagi.com`), it can instantly answer your questions about my skills, portfolio projects, and custom web development services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-5 h-5" />
                Chat via WhatsApp
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex items-center justify-center sm:justify-start gap-2 px-6 py-4 rounded-2xl bg-accent/50 border border-border text-muted-foreground font-medium shadow-sm">
                WhatsApp: <span className="font-mono text-foreground font-bold">+{whatsappNumber}</span>
              </div>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4 max-w-lg">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border">
                <Cpu className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Self-Hosted LLM</h4>
                  <p className="text-[11px] text-muted-foreground">llm.cheetahagi.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border">
                <Sparkles className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Fast Streaming</h4>
                  <p className="text-[11px] text-muted-foreground">Real-time answers</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Interactive Chat Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 w-full max-w-xl mx-auto"
          >
            <AIChatWidget embedded={true} />
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="py-24 border-t border-border mt-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              Built using modern Next.js 15, Vercel AI SDK, and a custom VPS LLM service for seamless 24/7 intelligent responses.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: "Instant AI Streaming", 
                desc: "Connected directly to my VPS LLM service (`llm.cheetahagi.com`) for sub-second responses." 
              },
              { 
                icon: Shield, 
                title: "Real-time Context", 
                desc: "Dynamically synced with my MongoDB portfolio database to present up-to-date project info." 
              },
              { 
                icon: Bot, 
                title: "Omnichannel Support", 
                desc: "Available as a web chat widget on this site and fully integrated with Meta WhatsApp Cloud API." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card/50 border border-border rounded-3xl p-8 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
