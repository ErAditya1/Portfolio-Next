import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatsApp AI Assistant Demo",
  description:
    "Try the AI assistant Aditya Kumar built for his portfolio: ask about his projects and skills, or continue the conversation with him on WhatsApp.",
  alternates: { canonical: "/whatsapp-assistant" },
  openGraph: { url: "/whatsapp-assistant" },
};

export default function WhatsAppAssistantLayout({ children }: { children: React.ReactNode }) {
  return children;
}
