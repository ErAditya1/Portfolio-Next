"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, Bot, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function WhatsAppAssistantPublic() {
  const whatsappNumber = "919473774390"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Now Live • 24/7 Availability
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Meet my <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">AI Assistant</span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-xl">
              I've built a custom WhatsApp integration using Meta's Cloud API and Node.js. 
              Try it out! It can answer questions about my services, pricing, and schedule meetings while I'm away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Chat with Assistant
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex items-center justify-center sm:justify-start gap-2 px-6 py-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-300">
                Number: <span className="font-mono text-white">+{whatsappNumber}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-[40px] blur-3xl" />
            <div className="relative bg-gray-900 border border-gray-800 rounded-[40px] p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Aditya's Assistant</h3>
                  <p className="text-emerald-400 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Online
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm max-w-[80%] shadow-md">
                    Hi! What's the pricing for a website?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-2 text-sm max-w-[80%] shadow-md">
                    Our pricing starts at $499 for standard portfolio websites. For custom applications, please type 'quote'.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[80%] shadow-md">
                    <span className="text-xs text-emerald-400 font-semibold mb-1 block uppercase tracking-wider">Interactive Options</span>
                    Here are some options:
                    <div className="mt-3 flex flex-col gap-2">
                      <button className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-emerald-400 font-medium transition-colors">View Projects</button>
                      <button className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-emerald-400 font-medium transition-colors">Contact Human</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="py-24 border-t border-gray-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built using modern technologies to provide a seamless and instant communication channel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: "Instant Replies", 
                desc: "Powered by Node.js webhooks, the assistant replies in milliseconds when you send a message." 
              },
              { 
                icon: Shield, 
                title: "Meta Cloud API", 
                desc: "Fully integrated with the official WhatsApp Business API for reliable and secure message delivery." 
              },
              { 
                icon: Bot, 
                title: "Smart Routing", 
                desc: "Automatically handles common queries and seamlessly escalates to me when human intervention is needed." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:bg-gray-900 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
