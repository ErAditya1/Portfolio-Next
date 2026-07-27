"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Sparkles, 
  RefreshCw 
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIChatWidgetProps {
  embedded?: boolean;
}

const PRESET_QUESTIONS = [
  "What is Aditya's tech stack?",
  "What projects has Aditya built?",
  "How much does a custom website cost?",
  "How can I contact Aditya for work?"
];

export default function AIChatWidget({ embedded = false }: AIChatWidgetProps) {
  const [deviceId, setDeviceId] = useState<string>("");
  const [activeModel, setActiveModel] = useState<string>("qwen2.5");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "assistant",
      content: "Hi there! 👋 I am Aditya's AI Assistant. Ask me anything about Aditya's skills, projects, experience, or custom development pricing!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll ONLY the inner chat container, NOT the outer window/page
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Generate or retrieve unique deviceId on mount & fetch settings
  useEffect(() => {
    let id = localStorage.getItem("portfolio_device_id");
    if (!id) {
      id = "device_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
      localStorage.setItem("portfolio_device_id", id);
    }
    setDeviceId(id);

    // Fetch site settings to get active AI model
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.aiModel) setActiveModel(data.aiModel);
      })
      .catch(() => {});

    // Fetch device chat history from server
    fetch(`/api/chat?deviceId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.warn("Failed to load device chat history:", err));
  }, []);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading || !deviceId) return;

    setError(null);
    const userText = textToSend.trim();
    setInput("");

    // Add user message & empty assistant placeholder
    const tempUserMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText
    };

    const assistantMsgId = `bot-${Date.now()}`;
    const tempAssistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: ""
    };

    setMessages((prev) => [...prev, tempUserMsg, tempAssistantMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          message: userText
        })
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to connect to streaming response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedContent += chunk;

        // Update active assistant message in real time
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: streamedContent }
              : msg
          )
        );

        scrollToBottom();
      }
    } catch (err: any) {
      console.error("Stream chat error:", err);
      setError(err?.message || "Could not connect to AI service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handlePresetClick = (question: string) => {
    sendMessage(question);
  };

  const handleClearChat = async () => {
    if (!deviceId) return;
    try {
      await fetch(`/api/chat?deviceId=${deviceId}`, { method: "DELETE" });
      setMessages([
        {
          id: `init-${Date.now()}`,
          role: "assistant",
          content: "Hi there! 👋 I am Aditya's AI Assistant. How can I help you today?"
        }
      ]);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  };

  return (
    <div className={`w-full flex flex-col ${embedded ? "h-[620px] rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden" : "h-[500px]"}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight flex items-center gap-2">
              Aditya&apos;s AI Assistant
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium uppercase tracking-wider">
                {activeModel} • streaming
              </span>
            </h3>
            <p className="text-xs text-white/80 flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Saved per device • llm.cheetahagi.com
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          title="Reset conversation"
          className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area (Inner Container Scroll Only) */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 p-6 overflow-y-auto space-y-4 bg-background/50 scroll-smooth"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-sm shadow-md font-medium"
                  : "bg-card border border-border text-foreground rounded-tl-sm shadow-sm"
              }`}
            >
              {msg.content || (isLoading && msg.role === "assistant" ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                  Generating response...
                </span>
              ) : null)}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-accent text-muted-foreground border border-border flex items-center justify-center shrink-0 shadow-sm mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}

        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            {error}
          </div>
        )}
      </div>

      {/* Preset Questions Suggestions */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-6 py-2 bg-accent/20 border-t border-border flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 w-full mb-1">
            <Sparkles className="w-3 h-3 text-emerald-500" /> Suggested questions:
          </span>
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(q)}
              className="text-xs px-3 py-1.5 bg-card hover:bg-emerald-500/10 border border-border hover:border-emerald-500/30 text-foreground hover:text-emerald-500 rounded-full transition-all text-left font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="p-4 bg-card border-t border-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Aditya's AI Assistant..."
          className="flex-1 bg-background text-foreground border border-border focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center shrink-0"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
