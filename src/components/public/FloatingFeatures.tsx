"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bot, MessageCircle } from "lucide-react";

export function FloatingFeatures() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-3">
      {/* 1. 🤖 AI Assistant */}
      <Link
        href="/whatsapp-assistant"
        className="relative group p-3.5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-600/30 flex items-center justify-center hover:scale-110 active:scale-95 border border-white/20"
        title="AI Assistant"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400"></span>
        </span>
        <span className="absolute right-full mr-3 hidden group-hover:flex px-2.5 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap">
          AI Assistant
        </span>
      </Link>

      {/* 2. 💬 WhatsApp Chat */}
      <a
        href="https://wa.me/919473774390?text=Hi%20Aditya,%20I%20visited%20your%20portfolio!"
        target="_blank"
        rel="noopener noreferrer"
        className="relative group p-3.5 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 active:scale-95 border border-white/20"
        title="WhatsApp Chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 hidden group-hover:flex px-2.5 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-xl shadow-xl whitespace-nowrap">
          WhatsApp Chat
        </span>
      </a>
    </div>
  );
}
