"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Settings, Users, Activity, Loader2, Bot, PhoneOutgoing } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function WhatsAppDashboard() {
  const [config, setConfig] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // Optional: Add polling here for real-time updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [configRes, convsRes] = await Promise.all([
        fetch("/api/whatsapp/config"),
        fetch("/api/whatsapp/conversations")
      ]);
      const configData = await configRes.json();
      const convsData = await convsRes.json();
      
      setConfig(configData);
      setConversations(convsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/whatsapp/conversations/${conversationId}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const toggleAutoReply = async () => {
    if (!config) return;
    const newState = !config.autoReplyEnabled;
    setConfig({ ...config, autoReplyEnabled: newState });
    try {
      await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newState })
      });
    } catch (error) {
      console.error("Error toggling auto-reply:", error);
      // Revert on error
      setConfig({ ...config, autoReplyEnabled: !newState });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const stats = [
    { label: "Total Messages", value: config?.totalMessagesCount || 0, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Chats", value: config?.activeConversationsCount || 0, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Auto Replies Sent", value: config?.autoRepliesSentCount || 0, icon: Bot, color: "text-purple-500", bg: "bg-purple-500/10" }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-500 p-2 rounded-xl">
              <Bot className="w-6 h-6" />
            </span>
            WhatsApp Assistant
          </h1>
          <p className="text-gray-400 mt-2">Manage your AI-powered WhatsApp interactions</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-4 rounded-2xl">
          <div>
            <p className="text-sm font-medium text-white">Auto Assistant</p>
            <p className="text-xs text-gray-400">
              {config?.autoReplyEnabled ? "Active and replying" : "Currently paused"}
            </p>
          </div>
          <button
            onClick={toggleAutoReply}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config?.autoReplyEnabled ? 'bg-emerald-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config?.autoReplyEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              Recent Conversations
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">No conversations yet</p>
            )}
            {conversations.map((chat) => (
              <button
                key={chat._id}
                onClick={() => {
                  setActiveChat(chat);
                  fetchMessages(chat._id);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex gap-3 items-center ${
                  activeChat?._id === chat._id ? 'bg-gray-800 border border-gray-700' : 'hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 text-white font-medium">
                  {chat.name ? chat.name[0].toUpperCase() : <Activity className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className="text-sm font-medium text-white truncate">{chat.name || chat.phone}</p>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(chat.lastActivityAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {chat.unreadCount}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col h-full overflow-hidden">
          {activeChat ? (
            <>
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium">
                    {activeChat.name ? activeChat.name[0].toUpperCase() : <Activity className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{activeChat.name || activeChat.phone}</h3>
                    <p className="text-xs text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {activeChat.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                    activeChat.status === 'bot_handling' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                    activeChat.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    'bg-gray-500/10 border-gray-500/20 text-gray-400'
                  }`}>
                    {activeChat.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/bg-chat.png')] bg-cover bg-center">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm py-8">No messages available</p>
                ) : (
                  messages.map((msg, i) => (
                    <div key={msg._id || i} className={`flex ${msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl p-3 ${
                        msg.direction === 'outgoing' 
                          ? 'bg-emerald-600 text-white rounded-tr-sm' 
                          : 'bg-gray-800/90 text-gray-100 rounded-tl-sm border border-gray-700'
                      }`}>
                        {msg.type === 'interactive' && <span className="text-[10px] uppercase font-bold opacity-70 mb-1 block">Interactive Option</span>}
                        <p className="text-sm break-words">{msg.content}</p>
                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                          msg.direction === 'outgoing' ? 'text-emerald-100/70' : 'text-gray-400'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.direction === 'outgoing' && (
                            <span className="text-[10px]">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Bot className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a conversation to view chat history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
