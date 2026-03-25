"use client";

import { useChat, Message, useCompletion } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, ChevronDown, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  
  // WhatsApp Sync State
  const [isLinked, setIsLinked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem("whatsapp_sync_phone");
    const skipped = localStorage.getItem("whatsapp_sync_skip");
    
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      // Auto-connect in background if previously linked
      connectPhone(savedPhone);
    } else if (skipped === "true") {
      setIsLinked(true);
    }
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: {
      phone: isLinked ? phoneNumber : undefined,
    }
  });

  const connectPhone = async (phone: string) => {
    setIsLinking(true);
    try {
      const res = await fetch(`/api/whatsapp/history?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.history && data.history.length > 0) {
          const mappedHistory = data.history.map((msg: { role: string; content: string }, i: number) => ({
            ...msg,
            id: `history-${i}-${Date.now()}`
          }));
          setMessages(mappedHistory);
        }
        localStorage.setItem("whatsapp_sync_phone", phone);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setIsLinked(true);
      setIsLinking(false);
    }
  };

  const handleLinkWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      // User is skipping
      localStorage.setItem("whatsapp_sync_skip", "true");
      return setIsLinked(true);
    }
    await connectPhone(phoneNumber);
  };

 
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 sm:w-96 h-[500px] max-h-[80vh] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-teal-500/10" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Aditya's AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-medium tracking-wide">
                      Online 24/7
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
              {!isLinked ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white mb-2">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">Connect WhatsApp</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Enter your phone number to load your past chat history, or skip to chat anonymously.
                    </p>
                  </div>
                  
                  <form onSubmit={handleLinkWhatsApp} className="w-full space-y-3">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 919876543210"
                      className="w-full bg-gray-950/50 border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-center"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem("whatsapp_sync_skip", "true");
                          setIsLinked(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        Skip
                      </button>
                      <button
                        type="submit"
                        disabled={isLinking}
                        className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLinking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950/50 backdrop-blur-3xl scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {messages.length === 0 && (
                      <div className="text-center h-full flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center">
                          <Bot className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm max-w-[200px]">
                          Hi! I'm Aditya's AI assistant. Ask me anything about his projects or pricing!
                        </p>
                      </div>
                    )}
                    
                    {messages.map((m: Message) => (
                      <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex gap-2 max-w-[85%]">
                          {m.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-gray-800 border items-center justify-center hidden sm:flex border-gray-700 flex-shrink-0">
                              <Bot className="w-4 h-4 text-purple-400" />
                            </div>
                          )}
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              m.role === "user"
                                ? "bg-purple-600 text-white rounded-br-sm shadow-md"
                                : "bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-sm shadow-sm"
                            }`}
                          >
                            {m.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-800 border flex items-center justify-center border-gray-700 flex-shrink-0">
                            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                          </div>
                          <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="p-3 bg-gray-800 border-t border-gray-700 flex items-end gap-2"
                  >
                    <div className="bg-gray-900 border border-gray-700 rounded-xl flex-1 focus-within:ring-2 ring-purple-500/50 focus-within:border-purple-500 transition-all flex items-center p-1">
                      <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question..."
                        className="bg-transparent text-sm text-white w-full px-3 py-2 outline-none placeholder:text-gray-500 h-10"
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-2 h-10 w-10 flex items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasUnread(false);
        }}
        className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] border border-purple-400/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative z-50"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Bot className="w-6 h-6 group-hover:animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Unread dot */}
        {!isOpen && hasUnread && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-gray-950 rounded-full animate-pulse" />
        )}
      </button>
    </div>
  );
}
