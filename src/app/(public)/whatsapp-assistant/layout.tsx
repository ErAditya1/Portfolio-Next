import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo/meta";

export const metadata: Metadata = pageMeta({
  title: "WhatsApp AI Assistant Demo",
  description:
    "Try the AI assistant Aditya Kumar built for his portfolio: ask about his projects and skills, or continue the conversation with him on WhatsApp.",
  path: "/whatsapp-assistant",
});

export default function WhatsAppAssistantLayout({ children }: { children: React.ReactNode }) {
  return children;
}
